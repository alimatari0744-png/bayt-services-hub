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
- Property browsing uses the shared property-browsing module for city/type/purpose filtering and numeric price/newest sorting; keep existing category/subcategory storage compatible with administration and derive legacy listing attributes without inventing owner data. Demo city options remain separate from future owner-managed city storage.
- Public service details load active rows through a publishable-key server function; service-specific and general requests share RequestForm and the requests table, with null service_id for general requests.
- Prebundle dependencies used by lazy routes in Vite optimizeDeps.include so opening a new page does not rediscover dependencies and replace shared React chunks mid-session; preserve the base config's React deduplication.
- Demo service photos use CDN asset pointers and store their served URLs in services.image_url; useImageUrl supports those paths alongside owner-uploaded private storage paths.

- All public-site wording and images are editable rows in `public.site_content` (key/jsonb value, public read + admin-only write via `has_role`); components read defaults from `src/lib/site-content.ts` and must never hardcode copy that the owner should control.
- Admin sign-in is by phone number: `src/lib/phone-auth.ts` maps a Saudi number to one synthetic email, so auth stays email-based without a lookup table; admin rights always come from `public.user_roles` through `has_role`, never from browser state.
