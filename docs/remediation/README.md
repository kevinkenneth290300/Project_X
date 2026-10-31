# Core stabilization delivery plan

Tracking source: [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). The existing 22 issues, priority labels, and four milestones are reused; this plan does not create duplicates. GitHub is authoritative for current issue and PR status.

## Delivery rules

Work only in Project_X. The separate collector is a read-only contract reference and must not be modified or released by this work. Keep a focused branch, conventional commit, regression tests, and a root-cause/change/validation document for each issue. Do not push directly to main or merge PRs automatically.

Priority order is P0 containment, prototype correctness and reproducible quality, authenticated telemetry, then offline/platform readiness. A prerequisite may be delivered first when needed to verify an otherwise higher-priority change. Large backend work is split into contract, identity, durable ingestion, authorized reads, and verified export increments, not one unreviewable rewrite.

Sequential PRs may depend on the preceding unmerged branch. Such PRs must state their base dependency and merge order; retarget to main after the prerequisite merges. Review and merge the lowest dependency first. Do not treat a passing demo test suite as production release certification.

## Issue map

| Milestone | Priority | Issue | Increment |
| --- | --- | --- | --- |
| M0 - Truthful prototype safety | P0 | [#1](https://github.com/kevinkenneth290300/Project_X/issues/1) | Persistent demo notice; unavailable evidence integrity and export |
| M0 | P0 | [#2](https://github.com/kevinkenneth290300/Project_X/issues/2) | No simulated security or integration acknowledgements |
| M0 | P0 | [#3](https://github.com/kevinkenneth290300/Project_X/issues/3) | Explicit investigation/evidence attribution |
| M0 | P0 | [#4](https://github.com/kevinkenneth290300/Project_X/issues/4) | Disable nonexistent enrollment and remote operations |
| M0 | P0 | [#5](https://github.com/kevinkenneth290300/Project_X/issues/5) | No simulated rule validation or backtest success |
| M0 | P0 | [#6](https://github.com/kevinkenneth290300/Project_X/issues/6) | Sample telemetry and unavailable live streaming |
| M0 | P0 | [#7](https://github.com/kevinkenneth290300/Project_X/issues/7) | No policy/profile deployment claims |
| M0 | P0 | [#8](https://github.com/kevinkenneth290300/Project_X/issues/8) | No fabricated parser verification |
| M1 - Prototype correctness and quality | P1 | [#9](https://github.com/kevinkenneth290300/Project_X/issues/9) | Authoritative site/zone relationships and missing-entity errors |
| M1 | P1 | [#11](https://github.com/kevinkenneth290300/Project_X/issues/11) | Supported runtime, lockfile, portable scripts, strict types, tests, CI |
| M1 | P1 | [#12](https://github.com/kevinkenneth290300/Project_X/issues/12) | Restore the previous IR profile |
| M1 | P1 | [#13](https://github.com/kevinkenneth290300/Project_X/issues/13) | Consistent site/zone display scope |
| M1 | P1 | [#14](https://github.com/kevinkenneth290300/Project_X/issues/14) | Canonical asset/device models and safe filters |
| M1 | P1 | [#16](https://github.com/kevinkenneth290300/Project_X/issues/16) | Selected agent/host event attribution |
| M1 | P1 | [#17](https://github.com/kevinkenneth290300/Project_X/issues/17) | Exact time-range/channel filter semantics |
| M2 - Authenticated telemetry foundation | P1 | [#18](https://github.com/kevinkenneth290300/Project_X/issues/18) | Versioned collector contract and contract tests |
| M2 | P1 | [#20](https://github.com/kevinkenneth290300/Project_X/issues/20) | Authenticated collector identity and tenant/site binding |
| M2 | P1 | [#19](https://github.com/kevinkenneth290300/Project_X/issues/19) | Durable, bounded, replay-safe ingestion |
| M2 | P1 | [#21](https://github.com/kevinkenneth290300/Project_X/issues/21) | Server-authorized scoped event access |
| M2 | P1 | [#22](https://github.com/kevinkenneth290300/Project_X/issues/22) | Scoped export with genuine digest verification |
| M3 - Platform and offline readiness | P2 | [#10](https://github.com/kevinkenneth290300/Project_X/issues/10) | Local fonts and no console font egress |
| M3 | P2 | [#15](https://github.com/kevinkenneth290300/Project_X/issues/15) | Evidence-backed browser/build/OS support matrix |

## Documentation and gates

Per-issue documents use `<issue-number>-<short-description>.md` in this directory. Record the actual test results, any baseline blockers, remaining limitations, and review/rollout expectations. Link the issue and epic in each document and PR. An issue is complete only after its acceptance criteria and required gates are satisfied and its reviewed PR is merged.

Use unit checks for service semantics, component/integration checks for operator workflows, and real HTTP/storage/security tests for the future backend. Required gates are focused tests, full type checking, and a production build; CI must eventually verify a clean `npm ci` checkout on supported Windows and Linux runtimes. Never replace a failing gate with an ignore, invented status, or untested compatibility claim.