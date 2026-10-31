# Issue #4: Unavailable endpoint-agent enrollment and remote controls

Tracking: [issue #4](https://github.com/kevinkenneth290300/Project_X/issues/4), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #3. The collector is read-only and unchanged.

## Root cause and fix

The enrollment dialog displayed an invented MSI command, enrollment key, and telemetry endpoint. Its service created a healthy agent with invented heartbeat/delivery counters. Restart and IR deployment mutated sample state as though real endpoints acknowledged work.

The installer command, key, endpoint, form submission, and success callback are removed. Enrollment is disabled in the fleet and any direct dialog route exposes an accessible unavailable state. Remote enrollment, restart, and IR deployment reject `OperationUnavailableError` without changing agent health, counters, or profiles. Missing targets fail explicitly. There is no existing restart UI caller; direct service calls are covered.

IR deployment is disabled in agent detail and its sample state is no longer called active endpoint collection. Channel display is derived from the canonical `collection` fixture field instead of nonexistent `channels`, allowing the real fixture detail view and disabled controls to render. No live channel rate, endpoint spool location, or TLS fingerprint is invented.

## Checks and limitations

```sh
npm test -- src/__tests__/agentOperationSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit checks cover each service action and unchanged records/counters/profiles. Component/integration checks cover unavailable enrollment, no installer credentials or command, disabled fleet enrollment, real fixture detail rendering, and disabled IR deployment. Sample fleet metrics remain demonstration data; their explicit labeling is issue #6. Local IR profile-preview correctness is issue #12, not permission to enable remote deployment.

Local validation on 2026-11-01: 8 targeted tests passed across agent operation safety and persistent navigation. `npm run build` passed. Correcting canonical channel rendering reduced remaining baseline type errors from 22 to 21; no new errors or suppressions. Remaining model errors are tracked under #11. The existing bundle-size warning remains.

Real endpoint-agent enrollment/control requires a separately reviewed installer, authenticated identity, authorized site binding, durable command workflow, and tested endpoint acknowledgements. Collector identity/ingestion in issues #18 through #21 is not an endpoint-agent installer. Merge prerequisite PRs to main, retarget this issue PR to main, and review it independently; never merge into its prerequisite branch or claim production agent support.