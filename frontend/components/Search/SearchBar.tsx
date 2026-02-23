"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, XCircle } from "lucide-react";
import { useMapStore, countActiveFilters } from "@/store/mapStore";

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setFilterSheetOpen,
    activeFilters,
  } = useMapStore();

  // Local state for immediate input responsiveness; debounce syncs to store
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localQuery), 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Keep local in sync if store is reset externally (e.g. filter reset)
  useEffect(() => {
    if (searchQuery === "") setLocalQuery("");
  }, [searchQuery]);

  const filterCount = countActiveFilters(activeFilters);

  return (
    // Hidden on desktop — search moves into the nav bar at lg breakpoint
    <div className="flex gap-2.5 items-center lg:hidden">
      {/* Search input */}
      <div
        className={`flex-1 glass rounded-2xl flex items-center px-4 py-3 gap-3 shadow-sm border transition-all duration-200 ${
          localQuery
            ? "border-[#007AFF]/30 shadow-[0_0_0_3px_rgba(0,122,255,0.08)]"
            : "border-white/50"
        }`}
      >
        <Search className="w-4 h-4 text-[#AEAEB2] flex-shrink-0" strokeWidth={2.5} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search by area, project, or address…"
          className="flex-1 bg-transparent text-[15px] leading-none placeholder-[#AEAEB2] text-[#1C1C1E] focus:outline-none"
        />
        {localQuery && (
          <button
            onClick={() => { setLocalQuery(""); setSearchQuery(""); }}
            className="flex-shrink-0 animate-scale-in"
            aria-label="Clear search"
          >
            <XCircle className="w-4 h-4 text-[#AEAEB2]" />
          </button>
        )}
      </div>

      {/* Filter button — blue badge when filters active */}
      <button
        onClick={() => setFilterSheetOpen(true)}
        aria-label={`Filters${filterCount > 0 ? ` (${filterCount} active)` : ""}`}
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
