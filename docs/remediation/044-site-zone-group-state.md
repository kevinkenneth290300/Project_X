# Issue #44 part 1: Sites, zones and groups

Tracking: [#44](https://github.com/kevinkenneth290300/Project_X/issues/44), parent [#23](https://github.com/kevinkenneth290300/Project_X/issues/23), retaining [#9](https://github.com/kevinkenneth290300/Project_X/issues/9) safeguards. Gate 1 T1.2 is stacked on the #38 foundation PR #58. Use `Refs #44`; assets/devices and agents are subsequent parts of the same inventory requirement.

## Changes

Removed runtime `MOCK_SITES` / `MOCK_GROUPS` exports and their seeded/transient store. Site, zone, group and detail readers now return shared typed data states; without an authorised inventory API they return unconfigured, never a fixture or a successfully monitored zero. Local site/zone/group creation is unavailable and disabled with factual explanations; no browser-only record is saved or discarded as if persisted.

List/detail views reuse `DataStateView` and the scoped loader. Ready records can be browsed and filtered without another-site fallback. Exact-ID lookup rejects ambiguous IDs and returns independent copies. Zone checks reject cross-site/forged-parent ownership and unsupported reference values without storing them. Detail rejects a mismatched returned site or malformed zones visibly instead of quietly filtering bad records. Zone selection uses one atomic site/zone update.

The shared scope key includes principal, organisation, display filters and available site/zone grants, so identity/scope changes retire old loader results. These are display checks, not server authorization. The dashboard's unused fixture import is removed and its unknown site total is `-`; broader dashboard telemetry remains T1.5.

## Tests and verification

Synthetic inventory builders live only in `src/test/fixtures/inventory.ts`. The former local-store site tests were migrated, not skipped: distinct/newly supplied IDs, missing IDs, exact matches, cross-site/all-zone/parent rejection, independent copies, duplicate identifiers, bad zone metadata, navigation and scope changes remain covered. Creation tests now prove unavailable behavior rather than generating transient objects.

Fresh local Windows x64 / Node 24.22.2 verification on 2026-11-07:

- `npm ci`: pass, 180 packages, zero reported audit vulnerabilities.
- `npm run lint`: pass, strict TypeScript, zero errors.
- `npm test`: pass, 111 tests in 13 files, none failed or pending.
- `npm run build`: pass; JavaScript chunk 611.57 kB / 142.77 kB gzip, existing >500 kB warning retained.
- Focused tests first reproduced runtime seeds, pretend creation, the unconfigured/missing-detail mismatch, and an unknown optional group count. They pass after their local fixes.

Hosted CI: not run (owner decision). Native Linux/browser/e2e validation is not established here; the Playwright harness is scheduled later. No workflow or credential configuration is changed.

## Limits, stack and rollback

No real inventory, discovery, persistence, authentication or authorization API is implemented by this slice. The server must provide authorized context/records in its separately reviewed work. Other asset/device/agent and operational fixtures remain in the later Block A tasks; the sample notice is retained until T1.12. Real customer data and collector source are untouched.

Owner merge order is PR #56, #57, #58, then this slice, verifying each retargeting/diff to main. #44 remains open until all inventory parts and acceptance on main are verified. Rollback is a separately reviewed revert of this slice with local gates rerun; do not reset/delete a database or worktree, or restore runtime fixtures as an error fallback.