export type Coordinates = { latitude: number; longitude: number };

export function parseCoordinates(latitude: string, longitude: string): Coordinates | null {
  if (!latitude.trim() || !longitude.trim()) return null;
  const lat = Number(latitude), lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { latitude: lat, longitude: lng };
}

export function coordinateMapUrl(coordinates: Coordinates): string {
  return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
}

export function coordinatesFromMapUrl(value: string | null | undefined): Coordinates | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const pair = (url.searchParams.get("query") ?? url.searchParams.get("q"))?.split(",");
    return pair?.length === 2 ? parseCoordinates(pair[0], pair[1]) : null;
  } catch { return null; }
}

export function propertyCoordinatePayload(section: string, mapUrl: string | null | undefined) {
  return { location: null, map_url: section === "real_estate" ? mapUrl?.trim() || null : null };
}