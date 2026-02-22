# ADR-002: FastAPI Modular Monolith over Microservices

## Status
Accepted

## Context
The backend needs to serve listings, spatial layers, NLP search, and visual search. These could be built as separate microservices (separate deployments, separate databases). The question is whether to start with microservices or a monolith.

## Decision
Use a **single FastAPI application** structured as a modular monolith — clean internal module separation (listings, search, layers, visual, ml) but deployed as one process.

## Consequences
**Better:**
- Single `docker compose up` for local dev — no service mesh to configure
- In-process calls between modules — no network latency between search and listings
- Single deployment unit — simpler CI/CD at this stage
- Easy to extract a module into its own service later if it becomes a bottleneck

**Worse:**
- If ML inference (CLIP) becomes CPU-heavy, it cannot be scaled independently without refactoring
- All modules share the same Python process and crash surface

**Trigger for revisiting:**
Extract the ML inference module into a separate service if CLIP embeddings or LLM calls cause > 50ms latency impact on other endpoints.
