export const PROPERTY_FILTER_LABELS = ["المدينة", "النوع", "الغرض", "الترتيب"] as const;
export const DEMO_CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف"] as const;
export const PROPERTY_TYPES = ["سكني", "تجاري"] as const;
export const PROPERTY_PURPOSES = ["بيع", "إيجار"] as const;
export const PROPERTY_SORTS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_desc", label: "السعر الأعلى" },
  { value: "price_asc", label: "السعر الأقل" },
] as const;

export type PropertyFilters = { city: string; type: string; purpose: string; sort: string };
export const EMPTY_PROPERTY_FILTERS: PropertyFilters = { city: "", type: "", purpose: "", sort: "newest" };
type Property = { id: string; title: string; category: string; subcategory: string; location: string | null; price: string | null; created_at: string; city?: string; property_type?: string; purpose?: string };

// Existing sample listings are all in Riyadh; do not invent cities for owner listings.
const RIYADH_DEMO_IDS = new Set(["8b595a13-f9dc-4d42-8f9a-7294d9b66bbc", "9db2a016-4bc9-41a9-9ca1-9790bf9f7c32", "a7576b7b-30ff-425c-b25d-2d16590069f1", "c73a9db3-2b33-443f-ac08-d069219276d0"]);

export function propertyCity(item: Property) {
  return item.city?.trim() || DEMO_CITIES.find((city) => item.location?.includes(city)) || (RIYADH_DEMO_IDS.has(item.id) ? "الرياض" : "");
}

export function propertyType(item: Property) {
  if (item.property_type) return item.property_type;
  const text = `${item.category} ${item.subcategory} ${item.title}`;
  if (/تجاري|تجارية|محل|مكتب/.test(text)) return "تجاري";
  return /سكن|شق|فيلا|فلل/.test(text) ? "سكني" : "";
}

export function propertyPurpose(item: Property) {
  if (item.purpose) return item.purpose;
  const text = `${item.title} ${item.subcategory} ${item.price ?? ""}`;
  if (/إيجار|ايجار|للإيجار|سنوي|شهري/.test(text)) return "إيجار";
  return /بيع/.test(text) ? "بيع" : "";
}

export function numericPropertyPrice(price: string | null) {
  const normalized = (price ?? "").replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/[٬,]/g, "").replace(/٫/g, ".");
  const match = normalized.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function browseProperties<T extends Property>(items: T[], filters: PropertyFilters) {
  return items.filter((item) => (!filters.city || propertyCity(item) === filters.city)
    && (!filters.type || propertyType(item) === filters.type)
    && (!filters.purpose || propertyPurpose(item) === filters.purpose))
    .sort((a, b) => {
      if (filters.sort === "newest") return Date.parse(b.created_at) - Date.parse(a.created_at);
      const left = numericPropertyPrice(a.price);
      const right = numericPropertyPrice(b.price);
      if (left === null) return right === null ? 0 : 1;
      if (right === null) return -1;
      return filters.sort === "price_desc" ? right - left : left - right;
    });
}