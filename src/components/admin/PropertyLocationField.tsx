import { useState } from "react";
import { LocateFixed, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { coordinateMapUrl, coordinatesFromMapUrl, type Coordinates } from "@/lib/property-coordinates";
import { PropertyMapPicker } from "./PropertyMapPicker";

export function PropertyLocationField({ value, onChange }: { value: string | null | undefined; onChange: (value: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const coordinates = coordinatesFromMapUrl(value);
  function show() {
    setSelected(coordinates);
    setError("");
    setOpen(true);
  }
  function apply() {
    if (!selected) { setError("اختر موقع العقار على الخريطة أولًا."); return; }
    onChange(coordinateMapUrl(selected));
    setOpen(false);
  }
  function locate() {
    if (!navigator.geolocation) { setError("تحديد موقع الجهاز غير متاح؛ اختر الموقع على الخريطة."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition((position) => {
      setSelected({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocating(false);
    }, (failure) => { setLocating(false); setError(failure.code === 1 ? "لم تسمح بالوصول لموقع الجهاز؛ اختر الموقع على الخريطة." : "تعذّر تحديد موقع الجهاز؛ اختر الموقع على الخريطة."); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  }
  return <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="flex-1 text-sm">الموقع الجغرافي للعقار</span>
      <Button type="button" size="icon" variant="outline" onClick={show} aria-label="تحديد الموقع الجغرافي" title="تحديد الموقع الجغرافي"><MapPin className="h-4 w-4" /></Button>
      {value && <Button type="button" size="icon" variant="ghost" onClick={() => onChange(null)} aria-label="إزالة الموقع الجغرافي" title="إزالة الموقع الجغرافي"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
    </div>
    {value && <p className="text-sm text-primary">تم تحديد موقع العقار</p>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir="rtl" className="max-h-[90vh] max-w-xl overflow-y-auto text-right">
        <DialogHeader><DialogTitle className="text-right">موقع العقار</DialogTitle><DialogDescription className="text-right">الموقع الجغرافي</DialogDescription></DialogHeader>
        <Button type="button" variant="outline" onClick={locate} disabled={locating}><LocateFixed className="h-4 w-4" />{locating ? "جارٍ تحديد الموقع…" : "استخدام موقع الجهاز"}</Button>
        <PropertyMapPicker selected={selected} onSelect={(point) => { setSelected(point); setError(""); }} />
        {selected && <p className="text-sm text-primary">تم اختيار الموقع</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="button" onClick={apply}>اعتماد الموقع</Button>
      </DialogContent>
    </Dialog>
  </div>;
}