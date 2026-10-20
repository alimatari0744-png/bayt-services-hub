import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Boxes, Inbox, LayoutDashboard, LogOut, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SECTIONS, useImageUrl, type Section, type Service } from "@/lib/services";
import { useSiteContent } from "@/lib/site-content";
import { ContentSettings } from "@/components/admin/ContentSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PROPERTY_CATEGORIES, geographicUrl } from "@/lib/service-filters";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | مركز الخدمات الشاملة" },
      { name: "description", content: "إدارة الخدمات والطلبات ونصوص وصور الموقع." },
      { property: "og:title", content: "لوحة الإدارة | مركز الخدمات الشاملة" },
      { property: "og:description", content: "إدارة الخدمات والطلبات ونصوص وصور الموقع." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { tab?: "overview" | "services" | "requests" | "settings" } => {
    const t = s["tab"];
    return t === "services" || t === "requests" || t === "settings" || t === "overview" ? { tab: t } : {};
  },
  component: Admin,
});

type Req = { id: string; name: string; phone: string; message: string; created_at: string; services: { title: string } | null };

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "services", label: "الخدمات", icon: Boxes },
  { id: "requests", label: "الطلبات", icon: Inbox },
  { id: "settings", label: "إعدادات الموقع", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) return <div className="py-32 text-center text-muted-foreground">جارٍ التحميل...</div>;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-md py-32 text-center">
        <p className="text-lg">ليس لديك صلاحية الإدارة.</p>
        <Button variant="outline" className="mt-4" onClick={() => supabase.auth.signOut()}>تسجيل الخروج</Button>
      </div>
    );
  return <Dashboard />;
}

