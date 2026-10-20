import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CLASSIFICATION_GROUPS, classificationsQuery } from "@/lib/property-classifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PropertyClassifications() {
  const { data: options = [], isPending, error } = useQuery(classificationsQuery);
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(kind: string, id?: string) {
    const text = (id ? label : drafts[kind] ?? "").trim();
    if (!text) { toast.error("أدخل اسم التصنيف"); return; }
    setBusy(true);
    const { error } = id ? await supabase.from("property_classifications").update({ label: text }).eq("id", id) : await supabase.from("property_classifications").insert({ kind, label: text });
    setBusy(false);
    if (error) { toast.error(error.code === "23505" ? "هذا التصنيف موجود بالفعل" : "تعذّر حفظ التصنيف"); return; }
    setEditing(null); setDrafts((current) => ({ ...current, [kind]: "" }));
    await queryClient.invalidateQueries({ queryKey: classificationsQuery.queryKey });
    toast.success("تم حفظ التصنيف");
  }
  async function remove(id: string) {
    if (!confirm("حذف هذا التصنيف؟")) return;
    setBusy(true);
    const { error } = await supabase.from("property_classifications").delete().eq("id", id);
    setBusy(false);
    if (error) { toast.error(error.code === "23503" ? "التصنيف مرتبط بعقارات؛ غيّر تصنيفها أولًا قبل حذفه" : "تعذّر حذف التصنيف"); return; }
    await queryClient.invalidateQueries({ queryKey: classificationsQuery.queryKey });
    toast.success("تم حذف التصنيف");
  }
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold">التصنيفات</h2>
    {isPending && <p className="text-muted-foreground">جارٍ التحميل...</p>}
    {error && <p className="text-destructive">تعذّر تحميل التصنيفات</p>}
    <div className="grid gap-6 xl:grid-cols-3">
      {CLASSIFICATION_GROUPS.map(({kind,label: groupLabel}) => <section key={kind} className="min-w-0 space-y-3" aria-label={`تصنيفات ${groupLabel}`}>
        <h3 className="border-b border-border pb-3 text-lg font-semibold">{groupLabel}</h3>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void save(kind); }}>
          <Input aria-label={`تصنيف جديد: ${groupLabel}`} maxLength={100} value={drafts[kind] ?? ""} onChange={(event) => setDrafts((current) => ({...current, [kind]: event.target.value}))} />
          <Button type="submit" size="icon" disabled={busy || isPending || !!error} aria-label={`إضافة تصنيف ${groupLabel}`} title="إضافة تصنيف"><Plus /></Button>
        </form>
        {options.filter((option) => option.kind === kind).map((option) => <div key={option.id} className="flex min-h-12 items-center gap-2 border-b border-border py-2">
          {editing === option.id ? <>
            <Input aria-label="اسم التصنيف" value={label} maxLength={100} onChange={(event) => setLabel(event.target.value)} />
            <Button size="icon" variant="ghost" disabled={busy} aria-label="حفظ التصنيف" onClick={() => save(kind, option.id)}><Save /></Button>
            <Button size="icon" variant="ghost" aria-label="إلغاء تعديل التصنيف" onClick={() => setEditing(null)}><X /></Button>
          </> : <>
            <span className="min-w-0 flex-1 break-words">{option.label}</span>
            <Button size="icon" variant="ghost" disabled={busy} aria-label={`تعديل ${option.label}`} onClick={() => {setEditing(option.id);setLabel(option.label);}}><Pencil /></Button>
            <Button size="icon" variant="ghost" disabled={busy} aria-label={`حذف ${option.label}`} onClick={() => remove(option.id)}><Trash2 className="text-destructive" /></Button>
          </>}
        </div>)}
      </section>)}
    </div>
  </div>;
}