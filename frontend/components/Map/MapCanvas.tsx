"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import { fetchListings } from "@/lib/api";
import { formatPrice, Listing } from "@/types/listing";

const FLOOD_SOURCE_ID = "flood-zones";
const FLOOD_FILL_ID = "flood-fill";
const FLOOD_LINE_ID = "flood-line";

const RISK_FILL_COLOR: Record<string, string> = {
  high: "#FF3B30",
  medium: "#FF9500",
  low: "#34C759",
};

const RISK_OPACITY: Record<string, number> = {
  high: 0.25,
  medium: 0.18,
  low: 0.12,
};

interface MarkerEntry {
  marker: maplibregl.Marker;
  el: HTMLDivElement;
  listing: Listing;
}

const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
  "https://tiles.openfreemap.org/styles/liberty";

const DEFAULT_CENTER: [number, number] = [80.2707, 13.0827];
const DEFAULT_ZOOM = 10.5;

export default function MapCanvas() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { setSelectedListing, setListingCount, activeFilters, activeLayers, searchQuery } = useMapStore();
  const floodLoadedRef = useRef(false);

  // ── Initialise map (runs once) ───────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    map.on("load", () => setMapLoaded(true));

    map.on("click", () => {
      markersRef.current.forEach((m) => m.el.classList.remove("active"));
      setSelectedListing(null);
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reload markers whenever map is ready OR filters change ──────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    async function loadMarkers() {
      // Clear existing markers
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      setSelectedListing(null);

      try {
        const allListings = await fetchListings({
          priceMin: activeFilters.priceMin,
          priceMax: activeFilters.priceMax,
          neighborhoods: activeFilters.neighborhoods,
          propertyTypes: activeFilters.propertyTypes,
        });

        // Client-side search filter (neighbourhood, title, city)
        const q = searchQuery.toLowerCase().trim();
        const listings = q
          ? allListings.filter(
              (l) =>
                l.neighborhood?.toLowerCase().includes(q) ||
                l.title?.toLowerCase().includes(q) ||
                l.city?.toLowerCase().includes(q)
            )
          : allListings;

        setListingCount(listings.length);

        listings.forEach((listing) => {
          const el = document.createElement("div");

          if (listing.beds != null) {
            el.className = "price-pin price-pin--enhanced";
            el.innerHTML = `<span class="pin-beds">${listing.beds}\u{1F6CF}</span><span class="pin-price">${formatPrice(listing.price)}</span>`;
          } else {
            el.className = "price-pin";
            el.textContent = formatPrice(listing.price);
          }

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            markersRef.current.forEach((m) => m.el.classList.remove("active"));
            el.classList.add("active");
            setSelectedListing(listing);
          });

          const marker = new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat([listing.lng, listing.lat])
            .addTo(map);

          markersRef.current.push({ marker, el, listing });
        });
      } catch (err) {
        console.error("Failed to load listings:", err);
      }
    }

    loadMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, activeFilters, searchQuery]);

  // ── Flood layer visibility ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const isActive = activeLayers.includes("flood");

    async function ensureFloodLayer() {
      if (!floodLoadedRef.current) {
        // Lazy-fetch the GeoJSON from backend
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API}/api/layers/flood`);
        const geojson = await res.json();

        map.addSource(FLOOD_SOURCE_ID, { type: "geojson", data: geojson });

        // Semi-transparent fill coloured by risk level
        map.addLayer({
          id: FLOOD_FILL_ID,
          type: "fill",
          source: FLOOD_SOURCE_ID,
          layout: { visibility: "visible" },
          paint: {
            "fill-color": [
              "match",
              ["get", "risk_level"],
              "high", RISK_FILL_COLOR.high,
              "medium", RISK_FILL_COLOR.medium,
              RISK_FILL_COLOR.low,
            ],
            "fill-opacity": [
              "match",
              ["get", "risk_level"],
              "high", RISK_OPACITY.high,
              "medium", RISK_OPACITY.medium,
              RISK_OPACITY.low,
            ],
          },
        });

        // Outline stroke
        map.addLayer({
          id: FLOOD_LINE_ID,
          type: "line",
          source: FLOOD_SOURCE_ID,
          layout: { visibility: "visible" },
          paint: {
            "line-color": [
              "match",
              ["get", "risk_level"],
              "high", RISK_FILL_COLOR.high,
              "medium", RISK_FILL_COLOR.medium,
              RISK_FILL_COLOR.low,
            ],
            "line-width": 1.5,
            "line-opacity": 0.7,
          },
        });

        floodLoadedRef.current = true;
      } else {
        const visibility = isActive ? "visible" : "none";
        map.setLayoutProperty(FLOOD_FILL_ID, "visibility", visibility);
        map.setLayoutProperty(FLOOD_LINE_ID, "visibility", visibility);
      }
    }

    if (isActive) {
      ensureFloodLayer().catch(console.error);
    } else if (floodLoadedRef.current) {
      map.setLayoutProperty(FLOOD_FILL_ID, "visibility", "none");
      map.setLayoutProperty(FLOOD_LINE_ID, "visibility", "none");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, activeLayers]);

  return (
    <div className="absolute inset-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
