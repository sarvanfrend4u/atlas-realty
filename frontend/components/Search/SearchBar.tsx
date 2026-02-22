"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useMapStore();

  return (
    <div className="flex gap-2.5 items-center">
      {/* Search input */}
      <div className="flex-1 glass rounded-2xl flex items-center px-4 py-3 gap-3 shadow-sm border border-white/50">
        <Search className="w-4 h-4 text-ios-gray-400 flex-shrink-0" strokeWidth={2.5} />
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

      {/* Filter button */}
      <button className="glass rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm border border-white/50 flex-shrink-0">
        <SlidersHorizontal className="w-5 h-5 text-[#1C1C1E]" strokeWidth={2} />
      </button>
    </div>
  );
}
