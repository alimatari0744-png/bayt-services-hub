export type SpecificationParagraph = { title: string; content: string };
export type ServiceSpecifications = { text: string; paragraphs: SpecificationParagraph[] };

export function specificationParagraphDrafts(value: string | null | undefined): SpecificationParagraph[] {
  return [...parseServiceSpecifications(value).paragraphs.filter(({ title, content }) => title.trim() || content.trim()), { title: "", content: "" }];
}

export function incompleteSpecificationParagraphs(paragraphs: SpecificationParagraph[]): boolean {
  return paragraphs.some(({ title, content }) => Boolean(title.trim() || content.trim()) && (!title.trim() || !content.trim()));
}

function isParagraphs(value: unknown): value is SpecificationParagraph[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" && typeof item.title === "string" && typeof item.content === "string");
}

export function parseServiceSpecifications(value: string | null | undefined): ServiceSpecifications {
  if (!value?.trim()) return { text: "", paragraphs: [] };
  try {
    const parsed: unknown = JSON.parse(value);
    if (isParagraphs(parsed)) return { text: "", paragraphs: parsed };
    if (parsed && typeof parsed === "object" && "text" in parsed && typeof parsed.text === "string" && "paragraphs" in parsed && isParagraphs(parsed.paragraphs)) {
      return { text: parsed.text, paragraphs: parsed.paragraphs };
    }
  } catch {
    // Plain-text specifications from existing services are preserved verbatim.
  }
  return { text: value, paragraphs: [] };
}

export function serializeServiceSpecifications(specifications: ServiceSpecifications): string {
  const paragraphs = specifications.paragraphs.filter(({ title, content }) => title.trim() || content.trim()).map(({ title, content }) => ({ title: title.trim(), content: content.trim() }));
  if (!paragraphs.length) return specifications.text;
  return JSON.stringify({ text: specifications.text, paragraphs });
}

export function parseSpecificationParagraphs(value: string | null | undefined): SpecificationParagraph[] | null {
  if (!value?.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isParagraphs(parsed)) return null;
    return parsed.map((item) => ({ title: item.title, content: item.content }));
  } catch {
    return null;
  }
}

export function serializeSpecificationParagraphs(paragraphs: SpecificationParagraph[]): string {
  return JSON.stringify(paragraphs.map(({ title, content }) => ({ title: title.trim(), content: content.trim() })));
}