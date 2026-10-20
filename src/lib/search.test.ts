import { describe, it, expect } from "vitest";
import { smartSearch } from "./search";

const items = [
  { title: "تجديد الإقامة", keywords: "جوازات", category: "حكومية" },
  { title: "شقة 3 غرف للإيجار", keywords: "سكن", category: "شقق" },
  { title: "تصميم عروض بوربوينت", keywords: "باوربوينت", category: "عروض تقديمية" },
];

describe("smartSearch", () => {
  it("recognizes English property hints from Arabic content without keywords", () => {
    expect(smartSearch("villa sale", [{ title: "فيلا للبيع" }, { title: "شقة للإيجار" }]).map((item) => item.title)).toEqual(["فيلا للبيع"]);
  });
  it("recognizes English student hints without manually entered keywords", () => {
    expect(smartSearch("PowerPoint", [{ title: "تصميم عروض بوربوينت" }])[0]?.title).toBe("تصميم عروض بوربوينت");
  });
  it("recognizes English general hints without manually entered keywords", () => {
    expect(smartSearch("translation", [{ title: "ترجمة المستندات" }, { title: "تجديد الإقامة" }]).map((item) => item.title)).toEqual(["ترجمة المستندات"]);
  });
  it("does not match unrelated or partially matched English requests", () => {
    expect(smartSearch("villa car", [{ title: "فيلا للبيع" }])).toHaveLength(0);
    expect(smartSearch("translation", [{ title: "فيلا للبيع" }])).toHaveLength(0);
  });
  it("matches a partial hint", () => {
    expect(smartSearch("اقام", items)[0]?.title).toBe("تجديد الإقامة");
  });
  it("ignores hamza/ta-marbuta differences", () => {
    expect(smartSearch("شقه", items)[0]?.title).toBe("شقة 3 غرف للإيجار");
  });
  it("tolerates a typo", () => {
    expect(smartSearch("بوربونت", items)[0]?.title).toBe("تصميم عروض بوربوينت");
  });
  it("returns nothing for unrelated text", () => {
    expect(smartSearch("سيارة", items)).toHaveLength(0);
  });
});
