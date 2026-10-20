<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Services data lives in Cloud tables `services` (section enum + free-text category) and `requests`; admin rights come from `user_roles` via `has_role`, and the first account to sign up becomes admin — keeps setup zero-config for the owner.
- Service images are in a private `service-images` bucket and shown via signed URLs (`useImageUrl`) because the workspace blocks public buckets.
- Smart search is client-side in `src/lib/search.ts` (Arabic normalization + typo tolerance); keep its tests passing.
- Property classifications live in the public-read/admin-write property_classifications table; services reference city/type/purpose IDs with kind validation and restricted deletion. Resolve IDs through the shared module for matching customer filters, preserving legacy category/subcategory data and inferred attributes. Sorting is a view choice based on price/date, never an assigned category.
- Public service details load active rows through a publishable-key server function; service-specific and general requests share RequestForm and the requests table, with null service_id for general requests.
- Prebundle dependencies used by lazy routes in Vite optimizeDeps.include so opening a new page does not rediscover dependencies and replace shared React chunks mid-session; preserve the base config's React deduplication.
- Recover stale deployment module failures via the shared browser chunk-recovery helper, with persisted retry throttling to prevent reload loops; handle both Vite preload failures and router-boundary import errors.
- Demo service photos are static files under `public/images/demo/` and services.image_url stores their site-relative URLs (`/images/demo/*.jpg`); useImageUrl serves `/images/` paths directly and treats everything else as a private `service-images` storage path. Keep repo images as real files, not CDN pointers, so the codebase stays deployable off Lovable.
- Self-hosting off Lovable (e.g. Vercel): build with `DEPLOY_PRESET=vercel` (vite.config.ts passes it as the nitro preset); Lovable builds don't set it and keep their own target. The backend stays on Lovable Cloud, so the hosting environment needs the SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / SUPABASE_PROJECT_ID (and VITE_ equivalents) values from `.env`.

- All public-site wording and images are editable rows in `public.site_content` (key/jsonb value, public read + admin-only write via `has_role`); components read defaults from `src/lib/site-content.ts` and must never hardcode copy that the owner should control.
- Admin sign-in is by phone number: `src/lib/phone-auth.ts` maps a Saudi number to one synthetic email, so auth stays email-based without a lookup table; admin rights always come from `public.user_roles` through `has_role`, never from browser state.
- All service specifications use the shared helper to serialize free text and title/content paragraphs in the existing specifications text column; parse legacy plain text and paragraph arrays without losing owner content.
- Generate call and WhatsApp destinations through the shared contact-links helper using recorded numbers, preserving explicit international codes and omitting invalid WhatsApp destinations.
