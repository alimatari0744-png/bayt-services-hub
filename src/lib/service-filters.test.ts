import { describe, expect, it } from "vitest";
import { categoryFilters, filterServices, geographicUrl, propertyLocation } from "./service-filters";

describe("Service browsing rules", () => {
  it("hides location on general services", () => expect(propertyLocation("general", "الرياض")).toBeNull());
  it("hides location on student services", () => expect(propertyLocation("student", "عن بُعد")).toBeNull());
  it("shows the property's location", () => expect(propertyLocation("real_estate", "حي النرجس")).toBe("حي النرجس"));
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