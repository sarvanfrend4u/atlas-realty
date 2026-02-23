import os
import time
import json
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

LAYERS_DIR = os.path.join(os.path.dirname(__file__), "layers")

app = FastAPI(title="Atlas Realty API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/atlas_realty"
)


def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def wait_for_db(max_retries: int = 30) -> None:
    for attempt in range(1, max_retries + 1):
        try:
            conn = psycopg2.connect(DATABASE_URL)
            conn.close()
            print(f"✅ Database ready after {attempt} attempt(s)")
            return
        except Exception as exc:
            print(f"⏳ Waiting for database ({attempt}/{max_retries}): {exc}")
            time.sleep(2)
    raise RuntimeError("Database not available after maximum retries")


@app.on_event("startup")
async def startup() -> None:
    wait_for_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/listings")
def get_listings(
    # Viewport bbox
    west: Optional[float] = Query(None),
    south: Optional[float] = Query(None),
    east: Optional[float] = Query(None),
    north: Optional[float] = Query(None),
    # Budget filter
    price_min: Optional[int] = Query(None),
    price_max: Optional[int] = Query(None),
    # Location filter — comma-separated neighborhood names e.g. "Adyar,Velachery"
    neighborhoods: Optional[str] = Query(None),
    # Property type filter — comma-separated e.g. "apartment,villa"
    property_types: Optional[str] = Query(None),
):
    """
    Return property listings with optional filters.
    All filter params are combinable — filters are ANDed together.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()

        # Build query dynamically based on provided filters
        query = """
            SELECT id::text, title, price, beds, baths, area_sqft,
                   address, neighborhood, city, lat, lng, property_type
            FROM listings
            WHERE 1=1
        """
        params: list = []

        # Viewport bbox
        if all(v is not None for v in [west, south, east, north]):
            query += " AND lat BETWEEN %s AND %s AND lng BETWEEN %s AND %s"
            params.extend([south, north, west, east])

        # Budget
        if price_min is not None:
            query += " AND price >= %s"
            params.append(price_min)

        if price_max is not None:
            query += " AND price <= %s"
            params.append(price_max)

        # Neighborhoods (multi-select, comma-separated)
        if neighborhoods:
            neighborhood_list = [n.strip() for n in neighborhoods.split(",") if n.strip()]
            if neighborhood_list:
                placeholders = ",".join(["%s"] * len(neighborhood_list))
                query += f" AND neighborhood IN ({placeholders})"
                params.extend(neighborhood_list)

        # Property types (multi-select, comma-separated)
        if property_types:
            type_list = [t.strip() for t in property_types.split(",") if t.strip()]
            if type_list:
                placeholders = ",".join(["%s"] * len(type_list))
                query += f" AND property_type IN ({placeholders})"
                params.extend(type_list)

        query += " ORDER BY price LIMIT 500"

        cur.execute(query, params)
        rows = cur.fetchall()
        listings = [dict(row) for row in rows]
        return {"listings": listings, "total": len(listings)}
    finally:
        conn.close()


@app.get("/api/layers/flood")
def get_flood_layer():
    """Return the Chennai flood zones GeoJSON layer."""
    path = os.path.join(LAYERS_DIR, "flood_zones_chennai.geojson")
    with open(path, "r") as f:
        data = json.load(f)
    return JSONResponse(content=data)
