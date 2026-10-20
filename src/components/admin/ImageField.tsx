import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageUrl } from "@/lib/services";

export function ImageField({ label, hint, value, onChange }: { label: string; hint?: string | undefined; value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const shown = useImageUrl(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    const path = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("service-images").upload(path, file);
    setUploading(false);
    if (error) {
      toast.error("تعذّر رفع الصورة");
      return;
    }
    onChange(path);
    toast.success("تم رفع الصورة");
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "جارٍ الرفع..." : "رفع صورة"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      <div className="mt-3 flex items-center gap-3">
        <span className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-background">
          {shown ? <img src={shown} alt={label} className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">لا صورة</span>}
        </span>
        <Input dir="ltr" placeholder="https://... أو مسار الصورة" value={value} onChange={(e) => onChange(e.target.value)} className="text-xs" />
      </div>
    </div>
  );
}
