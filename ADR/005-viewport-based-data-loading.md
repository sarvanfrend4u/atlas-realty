# ADR-005: Viewport-Based Data Loading (Never Load All Listings)

## Status
Accepted

## Context
A real estate platform may have thousands to millions of listings. Loading all of them on page load would be slow, memory-intensive, and would make the map unusable. We need a strategy for loading only the data the user can currently see.

## Decision
**Never load all listings at once.** All listing queries are filtered by the current map viewport bounding box using PostGIS `ST_Within`. Results are capped at 500 per query. The frontend re-fetches automatically when the viewport changes (debounced at 300ms).

```python
SELECT * FROM listings
WHERE ST_Within(geom, ST_MakeEnvelope(:west, :south, :east, :north, 4326))
LIMIT 500;
```

```typescript
// SWR key changes with viewport → triggers re-fetch
const key = `listings?${encodeViewport(viewport)}&${encodeFilters(filters)}`;
const { data } = useSWR(key, fetcher, { dedupingInterval: 300 });
```

## Consequences
**Better:**
- Consistent <200ms API response time regardless of total listings in DB
- Map remains responsive at any zoom level
- SWR caches previous viewports — returning to a past area is instant
- At low zoom, pins are replaced by a heatmap (separate `/heatmap` endpoint returns aggregated tiles, not individual points)

**Worse:**
- Users cannot export or see all listings at once (intentional — this is a map-first product)
- Viewport key changes on every pixel of pan — debounce is critical to avoid API spam

**Hard rule:**
No endpoint may return more than 500 individual listing records in a single response. This cap must never be removed without a performance review.
