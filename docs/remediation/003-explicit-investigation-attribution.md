# Issue #3: Explicit investigation and evidence attribution

Tracking: [issue #3](https://github.com/kevinkenneth290300/Project_X/issues/3), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on the prior issue #2 branch. The collector remains unchanged.

## Root cause and changes

New cases were assigned a fixed event/evidence ID, fabricated analysis/confidence, and a graph independent of their requested host. A supposed evidence attachment wrote a note to a fixed case. Detail views fell back to unrelated sample records for missing IDs; notes could appear successful for missing cases.

New local cases now retain the requested host, use collision-resistant IDs, and start unassigned with no evidence, timeline events, findings, or analysis. Notes and status writes validate the target case; notes update only that case without mutating a previously read object. Missing IDs stay missing with explicit UI errors, and late read responses cannot replace a newly selected case.

Evidence linking remains disabled and cannot produce an attachment notification or note. Inspect navigation uses only explicit event-record references, never fixed-ID guesses. The unrelated sample relationship graph and hard-coded host IP/OS/enclave, digest, custody, and authenticated-ledger claims are removed. Existing fixture artifacts remain unverified samples; this is not an evidence backend.

## Regression checks

```sh
npm test -- src/__tests__/investigationAttribution.test.tsx src/__tests__/evidenceSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Coverage includes two hosts/cases, no fabricated evidence or analysis, correct note targeting and immutable reads, missing/invalid cases, case/event not-found states, disabled attachment, and stale-response cancellation during case navigation. Existing evidence/export containment tests remain required.

Local validation on 2026-11-01: 14 tests passed across attribution, evidence safety, and application navigation. The evidence-safety file also passed separately after changing unverified badges to caution colors. `npm run build` passed; correcting event/evidence detail model fields reduced remaining baseline type errors from 26 to 22. Those remaining errors are tracked under #11; no errors were suppressed. The existing bundle-size warning remains.

## Limitations and rollout

Case creation, notes, and status edits are local demonstrations. They are not authenticated, durable, shared across processes, or evidence custody records. Actual linking requires an authorized explicit case/event relationship and durable evidence workflow, not a note or client-side scope selector. Review and merge prerequisites to main, retarget this PR to main, and then merge this focused increment. Do not merge into a prerequisite branch or claim production forensic readiness.