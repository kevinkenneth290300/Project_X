# Issue #38: Core identity and data states

Tracking: [#38](https://github.com/kevinkenneth290300/Project_X/issues/38), parent [#23](https://github.com/kevinkenneth290300/Project_X/issues/23). Gate 1 task T1.1 is stacked on template cleanup PR #57 while Gate 0 remains unmerged. Use `Refs #38`; this foundation does not implement the server/session or all runtime-data removal criteria.

## Changes and trust boundary

Removed the seeded organisation and site collection from ScopeContext. The provider starts unconfigured and exposes no person or sites unless an explicit authorised display context is supplied. App supplies none because there is no session/backend implementation yet. Test-only providers inject synthetic contexts; no runtime fixture fallback is used by the provider. Browser scope remains a display filter, never an authorization boundary or proof of a real login.

Identity and available-scope changes invalidate the provider's selected scope. Unknown sites and cross-site zones cannot be selected or assigned another site's name. The header shows `Not signed in` and `No scope configured` by default, with compact accessible state announcements. No user, email, or analyst role is invented.

All six initial drilldown IDs are null. Navigating to a detail route without an explicit ID clears its prior selection and renders `Nothing selected` with a route back to the list. Existing missing-ID service/view protections remain; no fallback entity is selected.

## Shared state contract

`DataState<Data>` distinguishes ready data from empty, unconfigured, unavailable, unauthenticated, forbidden, error and loading conditions. Only ready states carry data. `recordsState([])` is configured-empty, not an unconfigured source or measured health value. `DataStateView` announces factual states and exposes a next action only when supplied; its compact variant fits the existing fixed-height toolbar.

`useDataState` passes an AbortSignal and an identity/scope key to a stable loader, aborts obsolete requests, ignores late results, and immediately hides a snapshot whose key or loader changed. Expected conditions are returned as typed states; unexpected exceptions become a generic error without private source details. Later inventory tasks reuse these abstractions rather than inventing per-view empty states.

## Verification

Fresh isolated Windows x64 worktree, Node 24.22.2, 2026-11-07:

- `npm ci`: pass, 180 packages, zero reported audit vulnerabilities.
- `npm run lint`: pass, strict TypeScript.
- `npm test`: pass, 99 tests in 12 files, none failed or skipped.
- `npm run build`: pass; existing >500 kB chunk warning remains (663.66 kB JavaScript).
- Fourteen new state/identity tests cover fresh context, ready/empty distinctions, denied/failed/loading states, supplied context and revocation, missing selection, scope-change cancellation and ignored late responses.

The initial fresh-scope/user/selection checks failed against their seeded baselines. Two existing site-navigation tests then exposed reliance on implicit demo identity; they now use an explicit test-only authorised context without removing their assertions or restoring runtime defaults.

Hosted CI: not run (owner decision). Native Linux and browser/e2e verification are not established here; the Playwright harness is scheduled later. No workflow or credential configuration is changed.

## Remaining scope and rollback

The sample notice, ticker/notifications, site/asset/agent datasets and other operational fixtures remain until their scheduled Block A tasks. Server authentication/authorization and real configuration are not implemented by a provider prop or state label. #38 remains open pending its full acceptance review on main; #13/#35 reconciliation remains separate work.

The owner merges the declared stack bottom-up, verifying each retargeting to main. Roll back only this task's reviewed commits through a new revert branch and rerun local gates; do not reset or delete a worktree, branch, database or real customer data. Collector source is unchanged.