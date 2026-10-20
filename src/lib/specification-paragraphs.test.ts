import { describe, expect, it } from "vitest";
import { parseSpecificationParagraphs, serializeSpecificationParagraphs } from "./specification-paragraphs";

describe("property specification paragraphs", () => {
  it("saves and restores each paragraph title and content", () => {
    const paragraphs = [{ title: "نوع الأثاث", content: "أثاث مستورد عالي الجودة" }];
    expect(parseSpecificationParagraphs(serializeSpecificationParagraphs(paragraphs))).toEqual(paragraphs);
  });
  it("preserves legacy plain specifications without treating them as paragraphs", () => {
    expect(parseSpecificationParagraphs("ثلاث غرف وصالة")).toBeNull();
    expect(parseSpecificationParagraphs('[{"title":"عنوان"}]')).toBeNull();
  });
});