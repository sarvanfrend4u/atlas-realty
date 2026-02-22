export const BUDGET_PRESETS = [
  { key: "under50L",   label: "Under ₹50L",   min: null,       max: 5_000_000  },
  { key: "50L-1Cr",   label: "₹50L – ₹1Cr",  min: 5_000_000,  max: 10_000_000 },
  { key: "1Cr-2Cr",   label: "₹1Cr – ₹2Cr",  min: 10_000_000, max: 20_000_000 },
  { key: "above2Cr",  label: "Above ₹2Cr",   min: 20_000_000, max: null        },
] as const;

export const LOCATIONS = [
  "Sholinganallur",
  "Anna Nagar",
  "T. Nagar",
  "Adyar",
  "Velachery",
  "Porur",
  "Mogappair",
  "Perambur",
  "Tambaram",
  "Thiruvanmiyur",
  "Kilpauk",
  "Nungambakkam",
  "Perungudi",
  "Kelambakkam",
  "Pallikaranai",
  "Ambattur",
  "Chromepet",
  "Mylapore",
  "Besant Nagar",
  "Thoraipakkam",
];

export const PROPERTY_TYPES = [
  { key: "apartment", label: "Apartment" },
  { key: "villa",     label: "Villa"      },
] as const;
