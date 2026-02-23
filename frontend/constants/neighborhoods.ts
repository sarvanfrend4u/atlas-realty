/**
 * Colour-coded neighbourhood styles for the 20 Chennai seed locations.
 * 6 geographic zone colours cycle across neighbourhoods.
 * Used by FilterSheet (location chips) and ListingSheet (neighbourhood badge).
 */
export interface NeighborhoodStyle {
  bg: string;
  text: string;
}

export const NEIGHBORHOOD_STYLES: Record<string, NeighborhoodStyle> = {
  // East Coast (seafront) — teal
  Adyar:          { bg: "rgba(90,200,250,0.15)",  text: "#0071A4" },
  Mylapore:       { bg: "rgba(90,200,250,0.15)",  text: "#0071A4" },
  "Besant Nagar": { bg: "rgba(90,200,250,0.15)",  text: "#0071A4" },
  Thiruvanmiyur:  { bg: "rgba(90,200,250,0.15)",  text: "#0071A4" },

  // Central (old city) — indigo
  "T. Nagar":       { bg: "rgba(88,86,214,0.12)",  text: "#3634A3" },
  Nungambakkam:     { bg: "rgba(88,86,214,0.12)",  text: "#3634A3" },
  Kilpauk:          { bg: "rgba(88,86,214,0.12)",  text: "#3634A3" },

  // North-Central — purple
  "Anna Nagar":   { bg: "rgba(175,82,222,0.12)",  text: "#8944AB" },

  // South (IT corridor) — green
  Sholinganallur: { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },
  Velachery:      { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },
  Perungudi:      { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },
  Pallikaranai:   { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },
  Thoraipakkam:   { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },
  Kelambakkam:    { bg: "rgba(52,199,89,0.12)",   text: "#248A3D" },

  // North (industrial) — blue
  Perambur:       { bg: "rgba(0,122,255,0.12)",   text: "#0062CC" },
  Mogappair:      { bg: "rgba(0,122,255,0.12)",   text: "#0062CC" },
  Ambattur:       { bg: "rgba(0,122,255,0.12)",   text: "#0062CC" },

  // West (suburban) — orange
  Porur:          { bg: "rgba(255,149,0,0.12)",   text: "#C84B00" },
  Tambaram:       { bg: "rgba(255,149,0,0.12)",   text: "#C84B00" },
  Chromepet:      { bg: "rgba(255,149,0,0.12)",   text: "#C84B00" },
};

/** Fallback style for any neighbourhood not in the map */
export const DEFAULT_NEIGHBORHOOD_STYLE: NeighborhoodStyle = {
  bg:   "rgba(142,142,147,0.12)",
  text: "#636366",
};

export function getNeighborhoodStyle(name: string | null | undefined): NeighborhoodStyle {
  if (!name) return DEFAULT_NEIGHBORHOOD_STYLE;
  return NEIGHBORHOOD_STYLES[name] ?? DEFAULT_NEIGHBORHOOD_STYLE;
}
