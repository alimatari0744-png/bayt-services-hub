import { queryOptions } from "@tanstack/react-query";
import { getPropertyClassifications } from "./property-classifications.functions";
import { propertyCity, propertyType, propertyPurpose } from "./property-browsing";
import type { Service } from "./services";

export type ClassificationKind = "city" | "type" | "purpose";
export type Classification = { id: string; kind: string; label: string };
export const EMPTY_CLASSIFICATIONS: Classification[] = [];
export const CLASSIFICATION_GROUPS = [
  { kind: "city", field: "city_id", label: "المدينة" },
  { kind: "type", field: "property_type_id", label: "النوع" },
  { kind: "purpose", field: "purpose_id", label: "الغرض" },
] as const;
export const classificationsQuery = queryOptions({ queryKey: ["property-classifications"], queryFn: () => getPropertyClassifications() });

export function resolvePropertyClassifications<T extends Pick<Service, "id" | "title" | "category" | "subcategory" | "location" | "price" | "created_at"> & Partial<Pick<Service, "city_id" | "property_type_id" | "purpose_id">>>(item: T, options: Classification[]) {
  const label = (id: string | null | undefined, kind: ClassificationKind, legacy: string) => id ? options.find((option) => option.id === id && option.kind === kind)?.label ?? "" : legacy;
  return { ...item,
    city: label(item.city_id, "city", propertyCity(item)),
    property_type: label(item.property_type_id, "type", propertyType(item)),
    purpose: label(item.purpose_id, "purpose", propertyPurpose(item)),
  };
}

export function classificationAssignmentsValid(value: Partial<Service>, options: Classification[]) {
  return CLASSIFICATION_GROUPS.every(({kind,field}) => options.some((option) => option.id === value[field] && option.kind === kind));
}