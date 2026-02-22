"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import SearchBar from "@/components/Search/SearchBar";
import ListingSheet from "@/components/Listing/ListingSheet";
import FilterSheet from "@/components/Filters/FilterSheet";
import { useMapStore } from "@/store/mapStore";

const MapCanvas = dynamic(() => import("@/components/Map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#E8E0D8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center mx-auto mb-3 animate-pulse">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm text-[#8E8E93] font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const { listingCount } = useMapStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#E8E0D8]">
      {/* ── Full-screen map ─────────────────────────────────────────── */}
      <MapCanvas />

      {/* ── Navigation bar ──────────────────────────────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-20 glass border-b border-white/30">
        <div className="h-14 px-4 flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF] flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-[#1C1C1E]">
              Atlas Realty
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-[#007AFF] text-[15px] font-medium hidden sm:block">
              Sign In
            </button>
            <button className="bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white text-[14px] font-semibold px-4 py-2 rounded-full shadow-sm">
              List Property
            </button>
          </div>
        </div>
      </nav>

      {/* ── Search + Filter bar ──────────────────────────────────────── */}
      <div className="absolute top-14 left-0 right-0 z-20 px-4 pt-3 max-w-screen-sm mx-auto w-full">
        <SearchBar />
      </div>

      {/* ── Listing count badge ─────────────────────────────────────── */}
      {listingCount > 0 && (
        <div className="absolute bottom-8 left-4 z-20 animate-fade-in">
          <div className="glass rounded-full px-4 py-2 shadow-sm border border-white/50">
            <span className="text-[13px] font-semibold text-[#1C1C1E]">
              {listingCount} homes
            </span>
          </div>
        </div>
      )}

      {/* ── Filter sheet (slides up from bottom) ────────────────────── */}
      <FilterSheet />

      {/* ── Listing detail sheet ────────────────────────────────────── */}
      <ListingSheet />
    </main>
  );
}
