# Issue #55: Unused template scaffolding

Tracking: [#55](https://github.com/kevinkenneth290300/Project_X/issues/55), parent [#23](https://github.com/kevinkenneth290300/Project_X/issues/23), with local quality prerequisite [PR #56](https://github.com/kevinkenneth290300/Project_X/pull/56). This is Gate 0 task T0.2. Use `Refs #55`: third-party-free loading remains dependent on [#10](https://github.com/kevinkenneth290300/Project_X/issues/10), and acceptance must be verified after owner merge.

## Evidence and changes

A production Vite/Rollup audit of the T0.1 baseline collected 1,726 module IDs and their importer/imported-module edges. None came from `@google/genai`, `dotenv`, `motion`, or `express`; no runtime metadata import existed. Source inspection also confirmed no merged server consumer. The package removals are based on this module graph, not keyword search alone.

Removed the four unused dependencies and unused Express type declarations with `npm uninstall`, keeping the lockfile consistent. Fresh installation fell from 303 to 180 packages. Express and its types must be re-added explicitly if the reviewed backend needs them in T2.2; the collector is unchanged.

Removed the unused AI Studio media middleware, its template comments, the tracked empty asset placeholder, the unused Gemini/APP_URL environment example, and unconsumed template metadata. No product/package rename was made: the console's Warden title and UI branding remain unchanged. Existing HMR opt-out behavior is retained, and T0.1's loopback default is not redone.

The secondary bundle scan found a fake Gemini integration row in the runtime fixture store after package removal. That one invented template capability was removed, with a failing-then-passing service regression. This small record deletion was brought forward from T1.8 to satisfy #55's no-Gemini-artifact criterion; no real data, operational integration, or unsupported-operation behavior was changed. Other runtime fixtures remain unfinished Block A work.

## Reproducible module report

```sh
npm run report:modules
```

The command uses Vite/Rollup APIs to record real module IDs and import edges in a uniquely named temporary JSON report. It does not write the production bundle or overwrite an existing report. A caller can supply a new output path after `--`. Virtual module IDs must be treated as identifiers, not filesystem paths. Production artifact hashes were unchanged by the reporting command.

The completed cleanup still has 1,726 graph nodes, with zero nodes from the removed dependencies or template metadata. A secondary scan of emitted JS/CSS/HTML found zero Gemini/AI Studio references. The JavaScript chunk changed from 661.89 kB (149.91 kB gzip) to 661.54 kB (149.80 kB gzip), primarily from deleting the invented row; removing already-unused packages was not presented as a large runtime bundle reduction.

## Local verification

Verified on 2026-11-07 in the isolated T0.2 Windows x64 worktree with Node 24.22.2:

- Fresh `npm ci`: pass, 180 packages and zero reported audit vulnerabilities.
- `npm run lint`: pass, strict TypeScript with no errors or type escapes.
- `npm test`: pass, 85 tests across 11 files, none failed or pending.
- `npm run build`: pass; existing chunk-size warning retained.
- `npm run report:modules`: pass; before/after graph evidence and read-only output behavior verified.
- New template checks first failed against the baseline and then passed. Existing unavailable-operation and cleanup tests remain intact.

The two existing esbuild install-script-policy warnings remain visible; no blanket approval was added. Native Linux verification is unavailable locally, and the Playwright harness/e2e command is scheduled for T1.12.

Hosted CI: not run (owner decision). No workflow path is edited, imported, created, triggered, or awaited.

## Limits, stack and rollback

Google Fonts preconnect/stylesheet links remain in `index.html`; this increment does not establish third-party-free or offline loading. #10 owns the scheduled self-hosted-font work, so #55 remains open for that criterion. The running console still has other seeded records and unsupported features; this is not real-data or production readiness.

While PR #56 is unmerged, this task targets `fix/11-quality-gates`. The owner merges PR #56 first, then reviews this task's retargeting to main. No owner merge or branch deletion is performed by Copilot.

If rollback is necessary, revert only this task's reviewed commits on a new branch and rerun local gates. Never restore a cloud dependency as a silent fallback, reset a worktree/database, or delete real customer data. A future server dependency must be added by its own reviewed backend change rather than restoring template scaffolding wholesale.