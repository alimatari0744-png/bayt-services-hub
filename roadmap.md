# Roadmap

## Current
- Apply free-text specifications followed by optional inline title/content paragraphs to all services; verify saving and public display.

## Done
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
- Real map links for each property listing (needs the owner's actual URLs).
- GitHub connection: settings → Git in the project.
- Owner deploys the GitHub copy on Vercel from their own account (agent has no access); verify the deployment's build there.
