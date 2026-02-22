import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface ListingFilters {
  bbox?: BBox;
  priceMin?: number | null;
  priceMax?: number | null;
  neighborhoods?: string[];
  propertyTypes?: string[];
}

/**
 * Fetch property listings from the backend.
 * All filters are optional and combinable — the backend ANDs them together.
 */
export async function fetchListings(filters?: ListingFilters): Promise<Listing[]> {
  const params = new URLSearchParams();

  if (filters?.bbox) {
    params.set("west", filters.bbox.west.toString());
    params.set("south", filters.bbox.south.toString());
    params.set("east", filters.bbox.east.toString());
    params.set("north", filters.bbox.north.toString());
  }

  if (filters?.priceMin != null) {
    params.set("price_min", filters.priceMin.toString());
  }

  if (filters?.priceMax != null) {
    params.set("price_max", filters.priceMax.toString());
  }

  if (filters?.neighborhoods?.length) {
    params.set("neighborhoods", filters.neighborhoods.join(","));
  }

  if (filters?.propertyTypes?.length) {
    params.set("property_types", filters.propertyTypes.join(","));
  }

  const query = params.toString();
  const url = query ? `${API_URL}/api/listings?${query}` : `${API_URL}/api/listings`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch listings: ${res.status}`);
  }

  const data = await res.json();
  return data.listings as Listing[];
}
