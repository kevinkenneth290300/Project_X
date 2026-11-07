# Issue #8: Unavailable syslog parser testing

Tracking: [issue #8](https://github.com/kevinkenneth290300/Project_X/issues/8), P0, M0 - Truthful prototype safety; [epic #23](https://github.com/kevinkenneth290300/Project_X/issues/23). Depends on issue #7. Collector code is unchanged.

## Root cause and changes

The console returned hard-coded fields/mappings/confidence for substring matches, or even arbitrary invalid input. The input screen called those results extracted/normalized and claimed a parser was compiled and assigned without a pipeline.

The test service now rejects every request with `OperationUnavailableError` and returns no fabricated parser result. Test/extract and save/deploy controls are disabled with an accessible explanation. Result, confidence, mapping, and compilation-success paths are removed. The bounded text input and sample presets remain local, explicitly unparsed examples; they make no request and no validation claim.

The adjacent syslog entry screen is also explicitly sample-only: no fake live buffer, successful delivery percentage, active listener, parsed sample fields, or verified TLS claims. Counts derive from fixture records; unmeasured rates/delivery are null/unknown/unavailable. Canonical source/listener/message fields replace undefined aliases. Listener startup is disabled in both entry screen and direct dialog and cannot invoke a successful saved callback. Failed sample loading remains unavailable rather than measured zero.

## Regression checks

```sh
npm test -- src/__tests__/syslogParserSafety.test.tsx src/__tests__/demoNavigation.test.tsx
npm run lint
npm run build
```

Unit cases cover empty, arbitrary, malformed, key/value, OpenSSH-shaped RFC5424, and firewall-shaped input. Component/integration cases cover representative/malformed/changed input, disabled operations, no invented output/confidence, no network request, local preset loading, and return navigation.

The same workflow also covers sample-record counts, unavailable listener status, empty parsed fields, canonical source search and parser-entry navigation, disabled direct listener startup, and failed loading. Local validation on 2026-11-01: 17 targeted syslog/navigation checks and all 71 current regressions in 9 test files passed. `npm run build` passed. Canonical syslog corrections reduced remaining baseline type errors from 13 to 4 in integrations and site detail; those are tracked by issues #9/#11. No errors were suppressed. The existing bundle-size warning remains.

## Parser boundary and rollout

Project_X does not implement an RFC3164/RFC5424 parser, Grok/regex extractor, normalized ECS parser, or collector parser-test endpoint. The separate collector has its own Go parsers; these tests neither execute nor certify them. A genuine parser test requires a reviewed parser, source-specific scope, versioned output/error semantics, and real contract fixtures. Review and merge prerequisites to main, retarget this PR to main, and merge independently without claiming collector parsing or a working syslog ingestion service.