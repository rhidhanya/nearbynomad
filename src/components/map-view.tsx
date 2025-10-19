"use client";

import { useEffect, useRef } from "react";

type GeoPosition = { latitude: number; longitude: number };

type MapPlace = {
  name: string;
  id?: number;
  latitude: number;
  longitude: number;
};

type MapViewProps = {
  userPosition: GeoPosition | null;
  places: MapPlace[];
  height?: number;
  onMarkerClick?: (place: MapPlace) => void;
};

// Lightweight Leaflet loader via CDN tags to avoid adding npm deps
function ensureLeafletLoaded() {
  const leafletCssId = "leaflet-css-cdn";
  const leafletJsId = "leaflet-js-cdn";
  if (!document.getElementById(leafletCssId)) {
    const link = document.createElement("link");
    link.id = leafletCssId;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  return new Promise<void>((resolve) => {
    if ((window as any).L && (window as any).L.map) {
      resolve();
      return;
    }
    if (!document.getElementById(leafletJsId)) {
      const script = document.createElement("script");
      script.id = leafletJsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    } else {
      const el = document.getElementById(leafletJsId) as HTMLScriptElement;
      if (el && (window as any).L) resolve();
      else el.addEventListener("load", () => resolve(), { once: true });
    }
  });
}

export default function MapView({ userPosition, places, height = 320, onMarkerClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    ensureLeafletLoaded().then(() => {
      if (cancelled) return;
      const L = (window as any).L;
      if (!mapRef.current) return;

      const center = userPosition ? [userPosition.latitude, userPosition.longitude] : [37.7749, -122.4194];

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current).setView(center, 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapInstance.current);
      } else {
        mapInstance.current.setView(center);
      }

      // Clear existing markers (keep tile layer)
      const toRemove: any[] = [];
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) toRemove.push(layer);
      });
      toRemove.forEach((l) => mapInstance.current.removeLayer(l));

      if (userPosition) {
        L.marker([userPosition.latitude, userPosition.longitude], {
          title: "You are here",
        }).addTo(mapInstance.current);
      }

      places.forEach((p) => {
        const marker = L.marker([p.latitude, p.longitude], { title: p.name }).addTo(mapInstance.current);
        if (onMarkerClick) {
          marker.on("click", () => onMarkerClick(p));
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [userPosition, places]);

  return <div ref={mapRef} style={{ width: "100%", height }} className="rounded-lg border border-gray-300 overflow-hidden" />;
}


