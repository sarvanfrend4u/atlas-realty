# ADR-003: PostgreSQL + PostGIS + pgvector for All Data Storage

## Status
Accepted

## Context
The platform needs three distinct data capabilities:
1. Relational data storage (listing attributes, users)
2. Spatial queries (viewport bounding box, polygon intersection, radius search)
3. Vector similarity search (CLIP image embeddings for visual photo matching)

We could use separate specialised databases (e.g. Elasticsearch for search, a separate vector DB like Pinecone for embeddings). The question is whether one database can handle all three.

## Decision
Use a single **PostgreSQL** instance with two extensions:
- **PostGIS** — for all spatial queries
- **pgvector** — for vector similarity search

## Consequences
**Better:**
- One database to manage, back up, and deploy
- PostGIS is the industry standard for spatial SQL — mature, well-documented
- pgvector supports cosine, L2, and inner product similarity with IVFFlat/HNSW indexes
- Joins between listings and spatial / vector queries happen in-process (no cross-DB calls)
- Supabase free tier includes PostGIS + pgvector — zero additional infrastructure

**Worse:**
- pgvector at very large scale (10M+ vectors) is slower than dedicated vector DBs (Pinecone, Weaviate)
- PostGIS spatial queries require careful index tuning for >1M rows

**Trigger for revisiting:**
Migrate embeddings to a dedicated vector DB if pgvector query latency exceeds 100ms at production scale.
