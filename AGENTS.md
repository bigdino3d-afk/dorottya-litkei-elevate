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

## Project rules
- Workshop hub: public landing pages read only through the `get_public_workshop_page` SQL function, which strips every workshop field not listed in `published_fields` — never give anon direct SELECT on `workshops`/`workshop_pages`, or unconfirmed dates/prices leak.
- Marketing-kit files live in the private `workshop-assets` bucket (public buckets are blocked in this workspace); public files are served via signed URLs allowed by the `is_public_asset_object` storage policy, restricted files only via the `openStudioKit` server function after token + hashed access code checks (`src/lib/studio-access.ts`, tested).
- Admin RLS policies call `public.has_role`; it must stay executable by `authenticated` or every admin write silently fails.
- Admin pages use `AdminShell` (`src/components/admin/AdminShell.tsx`) for the admin gate and section tabs.
- Artwork for studios is rendered client-side on canvas (`src/lib/artwork.ts`) from bundled photos; studio logos never leave the browser.
- Tests: `bunx vitest run --config vitest.config.ts` (tests live next to code in `src/lib`, never under `src/routes`).
