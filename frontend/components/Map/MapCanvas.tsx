"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import { fetchListings } from "@/lib/api";
import { formatPrice, Listing } from "@/types/listing";

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

  const { setSelectedListing, setListingCount, activeFilters } = useMapStore();

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
        const listings = await fetchListings({
          priceMin: activeFilters.priceMin,
          priceMax: activeFilters.priceMax,
          neighborhoods: activeFilters.neighborhoods,
          propertyTypes: activeFilters.propertyTypes,
        });

        setListingCount(listings.length);

        listings.forEach((listing) => {
          const el = document.createElement("div");
          el.className = "price-pin";
          el.textContent = formatPrice(listing.price);

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
  }, [mapLoaded, activeFilters]);

  return (
    <div className="absolute inset-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
