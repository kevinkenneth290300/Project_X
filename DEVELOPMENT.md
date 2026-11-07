# Warden — Development Environment Setup Guide

This document provides instructions for setting up, running, testing, and extending the Warden Industrial OT/ICS & Enterprise Security Telemetry platform for local development.

The current console is a fixture-backed demonstration, not a production security platform. M0 fixes disable unsupported operations and false success claims. Local site/case/profile state is transient, and browser scope is not authorization. [The issue roadmap](docs/remediation/README.md) records the implemented increments and limitations.

---

## 💻 Prerequisites

- **Node.js**: Node 24 LTS, pinned to the version in [.node-version](.node-version). Use the pinned runtime for local verification.
- **npm**: Use npm shipped with the pinned Node runtime and the committed [package-lock.json](package-lock.json). Other package-manager lockfiles are not maintained.
- **Git**: For version control
- **Modern Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge with WebGL support

---

## ⚙️ Initial Setup

### 1. Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/kevinkenneth290300/Project_X.git
cd Project_X

# Install all npm dependencies
npm ci
```

### 2. Environment Configuration
No environment configuration or real credentials are required for the local demo. Do not put secrets into browser-exposed environment variables or commit environment files. Optional/future backend configuration is not an implemented authentication or AI integration.

Unused AI Studio/cloud-AI template scaffolding has been removed. There is no template secret file to configure. The optional `DISABLE_HMR` development-session setting retains its existing behavior and is not an authentication or production setting.

### 3. Launch Development Server
```bash
# Starts Vite local development server on http://localhost:3000
npm run dev
```

The default bind is `127.0.0.1`. LAN binding is an explicit opt-in for an authorized isolated development network only, for example `npm run dev -- --host 0.0.0.0`; never expose this development server or management services publicly.

---

## 🏗️ Project Architecture & Directory Structure

```
├── src/
│   ├── components/
│   │   ├── charts/               # Static sample SVG metric illustrations
│   │   ├── dialogs/              # Global command palette, registration & config modals
│   │   ├── navigation/           # Enterprise SOC TopBar, Sidebar & ScopeSelector
│   │   ├── severity/             # High/Medium/Low/Critical badges & indicators
│   │   └── status/               # Sample and unavailable status indicators
│   │
│   ├── context/
│   │   └── ScopeContext.tsx       # Hierarchical state management (Org -> Site -> Zone)
│   │
│   ├── services/                 # Modular mock data services & API contracts
│   │   ├── agentService.ts       # Sample agents; unsupported remote operations reject
│   │   ├── assetService.ts       # IT/OT inventory, PLCs, HMIs & groups store
│   │   ├── authService.ts        # LDAP, SAML 2.0, OIDC, RBAC & MFA configurations
│   │   ├── eventService.ts       # High-throughput Windows event logs & syslog records
│   │   ├── investigationService.ts # Incident dossiers, AI assessments & correlation graphs
│   │   ├── profileService.ts     # Declarative collection profiles & XPath policies
│   │   ├── siteService.ts        # Purdue model zones, sites & plants data
│   │   └── syslogService.ts      # Unparsed samples; live listener/parser testing unavailable
│   │
│   ├── views/                    # Full-screen operational console views
│   │   ├── DashboardView.tsx     # Scope-aware Master SOC dashboard
│   │   ├── SitesView.tsx         # Multi-site manufacturing plant directory
│   │   ├── SiteDetailView.tsx    # Purdue model architecture & site deep-dive
│   │   ├── AssetsView.tsx        # Unified IT/OT asset directory
│   │   ├── GroupsView.tsx        # Logical asset & controller groupings
│   │   ├── NetworkDevicesView.tsx # Industrial switches & OT firewalls
│   │   ├── TelemetrySourcesView.tsx # Syslog listeners, SNMP poller & OT DPI feeds
│   │   ├── DetectionsView.tsx    # MITRE ATT&CK security detections
│   │   ├── InvestigationsView.tsx # SOC investigation workspace
│   │   ├── UsersView.tsx         # RBAC matrix, user accounts & scoped access
│   │   └── SettingsView.tsx      # Enterprise auth providers, PKI mTLS & retention
│   │
│   ├── types.ts                  # Centralized TypeScript definitions & schemas
│   ├── App.tsx                   # Top-level view router with ScopeProvider wrapper
│   └── main.tsx                  # React entry point
```

---

## 🧪 Verification & Quality Checks

Run the linter and type-checker to ensure zero regressions:
```bash
# TypeScript compilation & lint check
npm run lint

# Unit and component/integration regressions
npm test

# Production build verification
npm run build

# Portable generated-artifact cleanup; source/data are preserved
npm run clean
```

For dependency audits, `npm run report:modules` records Vite/Rollup module IDs and import edges in a temporary JSON file without writing the production bundle. See [template cleanup evidence and remaining font limits](docs/remediation/055-unused-template-scaffolding.md).

---

## 🧭 Extending Mock Services to Real APIs

On native Windows PowerShell, use `npm.cmd` if execution policy prevents the npm PowerShell wrapper from running. The clean script uses Node's standard filesystem API without platform-specific shell commands. Verify a clean locked install, strict type checking, all tests, and a bundle build locally; Windows results do not establish native Linux execution. Hosted CI: not run (owner decision). The build's existing size warning is not suppressed.

Async method signatures are not a production contract. Real API integration must define and test identity, tenant/site authorization, validation, durable acceptance, error/retry behavior, and explicit capabilities before enabling operations:

1. Keep local samples separate from live data; never fall back to fixtures after a live error.
2. Follow collector contract/identity/durability/access increments #18 through #21 before claiming telemetry integration.
3. Keep unsupported evidence export, parser validation, remote agents, policy deployment, and detection engines unavailable until independently implemented and verified.
