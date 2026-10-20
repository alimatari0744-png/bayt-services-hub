import { describe, it, expect } from "vitest";
import { smartSearch } from "./search";

const items = [
  { title: "تجديد الإقامة", keywords: "جوازات", category: "حكومية" },
  { title: "شقة 3 غرف للإيجار", keywords: "سكن", category: "شقق" },
  { title: "تصميم عروض بوربوينت", keywords: "باوربوينت", category: "عروض تقديمية" },
];

describe("smartSearch", () => {
  it("matches a partial hint", () => {
    expect(smartSearch("اقام", items)[0].title).toBe("تجديد الإقامة");
  });
  it("ignores hamza/ta-marbuta differences", () => {
    expect(smartSearch("شقه", items)[0].title).toBe("شقة 3 غرف للإيجار");
  });
  it("tolerates a typo", () => {
    expect(smartSearch("بوربونت", items)[0].title).toBe("تصميم عروض بوربوينت");
  });
  it("returns nothing for unrelated text", () => {
    expect(smartSearch("سيارة", items)).toHaveLength(0);
  });
});
