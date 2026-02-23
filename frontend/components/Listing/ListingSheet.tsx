"use client";

import { useState } from "react";
import { X, Bed, Bath, Maximize2, MapPin, Heart, Calendar, Share2, Home } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { formatPrice } from "@/types/listing";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getNeighborhoodStyle } from "@/constants/neighborhoods";

export default function ListingSheet() {
  const { selectedListing, setSelectedListing } = useMapStore();
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const [saved, setSaved] = useState(false);

  if (!selectedListing) return null;

  const typeLabel =
    selectedListing.property_type === "villa" ? "Villa" : "Apartment";

  const nbStyle = getNeighborhoodStyle(selectedListing.neighborhood);

  const pricePerSqft =
    selectedListing.area_sqft && selectedListing.price
      ? Math.round(selectedListing.price / selectedListing.area_sqft)
      : null;

  const imageBlock = (
    <div
      className="w-full flex-shrink-0 flex items-center justify-center"
      style={{
        height: "160px",
        background: "linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)",
      }}
    >
      <Home className="w-12 h-12 text-[#C7C7CC]" strokeWidth={1} />
    </div>
  );

  const sheetContent = (
    <div className="px-5 pb-8 pt-1 overflow-y-auto flex-1 panel-scroll">
      {/* Header row */}
      <div className="flex justify-between items-start mb-1 mt-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[28px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
            {formatPrice(selectedListing.price)}
          </p>
          {pricePerSqft && (
            <p className="text-[13px] text-[#8E8E93] mt-0.5">
              ₹{pricePerSqft.toLocaleString("en-IN")}/sqft
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {/* Property type badge */}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-[#007AFF] bg-blue-50">
              {typeLabel}
            </span>
            {/* Neighbourhood badge — colour-coded by zone */}
            {selectedListing.neighborhood && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: nbStyle.bg, color: nbStyle.text }}
              >
                {selectedListing.neighborhood}
              </span>
            )}
            {/* City */}
            <div className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-[#8E8E93]" />
              <span className="text-sm text-[#8E8E93]">{selectedListing.city}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedListing(null)}
          className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center flex-shrink-0 hover:bg-[#D1D1D6] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#3A3A3C]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Title */}
      <p className="text-[15px] font-medium text-[#1C1C1E] mt-3 mb-4 leading-snug">
        {selectedListing.title}
      </p>

      {/* Stats row — horizontal scroll on narrow */}
      <div className="flex gap-3 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {selectedListing.beds != null && (
          <StatPill
            icon={<Bed className="w-4 h-4 text-[#007AFF]" />}
            label="Beds"
            value={String(selectedListing.beds)}
          />
        )}
        {selectedListing.baths != null && (
          <StatPill
            icon={<Bath className="w-4 h-4 text-[#007AFF]" />}
            label="Baths"
            value={String(selectedListing.baths)}
          />
        )}
        {selectedListing.area_sqft != null && (
          <StatPill
            icon={<Maximize2 className="w-4 h-4 text-[#007AFF]" />}
            label="Area"
            value={`${selectedListing.area_sqft.toLocaleString()} sqft`}
          />
        )}
      </div>

      {/* CTA row */}
      <div className="flex gap-3">
        <button className="flex-1 bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white font-semibold text-[15px] py-3.5 rounded-2xl flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Visit
        </button>
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Remove from saved" : "Save property"}
          className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
            saved ? "bg-[#FFE5E5] hover:bg-[#FFD0D0]" : "bg-[#F2F2F7] hover:bg-[#E5E5EA]"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              saved ? "scale-110 text-[#FF3B30]" : "text-[#3A3A3C]"
            }`}
            fill={saved ? "#FF3B30" : "none"}
            strokeWidth={2}
          />
        </button>
        <button
          aria-label="Share property"
          className="w-[52px] h-[52px] rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] transition-colors flex items-center justify-center flex-shrink-0"
        >
          <Share2 className="w-5 h-5 text-[#3A3A3C]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );

  if (isDesktop) {
    // ── Desktop: right panel (no backdrop, no drag handle) ─────────────────
    return (
      <div className="fixed top-16 right-0 bottom-0 w-[400px] z-30 animate-slide-left bg-white border-l border-[#E5E5EA] flex flex-col overflow-hidden">
        {imageBlock}
        {sheetContent}
      </div>
    );
  }

  // ── Mobile: bottom sheet ────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop scrim (transparent — clicking map closes the sheet) */}
      <div
        className="fixed inset-0 z-20 animate-fade-in"
        onClick={() => setSelectedListing(null)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up pointer-events-none">
        <div className="glass border-t border-white/30 rounded-t-3xl sheet-shadow pointer-events-auto max-w-2xl mx-auto overflow-hidden">
          {imageBlock}
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-0">
            <div className="w-9 h-1 rounded-full bg-[#C7C7CC]" />
          </div>
          {sheetContent}
        </div>
      </div>
    </>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-3 py-2 flex-shrink-0">
      {icon}
      <div>
        <p className="text-[11px] text-[#8E8E93] leading-none">{label}</p>
        <p className="text-[13px] font-semibold text-[#1C1C1E] mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}
