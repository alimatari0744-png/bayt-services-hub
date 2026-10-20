import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/site/Logo";
import { useSiteContent } from "@/lib/site-content";
import { loginIdentity } from "@/lib/phone-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مركز الخدمات الشاملة" },
      { name: "description", content: "دخول إدارة مركز الخدمات الشاملة." },
      { property: "og:title", content: "تسجيل الدخول | مركز الخدمات الشاملة" },
      { property: "og:description", content: "دخول إدارة مركز الخدمات الشاملة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const content = useSiteContent();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = loginIdentity(String(fd.get("identity")));
    const password = String(fd.get("password"));
    if (!email) { toast.error(content["login.invalid"]); return; }
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error(content["login.wrong"]); return; }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success(content["login.created"]);
      setMode("in");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{mode === "in" ? content["login.title_in"] : content["login.title_up"]}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input name="identity" placeholder={content["login.identity_placeholder"]} required autoComplete="username" dir="ltr" />
          <Input name="password" type="password" placeholder={content["login.password_placeholder"]} minLength={6} required dir="ltr" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : mode === "in" ? content["login.submit_in"] : content["login.submit_up"]}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-primary hover:underline">
          {mode === "in" ? content["login.switch_up"] : content["login.switch_in"]}
        </button>
      </div>
    </div>
  );
}
