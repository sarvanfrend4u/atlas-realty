import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

/**
 * Fetch property listings from the backend.
 * If a bounding box is provided, returns only listings within that viewport.
 * Phase 2 will use this bbox for PostGIS ST_Within queries.
 */
export async function fetchListings(bbox?: BBox): Promise<Listing[]> {
  let url = `${API_URL}/api/listings`;

  if (bbox) {
    const params = new URLSearchParams({
      west: bbox.west.toString(),
      south: bbox.south.toString(),
      east: bbox.east.toString(),
      north: bbox.north.toString(),
    });
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch listings: ${res.status}`);
  }

  const data = await res.json();
  return data.listings as Listing[];
}
