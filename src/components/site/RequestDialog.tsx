import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/lib/services";

export function RequestDialog({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!name || phone.length < 5) { toast.error("يرجى إدخال الاسم ورقم الجوال"); return; }
    setLoading(true);
    const { error } = await supabase.from("requests").insert({ service_id: service.id, name, phone, message });
    setLoading(false);
    if (error) { toast.error("تعذّر إرسال الطلب، حاول مجدداً"); return; }
    toast.success("تم استلام طلبك، سنتواصل معك قريباً");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full">اطلب الخدمة</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-right">طلب: {service.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input name="name" placeholder="الاسم" maxLength={100} required />
          <Input name="phone" placeholder="رقم الجوال" inputMode="tel" maxLength={20} required />
          <Textarea name="message" placeholder="تفاصيل إضافية (اختياري)" maxLength={1000} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "جارٍ الإرسال..." : "إرسال الطلب"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
