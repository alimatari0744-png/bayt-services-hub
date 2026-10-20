import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { SECTIONS, type Section } from "@/lib/services";
import { sectionText, useSiteContent } from "@/lib/site-content";
import { smartSearch } from "@/lib/search";
import { ServiceCard } from "./ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BROWSE_FILTERS, browseProperties, type PropertyBrowseFilters } from "@/lib/property-browsing";

type Props = { section: Section; items: { id: string; title: string; description: string; keywords: string; category: string; subcategory: string; price: string | null; location: string | null; image_url: string | null; map_url: string | null }[] };

export function SectionPage({ section, items }: Props) {
  const content = useSiteContent();
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<PropertyBrowseFilters>({});
  const meta = SECTIONS[section];
  const label = sectionText(content, section, "label");
  const tagline = sectionText(content, section, "tagline");

  const results = useMemo(() => {
    if (section !== "real_estate") return smartSearch(q, items);
    const searched = smartSearch(q, items);
    return browseProperties(
      searched,
      filters,
      (item) => ({ id: item.id, category: item.category, subcategory: item.subcategory, title: item.title, description: item.description, price: item.price, location: item.location, map_url: item.map_url }),
    );
  }, [q, filters, items, section]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-foreground">{meta.icon}</span>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{label}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{tagline}</p>
        </div>
        <Link to="/contact" className="rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
          {content["contact.other_request"]}
        </Link>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={content["search.placeholder"]}
            aria-label={`بحث في ${label}`}
            className="h-14 pr-12 text-base"
          />
        </div>

        {section === "real_estate" && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BROWSE_FILTERS.map((dropdown) => (
              <DropdownMenu key={dropdown.key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label={dropdown.label}
                    variant={filters[dropdown.key] && dropdown.key !== "sort" ? "default" : "secondary"}
                    className="h-auto min-h-12 w-full justify-between gap-2 px-3 py-2"
                  >
                    <span className="pointer-events-none min-w-0 text-right">
                      <span className="block text-xs opacity-75">{dropdown.label}</span>
                      <span className="block whitespace-normal">
                        {dropdown.options.find((option) => option.value === filters[dropdown.key])?.label || dropdown.all}
                      </span>
                    </span>
                    <ChevronDown className="pointer-events-none h-4 w-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
                  <DropdownMenuItem onSelect={() => setFilters((current) => ({ ...current, [dropdown.key]: undefined }))}>
                    {dropdown.all}
                  </DropdownMenuItem>
                  {dropdown.options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setFilters((current) => ({ ...current, [dropdown.key]: option.value }))}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            {section === "real_estate" ? <SlidersHorizontal className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            {results.length} {content["search.count"]}
          </span>
          {(q || Object.values(filters).some(Boolean)) && (
            <Button variant="ghost" size="sm" onClick={() => { setQ(""); setFilters({}); }}>
              إعادة تعيين البحث
            </Button>
          )}
        </div>
      </div>

      <div className="mt-10">
        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-16 text-center">
            <p className="text-muted-foreground">{content["search.empty"]}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
