import { createFileRoute } from "@tanstack/react-router";
import { RequestForm } from "@/components/site/RequestForm";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "تواصل معنا واطلب خدمة | مركز الخدمات الشاملة" },
    { name: "description", content: "أرسل طلبك للخدمات العامة والعقارية والطلابية، حتى لو لم تكن الخدمة مدرجة." },
    { property: "og:title", content: "تواصل معنا | مركز الخدمات الشاملة" },
    { property: "og:description", content: "أرسل تفاصيل الخدمة التي تحتاجها إلى مركز الخدمات الشاملة." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <section className="mx-auto max-w-2xl px-4 py-12 md:py-16"><h1 className="text-3xl font-bold">تواصل معنا</h1><h2 className="mb-8 mt-4 text-lg text-muted-foreground">طلب خدمة</h2><RequestForm /></section>,
});