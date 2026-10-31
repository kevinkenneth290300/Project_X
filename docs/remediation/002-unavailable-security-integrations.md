# Issue #2: Unavailable security and integration operations

Tracking: [issue #2](https://github.com/kevinkenneth290300/Project_X/issues/2), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #1's test harness and notice. Collector code is unchanged.

## Root cause and fix

Settings timers reported collector synchronization and verified TLS/LDAP bind results. Integration tests returned success with random latency, and toggles marked exporters connected/delivered without a request.

Those handlers and success notifications are removed. Security/deployment and exporter controls are disabled with accessible unavailable explanations. Sample fields remain locally editable, but no changes are deployed, authentication/MFA is not enforced, and no TLS/PKI or delivery result is claimed. Integration service methods reject a typed `OperationUnavailableError` without mutating sample state or sending a network request. Unknown integration IDs fail explicitly.

## Regression and release checks

```sh
npm test -- src/__tests__/operationSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit checks cover rejected operations, missing IDs, no network request, and unchanged exporter state. Component/integration checks cover disabled controls, accessible explanations, local sample editing, and absence of fabricated success. Full type-check baseline failures are tracked under #11 and must not be suppressed.

Local validation on 2026-11-01: 6 targeted tests passed across operation safety and application navigation; `npm run build` passed. `npm run lint` reports the same 26 verified baseline model errors, with no new errors. The existing large-bundle warning remains.

## Future boundary and rollout

Enable an operational control only after an authenticated, authorized backend implements it and returns a tested acknowledgement. A feature flag, timer, local state update, or mock result is not an acknowledgement. Collector ingress and identity follow issues #18 through #21; production identity providers/MFA/PKI need their own verified integrations. Review after PR #24 and merge the prerequisite first. This increment is demo containment, not production security implementation.