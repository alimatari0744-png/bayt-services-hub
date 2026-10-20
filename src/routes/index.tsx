import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, GraduationCap, Landmark, Clock, ShieldCheck, Headphones } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مركز الخدمات الشاملة | خدمات عامة وعقارية وطلابية" },
      { name: "description", content: "كل خدماتك في مكان واحد: معاملات عامة، عقارات للبيع والإيجار، وخدمات طلابية متكاملة." },
      { property: "og:title", content: "مركز الخدمات الشاملة" },
      { property: "og:description", content: "خدمات عامة وعقارية وطلابية في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sections = [
  { to: "/general", icon: Landmark, title: "الخدمات العامة", desc: "معاملات حكومية، طباعة، ترجمة وأكثر." },
  { to: "/real-estate", icon: Building2, title: "الخدمات العقارية", desc: "شقق، فلل، أراضٍ ومحلات تجارية." },
  { to: "/students", icon: GraduationCap, title: "الخدمات الطلابية", desc: "أبحاث، عروض، دروس وقبول جامعي." },
] as const;

function Index() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="mx-auto max-w-7xl px-4 pb-40 pt-24 text-primary-foreground md:pt-32">
          <span className="inline-block rounded-full border border-gold/50 bg-primary/30 px-4 py-1 text-sm text-gold backdrop-blur animate-rise">
            كل خدماتك في مكان واحد
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl animate-rise" style={{ animationDelay: "80ms" }}>
            مركز الخدمات <span className="text-gold">الشاملة</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85 animate-rise" style={{ animationDelay: "160ms" }}>
            نختصر عليك الوقت والجهد، من المعاملات اليومية إلى إيجاد منزلك القادم ومساندتك في مسيرتك الدراسية.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-24 grid max-w-7xl gap-6 px-4 md:grid-cols-3">
        {sections.map((s, i) => (
          <Link
            key={s.to}
            to={s.to}
            className="group rounded-3xl border border-border bg-card p-7 shadow-lift transition duration-300 hover:-translate-y-1.5 animate-rise"
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <s.icon className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-bold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              تصفّح الخدمات <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4">
        <div className="grid gap-6 rounded-3xl bg-secondary p-8 md:grid-cols-3 md:p-12">
          {[
            { icon: Clock, t: "إنجاز سريع", d: "ننجز طلبك في أقصر وقت ممكن." },
            { icon: ShieldCheck, t: "موثوقية", d: "خبرة وأمانة في كل معاملة." },
            { icon: Headphones, t: "دعم متواصل", d: "فريقنا جاهز للرد على استفساراتك." },
          ].map((f) => (
            <div key={f.t} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-gold text-gold-foreground">
                <f.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
