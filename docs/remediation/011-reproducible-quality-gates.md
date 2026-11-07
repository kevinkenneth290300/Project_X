# Issue #11: Reproducible local quality gates

Tracking: [issue #11](https://github.com/kevinkenneth290300/Project_X/issues/11), P1, M1 - Prototype correctness and quality; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23); [local increment review #35](https://github.com/kevinkenneth290300/Project_X/issues/35). This is a standalone main-based increment after PR #50. Collector code is unchanged.

## Baseline and changes

The baseline at `main` commit `43e7dd9` already contains the reviewed safety stack, lockfile, and Vitest harness. A fresh locked install and type check on 2026-11-07 reproduced two TS2339 errors: `Integration.type` and `Integration.format`. The view now uses the model's `category` and reports unsupported payload formatting as unavailable rather than inventing a model field.

This worktree copies only the reviewed non-workflow files from the tested `5dfbc97` / `29cfcfb` quality increment. The original `fix/11-main-quality-gates` branch and its worktree are unchanged and unpushed, preserving the deferred workflow for later. No imported or published commit touches `.github/workflows/**`. Strict application type checking is enabled. Optional accesses in event filters/assets/groups use stable narrowed values, supported aliases, and explicit optional/unknown states. No type errors are ignored or cast away, and the 21 later local remediation commits are excluded.

The committed npm lockfile from #1 is retained. Node 24 LTS is required and the exact tested version is pinned in `.node-version`. Cleanup uses Node filesystem APIs rooted at the script's project, not Unix shell commands; it deletes only known generated artifacts and preserves source/data. Development defaults to loopback rather than exposing the demo to the LAN.

Local verification is the supported path: locked install, portable cleanup, strict TypeScript, unit/component integration tests, and Vite bundle. The same Vitest harness is reused. Cleanup has focused temporary-directory tests for idempotency and source/data preservation. A real Node child-process regression also runs the cleanup CLI from an unrelated directory and verifies that directory's artifacts are preserved.

Hosted CI: not run (owner decision). The owner explicitly deferred the hosted Windows/Linux acceptance criterion in [the #11 decision](https://github.com/kevinkenneth290300/Project_X/issues/11#issuecomment-6705407170). No workflow is included, created, modified, triggered, or awaited by this increment. Use `Refs #11`, not `Closes #11`.

Both setup/deployment guide locations use the actual repository, pinned runtime, npm lockfile, and documented commands. Demo hosting is distinguished from unimplemented/unvalidated production, container, identity, and industrial architecture. A built bundle is not production readiness.

## Required gates

```sh
npm ci
npm run clean
npm run lint
npm test
npm run build
```

Use `npm.cmd` in native Windows PowerShell if its npm script wrapper is blocked by execution policy. Do not change system execution policy or request elevation just to run project commands. The portable scripts use standard Node APIs, but local Windows results do not establish a native Linux result. No registered WSL distribution or Docker runtime was available for local Linux verification; no installer or privileged setup was started. The existing bundle-size warning remains visible.

Fresh validation on 2026-11-07 used the separate T0.1 Windows x64 worktree and Node 24.22.2. `npm ci` succeeded with zero reported audit vulnerabilities; portable `npm run clean`, strict `npm run lint`, all 82 tests in 11 files, and `npm run build` passed with exit code 0. Installation emitted an existing dependency deprecation and npm install-script-policy warnings; they were not hidden or blanket-approved. Vite reported a 661.89 kB minified chunk above its 500 kB warning threshold. Native Linux and browser/e2e verification are not established here; the Playwright harness is a later increment.

## Review and limits

This branch targets main directly after the owner's merge of PR #50. The owner reviews and merges after checking the local evidence. Reviewing this one candidate does not complete #35, and #11 remains open for the deferred hosted criterion. Remaining scope/host/filter/profile/inventory defects and runtime mock removal are separate unfinished work. This does not implement production authentication, monitoring, evidence custody, collector interoperability, or legacy OS support.

## Risks and rollback

The optional field guards do not replace a canonical real asset model. The running console still contains runtime sample records until the subsequent cleanup tasks. Cleanup must not be repurposed to delete storage or customer data. If this increment must be rolled back, revert only its reviewed PR commits on a new branch and rerun local gates; do not reset any existing worktree, branch, or database. Stacked cleanup PRs must be reviewed against their declared base before rollback.