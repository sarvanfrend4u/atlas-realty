"use client";

import { useState } from "react";
import { X, RotateCcw, Check, Building2, Home } from "lucide-react";
import { useMapStore, ActiveFilters, countActiveFilters } from "@/store/mapStore";
import { BUDGET_PRESETS, LOCATIONS, PROPERTY_TYPES } from "@/constants/filters";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getNeighborhoodStyle } from "@/constants/neighborhoods";

// Suppress unused import warning — ActiveFilters is used as a type annotation
type _AF = ActiveFilters;

export default function FilterSheet() {
  const {
    isFilterSheetOpen,
    setFilterSheetOpen,
    activeFilters,
    setActiveFilters,
    resetFilters,
    listingCount,
  } = useMapStore();

  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const [isDragging, setIsDragging] = useState(false);

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
  const budgetActive = !!activeFilters.budgetKey;
  const locationActive = activeFilters.neighborhoods.length > 0;
  const typeActive = activeFilters.propertyTypes.length > 0;

  const propertyTypeIcons: Record<string, React.ReactNode> = {
    apartment: <Building2 className="w-3.5 h-3.5 flex-shrink-0" />,
    villa:     <Home className="w-3.5 h-3.5 flex-shrink-0" />,
  };

  const ctaLabel = listingCount > 0
    ? `Show ${listingCount.toLocaleString()} home${listingCount === 1 ? "" : "s"}`
    : "Show results";

  const filterContent = (
    <>
      {/* Budget */}
      <Section label="Budget" active={budgetActive}>
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

      {/* Location */}
      <Section label="Location" active={locationActive}>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((name) => (
            <NeighborhoodChip
              key={name}
              name={name}
              selected={activeFilters.neighborhoods.includes(name)}
              onToggle={() => toggleNeighborhood(name)}
            />
          ))}
        </div>
      </Section>
      <Divider />

      {/* Property Type */}
      <Section label="Property Type" active={typeActive}>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Chip
              key={type.key}
              label={type.label}
              icon={propertyTypeIcons[type.key]}
              selected={activeFilters.propertyTypes.includes(type.key)}
              onToggle={() => togglePropertyType(type.key)}
            />
          ))}
        </div>
      </Section>
    </>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 animate-fade-in"
        onClick={() => setFilterSheetOpen(false)}
      />

      {isDesktop ? (
        /* ── Desktop: left sidebar ─────────────────────────────────────── */
        <div className="fixed top-16 left-0 bottom-0 w-[320px] z-40 animate-slide-right flex flex-col bg-[#F2F2F7] border-r border-[#E5E5EA]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-[#E5E5EA]">
            <button
              onClick={() => { resetFilters(); }}
              className={`text-[15px] font-medium transition-colors flex items-center gap-1 ${
                activeCount > 0 ? "text-[#007AFF]" : "text-[#AEAEB2]"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <p className="text-[17px] font-semibold text-[#1C1C1E]">Filters</p>
            <button
              onClick={() => setFilterSheetOpen(false)}
              className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors"
            >
              <X className="w-4 h-4 text-[#3A3A3C]" strokeWidth={2.5} />
            </button>
          </div>
          {/* Content */}
          <div className="overflow-y-auto flex-1 panel-scroll pb-2">{filterContent}</div>
          {/* CTA */}
          <div className="px-5 py-4 flex-shrink-0 border-t border-[#E5E5EA]">
            <button
              onClick={() => setFilterSheetOpen(false)}
              className="w-full bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white font-semibold text-[15px] py-3.5 rounded-2xl"
            >
              <span key={listingCount} className="animate-count-change inline-block">
                {ctaLabel}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Mobile: bottom sheet ──────────────────────────────────────── */
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up max-w-2xl mx-auto">
          <div className="bg-[#F2F2F7] rounded-t-3xl shadow-2xl sheet-shadow max-h-[85vh] flex flex-col">

            {/* Animated drag handle */}
            <div
              className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={() => setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              onPointerLeave={() => setIsDragging(false)}
            >
              <div
                className={`rounded-full bg-[#C7C7CC] transition-all duration-300 ${
                  isDragging
                    ? "w-12 h-1.5 opacity-70"
                    : "w-9 h-1 animate-drag-pulse"
                }`}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <button
                onClick={() => { resetFilters(); }}
                className={`text-[15px] font-medium transition-colors flex items-center gap-1 ${
                  activeCount > 0 ? "text-[#007AFF]" : "text-[#AEAEB2]"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <p className="text-[17px] font-semibold text-[#1C1C1E]">Filters</p>
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors"
              >
                <X className="w-4 h-4 text-[#3A3A3C]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 pb-2">{filterContent}</div>

            {/* CTA */}
            <div className="px-5 py-4 flex-shrink-0 border-t border-[#E5E5EA]">
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="w-full bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#0066CC] transition-colors text-white font-semibold text-[15px] py-3.5 rounded-2xl"
              >
                <span key={listingCount} className="animate-count-change inline-block">
                  {ctaLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <p
        className={`text-[11px] font-semibold uppercase tracking-wider mb-3 transition-colors ${
          active ? "text-[#007AFF]" : "text-[#8E8E93]"
        }`}
      >
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
  icon,
  selected,
  onToggle,
}: {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
        selected
          ? "bg-[#007AFF] text-white shadow-sm"
          : "bg-white text-[#1C1C1E] border border-[#E5E5EA]"
      }`}
    >
      {icon && (
        <span className={selected ? "text-white" : "text-[#8E8E93]"}>{icon}</span>
      )}
      {label}
      {selected && (
        <Check className="w-3 h-3 ml-0.5 flex-shrink-0 text-white" strokeWidth={2.5} />
      )}
    </button>
  );
}

function NeighborhoodChip({
  name,
  selected,
  onToggle,
}: {
  name: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const style = getNeighborhoodStyle(name);
  return (
    <button
      onClick={onToggle}
      style={
        selected
          ? {
              backgroundColor: style.bg,
              color: style.text,
              borderColor: style.text + "4D",
            }
          : undefined
      }
      className={`flex items-center gap-1 px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
        selected
          ? "shadow-sm border"
          : "bg-white text-[#1C1C1E] border border-[#E5E5EA]"
      }`}
    >
      {name}
      {selected && (
        <Check
          className="w-3 h-3 ml-0.5 flex-shrink-0"
          strokeWidth={2.5}
          style={{ color: style.text }}
        />
      )}
    </button>
  );
}
