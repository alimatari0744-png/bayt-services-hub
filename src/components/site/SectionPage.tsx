import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { SECTIONS, servicesQuery, type Section } from "@/lib/services";
import { smartSearch } from "@/lib/search";
import { ServiceCard } from "./ServiceCard";

export function SectionPage({ section }: { section: Section }) {
  const meta = SECTIONS[section];
  const { data } = useSuspenseQuery(servicesQuery(section));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("الكل");
  const [focused, setFocused] = useState(false);

  const categories = useMemo(() => {
    const set = new Set([...meta.categories, ...data.map((s) => s.category).filter(Boolean)]);
    return ["الكل", ...Array.from(set).filter((c) => c !== "أخرى" || data.some((s) => s.category === "أخرى"))];
  }, [data, meta.categories]);

  const byCategory = category === "الكل" ? data : data.filter((s) => s.category === category);
  const results = smartSearch(query, byCategory);
  const suggestions = query.trim() ? smartSearch(query, data).slice(0, 5) : [];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="pattern-dots absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 text-primary-foreground">
          <h1 className="text-3xl font-bold md:text-5xl">{meta.label}</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">{meta.tagline}</p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4">
        <div className="relative rounded-2xl border border-border bg-card p-3 shadow-lift">
          <div className="flex items-center gap-3 rounded-xl bg-muted px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="اكتب أي تلميح... مثلاً: اقامة، شقه، بحث"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          {focused && suggestions.length > 0 && (
            <ul className="absolute inset-x-3 top-full mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    onMouseDown={() => {
                      setQuery(s.title);
                      setCategory("الكل");
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-secondary"
                  >
                    <span className="font-medium">{s.title}</span>
                    <span className="text-xs text-muted-foreground">{s.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>{results.length} خدمة</span>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <SearchX className="h-10 w-10" />
            <p>لا توجد نتائج مطابقة، جرّب كلمة أخرى</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
