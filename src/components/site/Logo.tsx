import { useImageUrl } from "@/lib/services";
import { useSiteContent } from "@/lib/site-content";

export function Logo({ light = false }: { light?: boolean }) {
  const content = useSiteContent();
  const mark = useImageUrl(content["site.logo_image"] || null);

  return (
    <span className="flex items-center gap-2.5">
      {mark ? (
        <img src={mark} alt={content["site.name"]} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-soft">
          <span className="absolute inset-1.5 rounded-lg border-2 border-gold/80 rotate-45" />
          <span className="relative font-display text-lg font-bold text-primary-foreground">{content["site.logo_letter"]}</span>
        </span>
      )}
      <span className="leading-tight">
        <span className={`block font-display text-base font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>{content["site.name"]}</span>
        <span className={`block text-[11px] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{content["site.tagline"]}</span>
      </span>
    </span>
  );
}
