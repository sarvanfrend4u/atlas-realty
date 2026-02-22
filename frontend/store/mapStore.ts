import { create } from "zustand";
import { Listing } from "@/types/listing";

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
}

export const useMapStore = create<MapStore>((set) => ({
  selectedListing: null,
  setSelectedListing: (listing) => set({ selectedListing: listing }),

  listingCount: 0,
  setListingCount: (count) => set({ listingCount: count }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
