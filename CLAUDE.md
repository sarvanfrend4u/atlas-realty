# CLAUDE.md — Atlas Realty

This file is automatically loaded by Claude Code at the start of every session.
Any AI coding assistant working on this repo must read this file completely before writing any code.

---

## What This Project Is

**Atlas Realty** is a map-first real estate search platform.

Core principle: **"The map is the application. Everything else is a feature of the map."**

The map is not a widget embedded in a page — it IS the page. Every feature (search, filters, layers, AI) updates the map as its primary output.

---

## Current Build Status

| Phase | Name | Status |
|---|---|---|
| 1 | Database schema + Docker scaffold | 🔲 Not started |
| 2 | Map shell + viewport listing pins | 🔲 Not started |
| 3 | Static GeoJSON layers (schools, flood) | 🔲 Not started |
| 4 | Isochrone integration (Valhalla) | 🔲 Not started |
| 5 | Filter panel (price, beds, baths) | 🔲 Not started |
| 6 | Conversational search (NLP → filters) | 🔲 Not started |
| 7 | Visual photo search (CLIP + pgvector) | 🔲 Not started |
| 8 | Clustering and performance | 🔲 Not started |
| 9 | Production deployment | 🔲 Not started |

**Update this table as each phase completes.**

---

## Tech Stack

Every tool in this stack is free and open source. Do NOT introduce paid services or proprietary APIs.

### Frontend
| Tool | Role | Version |
|---|---|---|
| Next.js | React framework + SSR | latest |
| MapLibre GL JS | Base map rendering (WebGL) | latest |
| Deck.gl | Data visualization layers (WebGL) | latest |
| Supercluster | Pin clustering in Web Worker | latest |
| Zustand | Global state (viewport, filters, layers) | latest |
| SWR | Viewport-keyed data fetching | latest |
| Tailwind CSS | Styling | latest |

### Backend
| Tool | Role | Version |
|---|---|---|
| FastAPI | Python REST API | latest |
| SQLAlchemy | ORM | latest |
| Alembic | Database migrations | latest |
| Python | Runtime | 3.12+ |

### Database
| Tool | Role |
|---|---|
| PostgreSQL | Primary relational database |
| PostGIS | Spatial queries (ST_Within, ST_MakeEnvelope) |
| pgvector | Vector similarity search for visual photo matching |

### Infrastructure
| Tool | Role |
|---|---|
| Docker Compose | One-command local dev environment |
| Protomaps / OpenFreeMap | Map tile hosting (replaces Google Maps / Mapbox) |

### Routing & Geocoding
| Tool | Role |
|---|---|
| Valhalla | Isochrone generation + turn-by-turn routing |
| Photon | Fast address geocoding (OpenStreetMap-based) |

### AI / ML
| Tool | Role |
|---|---|
| Groq (free tier) | Cloud LLM for conversational search (60 req/min free) |
| Ollama + Llama 3.2 | Local LLM fallback (fully offline) |
| CLIP (OpenAI) | Image embeddings for visual photo-match search |

---

## Architecture Rules

### Never violate these:

1. **No paid APIs** — Google Maps, Mapbox, OpenAI API (paid), Algolia, etc. are all forbidden.
2. **No microservices prematurely** — The backend is a modular monolith (single FastAPI app, clean module separation). Do not split into separate services unless a module becomes a proven scaling bottleneck.
3. **Viewport-based data loading always** — Never load all listings at once. Always filter by bounding box using PostGIS `ST_Within`. Max 500 results per viewport query.
4. **Progressive layer disclosure** — Layers do not all activate on page load. They activate contextually by zoom level or user action (see `docs/architecture.md`).
5. **Map is the primary output** — Every user action (search, filter, layer toggle) must update the map. Do not design flows where the map is secondary.

### Key patterns (use consistently):

**PostGIS viewport query pattern:**
```python
SELECT * FROM listings
WHERE ST_Within(geom, ST_MakeEnvelope(:west, :south, :east, :north, 4326))
LIMIT 500;
```

**Zustand store shape:**
```typescript
{
  viewport: { lat, lng, zoom, bounds },
  filters: { priceMin, priceMax, beds, baths },
  activeLayers: Set<LayerID>,
  hoveredListing: string | null,
  selectedListing: string | null,
  searchQuery: string,
  isochroneData: GeoJSON | null,
}
```

**SWR viewport-keyed fetching (debounced 300ms):**
```typescript
const { data } = useSWR(
  `listings?${encodeViewport(viewport)}&${encodeFilters(filters)}`,
  fetcher,
  { dedupingInterval: 300 }
);
```

---

## Project Structure

