export interface Listing {
  id: string;
  title: string;
  price: number;
  beds: number | null;
  baths: number | null;
  area_sqft: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string;
  lat: number;
  lng: number;
  property_type: string;
}

/**
 * Format a price in INR to a short human-readable label.
 * Examples: 3500000 → ₹35L, 12000000 → ₹1.2Cr, 35000000 → ₹3.5Cr
 */
export function formatPrice(price: number): string {
  if (price >= 10_000_000) {
    const cr = price / 10_000_000;
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1);
    return `₹${formatted}Cr`;
  }
  if (price >= 100_000) {
    return `₹${Math.round(price / 100_000)}L`;
  }
  return `₹${(price / 1000).toFixed(0)}K`;
}

/**
 * Format a price to a full display string with commas.
 * Example: 8500000 → ₹85,00,000
 */
export function formatPriceFull(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
