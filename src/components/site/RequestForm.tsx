import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(20),
  message: z.string().trim().max(1000),
});

export function RequestForm({ serviceId, onSent }: { serviceId?: string; onSent?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = requestSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success || (!serviceId && !parsed.data.message)) { toast.error("يرجى إدخال الاسم ورقم الجوال وتفاصيل الطلب"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("requests").insert({ ...parsed.data, service_id: serviceId ?? null });
      if (error) throw error;
      setSent(true);
      form.reset();
      toast.success("تم استلام طلبك، سنتواصل معك قريباً");
      onSent?.();
    } catch { toast.error("تعذّر إرسال الطلب، حاول مجدداً"); }
    finally { setLoading(false); }
  }
  if (sent) return <div role="status" className="space-y-4 py-6"><p className="font-semibold text-primary">تم استلام طلبك، سنتواصل معك قريباً</p><Button variant="outline" onClick={() => setSent(false)}>طلب جديد</Button></div>;
  return <form onSubmit={submit} className="space-y-5">
    <div><label htmlFor="request-name" className="mb-2 block text-sm font-medium">الاسم</label><Input id="request-name" name="name" maxLength={100} required autoComplete="name" /></div>
    <div><label htmlFor="request-phone" className="mb-2 block text-sm font-medium">رقم الجوال</label><Input id="request-phone" name="phone" type="tel" minLength={5} maxLength={20} required autoComplete="tel" dir="ltr" /></div>
    <div><label htmlFor="request-message" className="mb-2 block text-sm font-medium">{serviceId ? "تفاصيل إضافية (اختياري)" : "الخدمة المطلوبة وتفاصيل الطلب"}</label><Textarea id="request-message" name="message" maxLength={1000} required={!serviceId} rows={5} /></div>
    <Button type="submit" className="w-full" disabled={loading}><Send className="h-4 w-4" />{loading ? "جارٍ الإرسال..." : "إرسال الطلب"}</Button>
  </form>;
}