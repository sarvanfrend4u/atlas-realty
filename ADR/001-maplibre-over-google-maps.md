# ADR-001: MapLibre GL JS over Google Maps / Mapbox

## Status
Accepted

## Context
The platform requires a WebGL-capable map renderer that can handle 200,000+ data points at 60fps for heatmaps, pin clusters, and polygon layers. Google Maps and Mapbox are the most commonly known options but carry significant cost at scale (~$350/month for Google Maps at moderate traffic). We need a solution with zero licensing cost.

## Decision
Use **MapLibre GL JS** as the base map renderer, with **OpenFreeMap** (free hosted tile service) or **Protomaps** (self-hosted `.pmtiles`) for tile serving.

MapLibre GL JS is a community-maintained fork of Mapbox GL JS created after Mapbox changed its license in 2021. It is BSD-3 licensed and API-compatible with Mapbox GL JS.

## Consequences
**Better:**
- Zero licensing cost at any scale
- WebGL rendering — vector tiles at ~16ms/frame on mid-range hardware
- Full API compatibility with Mapbox GL JS (large ecosystem of plugins)
- Deck.gl integrates natively with MapLibre for additional WebGL layers

**Worse:**
- No Google Maps Street View integration
- Fewer ready-made UI controls vs. Google Maps (must build custom)
- Tile server setup required for self-hosted production (Protomaps / Cloudflare R2)
