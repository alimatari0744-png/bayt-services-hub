import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { coordinateMapUrl, coordinatesFromMapUrl, parseCoordinates } from "@/lib/property-coordinates";

export function PropertyLocationField({ value, onChange }: { value: string | null | undefined; onChange: (value: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const coordinates = coordinatesFromMapUrl(value);
  function show() {
    setLatitude(coordinates ? String(coordinates.latitude) : "");
    setLongitude(coordinates ? String(coordinates.longitude) : "");
    setError("");
    setOpen(true);
  }
  function apply() {
    if (!latitude.trim() && !longitude.trim()) { onChange(null); setOpen(false); return; }
    const result = parseCoordinates(latitude, longitude);
    if (!result) { setError("أدخل خط عرض بين ‎-90 و90 وخط طول بين ‎-180 و180."); return; }
    onChange(coordinateMapUrl(result));
    setOpen(false);
  }
  return <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="flex-1 text-sm">الموقع الجغرافي للعقار</span>
      <Button type="button" size="icon" variant="outline" onClick={show} aria-label="تحديد الموقع الجغرافي" title="تحديد الموقع الجغرافي"><MapPin className="h-4 w-4" /></Button>
      {value && <Button type="button" size="icon" variant="ghost" onClick={() => onChange(null)} aria-label="إزالة الموقع الجغرافي" title="إزالة الموقع الجغرافي"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
    </div>
    {coordinates && <p dir="ltr" className="text-right text-sm text-muted-foreground">{coordinates.latitude}, {coordinates.longitude}</p>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir="rtl" className="max-w-sm text-right">
        <DialogHeader><DialogTitle className="text-right">إحداثيات العقار</DialogTitle><DialogDescription className="text-right">Google Maps</DialogDescription></DialogHeader>
        <div className="space-y-2"><label htmlFor="property-latitude" className="text-sm">خط العرض</label><Input id="property-latitude" dir="ltr" inputMode="decimal" value={latitude} onChange={(event) => setLatitude(event.target.value)} /></div>
        <div className="space-y-2"><label htmlFor="property-longitude" className="text-sm">خط الطول</label><Input id="property-longitude" dir="ltr" inputMode="decimal" value={longitude} onChange={(event) => setLongitude(event.target.value)} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="button" onClick={apply}>اعتماد الموقع</Button>
      </DialogContent>
    </Dialog>
  </div>;
}