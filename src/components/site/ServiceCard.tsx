import { MapPin, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { geographicUrl, propertyLocation } from "@/lib/service-filters";
import { useImageUrl, type Service } from "@/lib/services";
import { RequestDialog } from "./RequestDialog";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const img = useImageUrl(service.image_url);
  const location = propertyLocation(service.section, service.location);
  const map = service.section === "real_estate" ? geographicUrl(service.map_url, service.location) : null;
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to="/services/$id" params={{ id: service.id }} aria-label={`تفاصيل ${service.title}`} className="relative block aspect-[16/10] overflow-hidden bg-gradient-primary">
        {img ? (
          <img src={img} alt={service.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="pattern-dots grid h-full w-full place-items-center">
            <Sparkles className="h-10 w-10 text-gold" />
          </div>
        )}
        {service.section === "real_estate" && service.category && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            {service.category}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug"><Link to="/services/$id" params={{ id: service.id }} className="hover:text-primary">{service.title}</Link></h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
        {location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {location}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display font-bold text-primary">{service.price || "حسب الطلب"}</span>
          <RequestDialog service={service} />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <Button asChild variant="ghost" size="sm"><Link to="/services/$id" params={{ id: service.id }}>تفاصيل الخدمة</Link></Button>
          {map && <Button asChild variant="ghost" size="icon"><a href={map} target="_blank" rel="noopener noreferrer" aria-label="الموقع الجغرافي" title="الموقع الجغرافي"><MapPin className="h-4 w-4" /></a></Button>}
        </div>
      </div>
    </article>
  );
}
