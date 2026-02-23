"use client";

import dynamic from "next/dynamic";
import { MapPin, Search, Menu } from "lucide-react";
import SearchBar from "@/components/Search/SearchBar";
import ListingSheet from "@/components/Listing/ListingSheet";
import FilterSheet from "@/components/Filters/FilterSheet";
import LayerControls from "@/components/Map/LayerControls";
import DesktopResultsPanel from "@/components/Listing/DesktopResultsPanel";
import { useMapStore, countActiveFilters } from "@/store/mapStore";

const MapCanvas = dynamic(() => import("@/components/Map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#E8E0D8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center mx-auto mb-3 animate-pulse">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm text-[#8E8E93] font-medium">Loading Chennai map…</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const { listingCount, searchQuery, setSearchQuery, setFilterSheetOpen, activeFilters } = useMapStore();
  const filterCount = countActiveFilters(activeFilters);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#E8E0D8]">

      {/* ── Map — constrained to left on desktop (right panel takes 400px) ── */}
      <div className="absolute inset-0 lg:right-[400px]">
        <MapCanvas />

        {/* Layer controls + listing count badge — inside map area */}
        <div className="absolute bottom-8 left-4 z-20 flex flex-col items-start gap-2">
          <LayerControls />
          {listingCount > 0 && (
            <div className="animate-fade-in lg:hidden">
              <div className="glass rounded-full px-4 py-2 shadow-sm border border-white/50">
                <span
                  key={listingCount}
                  className="text-[13px] font-semibold text-[#1C1C1E] animate-count-change"
                >
                  {listingCount.toLocaleString()} homes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop right results panel ─────────────────────────────────── */}
      <div className="hidden lg:flex absolute top-16 right-0 bottom-0 w-[400px] z-20 sidebar-panel flex-col">
        <DesktopResultsPanel />
      </div>

      {/* ── Navigation bar — responsive ─────────────────────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-20 glass border-b border-white/30">
        <div className="h-14 lg:h-16 px-4 lg:px-6 flex items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF] flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-[#1C1C1E]">
              Atlas Realty
            </span>
          </div>

          {/* Desktop inline search (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-[480px] mx-auto">
            <div
              className={`w-full glass rounded-2xl flex items-center px-4 py-2.5 gap-3 shadow-sm border transition-all duration-200 ${
                searchQuery
                  ? "border-[#007AFF]/30 shadow-[0_0_0_3px_rgba(0,122,255,0.08)]"
                  : "border-white/50"
              }`}
            >
              <Search className="w-4 h-4 text-[#AEAEB2] flex-shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Chennai properties…"
                className="flex-1 bg-transparent text-[14px] leading-none placeholder-[#AEAEB2] text-[#1C1C1E] focus:outline-none"
              />
            </div>
          </div>

          {/* Desktop nav links (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-5 flex-shrink-0 text-[15px] font-medium text-[#1C1C1E]">
            <button className="hover:text-[#007AFF] transition-colors">Buy</button>
            <button className="hover:text-[#007AFF] transition-colors">Rent</button>
            <button className="hover:text-[#007AFF] transition-colors">Projects</button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Desktop: Filter button */}
            <button
              onClick={() => setFilterSheetOpen(true)}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[14px] font-semibold border transition-colors ${
                filterCount > 0
                  ? "bg-[#007AFF] border-[#007AFF] text-white"
                  : "glass border-white/50 text-[#1C1C1E]"
              }`}
            >
              Filters
              {filterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {filterCount}
                </span>
              )}
            </button>
            {/* Sign In (desktop only) */}
            <button className="text-[#007AFF] text-[15px] font-medium hidden lg:block">
              Sign In
            </button>
            {/* List Property */}
            <button className="bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white text-[14px] font-semibold px-3 py-1.5 lg:px-5 lg:py-2.5 lg:text-[15px] rounded-full shadow-sm">
              List Property
            </button>
            {/* Hamburger (mobile only) */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#1C1C1E]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile search bar (below nav) — hidden on desktop ───────────── */}
      <div className="absolute top-14 left-0 right-0 z-20 px-4 pt-3 max-w-screen-sm mx-auto w-full">
        <SearchBar />
      </div>

      {/* ── Sheets (each handles mobile/desktop mode internally) ─────────── */}
      <FilterSheet />
      <ListingSheet />
    </main>
  );
}
