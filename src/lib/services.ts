import { queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Section = Database["public"]["Enums"]["service_section"];

export const SECTIONS: Record<Section, { label: string; path: "/general" | "/real-estate" | "/students"; tagline: string; categories: string[] }> = {
  general: {
    label: "الخدمات العامة",
    path: "/general",
    tagline: "معاملات حكومية، طباعة، ترجمة وكل ما تحتاجه في مكان واحد",
    categories: ["حكومية", "طباعة وتصوير", "ترجمة", "أخرى"],
  },
  real_estate: {
    label: "الخدمات العقارية",
    path: "/real-estate",
    tagline: "شقق، فلل، أراضٍ ومحلات تجارية للبيع والإيجار",
    categories: ["شقق", "فلل", "أراضي", "محلات تجارية"],
  },
  student: {
    label: "الخدمات الطلابية",
    path: "/students",
    tagline: "أبحاث، عروض تقديمية، دروس خصوصية وقبول جامعي",
    categories: ["أبحاث وتقارير", "عروض تقديمية", "دروس خصوصية", "قبول وتسجيل"],
  },
};

export const servicesQuery = (section: Section) =>
  queryOptions({
    queryKey: ["services", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("section", section)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const urlCache = new Map<string, string>();

export function useImageUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(path ? urlCache.get(path) ?? null : null);
  useEffect(() => {
    if (!path) return setUrl(null);
    if (path.startsWith("http")) return setUrl(path);
    const cached = urlCache.get(path);
    if (cached) return setUrl(cached);
    let cancelled = false;
    supabase.storage
      .from("service-images")
      .createSignedUrl(path, 60 * 60 * 24)
      .then(({ data }) => {
        if (data?.signedUrl && !cancelled) {
          urlCache.set(path, data.signedUrl);
          setUrl(data.signedUrl);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path]);
  return url;
}
