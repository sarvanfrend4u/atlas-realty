"use client";

import { Heart, Home } from "lucide-react";
import { useState } from "react";
import { Listing, formatPrice } from "@/types/listing";
import { getNeighborhoodStyle } from "@/constants/neighborhoods";

interface ListingCardProps {
  listing: Listing;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ListingCard({ listing, onSelect, isSelected }: ListingCardProps) {
  const [saved, setSaved] = useState(false);
  const nbStyle = getNeighborhoodStyle(listing.neighborhood);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left flex gap-3 p-4 transition-colors hover:bg-white/60 ${
        isSelected
          ? "border-l-4 border-[#007AFF] bg-[#F0F7FF] pl-3"
          : "border-l-4 border-transparent"
      }`}
    >
      {/* Image placeholder */}
      <div
        className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)" }}
      >
        <Home className="w-7 h-7 text-[#C7C7CC]" strokeWidth={1} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[17px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
            {formatPrice(listing.price)}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            aria-label={saved ? "Remove from saved" : "Save"}
            className="flex-shrink-0 p-1 -mt-0.5"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                saved ? "text-[#FF3B30] scale-110" : "text-[#C7C7CC]"
              }`}
              fill={saved ? "#FF3B30" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Neighbourhood badge */}
        {listing.neighborhood && (
          <span
            className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1"
            style={{ backgroundColor: nbStyle.bg, color: nbStyle.text }}
          >
            {listing.neighborhood}
          </span>
        )}

        {/* Stats */}
        <p className="text-[13px] text-[#8E8E93] mt-1.5 flex items-center gap-2">
          {listing.beds != null && <span>{listing.beds} Bed</span>}
          {listing.baths != null && <span>· {listing.baths} Bath</span>}
          {listing.area_sqft != null && (
            <span>· {listing.area_sqft.toLocaleString()} sqft</span>
          )}
        </p>
      </div>
    </button>
  );
}
