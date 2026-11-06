# Issue #1: Truthful demonstration and evidence status

- Tracking: [issue #1](https://github.com/kevinkenneth290300/Project_X/issues/1), [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23).
- Priority: P0. Milestone: M0 - Truthful prototype safety.
- Scope: safety containment in Project_X only. The collector is unchanged.

## Root cause

Fixture artifacts were assigned constant or fallback hashes and marked verified. The investigation download contained a constant digest and a preservation-standard claim, neither backed by verification. The application shell did not distinguish sample data from live operations.

## Changes

The shell now retains an accessible, non-dismissible demonstration notice across views. Evidence rows have no invented digest and are unverified, including unknown IDs and empty results. Verification and custody remain unavailable. The misleading export handler was removed and its button is disabled with an accessible explanation; no package or successful digest notification can be produced.

This fix does not implement immutable storage, authenticated users, tenant isolation, custody records, or real evidence export. Those requirements belong to issues #18 through #22. Sample records and other mock controls are not production capabilities.

## Regression checks

```sh
npm ci
npm test -- src/__tests__/evidenceSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

The component tests cover fixture, empty, and unknown evidence states, disabled download behavior, and persistent notice through application navigation. Type checking and build must be reported independently; pre-existing blockers must not be suppressed to claim a passing release.

### Local validation, 2026-11-01

- Runtime: checksum-verified portable Node 24.22.2; no system-wide runtime change.
- Focused tests: 2 files, 5 tests passed using `node node_modules/vitest/vitest.mjs run` with the two paths above.
- Build: passed using `node node_modules/vite/bin/vite.js build`; the existing large-bundle warning remains.
- Type check: blocked by 26 existing model mismatches in 8 views, tracked by issue #11. No errors were suppressed. The affected views are agent detail, collection profile list/detail, event detail, integrations, investigation detail, site detail, and syslog.
- Dependency installation audit: zero reported vulnerabilities. A lockfile is included so subsequent clean checkouts can use `npm ci`.

## Review and rollout

Review the focused issue branch, run the checks in an isolated checkout, and merge through its pull request. This is a demo-safety change, not a production readiness declaration. Returning to an earlier commit restores unsafe claims and is not a recommended operational rollback.