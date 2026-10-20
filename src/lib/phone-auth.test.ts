import { describe, expect, it } from "vitest";
import { loginIdentity, normalizePhone } from "./phone-auth";

describe("Phone sign-in identity", () => {
  it("accepts the owner number written with a country code and spaces", () => expect(normalizePhone("+966 53 622 2494")).toBe("966536222494"));
  it("accepts the local zero-prefixed form", () => expect(normalizePhone("0536222494")).toBe("966536222494"));
  it("accepts the number without any prefix", () => expect(normalizePhone("536222494")).toBe("966536222494"));
  it("accepts Arabic-Indic digits", () => expect(normalizePhone("+٩٦٦٥٣٦٢٢٢٤٩٤")).toBe("966536222494"));
  it("rejects a number that is too short", () => expect(normalizePhone("053622")).toBeNull());
  it("maps the number to one stable account address", () => expect(loginIdentity("+966 53 622 2494")).toBe("966536222494@app.local"));
  it("passes a real email through unchanged", () => expect(loginIdentity("Owner@Example.com")).toBe("owner@example.com"));
  it("rejects text that is neither a number nor an email", () => expect(loginIdentity("مركز")).toBeNull());
});
