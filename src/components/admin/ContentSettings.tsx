import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
import { saveSiteContent } from "@/lib/site-content.functions";
import { CONTENT_GROUPS, SITE_CONTENT_DEFAULTS, useSiteContent } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "./ImageField";

export function ContentSettings() {
  const content = useSiteContent();
  const [group, setGroup] = useState<string>(CONTENT_GROUPS[0]?.id ?? "");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const save = useServerFn(saveSiteContent);
  const queryClient = useQueryClient();

  const active = CONTENT_GROUPS.find((g) => g.id === group) ?? CONTENT_GROUPS[0];
  if (!active) return null;
  const value = (key: string) => draft[key] ?? content[key as keyof typeof content] ?? "";
  const dirty = Object.keys(draft).length > 0;

  function set(key: string, next: string) {
    setDraft((previous) => ({ ...previous, [key]: next }));
  }

  async function submit() {
    setSaving(true);
    try {
      await save({ data: draft });
      setDraft({});
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("تم حفظ التعديلات");
    } catch {
      toast.error("تعذّر حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {CONTENT_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${group === g.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{active.description}</p>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-6">
        {active.fields.map((field) => (
          <div key={field.key}>
            {field.type === "image" ? (
              <ImageField label={field.label} hint={field.hint} value={value(field.key)} onChange={(next) => set(field.key, next)} />
            ) : (
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <label htmlFor={field.key} className="mb-2 block text-sm font-medium">
                    {field.label}
                    {field.hint && <span className="mr-2 text-xs font-normal text-muted-foreground">— {field.hint}</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <Textarea id={field.key} rows={3} value={value(field.key)} onChange={(e) => set(field.key, e.target.value)} />
                  ) : (
                    <Input id={field.key} value={value(field.key)} onChange={(e) => set(field.key, e.target.value)} />
                  )}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  title="استرجاع النص الأصلي"
                  onClick={() => set(field.key, SITE_CONTENT_DEFAULTS[field.key])}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lift backdrop-blur">
        <p className="text-sm text-muted-foreground">{dirty ? `${Object.keys(draft).length} تعديل غير محفوظ` : "لا تعديلات غير محفوظة"}</p>
        <div className="flex gap-2">
          {dirty && <Button variant="ghost" onClick={() => setDraft({})}>تجاهل</Button>}
          <Button onClick={submit} disabled={!dirty || saving}>
            <Save className="h-4 w-4" />
            {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </div>
    </div>
  );
}
