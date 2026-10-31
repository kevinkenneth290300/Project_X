# Issue #5: Unevaluated sample detection definitions

Tracking: [issue #5](https://github.com/kevinkenneth290300/Project_X/issues/5), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #4. Collector code is unchanged.

## Root cause and changes

Editor/detail timers generated successful validation and a fixed historical match. Locally created definitions were marked active with invented confidence and host impact, and deployment toggles activated fixtures without a detection engine.

Validation, historical backtesting, and deployment controls are disabled with accessible unavailable explanations. Their timer handlers/results are removed. Deployment service calls reject typed unavailable errors. All fixture definitions are disabled samples. New local definitions require a name and logic, use unique IDs, and have no evaluation confidence, triggers, affected hosts, or matched events. Saving a sample definition does not validate, deploy, or activate a real rule.

List/editor/detail text identifies sample-only definitions. The detail view removes invented auto-investigation and engine claims; it inspects only explicit sample event references, never a hard-coded trigger record. Missing IDs remain not found. No real detection engine was added.

## Checks and limitations

```sh
npm test -- src/__tests__/detectionSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit checks cover unevaluated creation, distinct IDs, ignored fabricated runtime claims, disabled fixture state, rejected deployment, and invalid input. Component/integration checks cover local sample saving, unavailable validation/backtest/deployment, no network request or successful evaluation message, sample labeling, and not-found behavior.

Local validation on 2026-11-01: 9 targeted detection-safety/navigation tests passed; `npm run build` passed. `npm run lint` reports the same 21 remaining baseline model errors tracked under #11, with no new errors or suppressions. The existing bundle-size warning remains.

Definitions remain browser-local demonstrations, lost on refresh and not shared between processes. Historical fixture numbers are labeled sample data, not new evaluation results. Production detection requires a separately reviewed engine design, parser semantics, scoped data authorization, deterministic evaluations, versioned rule deployment, and genuine acknowledgements. This issue does not enable that engine or claim detection readiness. Merge prerequisites to main, retarget this PR to main, and review it independently.