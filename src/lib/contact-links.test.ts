import { describe, expect, it } from "vitest";
import { contactLinks } from "./contact-links";

describe("recorded contact links", () => {
  it("uses the configured contact number for WhatsApp and calls", () => {
    expect(contactLinks("+966 53 622 2494")).toEqual({call:"tel:+966536222494",whatsapp:"https://wa.me/966536222494"});
  });
  it("uses a requester's local Saudi number and Arabic digits", () => {
    expect(contactLinks("٠٥٣٦٢٢٢٤٩٤").whatsapp).toBe("https://wa.me/966536222494");
  });
  it("keeps explicit non-Saudi country codes", () => {
    expect(contactLinks("+44 7700 900123").whatsapp).toBe("https://wa.me/447700900123");
  });
  it("never invents a WhatsApp number for invalid input", () => {
    expect(contactLinks("123").whatsapp).toBeNull();
  });
});