```
/
├── frontend/
│   ├── components/
│   │   ├── Map/           # MapLibre + Deck.gl canvas — core of the app
│   │   ├── Search/        # NLP search bar + filter panel
│   │   ├── Layers/        # Layer toggle controls
│   │   └── Listing/       # Card, detail drawer
│   ├── store/             # Zustand state (viewport, filters, layers)
│   ├── hooks/             # SWR viewport-keyed fetching hooks
│   └── api/               # API client functions (typed)
├── backend/
│   ├── api/
│   │   ├── listings.py    # PostGIS viewport queries
│   │   ├── search.py      # NLP → structured filter params
│   │   ├── layers.py      # School / flood / isochrone endpoints
│   │   └── visual.py      # CLIP image search
│   ├── models/            # SQLAlchemy ORM models
│   └── ml/                # CLIP + LLM integration
├── data/
│   ├── migrations/        # Alembic SQL migration files
│   ├── ingestion/         # ETL scripts (OSM, NCES, FEMA, TNRERA)
│   └── tiles/             # Protomaps .pmtiles file (gitignored — large binary)
├── infra/                 # Docker Compose, Dockerfiles, k6 load tests
├── docs/                  # Technical guides (architecture, deployment, etc.)
├── ADR/                   # Architecture Decision Records
├── CLAUDE.md              # ← You are here. AI assistant instructions.
├── CONTRIBUTING.md        # Branching, commits, testing standards
└── README.md              # Project overview + quick start
```

---

## Code Standards

### Backend (Python)
- Every public function must have a docstring explaining what it does and why
- Use type hints everywhere
- Use `async def` for all FastAPI route handlers
- Tests live in `backend/tests/` mirroring the source structure
- Run: `pytest backend/tests/ --cov=backend --cov-report=term-missing`

### Frontend (TypeScript)
- Strict TypeScript — no `any` types
- Every hook and store action must have a JSDoc comment
- Component files: PascalCase (`MapCanvas.tsx`)
- Hook files: camelCase with `use` prefix (`useViewportListings.ts`)
- Run: `pnpm test` (Vitest) and `pnpm test:e2e` (Playwright)

---

## Testing Requirements

Every phase must ship with:
- Unit tests for all new functions
- Integration tests for all new API endpoints
- E2E tests for all new user-facing interactions

Coverage targets:
- Backend unit: 90%
- Backend integration: 80%
- Frontend unit/component: 80%
- E2E critical paths: 100%
- Performance: viewport query p99 < 200ms (k6)

---

## Git Conventions

### Branches
- `main` — stable only, no direct commits
- `phase/01-database-schema`, `phase/02-map-shell`, etc. — one branch per phase

### Commit format (Conventional Commits)
```
feat(map): add viewport-keyed listing pins
fix(search): correct bbox parameter parsing
chore(docker): add valhalla service to compose
docs(adr): record MapLibre over Leaflet decision
test(listings): add integration tests for bbox query
perf(clusters): move supercluster to web worker
```

---

## 17 Planned Map Layers

| # | Layer | Activation Rule |
|---|---|---|
| 1 | Property listing pins | Always on |
| 2 | School district zones | zoom ≥ 12 OR children filter active |
| 3 | Flood zones | zoom ≥ 11 OR user toggles |
| 4 | Drive/walk/transit isochrones | After user pins commute destination |
| 5 | Transit routes and stops | zoom ≥ 13 |
| 6 | Noise pollution heatmap | User toggles |
| 7 | Crime density heatmap | User toggles |
| 8 | Demographics / income overlay | User toggles |
| 9 | Building permit activity | User toggles |
| 10 | Walk score / bike score polygons | User toggles |
| 11 | 3D building extrusions | zoom ≥ 15 |
| 12 | Listing price heatmap | zoom < 10 |
| 13 | Satellite / aerial imagery | User toggles |
| 14 | Buyer demand signals | User toggles |
| 15 | AI virtual staging overlay | Per-listing, user toggles |
| 16 | Price trend time-series | User toggles |
| 17 | Agent territory boundaries | User toggles |

---

## Free Data Sources

| Source | Data | Notes |
|---|---|---|
| OpenStreetMap | Roads, buildings, transit | PBF format via Geofabrik |
| NCES | US school district boundaries | GeoJSON |
| FEMA OpenFEMA | Flood zone maps | GeoJSON / Shapefile |
| US Census Bureau | Demographics, income | GeoJSON |
| TNRERA (tnrera.in) | Chennai new project registrations | Scrape |
| CMDA | Chennai planning permissions | Scrape |
| City open data portals | Building permits, zoning | Varies |

---

## Environment Variables

See `.env.example` for all required variables. Never commit `.env`.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `BACKEND_PORT` — FastAPI port (default 8000)
- `NEXT_PUBLIC_API_URL` — Frontend → backend URL
- `NEXT_PUBLIC_MAP_STYLE_URL` — OpenFreeMap tile URL
- `GROQ_API_KEY` — Optional, free tier LLM
- `TILES_PATH` — Path to .pmtiles file

---

## Local Development

```bash
# Start full stack
docker compose up

# Services
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
# Database:  localhost:5432
```

---

## Deployment (Phase 9)

- Frontend → Vercel (free tier)
- Backend + PostGIS → Fly.io (free tier)
- Map tiles → Cloudflare R2 (free up to 10GB)
- Target cost at launch: $0/month