function Dashboard() {
  const content = useSiteContent();
  const tab: TabId = Route.useSearch().tab ?? "overview";
  const nav = useNavigate();
  const setTab = (t: TabId) => nav({ to: "/admin", search: { tab: t } });
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [section, setSection] = useState<Section>("general");
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  async function load() {
    const [s, r] = await Promise.all([
      supabase.from("services").select("*").order("created_at", { ascending: false }),
      supabase.from("requests").select("id,name,phone,message,created_at,services(title)").order("created_at", { ascending: false }),
    ]);
    setServices(s.data ?? []);
    setRequests((r.data as Req[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("حذف هذه الخدمة؟")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("تعذّر الحذف"); return; }
    toast.success("تم الحذف");
    load();
  }

  async function removeRequest(id: string) {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) { toast.error("تعذّر حذف الطلب"); return; }
    toast.success("تم حذف الطلب");
    load();
  }

  const list = services.filter((s) => s.section === section);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <aside className="lg:w-60 lg:shrink-0">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h1 className="text-lg font-bold">{content["admin.title"]}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{content["site.name"]}</p>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "services" && <span className="mr-auto text-xs opacity-70">{services.length}</span>}
                {t.id === "requests" && <span className="mr-auto text-xs opacity-70">{requests.length}</span>}
              </button>
            ))}
          </nav>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4" /> خروج
          </Button>
        </div>
        <p className="mt-3 text-center text-sm"><Link to="/" className="text-primary hover:underline">العودة للموقع</Link></p>
      </aside>

      <main className="min-w-0 flex-1">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(SECTIONS) as Section[]).map((k) => (
                <div key={k} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">{content[`section.${k}.label` as keyof typeof content]}</p>
                  <p className="mt-1 text-3xl font-bold">{services.filter((s) => s.section === k).length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">خدمة</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">الطلبات الواردة</p>
                <p className="mt-1 text-3xl font-bold">{requests.length}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setTab("requests")}>عرض الطلبات</Button>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">نصوص وصور الموقع</p>
                <p className="mt-1 text-3xl font-bold">كل شيء</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setTab("settings")}>فتح الإعدادات</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              الخدمات المخفية لا تظهر للزوار: {services.filter((s) => !s.is_active).length}
            </div>
          </div>
        )}

        {tab === "services" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {(Object.keys(SECTIONS) as Section[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSection(k)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${section === k ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                  >
                    {content[`section.${k}.label` as keyof typeof content]}
                  </button>
                ))}
              </div>
              <Button onClick={() => setEditing({ section, is_active: true, category: SECTIONS[section].categories[0] ?? "" })}>
                <Plus className="h-4 w-4" /> إضافة خدمة
              </Button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {list.length === 0 && <p className="p-8 text-center text-muted-foreground">لا توجد خدمات بعد</p>}
              {list.map((s) => (
                <ServiceRow key={s.id} service={s} onEdit={() => setEditing(s)} onDelete={() => remove(s.id)} />
              ))}
            </div>
          </div>
        )}

        {tab === "requests" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {requests.length === 0 && <p className="p-8 text-center text-muted-foreground">لا توجد طلبات</p>}
            {requests.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 border-b border-border p-4 last:border-0">
                <div className="min-w-0">
                  <p className="font-semibold">{r.name} · <a href={`tel:${r.phone}`} className="text-primary" dir="ltr">{r.phone}</a></p>
                  <p className="text-sm text-muted-foreground">{r.services?.title ?? "طلب خدمة عام"} — {new Date(r.created_at).toLocaleString("ar-SA")}</p>
                  {r.message && <p className="mt-1 text-sm">{r.message}</p>}
                </div>
                <Button size="icon" variant="ghost" aria-label="حذف الطلب" onClick={() => removeRequest(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && <ContentSettings />}
      </main>

      <ServiceForm value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}

function ServiceRow({ service, onEdit, onDelete }: { service: Service; onEdit: () => void; onDelete: () => void }) {
  const img = useImageUrl(service.image_url);
  return (
    <div className="flex items-center gap-4 border-b border-border p-4 last:border-0">
      <span className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] text-muted-foreground">بدون صورة</span>}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{service.title} {!service.is_active && <span className="text-xs text-destructive">(مخفية)</span>}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[service.category, service.subcategory, service.price].filter(Boolean).join(" · ") || "بدون تفاصيل"}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button size="icon" variant="ghost" aria-label="تعديل الخدمة" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" aria-label="حذف الخدمة" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

function ServiceForm({ value, onClose, onSaved }: { value: Partial<Service> | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Service>>({});
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const current = useImageUrl(form.image_url);
  useEffect(() => {
    setForm(value ?? {});
    setFile(null);
  }, [value]);

  const set = (k: keyof Service, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const sec = (form.section ?? "general") as Section;

  async function save() {
    if (!form.title?.trim()) { toast.error("العنوان مطلوب"); return; }
    if (sec === "real_estate" && !PROPERTY_CATEGORIES.some((c) => c === form.category)) { toast.error("اختر أحد التصنيفات العقارية الأربعة"); return; }
    if (sec === "real_estate" && form.map_url?.trim() && !geographicUrl(form.map_url.trim(), null)) { toast.error("أدخل رابط موقع صحيحاً يبدأ بـ https://"); return; }
    setSaving(true);
    let image_url = form.image_url ?? null;
    if (file) {
      const path = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("service-images").upload(path, file);
      if (error) { setSaving(false); { toast.error("تعذّر رفع الصورة"); return; } }
      image_url = path;
    }
    const payload = {
      section: sec,
      category: sec === "real_estate" ? form.category ?? "" : "",
      subcategory: sec === "real_estate" ? form.subcategory?.trim() ?? "" : "",
      specifications: form.specifications ?? "",
      map_url: sec === "real_estate" ? form.map_url?.trim() || null : null,
      title: form.title.trim(),
      description: form.description ?? "",
      price: form.price ?? null,
      location: form.location ?? null,
      keywords: form.keywords ?? "",
      contact_phone: form.contact_phone ?? null,
      is_active: form.is_active ?? true,
      image_url,
    };
    const { error } = form.id
      ? await supabase.from("services").update(payload).eq("id", form.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) { toast.error("تعذّر الحفظ"); return; }
    toast.success("تم الحفظ");
    onSaved();
  }

  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right">
        <DialogHeader>
          <DialogTitle className="text-right">{form.id ? "تعديل خدمة" : "إضافة خدمة"} — {SECTIONS[sec].label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="عنوان الخدمة" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          {sec === "real_estate" && <div>
            <p className="mb-2 text-sm text-muted-foreground">التصنيف</p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_CATEGORIES.map((c) => (
                <Button key={c} type="button" size="sm" variant={form.category === c ? "default" : "secondary"} onClick={() => { set("category", c); set("subcategory", ""); }}>
                  {c}
                </Button>
              ))}
            </div>
            <label className="mb-2 mt-3 block text-sm" htmlFor="subcategory">التصنيف الفرعي</label>
            <Input id="subcategory" placeholder="التصنيف الفرعي" maxLength={100} value={form.subcategory ?? ""} onChange={(e) => set("subcategory", e.target.value)} />
          </div>}
          <Textarea placeholder="الوصف" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          <label className="block text-sm" htmlFor="specifications">مواصفات الخدمة وتفاصيلها</label>
          <Textarea id="specifications" rows={5} value={form.specifications ?? ""} onChange={(e) => set("specifications", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="السعر" value={form.price ?? ""} onChange={(e) => set("price", e.target.value)} />
            <Input placeholder="الموقع" value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
          </div>
          {sec === "real_estate" && <div><label htmlFor="map-url" className="mb-2 block text-sm">رابط الموقع الجغرافي</label><Input id="map-url" type="url" dir="ltr" placeholder="https://maps.google.com/..." value={form.map_url ?? ""} onChange={(e) => set("map_url", e.target.value)} /></div>}
          <Input placeholder="كلمات مفتاحية للبحث (مفصولة بمسافة)" value={form.keywords ?? ""} onChange={(e) => set("keywords", e.target.value)} />
          <div>
            <p className="mb-2 text-sm text-muted-foreground">صورة الخدمة</p>
            {current && <span className="mb-2 block h-24 w-40 overflow-hidden rounded-lg border border-border"><img src={current} alt="" className="h-full w-full object-cover" /></span>}
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {file && <p className="mt-1 text-xs text-primary">صورة جديدة: {file.name}</p>}
          </div>
          <label className="flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
            ظاهرة للزوار
            <Switch checked={form.is_active ?? true} onCheckedChange={(v) => set("is_active", v)} />
          </label>
          <Button className="w-full" onClick={save} disabled={saving}>{saving ? "جارٍ الحفظ..." : "حفظ"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
