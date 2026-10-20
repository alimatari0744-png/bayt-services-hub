// Smart Arabic search: normalizes letters, tolerates typos, matches partial hints.
import { ENGLISH_SEARCH_HINTS } from "./search-aliases";

export function normalizeArabic(input: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "") // tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/^ال/, "")
    .replace(/\sال/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n] ?? 0;
}

function tokenScore(q: string, word: string): number {
  if (!q || !word) return 0;
  if (word === q) return 10;
  if (word.startsWith(q)) return 7;
  if (word.includes(q)) return 5;
  if (q.length >= 3) {
    const d = levenshtein(q, word.slice(0, Math.max(q.length, Math.min(word.length, q.length + 1))));
    if (d <= (q.length >= 5 ? 2 : 1)) return 4;
  }
  return 0;
}

export interface Searchable {
  title: string;
  description?: string | null;
  category?: string | null;
  keywords?: string | null;
  location?: string | null;
}

export function scoreItem(query: string, item: Searchable): number {
  const q = normalizeArabic(query);
  if (!q) return 1;
  const fields: [string, number][] = [
    [item.title, 3],
    [item.keywords ?? "", 2.5],
    [item.category ?? "", 2],
    [item.description ?? "", 1],
    [item.location ?? "", 1],
  ];
  const qTokens = q.split(" ").filter(Boolean);
  let total = 0;
  for (const qt of qTokens) {
    const aliases = (ENGLISH_SEARCH_HINTS[qt] ?? []).map(normalizeArabic);
    let best = 0;
    for (const [text, weight] of fields) {
      for (const w of normalizeArabic(text).split(" ")) {
        best = Math.max(best, tokenScore(qt, w) * weight);
        // Aliases match exact concepts and their Arabic prefixes, not fuzzy unrelated words.
        for (const alias of aliases) {
          if (w === alias || w === `ل${alias}` || w === `لل${alias}`) best = Math.max(best, 10 * weight);
        }
      }
    }
    if (best === 0) return 0; // every hint must match something
    total += best;
  }
  return total;
}

export function smartSearch<T extends Searchable>(query: string, items: T[]): T[] {
  if (!normalizeArabic(query)) return items;
  return items
    .map((item) => ({ item, s: scoreItem(query, item) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.item);
}
