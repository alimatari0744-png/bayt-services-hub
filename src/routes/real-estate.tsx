import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/site/SectionPage";
import { servicesQuery } from "@/lib/services";

export const Route = createFileRoute("/real-estate")({
  head: () => ({
    meta: [
      { title: "الخدمات العقارية | مركز الخدمات الشاملة" },
      { name: "description", content: "شقق وفلل وأراضٍ ومحلات تجارية للبيع والإيجار." },
      { property: "og:title", content: "الخدمات العقارية | مركز الخدمات الشاملة" },
      { property: "og:description", content: "شقق وفلل وأراضٍ ومحلات تجارية للبيع والإيجار." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery("real_estate")),
  component: () => <SectionPage section="real_estate" />,
});
