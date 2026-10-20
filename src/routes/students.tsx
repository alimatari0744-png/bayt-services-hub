import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/site/SectionPage";
import { servicesQuery } from "@/lib/services";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "الخدمات الطلابية | مركز الخدمات الشاملة" },
      { name: "description", content: "أبحاث، عروض تقديمية، دروس خصوصية وقبول جامعي." },
      { property: "og:title", content: "الخدمات الطلابية | مركز الخدمات الشاملة" },
      { property: "og:description", content: "أبحاث، عروض تقديمية، دروس خصوصية وقبول جامعي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery("student")),
  component: () => <SectionPage section="student" />,
});
