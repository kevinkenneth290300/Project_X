# Issue #9: Shared local site/zone records and explicit ownership

Tracking: [issue #9](https://github.com/kevinkenneth290300/Project_X/issues/9), P1, M1 - Prototype correctness and quality; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #8. Collector code is unchanged.

## Root cause and behavior

New sites/zones existed only in individual views, while details/scope read fixtures. Unknown IDs could match a partial name or fall back to Chennai. Asset creation supplied a hard-coded Chennai site/zone when scope was global.

Site service now owns one transient local store with stable snapshots/subscriptions and immutable updates. Site list/detail and scope consumers share it through `useSyncExternalStore`. New IDs are unique, lookups are exact, and missing sites stay not found. Returned service records are independent copies. New sites/zones have empty inventory and unavailable/unknown connectivity/health rather than invented devices, certificates, collector endpoints, or measurements.

Zone creation requires an existing parent site. Explicit ownership/parent-zone checks reject cross-site data. Zone selection for entity registration must be a concrete zone owned by its site; `all` is not an entity location. The canonical zone type/security-class values replace invalid literals.

Asset registration is intentionally unavailable until a shared authoritative asset registry exists, as permitted by this issue's acceptance criteria. Its previous Chennai/default-zone writes and fabricated discovery/health/telemetry record are removed. Inventory browsing/model rendering is handled separately in #14; its existing render defect currently blocks an executable asset-control UI check, so that follow-up must validate the disabled control against real fixtures. No cross-site asset is created as a fallback.

## Checks

```sh
npm test -- src/__tests__/siteZoneState.test.tsx src/__tests__/telemetryTruthfulness.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit cases cover two new sites, exact new/missing IDs, empty truthful records, duplicate codes, cross-site/parent-zone rejection, stable subscription snapshots, and independent returned copies. Integration cases cover real form creation, list-to-detail navigation, new zones shared with other consumers, not-found states, and mounted scope subscribers.

Nested snapshots are frozen to prevent accidental mutation without notification; ordinary service reads return independent copies. Invalid zone types/security classes are rejected and valid parent references are retained. Local validation on 2026-11-01: 20 targeted site/zone/telemetry/navigation checks and all 80 current tests in 10 files passed; the 9-test site workflow also passed after nested snapshot hardening. `npm run build` passed. Remaining baseline type errors dropped from 4 to 2 in integrations, tracked under #11. No errors were suppressed; the existing bundle-size warning remains. Asset-control rendering validation remains blocked until #14.

## Limits and rollout

This is explicitly non-persistent local demo state: shared within one browser session, lost on refresh, not cross-process, authenticated, or a server authorization boundary. No industrial site, collector, certificate, device, or enforced policy is provisioned. Actual management persistence requires a separate reviewed backend. Review/merge prerequisite PRs to main, retarget this PR to main, and merge independently. Site/zone display-filter correctness is issue #13; inventory model/rendering is issue #14.