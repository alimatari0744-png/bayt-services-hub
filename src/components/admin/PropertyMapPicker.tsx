import { useEffect, useRef, useState } from "react";
import type { Coordinates } from "@/lib/property-coordinates";

export function PropertyMapPicker({ selected, onSelect }: { selected: Coordinates | null; onSelect: (point: Coordinates) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const select = useRef(onSelect);
  select.current = onSelect;
  const update = useRef<((point: Coordinates) => void) | null>(null);
  const initial = useRef(selected);
  const [error, setError] = useState("");
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import("leaflet").then((L) => {
      if (disposed || !element.current) return;
      const point = initial.current;
      const map = L.map(element.current).setView(point ? [point.latitude, point.longitude] : [24.7136, 46.6753], point ? 16 : 10);
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>' }).addTo(map);
      let marker: ReturnType<typeof L.circleMarker> | undefined;
      const mark = (p: Coordinates) => {
        if (marker) marker.setLatLng([p.latitude, p.longitude]);
        else marker = L.circleMarker([p.latitude, p.longitude], { radius: 10, className: "property-map-point" }).addTo(map);
      };
      if (point) mark(point);
      update.current = (p) => { mark(p); map.setView([p.latitude, p.longitude], Math.max(map.getZoom(), 16)); };
      map.on("click", (event) => { const p = { latitude: event.latlng.lat, longitude: event.latlng.lng }; mark(p); select.current(p); });
      tiles.on("tileerror", () => { if (!disposed) setError("تعذّر تحميل بعض أجزاء الخريطة؛ تحقق من اتصال الإنترنت."); });
      const timer = window.setTimeout(() => map.invalidateSize(), 250);
      cleanup = () => { window.clearTimeout(timer); update.current = null; map.remove(); };
    }).catch(() => { if (!disposed) setError("تعذّر تحميل الخريطة. حاول مرة أخرى."); });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  useEffect(() => { if (selected) update.current?.(selected); }, [selected]);
  return <div className="space-y-2"><div ref={element} role="region" aria-label="خريطة موقع العقار" className="relative z-0 h-80 w-full overflow-hidden rounded-lg border border-border bg-secondary" />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}