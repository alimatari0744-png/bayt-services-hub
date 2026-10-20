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
