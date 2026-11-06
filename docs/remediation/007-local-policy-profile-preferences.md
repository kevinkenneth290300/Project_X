# Issue #7: Local preferences, unavailable policy/profile deployment

Tracking: [issue #7](https://github.com/kevinkenneth290300/Project_X/issues/7), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #6. The collector remains unchanged.

## Root cause and changes

Local state/timers claimed fleet policy synchronization, rolling profile deployment, valid XPath, and air-gap compliance. The profile view also read nonexistent YAML and inconsistent channel fields, so operators could not reliably inspect a real fixture profile.

Policy/profile deployment and XPath validation are disabled with accessible unavailable explanations; fake handlers/notifications are removed. Air-gap, TLS, retention, and spool preferences are local samples, not enforced/applied settings. No checkbox implements network isolation or cryptographic policy.

Profile service reads/copies supply independent local drafts with no fabricated deployed fleet. Copies have unique IDs and do not mutate their source. Channels and enabled definition event IDs use canonical model helpers. Detail shows sample JSON, not a validated executable YAML/agent deployment specification, and copying succeeds only after clipboard acknowledgement. Missing profiles remain not found. Sample change history is not a durable or authenticated audit ledger.

## Regression and release checks

```sh
npm test -- src/__tests__/policyProfileSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit checks cover draft-only profile status, independent copies, missing targets, and canonical definition/channel fields. Component/integration checks cover non-enforcing local preference edits, unavailable application/deployment/validation, real fixture rendering, not-found profiles, and failed clipboard access without false success.

The sample profile list also uses those canonical helpers, no longer claims deployment percentages, and supports keyboard inspection of the selected ID. Its misleading new-profile entry point is unavailable rather than opening a different existing profile. Empty and failed sample-list loads are distinct. Stubbed browser globals are automatically restored between tests.

Local validation on 2026-11-01: 12 targeted policy/profile/navigation checks and all 55 current regressions in 8 test files passed. `npm run build` passed. Canonical profile corrections reduced remaining baseline type errors from 21 to 13 in integrations, site detail, and syslog, tracked under #11; no errors were suppressed. The existing bundle-size warning remains.

## Management boundary

Real applied policy needs authenticated/authorized management, versioned configuration, an implemented endpoint control path, durable acknowledgements, and recovery/reconciliation. Core collector ingestion does not implement those controls. Air-gap isolation requires deployment/network egress controls; removing external fonts is issue #10, not proof of an enforced air gap. Review prerequisites to main, retarget this issue PR to main, and merge independently without production management claims.