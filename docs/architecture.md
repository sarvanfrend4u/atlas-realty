# Atlas Realty — Architecture

This document is the canonical technical reference for the Atlas Realty platform.
Any developer or AI assistant working on this project must read this before making architectural changes.

---

## Core Principle

> **"The map is the application. Everything else is a feature of the map."**

This is not a list-based search UI with a map widget. The map IS the interface. Every user action produces a map response as its primary output. Filters narrow the map. Search pans and filters the map. Layer toggles add/remove data on the map.

---

## Architecture Pattern: Modular Monolith

The backend is a **single FastAPI application** with clean internal module separation.

```
backend/
├── api/
│   ├── listings.py     # module: property listing queries
│   ├── search.py       # module: NLP + filter search
│   ├── layers.py       # module: GeoJSON + isochrone layers
│   └── visual.py       # module: CLIP visual search
├── models/             # SQLAlchemy ORM (shared across modules)
└── ml/                 # CLIP + LLM integrations (shared across modules)
```

**Why not microservices?**
Microservices add network latency, deployment complexity, distributed tracing overhead, and service discovery — none of which are justified at this stage. If a specific module (e.g. ML inference) becomes a bottleneck, extract it then. Not before.

---

## System Overview

```
Browser
  │
  ├── MapLibre GL JS     ← renders vector tiles (OpenFreeMap / Protomaps)
  ├── Deck.gl            ← renders data layers (WebGL, 200K+ points at 60fps)
  ├── Zustand store      ← viewport, filters, layers, selected listing state
  └── SWR hooks          ← viewport-keyed HTTP fetching, debounced 300ms
         │
         ▼
    FastAPI (port 8000)
         │
         ├── /listings          → PostGIS viewport query
         ├── /search/nlp        → Groq/Ollama LLM → structured filters
         ├── /search/visual     → CLIP embedding → pgvector similarity
         ├── /layers/schools    → GeoJSON school district polygons
         ├── /layers/flood      → GeoJSON flood zone polygons
         └── /layers/isochrone  → Valhalla isochrone polygon
              │
              ├── PostgreSQL + PostGIS   ← spatial queries
              ├── pgvector               ← image similarity queries
              └── Valhalla               ← routing + isochrone engine
```

---

## Frontend Architecture

### Component Tree

```
App
└── MapPage
    ├── MapCanvas              ← MapLibre GL JS + Deck.gl (full screen)
    │   ├── ListingPinsLayer   ← Deck.gl ScatterplotLayer
    │   ├── SchoolZonesLayer   ← Deck.gl GeoJsonLayer
    │   ├── FloodZonesLayer    ← Deck.gl GeoJsonLayer
    │   ├── IsochroneLayer     ← Deck.gl GeoJsonLayer
    │   ├── PriceHeatmapLayer  ← Deck.gl HeatmapLayer
    │   └── ClusterLayer       ← Deck.gl IconLayer (Supercluster)
    ├── SearchBar              ← NLP text input
    ├── FilterPanel            ← Price, beds, baths
    ├── LayerControls          ← Toggle buttons per layer
    └── ListingDrawer          ← Slides in on pin click
```

### State Management (Zustand)

Single store, single source of truth:

```typescript
interface MapStore {
  // Viewport
  viewport: {
    lat: number;
    lng: number;
    zoom: number;
    bounds: BoundingBox;  // { west, south, east, north }
  };

  // Filters
  filters: {
    priceMin: number | null;
    priceMax: number | null;
    beds: number | null;
    baths: number | null;
    propertyType: PropertyType | null;
  };

  // Layers
  activeLayers: Set<LayerID>;

  // Selection
  hoveredListing: string | null;
  selectedListing: string | null;

  // Search
  searchQuery: string;
  isochroneData: GeoJSON.Feature | null;
  commutePin: [number, number] | null;
}
```

### Data Fetching (SWR)

Listings re-fetch whenever viewport or filters change:

```typescript
// Debounced 300ms — prevents API spam during pan/zoom
const key = `listings?${encodeViewport(viewport)}&${encodeFilters(filters)}`;
const { data: listings } = useSWR(key, fetcher, { dedupingInterval: 300 });
```

Each unique `key` is cached independently. Moving back to a previous viewport
instantly restores data from cache without a network request.

---

## Backend Architecture

### API Modules

#### `/listings` — Viewport Query
```
GET /listings?west=-80.2&south=25.7&east=-80.1&north=25.8&priceMax=500000&beds=3
```
- Runs PostGIS `ST_Within` + filter conditions
- Returns max 500 listings per call
- Response: `{ listings: Listing[], total: number }`

#### `/search/nlp` — Conversational Search
```
POST /search/nlp
{ "query": "3BHK near OMR under 80 lakhs walk to metro" }
```
- Sends query to Groq (cloud) or Ollama (local)
- LLM returns structured JSON: `{ beds: 3, area: "OMR", priceMax: 8000000, amenities: ["metro"] }`
- Backend geocodes `area` → bounding box → returns as viewport update + filters
- Frontend applies returned viewport + filters → map updates

#### `/search/visual` — Photo Match Search
```
POST /search/visual  (multipart: image file)
```
- CLIP model embeds uploaded image into 512-dim vector
- pgvector `<=>` cosine similarity query against pre-embedded listing photos
- Returns top-N most visually similar listings

#### `/layers/schools`
```
GET /layers/schools?west=...&south=...&east=...&north=...
```
- Returns GeoJSON FeatureCollection of school district polygons in viewport

#### `/layers/flood`
```
GET /layers/flood?west=...&south=...&east=...&north=...
```
- Returns GeoJSON FeatureCollection of FEMA flood zone polygons in viewport

#### `/layers/isochrone`
```
POST /layers/isochrone
{ "lat": 13.05, "lng": 80.21, "mode": "drive", "minutes": 15 }
```
- Calls Valhalla isochrone API
- Returns GeoJSON polygon of reachable area

---

## Database Schema

### Core Tables

```sql
-- Listings
CREATE TABLE listings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    price       INTEGER NOT NULL,           -- in INR paise (or USD cents)
    beds        SMALLINT,
    baths       SMALLINT,
    area_sqft   INTEGER,
    address     TEXT,
    city        TEXT,
    geom        GEOMETRY(Point, 4326),      -- PostGIS spatial column
    photo_urls  TEXT[],
    embedding   VECTOR(512),               -- pgvector: CLIP image embedding
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for viewport queries
CREATE INDEX listings_geom_idx ON listings USING GIST(geom);

-- Vector index for visual similarity queries
CREATE INDEX listings_embedding_idx ON listings
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Key Query Patterns

**Viewport query (PostGIS):**
```sql
SELECT id, title, price, beds, baths, ST_X(geom) AS lng, ST_Y(geom) AS lat
FROM listings
WHERE ST_Within(geom, ST_MakeEnvelope(:west, :south, :east, :north, 4326))
  AND (:priceMin IS NULL OR price >= :priceMin)
  AND (:priceMax IS NULL OR price <= :priceMax)
  AND (:beds IS NULL OR beds >= :beds)
ORDER BY price
LIMIT 500;
```

**Visual similarity query (pgvector):**
```sql
SELECT id, title, price, embedding <=> :query_embedding AS distance
FROM listings
ORDER BY embedding <=> :query_embedding
LIMIT 20;
```

---

## Map Tile Strategy

Base map tiles are served by **OpenFreeMap** (hosted, free) or **Protomaps** (self-hosted).

- Map style URL: `https://tiles.openfreemap.org/styles/liberty`
- For production with high traffic: serve `.pmtiles` file from Cloudflare R2
- The `.pmtiles` file is a single static binary — no tile server needed
- File is gitignored (large binary, use Git LFS or download separately)

**Why not Google Maps or Mapbox?**
See [ADR-001](../ADR/001-maplibre-over-google-maps.md).

---

## Layer Activation Rules (Progressive Disclosure)

Layers do NOT all activate on page load. Activation is contextual:

