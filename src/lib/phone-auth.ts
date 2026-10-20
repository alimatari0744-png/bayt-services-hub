const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

// Owner accounts sign in with a phone number; auth needs an email, so each Saudi
// number maps deterministically to a synthetic address instead of a lookup table.
export function normalizePhone(input: string): string | null {
  const digits = input
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[^\d]/g, "")
    .replace(/^00/, "");
  if (/^966\d{9}$/.test(digits)) return digits;
  if (/^0?\d{9}$/.test(digits)) return `966${digits.replace(/^0/, "")}`;
  return null;
}

export function loginIdentity(input: string): string | null {
  const value = input.trim();
  if (value.includes("@")) return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? value.toLowerCase() : null;
  const phone = normalizePhone(value);
  return phone ? `${phone}@app.local` : null;
}
