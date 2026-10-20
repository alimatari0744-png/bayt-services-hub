import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { RequestForm } from "@/components/site/RequestForm";
import { useSiteContent } from "@/lib/site-content";
import { normalizePhone } from "@/lib/phone-auth";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "تواصل معنا واطلب خدمة | مركز الخدمات الشاملة" },
    { name: "description", content: "أرسل طلبك للخدمات العامة والعقارية والطلابية، حتى لو لم تكن الخدمة مدرجة." },
    { property: "og:title", content: "تواصل معنا | مركز الخدمات الشاملة" },
    { property: "og:description", content: "أرسل تفاصيل الخدمة التي تحتاجها إلى مركز الخدمات الشاملة." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Contact,
});

function Contact() {
  const content = useSiteContent();
  const phone = normalizePhone(content["contact.phone"]);
  const hasDetails = Boolean(content["contact.phone"] || content["contact.email"] || content["contact.address"] || content["contact.hours"]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold">{content["contact.title"]}</h1>
      <h2 className="mb-8 mt-4 text-lg text-muted-foreground">{content["contact.intro"]}</h2>

      {hasDetails && (
        <ul className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
          {content["contact.phone"] && (
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${phone ?? content["contact.phone"]}`} dir="ltr" className="hover:text-primary">{content["contact.phone"]}</a>
            </li>
          )}
          {phone && (
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{content["contact.whatsapp_label"]}</a>
            </li>
          )}
          {content["contact.email"] && (
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${content["contact.email"]}`} dir="ltr" className="hover:text-primary">{content["contact.email"]}</a>
            </li>
          )}
          {content["contact.address"] && (
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" />{content["contact.address"]}</li>
          )}
          {content["contact.hours"] && (
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" />{content["contact.hours"]}</li>
          )}
        </ul>
      )}

      <RequestForm />
    </section>
  );
}
