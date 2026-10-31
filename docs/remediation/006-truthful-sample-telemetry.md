# Issue #6: Sample telemetry and unavailable live measurements

Tracking: [issue #6](https://github.com/kevinkenneth290300/Project_X/issues/6), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #5. The collector is unchanged.

## Root cause and changes

An empty interval was called live streaming. Health reported operational services, verified mTLS, listener ports, latency, and uptime without measurements. Dashboard and fleet summaries substituted hard-coded nonzero counts and successful connectivity/delivery metrics for missing data.

The no-op stream and its active/resume states are removed; streaming is disabled with an accessible unavailable explanation. Events are static sample records. Empty results display zero/no samples; load failures display unavailable rather than measured zero.

Live health and component service calls reject typed unavailable errors. A separate `getSampleHealthStatus` method supplies explicitly labeled resource illustrations, independent for each caller. Its pipeline/connectivity/latency/throughput/TLS states are unavailable, never operational or verified. The health view reloads samples only and distinguishes failed loading.

Dashboard/fleet counts derive from loaded sample records without invented nonzero fallbacks. Failed dashboard counts are unavailable. Unmeasured delivery, drops, queue, relay, listener, and port-uptime indicators are unknown/unavailable. Static charts, historical capture times, fixture site/agent status, and definition summaries are marked samples. No connected stream or active monitoring is implied.

## Regression checks

```sh
npm test -- src/__tests__/telemetryTruthfulness.test.tsx src/__tests__/demoNavigation.test.tsx src/__tests__/agentOperationSafety.test.tsx
npm run lint
npm run build
```

Tests cover no fake stream/timer/request, empty versus failed event loads, rejected live health, independent sample data, unavailable connectivity/crypto/latency states, empty and failed dashboard counts, and static chart labeling. Existing disabled agent-control and persistent-notice checks remain required.

Local validation on 2026-11-01: 18 targeted telemetry/health/count/navigation/agent-safety tests passed; `npm run build` passed. Full type checking remains at 21 verified baseline model errors tracked under #11, with no new errors or suppressions. The existing bundle-size warning remains.

## Limits and rollout

This is demo truthfulness, not a telemetry backend, working listener, endpoint monitoring, or server authorization. Site/zone correctness is issue #13; exact time/channel filters are issue #17; durable authenticated collector ingestion and authorized access are issues #18 through #21. Sampling a fixture does not measure a real system. Review and merge prerequisites to main, retarget this PR to main, then merge the increment independently.