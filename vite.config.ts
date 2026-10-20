// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as the default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Self-hosting off Lovable (e.g. Vercel): build with DEPLOY_PRESET=vercel to
  // switch the nitro output preset. Lovable builds don't set it and keep their
  // own target, so preview/publish behavior is unchanged.
  nitro: process.env.DEPLOY_PRESET ? { preset: process.env.DEPLOY_PRESET } : undefined,
  vite: {
    optimizeDeps: {
      // Prebundle lazy-route dependencies together. Discovering them only after
      // navigation can replace the shared React chunks while an old page is open.
      include: [
        "@tanstack/react-query",
        "@supabase/supabase-js",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "lucide-react",
        "sonner",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "zod",
      ],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
