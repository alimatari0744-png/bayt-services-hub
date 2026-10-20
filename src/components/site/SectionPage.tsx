import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SearchX, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SECTIONS, servicesQuery, type Section } from "@/lib/services";
import { smartSearch } from "@/lib/search";
import { ServiceCard } from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { browseProperties, DEMO_CITIES, EMPTY_PROPERTY_FILTERS, propertyCity, PROPERTY_PURPOSES, PROPERTY_SORTS, PROPERTY_TYPES, type PropertyFilters } from "@/lib/property-browsing";
import { Link } from "@tanstack/react-router";

export function SectionPage({ section }: { section: Section }) {
  const meta = SECTIONS[section];
  const { data } = useSuspenseQuery(servicesQuery(section));
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>(EMPTY_PROPERTY_FILTERS);
  const [focused, setFocused] = useState(false);

  const cities = useMemo(() => [...new Set([...DEMO_CITIES, ...data.map(propertyCity).filter(Boolean)])], [data]);
  const searched = smartSearch(query, data);
  const results = section === "real_estate" ? browseProperties(searched, filters) : searched;
  const dropdowns = [
    { key: "city" as const, label: "المدينة", all: "جميع المدن", options: cities.map((value) => ({ value, label: value })) },
    { key: "type" as const, label: "النوع", all: "جميع الأنواع", options: PROPERTY_TYPES.map((value) => ({ value, label: value })) },
    { key: "purpose" as const, label: "الغرض", all: "جميع الأغراض", options: PROPERTY_PURPOSES.map((value) => ({ value, label: value })) },
    { key: "sort" as const, label: "الترتيب", all: "", options: PROPERTY_SORTS },
  ];
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
                      setFilters(EMPTY_PROPERTY_FILTERS);
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
          {section === "real_estate" && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dropdowns.map((dropdown) => (
              <DropdownMenu key={dropdown.key} dir="rtl">
                <DropdownMenuTrigger asChild><Button aria-label={dropdown.label} variant={filters[dropdown.key] && dropdown.key !== "sort" ? "default" : "secondary"} className="h-auto min-h-12 w-full justify-between gap-2 px-3 py-2"><span className="pointer-events-none min-w-0 text-right"><span className="block text-xs opacity-75">{dropdown.label}</span><span className="block whitespace-normal">{dropdown.options.find((option) => option.value === filters[dropdown.key])?.label || dropdown.all}</span></span><ChevronDown className="pointer-events-none h-4 w-4 shrink-0" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-44">
                  {dropdown.all && <DropdownMenuItem onSelect={() => setFilters((previous) => ({ ...previous, [dropdown.key]: "" }))}>{dropdown.all}</DropdownMenuItem>}
                  {dropdown.options.map((option) => <DropdownMenuItem key={option.value} onSelect={() => setFilters((previous) => ({ ...previous, [dropdown.key]: option.value }))}>{option.label}</DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>}
          {section === "real_estate" && (filters.city || filters.type || filters.purpose || filters.sort !== "newest") && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm"><span>{[filters.city, filters.type, filters.purpose].filter(Boolean).join(" / ")}</span><Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_PROPERTY_FILTERS)}><X className="h-4 w-4" />إعادة ضبط</Button></div>}
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
