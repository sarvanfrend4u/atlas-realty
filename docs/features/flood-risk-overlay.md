# Flood Risk Overlay

A map layer that highlights Chennai's flood-prone zones, helping property buyers understand inundation risk before making a purchase decision.

---

## How to Use

1. Open the Atlas Realty home page at `http://localhost:3000`
2. Click the **🌊 Flood Risk** chip in the bottom-left corner of the map
3. Coloured overlays appear on the map — red for high-risk zones, orange for medium-risk zones
4. Click the chip again to hide the overlay

---

## Data Source

The flood zone data is **manually curated** from publicly available government and research sources. It is stored as a static GeoJSON file in the repository.

| Attribute | Detail |
|---|---|
| **File** | `backend/layers/flood_zones_chennai.geojson` |
| **Format** | GeoJSON FeatureCollection (RFC 7946) |
| **CRS** | EPSG:4326 (WGS 84 — standard GPS coordinates) |
| **Coverage** | Chennai Metropolitan Area |
| **Zones** | 5 indicative flood polygons |

### Primary Reference Sources

| Source | What it contributed |
|---|---|
| **NDMA (National Disaster Management Authority)** — flood risk assessments | Zone boundaries and risk classifications |
| **CMDA (Chennai Metropolitan Development Authority)** — Chennai Master Plan | Land-use designations, wetland boundaries, encroachment data |
| **2015 Chennai Floods** — post-disaster analysis reports | Empirical validation of which neighbourhoods were inundated |
| **CWC (Central Water Commission)** — river basin studies | Adyar and Cooum river floodplain extents |

> **Important:** This data is **indicative only** and is intended for general awareness. It should not be used as a substitute for a professional flood risk survey or CMDA/NDMA official flood hazard maps for property transactions.

### Flood Zones Included

| Zone | Risk Level | Type | Key Areas |
|---|---|---|---|
| Adyar River Floodplain | 🔴 High | Riverine | Saidapet, Kotturpuram, Adyar |
| Cooum River Corridor | 🔴 High | Riverine | Kilpauk, Nungambakkam, Egmore, Chetpet |
| Pallikaranai Marshland & Velachery | 🔴 High | Wetland | Velachery, Pallikaranai |
| Ambattur Lake Overflow Zone | 🟠 Medium | Lake overflow | Ambattur |
| Tondiarpet Coastal Low-lying Zone | 🟠 Medium | Coastal | Tondiarpet, north Chennai coast |

---

## How the Data Flows

```
GeoJSON file (static)
  └─ backend/layers/flood_zones_chennai.geojson

              │  read on request
              ▼

FastAPI endpoint
  GET /api/layers/flood
  └─ reads file, returns JSON response

              │  fetch() on first toggle
              ▼

MapLibre GL JS (MapCanvas.tsx)
  └─ addSource("flood-zones", geojson)
  └─ addLayer("flood-fill")   — semi-transparent polygon fill
  └─ addLayer("flood-line")   — polygon outline stroke

              │  visibility toggled by LayerControls
              ▼

User sees coloured overlays on map
```

### Lazy Loading

The GeoJSON is **not fetched on page load**. It is only requested from the backend the first time the user activates the layer. Once loaded, toggling the chip off/on simply changes MapLibre layer visibility — no repeat network request.

---

## Visual Encoding

| Risk Level | Fill Colour | Opacity | Stroke |
|---|---|---|---|
| High | `#FF3B30` (iOS red) | 25% | `#FF3B30` at 70% |
| Medium | `#FF9500` (iOS orange) | 18% | `#FF9500` at 70% |

Colours follow the iOS system palette for consistency with the Cupertino design language used throughout Atlas Realty.

---

## Code Locations

| Concern | File |
|---|---|
| GeoJSON data | [backend/layers/flood_zones_chennai.geojson](../backend/layers/flood_zones_chennai.geojson) |
| API endpoint | [backend/main.py](../../backend/main.py) — `GET /api/layers/flood` |
| Layer toggle state | [frontend/store/mapStore.ts](../../frontend/store/mapStore.ts) — `activeLayers`, `toggleLayer` |
| Map rendering | [frontend/components/Map/MapCanvas.tsx](../../frontend/components/Map/MapCanvas.tsx) — flood layer `useEffect` |
| Toggle UI chip | [frontend/components/Map/LayerControls.tsx](../../frontend/components/Map/LayerControls.tsx) |

---

## Extending the Layer

### Adding a new flood zone polygon

Edit `backend/layers/flood_zones_chennai.geojson` and append a new Feature to the `features` array:

```json
{
  "type": "Feature",
  "properties": {
    "zone_name": "Your Zone Name",
    "risk_level": "high",
    "description": "Brief description of the zone."
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [longitude, latitude],
      ...
    ]]
  }
}
```

Note: GeoJSON uses `[longitude, latitude]` order (not lat/lng).

### Adding more overlay layers (e.g. air quality, noise)

1. Add a new GeoJSON file to `backend/layers/`
2. Add a new endpoint in `backend/main.py` following the same pattern as `GET /api/layers/flood`
3. Add the layer definition to the `LAYERS` array in `frontend/components/Map/LayerControls.tsx`
4. Add the corresponding `useEffect` block in `MapCanvas.tsx`

---

## Future Improvements

- [ ] Source data from NDMA's open data API when one becomes publicly available
- [ ] Add property-level flood risk score derived from PostGIS spatial intersection with flood polygons
- [ ] Show flood risk badge on the listing detail sheet when a property falls inside a zone
- [ ] Add "last updated" timestamp to the GeoJSON metadata and surface it in the UI
- [ ] Integrate CMDA's official Chennai Flood Hazard Atlas polygons once digitised and released
