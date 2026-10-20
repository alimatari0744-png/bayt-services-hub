const RETRY_KEY = "site:chunk-recovery";
const RETRY_WINDOW_MS = 60_000;

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .+ failed|Unable to preload CSS/i.test(message);
}

export function recoverChunkLoad(
  error: unknown,
  storage: Pick<Storage, "getItem" | "setItem">,
  reload: () => void,
  now = Date.now(),
): boolean {
  if (!isChunkLoadError(error)) return false;
  try {
    const previous = storage.getItem(RETRY_KEY);
    if (previous && now - Number(previous) < RETRY_WINDOW_MS) return false;
    storage.setItem(RETRY_KEY, String(now));
  } catch {
    // Without persistent retry tracking, do not risk a reload loop.
    return false;
  }
  reload();
  return true;
}

export function recoverBrowserChunk(error: unknown): boolean {
  if (typeof window === "undefined" || !navigator.onLine) return false;
  try {
    return recoverChunkLoad(error, window.sessionStorage, () => window.location.reload());
  } catch {
    return false;
  }
}

export function installChunkRecovery(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("vite:preloadError", (event) => {
    const payload = (event as Event & { payload?: unknown }).payload;
    if (recoverBrowserChunk(payload)) event.preventDefault();
  });
}