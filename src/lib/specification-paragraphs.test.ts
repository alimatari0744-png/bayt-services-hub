import { describe, expect, it } from "vitest";
import { parseServiceSpecifications, serializeServiceSpecifications, parseSpecificationParagraphs, serializeSpecificationParagraphs, specificationParagraphDrafts, incompleteSpecificationParagraphs } from "./specification-paragraphs";

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

describe("all service specifications", () => {
  it("opens an empty paragraph for a new service", () => {
    expect(specificationParagraphDrafts(undefined)).toEqual([{ title: "", content: "" }]);
  });
  it("opens an extra empty paragraph without replacing saved paragraphs", () => {
    expect(specificationParagraphDrafts('[{"title":"نوع الأثاث","content":"مستورد"}]')).toEqual([{ title: "نوع الأثاث", content: "مستورد" }, { title: "", content: "" }]);
  });
  it("ignores untouched paragraphs on save", () => {
    expect(serializeServiceSpecifications({ text: "تفاصيل", paragraphs: [{ title: "  ", content: "" }] })).toBe("تفاصيل");
    expect(incompleteSpecificationParagraphs([{ title: "", content: "" }])).toBe(false);
  });
  it("requires both fields only when a paragraph is started", () => {
    expect(incompleteSpecificationParagraphs([{ title: "عنوان", content: "" }])).toBe(true);
    expect(incompleteSpecificationParagraphs([{ title: "", content: "محتوى" }])).toBe(true);
  });
  it("preserves free text followed by optional title/content paragraphs", () => {
    const specifications = { text: "تفاصيل الخدمة المكتوبة", paragraphs: [{ title: "نوع الأثاث", content: "أثاث مستورد عالي الجودة" }] };
    expect(parseServiceSpecifications(serializeServiceSpecifications(specifications))).toEqual(specifications);
  });
  it("keeps existing plain text in the text field, not a new paragraph", () => {
    expect(parseServiceSpecifications("ثلاث غرف وصالة")).toEqual({ text: "ثلاث غرف وصالة", paragraphs: [] });
  });
  it("retains existing paragraph arrays without fabricating text", () => {
    expect(parseServiceSpecifications('[{"title":"نوع الأثاث","content":"أثاث مستورد عالي الجودة"}]')).toEqual({ text: "", paragraphs: [{ title: "نوع الأثاث", content: "أثاث مستورد عالي الجودة" }] });
  });
  it("can remove all paragraphs without losing the written text", () => {
    expect(serializeServiceSpecifications({ text: "تفاصيل الخدمة المكتوبة", paragraphs: [] })).toBe("تفاصيل الخدمة المكتوبة");
  });
});