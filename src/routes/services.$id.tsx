import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, PencilRuler, Phone } from "lucide-react";
import { SECTIONS, useImageUrl, type Service } from "@/lib/services";
import { sectionText, useSiteContent } from "@/lib/site-content";
import { RequestForm } from "@/components/site/RequestForm";

export const Route = createFileRoute("/services/$id")({
  head: ({ params }) => ({
    meta: [
      { title: "تفاصيل الخدمة | مركز الخدمات الشاملة" },
      { name: "description", content: `تفاصيل ومواصفات وطلب خدمة ${params.id}.` },
      { property: "og:title", content: "تفاصيل الخدمة | مركز الخدمات الشاملة" },
      { property: "og:description", content: "اطّلع على مواصفات الخدمة وأرسل طلبك مباشرة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", params.id)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as Service;
  },
  notFoundComponent: () => <div className="py-32 text-center text-muted-foreground">الخدمة غير متاحة</div>,
  component: ServiceDetail,
});

function ServiceDetail() {
  const service = Route.useLoaderData() as Service | undefined;
  if (!service) throw notFound();
  const content = useSiteContent();
  const img = useImageUrl(service.image_url);
  const specifications = service.specifications?.trim() || content["service.spec_fallback"];

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Link to={SECTIONS[service.section].path} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowRight className="h-4 w-4" /> {sectionText(content, service.section, "label")}
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold md:text-5xl">{service.title}</h1>
          {service.category && <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">{service.category}</span>}
          {service.subcategory && <span className="rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground">{service.subcategory}</span>}
        </div>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{service.description}</p>
      </header>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-secondary">
        {img ? (
          <img src={img} alt={service.title} className="h-full min-h-[300px] w-full object-cover md:min-h-[440px]" />
        ) : (
          <div className="grid h-full min-h-[300px] w-full place-items-center text-muted-foreground">لا صورة</div>
        )}
      </div>

      <section className="mt-6 rounded-3xl border border-border bg-card p-6 md:p-8" aria-labelledby="service-specifications">
        <h2 id="service-specifications" className="flex items-center gap-2 text-xl font-bold"><PencilRuler className="h-5 w-5 text-primary" /> {content["service.specifications_title"]}</h2>
        <p className="mt-4 whitespace-pre-line leading-8">{specifications}</p>
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-secondary p-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 font-semibold text-primary"><Clock className="h-4 w-4" /> {content["service.price_label"]}: {service.price || content["service.price_fallback"]}</span>
        {service.location && <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2"><MapPin className="h-4 w-4 text-primary" /> {content["service.location_label"]}: {service.location}</span>}
        {service.contact_phone && <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2"><Phone className="h-4 w-4 text-primary" /> {content["service.call_label"]}: <a href={`tel:${service.contact_phone}`} dir="ltr" className="hover:text-primary">{service.contact_phone}</a></span>}
      </section>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-xl font-bold">طلب هذه الخدمة</h2>
        <p className="mt-2 text-sm text-muted-foreground">أدخل بياناتك وسنتواصل معك لإنجاز طلبك.</p>
        <div className="mt-6 max-w-2xl"><RequestForm serviceId={service.id} /></div>
      </div>
    </article>
  );
}
