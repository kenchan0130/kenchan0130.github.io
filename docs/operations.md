# Operations

## GitHub repository settings

The workflows assume the following repository settings. These settings are intentionally not
changed by repository code.

### GitHub Pages

- Source: GitHub Actions
- Production branch: `main`
- Custom domain: none

### Ruleset for `main`

- Require a pull request before merging
- Required status checks: `quality`, `build-test`, `dependency-review`
- Required approvals: 0 (single-maintainer repository)
- Block force pushes
- Block branch deletion
- Allow administrator bypass for emergency recovery

The repository-level Actions allowlist is left unchanged.

## Cutover

1. Open the migration as a draft pull request and confirm the Pages artifact.
2. Confirm all internal article links use `/post/YYYY-MM-DD-N`.
3. Create the rollback tag immediately before merging:

   ```sh
   git tag pre-astro-migration
   git push origin pre-astro-migration
   ```

4. Merge to `main` and verify the Pages deployment.
5. Check the homepage, one image-heavy article, search, archives, RSS, OGP, GA4, and the manual
   AdSense slot.

Rollback is performed by redeploying the `pre-astro-migration` commit. The old URL redirects are
not retained.

## Dependency policy

- Every direct dependency uses an exact version.
- pnpm rejects packages published within the last seven days.
- Dependabot opens weekly grouped minor/patch updates; major updates remain separate.
- Security updates are reviewed and merged manually.
- Pull requests use the required `dependency-review` check to block newly introduced high-severity
  vulnerabilities. The separate `Dependency audit` workflow checks the full dependency tree at
  high severity every Wednesday at 00:00 UTC and can also be run manually. Its findings are
  tracked independently of the required `quality` check so existing advisories do not skip
  formatting, lint, and type checks on unrelated pull requests.
- `pnpm.auditConfig.ignoreGhsas` lists advisories that have no patched release and do not affect
  this static site. Remove each entry once a fixed version is available.
  - `GHSA-ch52-4w7c-c8xp` (`http-cache-semantics` via `astro`): Astro uses it only for the
    build-time remote image cache. The site is served as static files without a shared HTTP cache.
- GitHub Actions are pinned to full commit SHAs with the exact release in comments.
- Automatic merge is not enabled.

## D2 diagram assets

- D2 diagrams are rendered at build time with D2.js (`astro-d2` with `experimental.useD2js`), so
  the D2 binary is not required locally or in CI.
- `src/assets/fonts/d2` contains Noto Sans JP subsets used for text measurement and embedding.
  They are generated from `ofl/notosansjp/NotoSansJP[wght].ttf` in `google/fonts` at commit
  `66a36c8c94b1a5d992ee4e7f392fccfe4945767c` with `scripts/build-d2-fonts.py` (requires
  `fonttools`). The license is kept in `OFL.txt`.
- `src/assets/d2-icons` contains icons copied from `lucide-static` v1.51.0. Add icons from the same
  version and keep the license file when adding new ones.

## Dashboard-only configuration

- Google AdSense Privacy & Messaging handles consent where required. The site does not implement a
  custom cookie banner.
- GA4 uses measurement ID `G-B7RX34Q5PL`.
- AdSense uses publisher ID `ca-pub-2444060431947599` and one manual responsive article slot.
