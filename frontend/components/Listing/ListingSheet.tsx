"use client";

import { X, Bed, Bath, Maximize2, MapPin, Heart, Calendar } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { formatPrice } from "@/types/listing";

export default function ListingSheet() {
  const { selectedListing, setSelectedListing } = useMapStore();

  if (!selectedListing) return null;

  const typeLabel =
    selectedListing.property_type === "villa" ? "Villa" : "Apartment";

  return (
    <>
      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 z-20 animate-fade-in"
        onClick={() => setSelectedListing(null)}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up pointer-events-none">
        <div className="glass border-t border-white/30 rounded-t-3xl shadow-2xl pointer-events-auto max-w-2xl mx-auto">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-9 h-1 rounded-full bg-[#C7C7CC]" />
          </div>

          <div className="px-5 pb-safe-or-8 pb-8 pt-1">
            {/* Header row */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-[28px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
                  {formatPrice(selectedListing.price)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-medium text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded-full">
                    {typeLabel}
                  </span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <MapPin className="w-3 h-3 text-[#8E8E93]" />
                    <span className="text-sm text-[#8E8E93]">
                      {selectedListing.neighborhood}, {selectedListing.city}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center flex-shrink-0 hover:bg-[#D1D1D6] transition-colors"
              >
                <X className="w-4 h-4 text-[#3A3A3C]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Title */}
            <p className="text-[15px] font-medium text-[#1C1C1E] mt-3 mb-4 leading-snug">
              {selectedListing.title}
            </p>

            {/* Stats row */}
            <div className="flex gap-3 mb-5">
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
              <button className="w-[52px] h-[52px] rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] transition-colors flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-[#3A3A3C]" strokeWidth={2} />
              </button>
            </div>
          </div>
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
    <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-3 py-2">
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
