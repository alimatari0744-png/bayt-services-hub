import { describe, expect, it } from "vitest";
import { coordinateMapUrl, coordinatesFromMapUrl, parseCoordinates, propertyCoordinatePayload } from "./property-coordinates";

describe("property geographic coordinates", () => {
  it("stores and restores the exact coordinates in Google Maps", () => {
    const point = { latitude: 24.7136, longitude: 46.6753 };
    expect(coordinateMapUrl(point)).toBe("https://www.google.com/maps/search/?api=1&query=24.7136,46.6753");
    expect(coordinatesFromMapUrl(coordinateMapUrl(point))).toEqual(point);
  });
  it("rejects missing or out-of-range coordinates", () => {
    for (const [latitude, longitude] of [["", "46"], ["24", ""], ["91", "46"], ["24", "181"], ["abc", "46"]] as [string, string][]) expect(parseCoordinates(latitude, longitude)).toBeNull();
    expect(parseCoordinates("0", "0")).toEqual({ latitude: 0, longitude: 0 });
  });
  it.each(["general", "student"])("removes location fields for %s services", (section) => {
    expect(propertyCoordinatePayload(section, "https://www.google.com/maps/?q=24,46")).toEqual({ location: null, map_url: null });
  });
  it("keeps the property map URL instead of written location", () => {
    expect(propertyCoordinatePayload("real_estate", "https://www.google.com/maps/?q=24,46")).toEqual({ location: null, map_url: "https://www.google.com/maps/?q=24,46" });
  });
});