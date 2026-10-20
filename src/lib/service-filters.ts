export const PROPERTY_CATEGORIES = ["شقق", "فلل", "أراضي", "محلات تجارية"] as const;

export function propertyLocation(section: string, location: string | null | undefined) {
  return section === "real_estate" ? location?.trim() || null : null;
}

export function categoryFilters(section: string): readonly string[] {
  return section === "real_estate" ? PROPERTY_CATEGORIES : [];
}

export function filterServices<T extends { category: string; subcategory: string }>(items: T[], section: string, category: string, subcategory: string) {
  if (section !== "real_estate" || !category) return items;
  return items.filter((item) => item.category === category && (!subcategory || item.subcategory === subcategory));
}

export function geographicUrl(mapUrl: string | null | undefined, location: string | null | undefined) {
  if (mapUrl) {
    try {
      const url = new URL(mapUrl);
      if (url.protocol === "https:") return url.href;
    } catch { /* Fall back to the written location. */ }
  }
  return location?.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.trim())}` : null;
}