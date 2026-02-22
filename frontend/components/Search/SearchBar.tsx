"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMapStore, countActiveFilters } from "@/store/mapStore";

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setFilterSheetOpen,
    activeFilters,
  } = useMapStore();

  const filterCount = countActiveFilters(activeFilters);

  return (
    <div className="flex gap-2.5 items-center">
      {/* Search input */}
      <div className="flex-1 glass rounded-2xl flex items-center px-4 py-3 gap-3 shadow-sm border border-white/50">
        <Search className="w-4 h-4 text-[#AEAEB2] flex-shrink-0" strokeWidth={2.5} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Chennai properties…"
          className="flex-1 bg-transparent text-[15px] leading-none placeholder-[#AEAEB2] text-[#1C1C1E] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="w-5 h-5 rounded-full bg-[#AEAEB2] flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-xs leading-none font-medium">✕</span>
          </button>
        )}
      </div>

      {/* Filter button — shows blue badge when filters are active */}
      <button
        onClick={() => setFilterSheetOpen(true)}
        className={`relative rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm border flex-shrink-0 transition-colors ${
          filterCount > 0
            ? "bg-[#007AFF] border-[#007AFF]"
            : "glass border-white/50"
        }`}
      >
        <SlidersHorizontal
          className={`w-5 h-5 ${filterCount > 0 ? "text-white" : "text-[#1C1C1E]"}`}
          strokeWidth={2}
        />
        {/* Active filter count badge */}
        {filterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#007AFF] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#007AFF] leading-none">
              {filterCount}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
