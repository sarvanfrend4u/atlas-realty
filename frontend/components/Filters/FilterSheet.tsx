"use client";

import { X, RotateCcw } from "lucide-react";
import { useMapStore, ActiveFilters, countActiveFilters } from "@/store/mapStore";
import { BUDGET_PRESETS, LOCATIONS, PROPERTY_TYPES } from "@/constants/filters";

export default function FilterSheet() {
  const {
    isFilterSheetOpen,
    setFilterSheetOpen,
    activeFilters,
    setActiveFilters,
    resetFilters,
    listingCount,
  } = useMapStore();

  if (!isFilterSheetOpen) return null;

  // ── Budget handlers (single select) ──────────────────────────────────────
  function toggleBudget(key: string, min: number | null, max: number | null) {
    const isSelected = activeFilters.budgetKey === key;
    setActiveFilters({
      ...activeFilters,
      budgetKey: isSelected ? null : key,
      priceMin: isSelected ? null : min,
      priceMax: isSelected ? null : max,
    });
  }

  // ── Location handlers (multi select) ─────────────────────────────────────
  function toggleNeighborhood(name: string) {
    const already = activeFilters.neighborhoods.includes(name);
    setActiveFilters({
      ...activeFilters,
      neighborhoods: already
        ? activeFilters.neighborhoods.filter((n) => n !== name)
        : [...activeFilters.neighborhoods, name],
    });
  }

  // ── Property type handlers (multi select) ─────────────────────────────────
  function togglePropertyType(key: string) {
    const already = activeFilters.propertyTypes.includes(key);
    setActiveFilters({
      ...activeFilters,
      propertyTypes: already
        ? activeFilters.propertyTypes.filter((t) => t !== key)
        : [...activeFilters.propertyTypes, key],
    });
  }

  const activeCount = countActiveFilters(activeFilters);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 animate-fade-in"
        onClick={() => setFilterSheetOpen(false)}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up max-w-2xl mx-auto">
        <div className="bg-[#F2F2F7] rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-[#C7C7CC]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
            <button
              onClick={() => { resetFilters(); }}
              className={`text-[15px] font-medium transition-colors ${
                activeCount > 0 ? "text-[#007AFF]" : "text-[#AEAEB2]"
              }`}
            >
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </span>
            </button>

            <p className="text-[17px] font-semibold text-[#1C1C1E]">Filters</p>

            <button
              onClick={() => setFilterSheetOpen(false)}
              className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors"
            >
              <X className="w-4 h-4 text-[#3A3A3C]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 pb-2">

            {/* ── Budget ──────────────────────────────────────────────── */}
            <Section label="Budget">
              <div className="flex flex-wrap gap-2">
                {BUDGET_PRESETS.map((preset) => (
                  <Chip
                    key={preset.key}
                    label={preset.label}
                    selected={activeFilters.budgetKey === preset.key}
                    onToggle={() => toggleBudget(preset.key, preset.min, preset.max)}
                  />
                ))}
              </div>
            </Section>

            <Divider />

            {/* ── Location ────────────────────────────────────────────── */}
            <Section label="Location">
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    selected={activeFilters.neighborhoods.includes(name)}
                    onToggle={() => toggleNeighborhood(name)}
                  />
                ))}
              </div>
            </Section>

            <Divider />

            {/* ── Property Type ────────────────────────────────────────── */}
            <Section label="Property Type">
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <Chip
                    key={type.key}
                    label={type.label}
                    selected={activeFilters.propertyTypes.includes(type.key)}
                    onToggle={() => togglePropertyType(type.key)}
                  />
                ))}
              </div>
            </Section>
          </div>

          {/* ── Show results button ──────────────────────────────────────── */}
          <div className="px-5 py-4 flex-shrink-0 border-t border-[#E5E5EA]">
            <button
              onClick={() => setFilterSheetOpen(false)}
              className="w-full bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white font-semibold text-[15px] py-3.5 rounded-2xl"
            >
              {listingCount > 0
                ? `Show ${listingCount} home${listingCount === 1 ? "" : "s"}`
                : "Show results"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#E5E5EA] mx-5" />;
}

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
        selected
          ? "bg-[#007AFF] text-white shadow-sm"
          : "bg-white text-[#1C1C1E] border border-[#E5E5EA]"
      }`}
    >
      {label}
    </button>
  );
}
