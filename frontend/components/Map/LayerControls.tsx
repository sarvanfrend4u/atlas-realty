"use client";

import { useState } from "react";
import { Waves, Layers } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

interface LayerDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}

const LAYERS: LayerDef[] = [
  {
    id: "flood",
    label: "Flood Risk",
    icon: <Waves className="w-3.5 h-3.5" />,
    activeColor: "#FF3B30",
    activeBg: "rgba(255,59,48,0.10)",
    activeBorder: "rgba(255,59,48,0.30)",
  },
];

export default function LayerControls() {
  const { activeLayers, toggleLayer } = useMapStore();
  const [expanded, setExpanded] = useState(false);

  const hasActive = LAYERS.some((l) => activeLayers.includes(l.id));

  return (
    <div className="flex flex-col items-start gap-1.5">
      {/* Desktop: collapsible trigger (Layers icon) — always show on mobile */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`lg:flex hidden items-center justify-center w-10 h-10 rounded-2xl shadow-sm border transition-all select-none ${
          hasActive
            ? "bg-[#007AFF] border-[#007AFF] text-white"
            : "glass border-white/50 text-[#1C1C1E]"
        }`}
        aria-label="Toggle layer controls"
      >
        <Layers className="w-4 h-4" strokeWidth={2} />
      </button>

      {/* Layer chips — always visible on mobile, collapsible on desktop */}
      <div className={`flex flex-col gap-1.5 ${expanded ? "lg:flex" : "lg:hidden"} flex flex-col gap-1.5`}>
        {LAYERS.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              style={
                isActive
                  ? {
                      backgroundColor: layer.activeBg,
                      borderColor: layer.activeBorder,
                      color: layer.activeColor,
                    }
                  : undefined
              }
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[13px] font-semibold shadow-sm border transition-all duration-200 select-none ${
                isActive
                  ? ""
                  : "glass border-white/50 text-[#1C1C1E]"
              }`}
              aria-pressed={isActive}
              aria-label={`${layer.label} overlay ${isActive ? "on" : "off"}`}
            >
              {layer.icon}
              <span>{layer.label}</span>
              {isActive && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: layer.activeColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
