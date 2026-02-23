"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { fetchListings } from "@/lib/api";
import { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";
import ListingSheet from "./ListingSheet";

type SortKey = "price_asc" | "price_desc";

export default function DesktopResultsPanel() {
  const {
    listingCount,
    activeFilters,
    selectedListing,
    setSelectedListing,
    searchQuery,
  } = useMapStore();

  const [listings, setListings] = useState<Listing[]>([]);
  const [sort, setSort] = useState<SortKey>("price_asc");
  const [quickType, setQuickType] = useState<string | null>(null);

  // Fetch listings in sync with MapCanvas (same filters + search)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const all = await fetchListings({
          priceMin: activeFilters.priceMin,
          priceMax: activeFilters.priceMax,
          neighborhoods: activeFilters.neighborhoods,
          propertyTypes:
            quickType
              ? [quickType]
              : activeFilters.propertyTypes,
        });

        if (cancelled) return;

        const q = searchQuery.toLowerCase().trim();
        const filtered = q
          ? all.filter(
              (l) =>
                l.neighborhood?.toLowerCase().includes(q) ||
                l.title?.toLowerCase().includes(q) ||
                l.city?.toLowerCase().includes(q)
            )
          : all;

        const sorted = [...filtered].sort((a, b) =>
          sort === "price_asc" ? a.price - b.price : b.price - a.price
        );

        setListings(sorted);
      } catch {
        // silently ignore — MapCanvas will show its own error
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeFilters, searchQuery, sort, quickType]);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky top bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#E5E5EA] bg-[#F2F2F7]">
        <div className="flex items-center justify-between gap-2">
          <span
            key={listingCount}
            className="text-[13px] font-semibold text-[#1C1C1E] animate-count-change"
          >
            {listingCount.toLocaleString()} home{listingCount !== 1 ? "s" : ""}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-[13px] font-medium text-[#1C1C1E] bg-transparent border border-[#E5E5EA] rounded-lg px-2 py-1 focus:outline-none focus:border-[#007AFF]"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Quick property type filter */}
        <div className="flex gap-2 mt-2">
          {[
            { key: null,        label: "All" },
            { key: "apartment", label: "Apartment" },
            { key: "villa",     label: "Villa" },
          ].map(({ key, label }) => (
            <button
              key={label}
              onClick={() => setQuickType(key)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                quickType === key
                  ? "bg-[#007AFF] text-white"
                  : "bg-white text-[#1C1C1E] border border-[#E5E5EA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* If a listing is selected, show its detail instead of the list */}
      {selectedListing ? (
        <div className="flex-1 overflow-hidden">
          <ListingSheet />
        </div>
      ) : (
        /* Scrollable listing cards */
        <div className="flex-1 overflow-y-auto panel-scroll divide-y divide-[#E5E5EA]">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#8E8E93]">
              <p className="text-[15px] font-medium">No homes found</p>
              <p className="text-[13px] mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSelected={selectedListing?.id === listing.id}
                onSelect={() => setSelectedListing(listing)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
