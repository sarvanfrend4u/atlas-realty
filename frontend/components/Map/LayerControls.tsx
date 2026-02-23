"use client";

import { useMapStore } from "@/store/mapStore";

interface LayerDef {
  id: string;
  label: string;
  emoji: string;
  /** Dot colour shown when active */
  activeColor: string;
}

const LAYERS: LayerDef[] = [
  {
    id: "flood",
    label: "Flood Risk",
    emoji: "🌊",
    activeColor: "#FF3B30",
  },
];

export default function LayerControls() {
  const { activeLayers, toggleLayer } = useMapStore();

  return (
    <div className="flex flex-col gap-2">
      {LAYERS.map((layer) => {
        const isActive = activeLayers.includes(layer.id);
        return (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[13px] font-semibold shadow-sm border transition-all select-none ${
              isActive
                ? "bg-white border-white text-[#1C1C1E] shadow-md"
                : "glass border-white/50 text-[#1C1C1E]"
            }`}
          >
            <span>{layer.emoji}</span>
            <span>{layer.label}</span>
            {/* Active indicator dot */}
            {isActive && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: layer.activeColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
