import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/site/SectionPage";
import { servicesQuery } from "@/lib/services";

export const Route = createFileRoute("/general")({
  head: () => ({
    meta: [
      { title: "الخدمات العامة | مركز الخدمات الشاملة" },
      { name: "description", content: "معاملات حكومية، طباعة، ترجمة وخدمات عامة سريعة وموثوقة." },
      { property: "og:title", content: "الخدمات العامة | مركز الخدمات الشاملة" },
      { property: "og:description", content: "معاملات حكومية، طباعة، ترجمة وخدمات عامة سريعة وموثوقة." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery("general")),
  component: () => <SectionPage section="general" />,
});
