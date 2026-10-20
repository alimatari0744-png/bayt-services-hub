import { describe, expect, it, vi } from "vitest";
import { isChunkLoadError, recoverChunkLoad } from "./chunk-recovery";

describe("stale page module recovery", () => {
  const error = new TypeError("Failed to fetch dynamically imported module: /assets/general-old.js");
  it("recognizes the reported lazy page failure, not ordinary fetch failures", () => {
    expect(isChunkLoadError(error)).toBe(true);
    expect(isChunkLoadError(new TypeError("Failed to fetch"))).toBe(false);
  });
  it("reloads once and suppresses consecutive reloads", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    const reload = vi.fn();
    expect(recoverChunkLoad(error, storage, reload, 100000)).toBe(true);
    expect(recoverChunkLoad(error, storage, reload, 100001)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });
  it("does not reload when retry storage is unavailable", () => {
    const reload = vi.fn();
    const storage = { getItem: () => { throw new Error("blocked"); }, setItem: vi.fn() };
    expect(recoverChunkLoad(error, storage, reload)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});