export type SpecificationParagraph = { title: string; content: string };

export function parseSpecificationParagraphs(value: string | null | undefined): SpecificationParagraph[] | null {
  if (!value?.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || !parsed.every((item) => item && typeof item === "object" && typeof item.title === "string" && typeof item.content === "string")) return null;
    return parsed.map((item) => ({ title: item.title, content: item.content }));
  } catch {
    return null;
  }
}

export function serializeSpecificationParagraphs(paragraphs: SpecificationParagraph[]): string {
  return JSON.stringify(paragraphs.map(({ title, content }) => ({ title: title.trim(), content: content.trim() })));
}