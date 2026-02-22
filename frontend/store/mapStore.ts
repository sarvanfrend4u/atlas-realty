import { create } from "zustand";
import { Listing } from "@/types/listing";

export interface ActiveFilters {
  /** Selected budget preset key — single select */
  budgetKey: string | null;
  priceMin: number | null;
  priceMax: number | null;
  /** Selected neighborhood names — multi select */
  neighborhoods: string[];
  /** Selected property type keys — multi select */
  propertyTypes: string[];
}

export const DEFAULT_FILTERS: ActiveFilters = {
  budgetKey: null,
  priceMin: null,
  priceMax: null,
  neighborhoods: [],
  propertyTypes: [],
};

/** Returns the number of active filter dimensions (for badge count) */
export function countActiveFilters(f: ActiveFilters): number {
  return (
    (f.budgetKey ? 1 : 0) +
    (f.neighborhoods.length > 0 ? 1 : 0) +
    (f.propertyTypes.length > 0 ? 1 : 0)
  );
}

interface MapStore {
  /** Currently selected listing (shown in the bottom sheet) */
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;

  /** Total number of listings loaded on the map */
  listingCount: number;
  setListingCount: (count: number) => void;

  /** Current search query text */
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  /** Active filter state */
  activeFilters: ActiveFilters;
  setActiveFilters: (filters: ActiveFilters) => void;
  resetFilters: () => void;

  /** Filter sheet open/close */
  isFilterSheetOpen: boolean;
  setFilterSheetOpen: (open: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedListing: null,
  setSelectedListing: (listing) => set({ selectedListing: listing }),

  listingCount: 0,
  setListingCount: (count) => set({ listingCount: count }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  activeFilters: DEFAULT_FILTERS,
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  resetFilters: () => set({ activeFilters: DEFAULT_FILTERS }),

  isFilterSheetOpen: false,
  setFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),
}));
