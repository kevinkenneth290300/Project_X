# Issue #44 part 3: Agents and selected hosts

Tracking: [#44](https://github.com/kevinkenneth290300/Project_X/issues/44), [#16](https://github.com/kevinkenneth290300/Project_X/issues/16), retaining [#4](https://github.com/kevinkenneth290300/Project_X/issues/4) safety; parent [#23](https://github.com/kevinkenneth290300/Project_X/issues/23). Gate 1 T1.4 stacks on asset/device PR #60. Use `Refs`: real server access and post-merge acceptance remain unverified.

## Changes

Removed the agent fixture store and eager seeded-agent generator. No synthetic host/health/heartbeat is returned by agent readers; without an authorised source, lists/details return typed unconfigured states. Empty selections and confirmed missing reader results are distinct from an unavailable/unconfigured source. No `agent-042` or another-host fallback remains in the detail path.

Enrollment, restart and IR/profile deployment remain unavailable. The service returns an expected typed unavailable/empty state and no acknowledgement data; the UI cannot initiate these unsupported operations. The existing enrollment dialog still has no installer command, key or operational endpoint.

Agent detail reads only the selected ID, rejects a wrong returned identity or selected-scope mismatch, and requests events only for that supplied host. Navigation uses the consistent typed `hostFilter` key. `getEventsForHost` is a typed unconfigured source until real authorized access is published; it never falls back to the legacy sample event store, which remains for T1.11. A supplied event response for another host is a visible error, not silently shown/filtered.

The shared loader now supports a scope/identity key independently of entity ID, aborting and immediately hiding obsolete results even when the same ID remains selected. Ready fleet browsing uses exact display scope and typed metadata; it does not imply backend authorization. The adjacent dashboard adapts to the agent state contract: configured-empty can mean zero records, while unconfigured/unavailable counts are not presented as a measured zero. Other dashboard telemetry remains T1.5.

## Verification

Initial tests reproduced seeded fleet data, indefinite missing-ID behavior, fixed SERVER-42 queries and inconsistent host navigation with two distinct supplied hosts. Retained remote-operation and dashboard tests were adapted to explicit test-only records/state results, not skipped. A selected-scope mismatch regression exposed a further detail guard and now passes.

Fresh isolated Windows x64 / Node 24.22.2 results on 2026-11-07:

- `npm ci`: pass, 180 packages, zero reported audit vulnerabilities.
- `npm run lint`: pass, strict TypeScript, zero errors.
- `npm test`: pass, 140 tests in 15 files, none failed or pending.
- `npm run build`: pass, 550.98 kB / 133.53 kB gzip JS chunk; size warning retained.
- Focused agent/control and identity/scope regressions pass, including missing IDs, expected states, two hosts, wrong-host responses, same-ID identity changes and no remote acknowledgement.

Agent records are small test-only builders. The old seed array and eager generator were removed by a bounded TypeScript-parser rewrite that asserted exactly two top-level constructs; no other dataset was changed by that mechanical removal. Hosted CI: not run (owner decision). Native Linux and browser/e2e results are not established here; Playwright harness is scheduled later. No workflow or credential configuration changed.

## Remaining work and rollback

No real collector control, authorised event API, login, inventory persistence or discovery is implemented. The server must enforce scope; UI consistency checks are not security enforcement. Existing event/case/detection/health/notification/telemetry fixtures remain their scheduled Block A tasks, and the sample notice stays until T1.12. #44/#16 remain open for real access and verification on main.

Owner merges the declared stack through #60 before this slice, checking every retargeting/diff to main; Copilot does not merge/delete branches. Rollback is a separately reviewed revert of this task with local gates rerun, never a reset/deletion of customer data or protected worktrees. Do not restore runtime fixtures as error fallbacks. Collector source is unchanged.