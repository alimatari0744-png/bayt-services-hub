import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_TABS = [
  { tab: "overview", label: "نظرة عامة" },
  { tab: "services", label: "الخدمات" },
  { tab: "requests", label: "الطلبات" },
  { tab: "settings", label: "إعدادات الموقع" },
] as const;

const linkCls =
  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground";

export function SiteHeader() {
  const content = useSiteContent();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const currentTab = (location.search as { tab?: string }).tab ?? "overview";
  const links = [
    { to: "/", label: content["nav.home"] },
    { to: "/general", label: content["section.general.label"] },
    { to: "/real-estate", label: content["section.real_estate.label"] },
    { to: "/students", label: content["section.student.label"] },
    { to: "/contact", label: content["nav.contact"] },
  ] as const;

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const renderLinks = (mobile: boolean) =>
    isAdmin ? (
      <>
        {ADMIN_TABS.map((t) => (
          <Link
            key={t.tab}
            to="/admin"
            search={{ tab: t.tab }}
            onClick={() => setOpen(false)}
            data-status={currentTab === t.tab ? "active" : undefined}
            className={mobile ? "rounded-lg px-3 py-2 hover:bg-secondary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground" : linkCls}
          >
            {t.label}
          </Link>
        ))}
        <Link to="/" onClick={() => setOpen(false)} className={mobile ? "rounded-lg px-3 py-2 text-primary hover:bg-secondary" : linkCls}>
          العودة للموقع
        </Link>
        <button
          type="button"
          onClick={() => { setOpen(false); supabase.auth.signOut(); }}
          className={mobile ? "rounded-lg px-3 py-2 text-start text-destructive hover:bg-secondary" : linkCls}
        >
          خروج
        </button>
      </>
    ) : (
      links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: l.to === "/" }}
          className={mobile ? "rounded-lg px-3 py-2 hover:bg-secondary" : linkCls}
        >
          {l.label}
        </Link>
      ))
    );

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label={content["site.name"]} onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">{renderLinks(false)}</nav>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="القائمة" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden">{renderLinks(true)}</nav>}
    </header>
  );
}
