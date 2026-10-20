import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, ArrowRight, Phone, Sparkles } from "lucide-react";
import { getServiceDetail } from "@/lib/service-detail.functions";
import { geographicUrl, propertyLocation } from "@/lib/service-filters";
import { SECTIONS, useImageUrl } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { RequestDialog } from "@/components/site/RequestDialog";

export const Route = createFileRoute("/services/$id")({
  loader: async ({ params }) => {
    const service = await getServiceDetail({ data: { id: params.id } });
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} | مركز الخدمات الشاملة` : "الخدمة غير متاحة | مركز الخدمات الشاملة";
    const description = loaderData?.description || "تفاصيل ومواصفات الخدمة وطلبها من مركز الخدمات الشاملة.";
    const image = loaderData?.image_url?.startsWith("https://") ? loaderData.image_url : null;
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ] };
  },
  notFoundComponent: () => <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">الخدمة غير متاحة</h1><Button asChild className="mt-6"><Link to="/contact">تواصل معنا</Link></Button></div>,
  component: ServiceDetail,
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  const image = useImageUrl(service.image_url);
  const meta = SECTIONS[service.section];
  const location = propertyLocation(service.section, service.location);
  const map = service.section === "real_estate" ? geographicUrl(service.map_url, service.location) : null;
  return <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
    <Link to={meta.path} className="mb-6 inline-flex items-center gap-2 text-sm text-primary"><ArrowRight className="h-4 w-4" />{meta.label}</Link>
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
        {image ? <img src={image} alt={service.title} className="h-full w-full object-cover" /> : <div className="pattern-dots grid h-full place-items-center bg-primary"><Sparkles className="h-16 w-16 text-gold" /></div>}
      </div>
      <div className="min-w-0">
        <p className="mb-3 text-sm font-medium text-primary">{meta.label}{service.section === "real_estate" && service.category ? ` / ${service.category}${service.subcategory ? ` / ${service.subcategory}` : ""}` : ""}</p>
        <h1 className="break-words text-3xl font-bold leading-relaxed md:text-4xl">{service.title}</h1>
        <section className="mt-4">
          <h2 className="text-lg font-bold">مواصفات الخدمة</h2>
          <p className="mt-3 whitespace-pre-wrap break-words leading-loose text-muted-foreground">{service.specifications || service.description || "تواصل معنا للاستفسار عن تفاصيل هذه الخدمة."}</p>
        </section>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">السعر</dt><dd className="font-bold text-primary">{service.price || "حسب الطلب"}</dd></div>
          {location && <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">الموقع</dt><dd className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{location}</dd></div>}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3"><RequestDialog service={service} />
          {map && <Button asChild variant="outline"><a href={map} target="_blank" rel="noopener noreferrer"><MapPin className="h-4 w-4" />الموقع الجغرافي</a></Button>}
          {service.contact_phone && /^[+\d\s()-]{5,20}$/.test(service.contact_phone) && <Button asChild variant="outline"><a href={`tel:${service.contact_phone}`}><Phone className="h-4 w-4" />اتصال</a></Button>}
        </div>
      </div>
    </div>
  </div>;
}