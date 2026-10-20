# Roadmap

## Done
- Removed map actions from browsing cards; mobile browser checks confirm property details retain the map beside the price and all sections show price before specifications without general/student location links.
- Price directly below service image before specifications; old information band removed, admin price labeled, visibility/keyword inputs removed, common English hints inferred from Arabic content (tests passed).
- Free Leaflet/OpenStreetMap property picker replaces coordinate inputs; manual point selection, device location, save/reopen, customer map URL and temporary-data cleanup verified through authenticated UI. Google Maps destination itself remains unverified.
- Automatically show an optional blank specification paragraph for new/edit forms, ignoring it when empty; property-only coordinate window, save/reopen and exact customer Google Maps destination verified. Google Maps itself remains unverified in the sandbox.
- Owner-managed city/type/purpose classifications shared by property editing and customer browsing; mobile navigation, creation, editing, assignment persistence, rename matching, restricted deletion and anonymous combined filtering verified.
- All three service sections support free-text specifications followed by + added title/content paragraphs displayed side by side; saving, reopening, public display, and mobile layout verified through the admin UI.
- Property specification title/content paragraphs with demo entries saved through the admin UI; refreshed RTL dropdowns; footer and request WhatsApp links and request call links verified.
- Added throttled recovery for stale deployment page modules that previously blanked navigation.
- Investigated login rejection (invalid credentials); removed public account-creation UI and distinguished connectivity errors.
- Property filters: city, type, purpose, sort (four dropdowns) on the real-estate page.
- No "تفاصيل الخدمة" button on cards; the whole card opens the service page.
- Comprehensive admin dashboard: overview, services CRUD, requests, site settings.
- Every public text and image editable from Settings (site_content table).
- Phone-number sign-in for the owner account; first account is admin.
- Images made portable: demo photos are real files in `public/images/demo/`, DB rows point to `/images/demo/*.jpg`, `useImageUrl` serves them directly.
- Self-hosting path added: `DEPLOY_PRESET=vercel` build switch in vite.config.ts + README deploy guide.

## Open
- Owner to replace demo contact details (email, address, opening hours) from Settings.
- Owner to select actual property locations on the map and validate Google Maps destinations on the deployed site.
- GitHub connection: settings → Git in the project.
- Owner deploys the GitHub copy on Vercel from their own account (agent has no access); verify the deployment's build there.