| Layer | Activates When |
|---|---|
| Listing pins | Always on |
| Price heatmap | zoom < 10 (replaces pins at low zoom) |
| School zones | zoom ≥ 12 OR `children` filter is active |
| Flood zones | zoom ≥ 11 OR user explicitly toggles |
| 3D buildings | zoom ≥ 15 |
| Isochrone | After user drops a commute pin |
| Transit stops | zoom ≥ 13 |
| All others | User explicitly toggles via LayerControls |

This prevents visual overload and maintains performance at low zoom levels.

---

## Performance Architecture

| Concern | Solution |
|---|---|
| Map rendering | MapLibre GL JS (WebGL vector tiles, ~16ms/frame) |
| Data layers | Deck.gl (WebGL, 200K+ points at 60fps) |
| Pin clustering | Supercluster in Web Worker (100K pins < 100ms) |
| Viewport queries | PostGIS GIST spatial index |
| API debouncing | SWR `dedupingInterval: 300ms` |
| Response caching | SWR cache keyed by viewport + filters |
| Max results | Hard cap of 500 listings per viewport query |
| Vector search | pgvector IVFFlat index on embedding column |

**Performance target:** Viewport query endpoint p99 < 200ms under 100 concurrent users.

---

## AI / LLM Integration

### Conversational Search

1. User types: *"3BHK with pool in OMR under 80 lakhs"*
2. `POST /search/nlp` sends to Groq (or Ollama if offline)
3. LLM prompt instructs model to return **only valid JSON**, no prose:
   ```json
   { "beds": 3, "amenities": ["pool"], "area": "OMR", "priceMax": 8000000 }
   ```
4. Backend validates JSON, geocodes `area` string to bounding box
5. Returns `{ viewport, filters }` to frontend
6. Frontend updates Zustand store → map pans and pins re-render

### Visual Search

1. User uploads photo of interior/exterior
2. CLIP model (`clip-vit-base-patch32`) generates 512-dim float vector
3. pgvector cosine similarity query: `embedding <=> :query_vec LIMIT 20`
4. Results returned as listing IDs → rendered as highlighted pins on map

---

## Deployment Architecture

### Development
```
docker compose up
# Runs: postgres+postgis, backend, frontend, valhalla
```

### Production (Phase 9)
```
Vercel          ← Next.js frontend (CDN edge, free tier)
Fly.io          ← FastAPI + Valhalla (free tier, 256MB RAM)
Supabase        ← PostgreSQL + PostGIS + pgvector (free tier, 500MB)
Cloudflare R2   ← .pmtiles tile file (free up to 10GB storage)
```

Monthly cost at launch: **$0**

Scaling path: Add Fly.io paid machines + Supabase Pro when traffic justifies it.

---

## Free Data Sources

| Data | Source | Format | Update Frequency |
|---|---|---|---|
| Roads, buildings, transit | OpenStreetMap (Geofabrik) | PBF | Weekly extracts |
| School districts (US) | NCES | GeoJSON | Annual |
| Flood zones (US) | FEMA OpenFEMA | GeoJSON / Shapefile | Quarterly |
| Demographics | US Census Bureau | GeoJSON | Annual |
| New project registrations (Chennai) | TNRERA (tnrera.in) | Scrape | Real-time |
| Planning permissions (Chennai) | CMDA | Scrape | Real-time |
| Land registration (Chennai) | TN Registration Dept | Scrape | Real-time |

---

## Inspirations & Competitive Context

| Platform | Innovation we're learning from |
|---|---|
| Homes AI (CoStar, Feb 2026) | Voice + text + 3D + school data unified search |
| Realtor.com FlyAround | Low-altitude satellite flyover of any property |
| Jitty (UK) | Visual photo-style-match home search |
| Zoopla (UK) | Buyer demand visualization at multiple price points |
| Hemnet (Sweden) | Price history, tax records, energy rating on every listing |
| SeLoger (France) | Neighbourhood lifestyle overlays (café density, noise maps) |

The direction of travel globally: **map + conversational AI + visual search + agentic actions** as one unified surface.
