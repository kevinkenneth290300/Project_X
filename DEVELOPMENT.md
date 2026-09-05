# Warden — Development Environment Setup Guide

This document provides instructions for setting up, running, testing, and extending the Warden Industrial OT/ICS & Enterprise Security Telemetry platform for local development.

---

## 💻 Prerequisites

- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x LTS`)
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
- **Git**: For version control
- **Modern Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge with WebGL support

---

## ⚙️ Initial Setup

### 1. Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/warden-sec/warden-console.git
cd warden-console

# Install all npm dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` if you need custom runtime settings:
```bash
cp .env.example .env.local
```

### 3. Launch Development Server
```bash
# Starts Vite local development server on http://localhost:3000
npm run dev
```

---

## 🏗️ Project Architecture & Directory Structure

```
├── src/
│   ├── components/
│   │   ├── charts/               # Recharts & D3-based high-density metric visualizers
│   │   ├── dialogs/              # Global command palette, registration & config modals
│   │   ├── navigation/           # Enterprise SOC TopBar, Sidebar & ScopeSelector
│   │   ├── severity/             # High/Medium/Low/Critical badges & indicators
│   │   └── status/               # Operational health pills with live pulse animations
│   │
│   ├── context/
│   │   └── ScopeContext.tsx       # Hierarchical state management (Org -> Site -> Zone)
│   │
│   ├── services/                 # Modular mock data services & API contracts
│   │   ├── agentService.ts       # Windows endpoint agent telemetry & IR mode controls
│   │   ├── assetService.ts       # IT/OT inventory, PLCs, HMIs & groups store
│   │   ├── authService.ts        # LDAP, SAML 2.0, OIDC, RBAC & MFA configurations
│   │   ├── eventService.ts       # High-throughput Windows event logs & syslog records
│   │   ├── investigationService.ts # Incident dossiers, AI assessments & correlation graphs
│   │   ├── networkDeviceService.ts # Industrial switches, OT firewalls & interface telemetry
│   │   ├── profileService.ts     # Declarative collection profiles & XPath policies
│   │   ├── siteService.ts        # Purdue model zones, sites & plants data
│   │   └── telemetrySourceService.ts # Ingestion feeds, syslog listeners & SNMP pollers
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

# Production build verification
npm run build
```

---

## 🧭 Extending Mock Services to Real APIs

All services in `/src/services/` are designed with async method signatures (`Promise<T>`), allowing seamless drop-in replacement with real REST/gRPC backend endpoints:

1. Replace in-memory array operations with `fetch('/api/v1/...')` or WebSocket subscriptions.
2. Ingest live Purdue Level 1/2 metrics via MQTT / OPC-UA gateway bridges.
3. Hook authentication into standard OIDC auth token exchanges.
