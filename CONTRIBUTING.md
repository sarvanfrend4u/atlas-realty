# Contributing to Atlas Realty

This document defines the standards every developer and AI assistant must follow when contributing to this project.

---

## Golden Rules

1. **All tooling must be free and open source** — No paid APIs, no proprietary services.
2. **The map is the primary output** — Every feature must update the map. Do not build list-first flows.
3. **No microservices prematurely** — Backend is a modular monolith. Split only when there is a proven bottleneck.
4. **Tests ship with code** — No feature is complete without its tests.
5. **One phase at a time** — Do not start Phase N+1 until Phase N is complete, tested, and merged to `main`.

---

## Branching Strategy

```
main
└── phase/01-database-schema     ← active development
└── phase/02-map-shell
└── phase/03-geojson-layers
...
```

- `main` — stable only. Never commit directly to `main`.
- Each phase gets its own branch: `phase/NN-short-name`
- When a phase is complete, tested, and reviewed → merge to `main` → delete the phase branch.
- Hotfixes: `fix/short-description` branched from `main`.

---

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Config, tooling, dependencies, Docker |
| `docs` | Documentation, ADR entries |
| `refactor` | Code restructure with no behaviour change |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |

### Scopes

| Scope | Area |
|---|---|
| `map` | MapLibre / Deck.gl canvas |
| `db` | Database schema, migrations |
| `api` | FastAPI endpoints |
| `search` | NLP or filter search |
| `layers` | GeoJSON / overlay layers |
| `visual` | CLIP visual search |
| `docker` | Docker Compose / Dockerfile |
| `store` | Zustand state |
| `hooks` | SWR / React hooks |
| `adr` | Architecture Decision Records |

### Examples

```
feat(map): add viewport-keyed listing pins via Deck.gl ScatterplotLayer
feat(db): add PostGIS schema with ST_Within viewport query
fix(search): correct west/east bbox parameter order
chore(docker): add Valhalla routing service to compose
docs(adr): record decision to use MapLibre over Leaflet
test(api): add integration tests for listings bbox endpoint
perf(map): move Supercluster pin clustering to Web Worker
```

---

## Testing Standards

### What ships with every phase

Every phase must include:
- Unit tests for all new functions and utilities
- Integration tests for all new API endpoints
- E2E tests for all new user-facing interactions

No phase branch may be merged to `main` without passing tests.

### Backend (pytest)

```bash
# Run all backend tests
pytest backend/tests/ --cov=backend --cov-report=term-missing

# Run only unit tests
pytest backend/tests/unit/

# Run only integration tests
pytest backend/tests/integration/
```

File structure mirrors source:
```
backend/
├── api/listings.py
└── tests/
    ├── unit/
    │   └── test_listings.py
    └── integration/
        └── test_listings_api.py
```

Coverage targets:
- Unit: 90%
- Integration: 80%

### Frontend (Vitest + Playwright)

```bash
# Unit + component tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

Coverage targets:
- Unit / component: 80%
- E2E critical paths: 100%

### Performance (k6)

```bash
k6 run infra/tests/k6/viewport_load.js
```

Target: viewport query endpoint p99 < 200ms under 100 concurrent users.

---

## Code Standards

### Backend (Python)

- Python 3.12+
- Type hints on all functions
- `async def` for all FastAPI route handlers
- Docstring on every public function:

```python
async def get_listings_in_viewport(
    west: float, south: float, east: float, north: float,
    filters: ListingFilters
) -> list[Listing]:
    """
    Return listings within the given bounding box.

    Uses PostGIS ST_Within for spatial filtering.
    Capped at 500 results to maintain <200ms response time.
    """
```

- No bare `except:` — always catch specific exceptions
- Use `ruff` for linting: `ruff check backend/`

### Frontend (TypeScript)

- Strict TypeScript — no `any` types
- Component files: PascalCase (`MapCanvas.tsx`)
- Hook files: camelCase with `use` prefix (`useViewportListings.ts`)
- JSDoc on every hook and Zustand action:

```typescript
/**
 * Fetches listings for the current map viewport.
 * Re-fetches automatically when viewport or filters change.
 * Debounced at 300ms to avoid excessive API calls.
 */
export function useViewportListings(): Listing[]
```

- Use `pnpm` not `npm` or `yarn`
- ESLint + Prettier enforced

---

## Architecture Decision Records (ADR)

Every significant technical decision must be recorded in `/ADR/` before the code is written.

File naming: `NNN-short-title.md` (e.g. `001-maplibre-over-leaflet.md`)

Template:

```markdown
# ADR-NNN: [Title]

## Status
Accepted | Superseded by ADR-XXX | Deprecated

## Context
What situation or problem are we facing? Why does a decision need to be made?

## Decision
What did we decide to do?

## Consequences
What are the trade-offs? What becomes easier? What becomes harder?
```

---

## Environment Variables

Never commit `.env`. Always update `.env.example` when adding a new variable.

---

## Pull Request Checklist

Before merging a phase branch to `main`:

- [ ] All tests pass (`pytest` + `pnpm test` + `pnpm test:e2e`)
- [ ] Coverage targets met
- [ ] No `any` types in TypeScript
- [ ] All new functions have docstrings / JSDoc
- [ ] `.env.example` updated if new variables added
- [ ] ADR written for any new architectural decision
- [ ] `CLAUDE.md` phase table updated to mark phase complete
- [ ] `README.md` phase table updated
- [ ] `docker compose up` still works end-to-end

---

## Local Development

```bash
# Start all services
docker compose up

# Frontend only
cd frontend && pnpm dev

# Backend only
cd backend && uvicorn main:app --reload --port 8000

# Run DB migrations
cd backend && alembic upgrade head

# Seed database
python data/seed.py
```
