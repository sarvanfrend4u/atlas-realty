# Atlas Realty

A map-first real estate search platform built entirely with free and open source tools.

> **"The map is the application. Everything else is a feature of the map."**

---

## What It Does

Atlas Realty reimagines property search around an interactive map rather than a list of results. Every action — filtering by price, searching by natural language, toggling school zones, dropping a commute pin — updates the map as the primary output.

**Planned capabilities:**
- Viewport-based listing pins (only loads what's visible)
- 17 toggleable data layers (schools, flood zones, isochrones, crime, demographics, and more)
- Natural language search ("3BHK near OMR under 80L")
- Visual photo-match search (upload a room photo, find similar listings)
- Commute isochrones (draw 15-min drive/walk zone from any point)
- Real-time filter panel (price, beds, baths)

---

## Tech Stack

100% free and open source — no Google Maps, no Mapbox, no paid APIs.

| Layer | Technology |
|---|---|
| Frontend | Next.js + MapLibre GL JS + Deck.gl + Zustand + SWR + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + PostGIS + pgvector |
| Map Tiles | OpenFreeMap / Protomaps |
| Routing | Valhalla (isochrones) |
| Geocoding | Photon (OpenStreetMap-based) |
| AI Search | Groq free tier / Ollama + Llama 3.2 |
| Visual Search | CLIP (OpenAI, MIT license) |
| Infrastructure | Docker Compose |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/sarvanfrend4u/atlas-realty.git
cd atlas-realty

# 2. Copy environment variables
cp .env.example .env

# 3. Start everything
docker compose up
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Database | localhost:5432 |

---

## Project Structure

```
/
├── frontend/          # Next.js app (map, search, layers, listing UI)
├── backend/           # FastAPI app (listings, search, layers, visual API)
├── data/              # Migrations, ETL ingestion scripts, map tiles
├── infra/             # Docker Compose, Dockerfiles, load tests
├── docs/              # Technical documentation
├── ADR/               # Architecture Decision Records
├── CLAUDE.md          # AI assistant instructions (auto-loaded by Claude Code)
├── CONTRIBUTING.md    # Contribution guide, conventions, standards
└── .env.example       # Environment variable template
```

---

## Build Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Database schema + Docker scaffold | 🔲 |
| 2 | Map shell + viewport listing pins | 🔲 |
| 3 | Static GeoJSON layers (schools, flood zones) | 🔲 |
| 4 | Isochrone integration (Valhalla) | 🔲 |
| 5 | Filter panel (price, beds, baths) | 🔲 |
| 6 | Conversational NLP search | 🔲 |
| 7 | Visual photo-match search (CLIP) | 🔲 |
| 8 | Clustering and performance | 🔲 |
| 9 | Production deployment | 🔲 |

---

## Documentation

- [Architecture](docs/architecture.md) — Full system design, patterns, data flow
- [Contributing](CONTRIBUTING.md) — Branching, commits, testing standards
- [ADR](ADR/) — Architecture Decision Records
- [AI Context](CLAUDE.md) — Instructions for AI coding assistants

---

## Deployment

Target: **$0/month** at launch

| Service | Provider |
|---|---|
| Frontend | Vercel (free tier) |
| Backend + PostGIS | Fly.io (free tier) |
| Map tiles | Cloudflare R2 (free up to 10GB) |

---

## License

MIT
