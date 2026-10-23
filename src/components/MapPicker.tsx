"use client";
import { useEffect, useState, useRef } from "react";
import { MapPin } from "lucide-react";

interface Props {
  onLocationSelect: (loc: { lat: number; lng: number; address: string }) => void;
  initialLat?: number;
  initialLng?: number;
  readonly?: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { L: any; }
}

export default function MapPicker({ onLocationSelect, initialLat = 13.0827, initialLng = 80.2707, readonly = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [detecting, setDetecting] = useState(false);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Load Leaflet dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current!, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:linear-gradient(135deg,#0891b2,#0e7490);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(8,145,178,0.6)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: "",
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: !readonly,
        icon,
      }).addTo(map);
      markerRef.current = marker;
      leafletMapRef.current = map;

      if (!readonly) {
        marker.on("dragend", async () => {
          const { lat, lng } = marker.getLatLng();
          const address = await reverseGeocode(lat, lng);
          onLocationSelect({ lat, lng, address });
        });

        map.on("click", async (e: { latlng: { lat: number; lng: number } }) => {
          marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address });
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectLocation = () => {
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        if (markerRef.current && leafletMapRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          leafletMapRef.current.setView([lat, lng], 16);
        }
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({ lat, lng, address });
        setDetecting(false);
      },
      () => {
        alert("Could not detect location. Please click on the map.");
        setDetecting(false);
      }
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!readonly && (
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="absolute top-3 right-3 z-[999] btn-primary text-xs py-2 px-3 shadow-glow"
        >
          <MapPin className="w-3.5 h-3.5" />
          {detecting ? "Detecting..." : "Use My Location"}
        </button>
      )}
    </div>
  );
}
