import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useImageUrl, type Service } from "@/lib/services";
import { geographicUrl } from "@/lib/service-filters";
import { useSiteContent } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RequestForm } from "./RequestForm";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const img = useImageUrl(service.image_url);
  const content = useSiteContent();
  const map = service.section === "real_estate" ? geographicUrl(service.map_url, null) : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link
        to="/services/$id"
        params={{ id: service.id }}
        aria-label={`${content["service.details_prefix"]} ${service.title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {img ? (
          <img src={img} alt={service.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">لا صورة</div>
        )}
        {service.category && <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur">{service.category}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{service.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display font-bold text-primary">{service.price || content["service.price_fallback"]}</span>
          <span className="relative z-20"><RequestDialog service={service} /></span>
        </div>
        {map && (
          <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
            {map && (
              <Button asChild variant="ghost" size="icon" className="relative z-20">
                <a href={map} target="_blank" rel="noopener noreferrer" aria-label={content["service.map_label"]} title={content["service.map_label"]}>
                  <MapPin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function RequestDialog({ service }: { service: Service }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">اطلب الخدمة</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-lg text-right">
        <DialogHeader><DialogTitle className="text-right">طلب: {service.title}</DialogTitle></DialogHeader>
        <RequestForm serviceId={service.id} />
      </DialogContent>
    </Dialog>
  );
}
