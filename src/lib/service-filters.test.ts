import { describe, expect, it } from "vitest";
import { categoryFilters, filterServices, geographicUrl } from "./service-filters";

describe("Service browsing rules", () => {
  it("general services have no category filters", () => expect(categoryFilters("general")).toEqual([]));
  it("student services have no category filters", () => expect(categoryFilters("student")).toEqual([]));
  it("real estate has exactly four primary categories", () => expect(categoryFilters("real_estate")).toEqual(["شقق", "فلل", "أراضي", "محلات تجارية"]));
  it("filters by the owner's subcategory within its primary category", () => {
    const items = [{ category: "شقق", subcategory: "للإيجار" }, { category: "شقق", subcategory: "للبيع" }, { category: "فلل", subcategory: "للإيجار" }];
    expect(filterServices(items, "real_estate", "شقق", "للإيجار")).toEqual([items[0]]);
  });
  it("does not filter student services by category", () => {
    const items = [{ category: "أبحاث", subcategory: "" }];
    expect(filterServices(items, "student", "شقق", "للبيع")).toEqual(items);
  });
  it("opens a geographic link and rejects unsafe protocols", () => {
    expect(geographicUrl("https://maps.google.com/?q=24,46", null)).toBe("https://maps.google.com/?q=24,46");
    expect(geographicUrl("javascript:alert(1)", null)).toBeNull();
  });
});