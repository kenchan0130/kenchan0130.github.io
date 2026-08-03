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
- Required status checks: `validate`, `dependency-review`
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
- GitHub Actions are pinned to full commit SHAs with the exact release in comments.
- Automatic merge is not enabled.

## Dashboard-only configuration

- Google AdSense Privacy & Messaging handles consent where required. The site does not implement a
  custom cookie banner.
- GA4 uses measurement ID `G-B7RX34Q5PL`.
- AdSense uses publisher ID `ca-pub-2444060431947599` and one manual responsive article slot.
