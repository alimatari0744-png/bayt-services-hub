import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SearchX, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SECTIONS, servicesQuery, type Section } from "@/lib/services";
import { smartSearch } from "@/lib/search";
import { ServiceCard } from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { categoryFilters, filterServices } from "@/lib/service-filters";
import { Link } from "@tanstack/react-router";

export function SectionPage({ section }: { section: Section }) {
  const meta = SECTIONS[section];
  const { data } = useSuspenseQuery(servicesQuery(section));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [focused, setFocused] = useState(false);

  const categories = categoryFilters(section);
  const subcategories = useMemo(() => Object.fromEntries(categories.map((c) => [c, [...new Set(data.filter((s) => s.category === c).map((s) => s.subcategory).filter(Boolean))]])), [data, categories]);

  const byCategory = filterServices(data, section, category, subcategory);
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
          <div className="relative rounded-lg border border-border bg-card p-3 shadow-lift">
          <div className="flex items-center gap-3 rounded-xl bg-muted px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="اكتب أي تلميح... مثلاً: اقامة، شقه، بحث"
              aria-label={`بحث في ${meta.label}`}
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          {focused && suggestions.length > 0 && (
            <ul className="absolute inset-x-3 top-full mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Button variant="ghost"
                    onMouseDown={() => {
                      setQuery(s.title);
                      setCategory("");
                      setSubcategory("");
                    }}
                    className="flex h-auto w-full items-center justify-between whitespace-normal px-4 py-3 text-right hover:bg-secondary"
                  >
                    <span className="font-medium">{s.title}</span>
                    {section === "real_estate" && <span className="text-xs text-muted-foreground">{s.category}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {categories.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((c) => (
              <DropdownMenu key={c} dir="rtl">
                <DropdownMenuTrigger asChild><Button variant={category === c ? "default" : "secondary"} className="h-11 w-full justify-between px-3">{c}<ChevronDown className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => { setCategory(c); setSubcategory(""); }}>جميع {c}</DropdownMenuItem>
                  {(subcategories[c] ?? []).map((sub) => <DropdownMenuItem key={sub} onSelect={() => { setCategory(c); setSubcategory(sub); }}>{sub}</DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>}
          {section === "real_estate" && category && <div className="mt-3 flex items-center justify-between gap-2 text-sm"><span>{category}{subcategory ? ` / ${subcategory}` : ""}</span><Button variant="ghost" size="sm" onClick={() => { setCategory(""); setSubcategory(""); }}><X className="h-4 w-4" />عرض الكل</Button></div>}
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>{results.length} خدمة</span>
          <Button asChild variant="outline" size="sm"><Link to="/contact">طلب خدمة أخرى</Link></Button>
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
