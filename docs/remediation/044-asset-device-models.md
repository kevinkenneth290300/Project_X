# Issue #44 part 2: Asset and device models

Tracking: [#44](https://github.com/kevinkenneth290300/Project_X/issues/44), [#14](https://github.com/kevinkenneth290300/Project_X/issues/14), parent [#23](https://github.com/kevinkenneth290300/Project_X/issues/23). Gate 1 T1.3 is stacked on site/group PR #59. Use `Refs`, not an automatic closure: agents, real inventory/backend and verification on main remain separate.

## Model and source changes

Removed runtime `MOCK_ASSETS` / `MOCK_NETWORK_DEVICES` and direct seeded view state. With no authorised inventory source, asset/device readers return shared unconfigured states, not a fixture or a successfully discovered zero. Registration/Add Device is disabled with a factual reason; no form closes as if persistence occurred.

Runtime records use one canonical field set: Asset `assetType`, `mac`, `osFirmware`; NetworkDevice `deviceType`, `mac`, `firmware`. Classification reference values are retained as typed constants. Boundary normalizers accept the explicitly supported legacy type/MAC/OS aliases, reject conflicts or unsupported types, remove aliases from output and preserve exact identifiers and independent copies. Optional fields are `-` when unknown. Invalid/duplicate records produce visible error state instead of being hidden or merged.

Ready record browsing supports canonical MAC/name search, type filtering, exact site/zone display filters and read-only inspection. Changing identity/scope hides obsolete list responses and inspectors. Client filters remain display-only; real authorization belongs to the future server.

## Identity and overlap

A network device may be represented as an asset with specialised network metadata. That relationship must be supplied by a real authoritative source through stable IDs or explicit `relatedAssetIds`; names, IPs and labels are not merge keys. The duplicate fixture identities OT-FW-01/CORE-SW-01 were not carried into any new store. No persisted record, relationship or customer data was deleted or merged by this slice.

Telemetry-source/SNMP fixture content remains for T1.6. Agent fixtures remain for T1.4. This is not a complete production fixture guard or real inventory/discovery implementation.

## Reproduced evidence and local gates

The old asset-render/MAC-search crash prediction was disproved on this stack by a canonical test-only record: T0.1 already supplied guards. Separate tests reproduced wrong device filtering (`type` instead of `deviceType`), seeded service results and actionable no-op Add Device. They pass after cleanup.

Fresh isolated Windows x64 / Node 24.22.2 verification on 2026-11-07:

- `npm ci`: pass, 180 packages, zero reported audit vulnerabilities.
- `npm run lint`: pass, strict TypeScript with no type escapes.
- `npm test`: pass, 127 tests in 14 files, none failed or pending.
- `npm run build`: pass, 573.82 kB / 136.79 kB gzip JavaScript chunk; existing >500 kB warning retained.
- Sixteen focused regressions cover canonical/legacy records, conflicting aliases, optional fields, expected source conditions, duplicate IDs, exact scope and obsolete inspection state.

Synthetic records live only in the existing test-only inventory builders. No tests were removed or skipped. Hosted CI: not run (owner decision). Native Linux/browser/e2e results are not established here; Playwright harness is scheduled later. No workflow or credential configuration changed.

## Rollback and remaining work

The owner merges the declared stack through #59 before this slice, checking each retargeting to main. #44/#14 remain open until their acceptance criteria and main integration are verified. Revert only this task's reviewed commits on a new branch and rerun local gates; never reset/delete storage or restore runtime sample inventories as a fallback. Collector source is unchanged.