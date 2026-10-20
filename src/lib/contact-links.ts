import { normalizePhone } from "./phone-auth";

export function contactLinks(value: string) {
  const normalized = normalizePhone(value);
  const digits = value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/\D/g, "");
  const international = value.trim().startsWith("+") || digits.startsWith("00");
  const number = international ? digits.replace(/^00/, "") : normalized;
  const valid = number && /^\d{8,15}$/.test(number) ? number : null;
  return { call: `tel:${valid ? `+${valid}` : value}`, whatsapp: valid ? `https://wa.me/${valid}` : null };
}