import os
import time
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

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
    west: Optional[float] = Query(None),
    south: Optional[float] = Query(None),
    east: Optional[float] = Query(None),
    north: Optional[float] = Query(None),
):
    """
    Return property listings.
    If west/south/east/north bbox params are provided, filter to that viewport.
    Otherwise return all listings (capped at 500).
    MVP: simple lat/lng filtering. Phase 2 upgrades to PostGIS ST_Within.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        bbox_provided = all(v is not None for v in [west, south, east, north])

        if bbox_provided:
            cur.execute(
                """
                SELECT id::text, title, price, beds, baths, area_sqft,
                       address, neighborhood, city, lat, lng, property_type
                FROM listings
                WHERE lat BETWEEN %s AND %s
                  AND lng BETWEEN %s AND %s
                ORDER BY price
                LIMIT 500
                """,
                (south, north, west, east),
            )
        else:
            cur.execute(
                """
                SELECT id::text, title, price, beds, baths, area_sqft,
                       address, neighborhood, city, lat, lng, property_type
                FROM listings
                ORDER BY price
                LIMIT 500
                """
            )

        rows = cur.fetchall()
        listings = [dict(row) for row in rows]
        return {"listings": listings, "total": len(listings)}
    finally:
        conn.close()
