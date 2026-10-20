# Roadmap

## Done
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
