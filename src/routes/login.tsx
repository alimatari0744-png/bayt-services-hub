import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مركز الخدمات الشاملة" },
      { name: "description", content: "دخول إدارة مركز الخدمات الشاملة." },
      { property: "og:title", content: "تسجيل الدخول | مركز الخدمات الشاملة" },
      { property: "og:description", content: "دخول إدارة مركز الخدمات الشاملة." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error("بيانات الدخول غير صحيحة");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("تم إنشاء الحساب، تحقق من بريدك لتأكيده");
      setMode("in");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{mode === "in" ? "دخول الإدارة" : "إنشاء حساب"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input name="email" type="email" placeholder="البريد الإلكتروني" required dir="ltr" />
          <Input name="password" type="password" placeholder="كلمة المرور" minLength={6} required dir="ltr" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : mode === "in" ? "دخول" : "إنشاء الحساب"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-primary hover:underline">
          {mode === "in" ? "ليس لديك حساب؟ أنشئ حساباً" : "لديك حساب؟ سجّل الدخول"}
        </button>
      </div>
    </div>
  );
}
