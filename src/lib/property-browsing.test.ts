import { describe, expect, it } from "vitest";
import { browseProperties, DEMO_CITIES, EMPTY_PROPERTY_FILTERS, numericPropertyPrice, PROPERTY_FILTER_LABELS, PROPERTY_PURPOSES, PROPERTY_TYPES } from "./property-browsing";

const items = [
  { id: "1", title: "شقة للإيجار", category: "شقق", subcategory: "", location: "الرياض", price: "45,000 ر.س سنوياً", created_at: "2026-10-01" },
  { id: "2", title: "محل للبيع", category: "محلات تجارية", subcategory: "", location: "جدة", price: "900,000 ر.س", created_at: "2026-10-03" },
  { id: "3", title: "فيلا للبيع", category: "فلل", subcategory: "", location: "الرياض", price: "2,300,000 ر.س", created_at: "2026-10-02" },
];
describe("Property browsing", () => {
  it("uses the four requested dropdown labels", () => expect(PROPERTY_FILTER_LABELS).toEqual(["المدينة", "النوع", "الغرض", "الترتيب"]));
  it("offers residential and commercial types", () => expect(PROPERTY_TYPES).toEqual(["سكني", "تجاري"]));
  it("offers sale and rent purposes", () => expect(PROPERTY_PURPOSES).toEqual(["بيع", "إيجار"]));
  it("offers seven distinct demo cities", () => expect(new Set(DEMO_CITIES).size).toBe(7));
  it("combines city, type and purpose", () => expect(browseProperties(items, { ...EMPTY_PROPERTY_FILTERS, city: "الرياض", type: "سكني", purpose: "بيع" }).map((i) => i.id)).toEqual(["3"]));
  it("filters commercial properties", () => expect(browseProperties(items, { ...EMPTY_PROPERTY_FILTERS, type: "تجاري" }).map((i) => i.id)).toEqual(["2"]));
  it("sorts highest price first", () => expect(browseProperties(items, { ...EMPTY_PROPERTY_FILTERS, sort: "price_desc" }).map((i) => i.id)).toEqual(["3", "2", "1"]));
  it("sorts lowest price first", () => expect(browseProperties(items, { ...EMPTY_PROPERTY_FILTERS, sort: "price_asc" }).map((i) => i.id)).toEqual(["1", "2", "3"]));
  it("sorts newest first", () => expect(browseProperties(items, EMPTY_PROPERTY_FILTERS).map((i) => i.id)).toEqual(["2", "3", "1"]));
  it("parses Arabic price digits", () => expect(numericPropertyPrice("٩٠٠٬٠٠٠ ر.س")).toBe(900000));
  it("keeps unpriced listings last", () => expect(browseProperties([{ ...items[0], id: "4", price: null }, ...items], { ...EMPTY_PROPERTY_FILTERS, sort: "price_asc" }).map((i) => i.id)).toEqual(["1", "2", "3", "4"]));
});