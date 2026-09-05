# Warden — Development Environment & Engineering Guide

This document provides a comprehensive step-by-step guide for developers contributing to or extending the **Warden Windows Telemetry & Syslog Platform**.

---

## Table of Contents

1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [Quickstart Setup](#2-quickstart-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Project Architecture & Directory Layout](#4-project-architecture--directory-layout)
5. [Data Services & State Management](#5-data-services--state-management)
6. [Extension Walkthroughs](#6-extension-walkthroughs)
   - [Adding a New Windows Event ID or Channel](#adding-a-new-windows-event-id-or-channel)
   - [Creating a Security Detection / Sigma Rule](#creating-a-security-detection--sigma-rule)
   - [Adding a New Operational View](#adding-a-new-operational-view)
   - [Extending Syslog Parsers](#extending-syslog-parsers)
7. [Design System & UI Guidelines](#7-design-system--ui-guidelines)
8. [Type Checking, Linting & Build Verification](#8-type-checking-linting--build-verification)
9. [Debugging & Troubleshooting](#9-debugging--troubleshooting)

---

## 1. Prerequisites & System Requirements

Before you begin, ensure you have the following tools installed on your development workstation:

- **Node.js**: `v20.x` or higher (LTS recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), `yarn` (v1.22+), or `bun` (v1.1+)
- **Git**: `v2.30+`
- **Recommended Code Editor**: [Visual Studio Code](https://code.visualstudio.com/)
  - Recommended Extensions:
    - *Tailwind CSS IntelliSense* (`bradlc.vscode-tailwindcss`)
    - *TypeScript and JavaScript Language Features* (built-in)
    - *Prettier - Code formatter* (`esbenp.prettier-vscode`)
    - *ESLint* (`dbaeumer.vscode-eslint`)

---

## 2. Quickstart Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/warden-telemetry.git
cd warden-telemetry
```

### Step 2: Install Dependencies
```bash
# Using standard npm
npm install

# Alternatively using Bun
bun install
```

### Step 3: Launch Local Development Server
```bash
npm run dev
```

The Vite development server will bind to `0.0.0.0:3000`. Open your browser and navigate to:
```
http://localhost:3000
```

---

## 3. Environment Configuration

Warden comes pre-configured for instant client-side development. For server-side AI integrations or external APIs:

1. Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
2. Configure optional environment variables:
   ```env
   # .env.local
   # Optional: Google Gemini API Key for AI-assisted investigation summaries
   GEMINI_API_KEY=your_gemini_api_key_here

   # Server Port (Default is 3000)
   PORT=3000
   ```

> ⚠️ **Security Warning**: Never commit `.env` or `.env.local` files containing live credentials or secret API keys to version control.

---

## 4. Project Architecture & Directory Layout

Warden is structured with a modular, service-oriented architecture:

```
src/
├── components/                 # Reusable UI Components
│   ├── charts/                 # Telemetry time-series & rate visualizers
│   │   └── EventRateChart.tsx  # Ingestion rate SVG graph
│   ├── common/                 # Core UI framework components
│   │   ├── TopBar.tsx          # Header with live ticker, status & search button
│   │   └── Sidebar.tsx         # SOC section navigation with notification badges
│   ├── dialogs/                # Modals & command overlays
│   │   └── GlobalSearchModal.tsx # Unified omnibar (Ctrl+K)
│   └── severity/               # Severity & status rendering
│       ├── SeverityBadge.tsx   # Critical / High / Medium / Low badges
│       └── StatusBadge.tsx     # Healthy / Warning / Offline badges
├── services/                   # Business logic, data caching & API abstraction
│   ├── agentService.ts         # Agent fleet querying & IR isolation mode
│   ├── eventService.ts         # Multi-channel event querying & XML generator
│   ├── investigationService.ts # Incident dossier CRUD & timeline management
│   ├── detectionService.ts     # Correlation rules, queries & MITRE matrix
│   ├── evidenceService.ts      # Cryptographic evidence & chain-of-custody
│   ├── syslogService.ts        # Syslog source diagnostics & parser status
│   ├── profileService.ts       # Agent collection profile definitions
│   ├── auditService.ts         # Immutable operator action tracking
│   └── mockData.ts             # High-fidelity security telemetry dataset
├── views/                      # Primary application screens
│   ├── DashboardView.tsx       # Operations overview
│   ├── EventsView.tsx          # Multi-channel Windows event explorer
│   ├── EventDetailView.tsx     # Structured payload inspector & XML manifest
│   ├── AgentsView.tsx          # Endpoint collector fleet
│   ├── AgentDetailView.tsx     # Deep-dive per-agent view & buffer metrics
│   ├── DetectionsView.tsx      # Security detections & rule console
│   ├── InvestigationsView.tsx  # Active incident dossiers list
│   ├── InvestigationDetailView.tsx # Incident timeline & evidence workspace
│   ├── EvidenceView.tsx        # Cryptographic evidence chain-of-custody
│   ├── SyslogView.tsx          # Syslog sources & parser diagnostics
│   ├── ProfilesView.tsx        # Collector profile management
│   ├── HealthView.tsx          # Queue health, spool & buffer telemetry
│   └── AuditView.tsx           # SOC operator audit trail
├── types.ts                    # TypeScript interfaces, types & enums
├── index.css                   # Tailwind CSS v4 design tokens
├── App.tsx                     # Top-level state & routing coordinator
└── main.tsx                    # Application entrypoint
```

---

## 5. Data Services & State Management

All domain entities are decoupled into asynchronous services located under `src/services/`. This architecture allows effortless migration from local mock telemetry to production REST / GraphQL / WebSocket backends.

### Key Service Patterns:
- **`agentService.ts`**:
  - `getAgents(filters)`: Query fleet by status, search string, or profile.
  - `getAgentById(id)`: Retrieve specific agent metadata.
  - `toggleInvestigationMode(id)`: Switch agent between standard and Deep IR telemetry logging.
- **`eventService.ts`**:
  - `getEvents(filters)`: Query events with multi-criteria filtering (channel, severity, host, search, event ID).
  - `getEventById(id)`: Retrieve full event record with structured details and XML string.
- **`investigationService.ts`**:
  - `getInvestigations(filters)`: Retrieve active dossiers.
  - `addNote(id, text, author)`: Append collaborative notes to an investigation.
  - `updateInvestigationStatus(id, status)`: Update incident triage state.

---

## 6. Extension Walkthroughs

### Adding a New Windows Event ID or Channel

1. Open `src/types.ts` and verify if the channel exists in `EventChannel`:
   ```typescript
   export type EventChannel =
     | 'Security'
     | 'System'
     | 'Sysmon'
     | 'PowerShell'
     | 'TaskScheduler'
     | 'Defender'
     | 'DNS Server'
     | 'CustomChannel'; // Add new channel here
   ```

2. Add new event records to `src/services/mockData.ts` under `MOCK_EVENTS`:
   ```typescript
   {
     id: 'evt-4720-user-created',
     eventId: 4720,
     channel: 'Security',
     severity: 'Medium',
     host: 'DC-01',
     timestamp: '2026-09-02 10:48:15 UTC',
     provider: 'Microsoft-Windows-Security-Auditing',
     summary: 'A user account was created: target_user="johndoe"',
     user: 'CORP\\admin',
     sourceIp: '10.20.1.10',
     details: {
       TargetUserName: 'johndoe',
       TargetDomainName: 'CORP',
       SamAccountName: 'johndoe',
       SidHistory: '-',
       UserWorkstations: 'All',
     },
     xmlData: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
       <System>
         <Provider Name="Microsoft-Windows-Security-Auditing" />
         <EventID>4720</EventID>
         <TimeCreated SystemTime="2026-09-02T10:48:15.000Z" />
       </System>
       <EventData>
         <Data Name="TargetUserName">johndoe</Data>
       </EventData>
     </Event>`
   }
   ```

### Creating a Security Detection / Sigma Rule

Add a new detection entry in `src/services/mockData.ts` under `MOCK_DETECTIONS`:

```typescript
{
  id: 'DET-009',
  name: 'Suspicious Domain Account Creation',
  severity: 'Medium',
  status: 'Active',
  author: 'SOC Threat Intel Team',
  description: 'Detects creation of domain user accounts outside normal provisioning windows.',
  mitreAttack: {
    id: 'T1136.002',
    name: 'Create Account: Domain Account',
    tactic: 'Persistence',
  },
  ruleQuery: 'EventID == 4720 and Channel == "Security" and not (SubjectUserName in ["svc_idm", "Provisioner"])',
  targetChannels: ['Security'],
  triggeredCount24h: 3,
  lastTriggered: '12 min ago',
}
```

### Adding a New Operational View

1. Create your view component in `src/views/MyNewView.tsx`.
2. Add your section key to `NavigationSection` in `src/types.ts`:
   ```typescript
   export type NavigationSection =
     | 'dashboard'
     | 'events'
     | ...
     | 'my-new-view';
   ```
3. Register the route in `src/App.tsx` within `renderActiveView()`.
4. Add the navigation item to `src/components/common/Sidebar.tsx`.

---

## 7. Design System & UI Guidelines

Warden follows a strict **Technical SOC Dark** aesthetic designed for 24/7 monitoring environments without visual fatigue.

### Core Color Tokens:
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `#0B0B0C` | Deep neutral base canvas |
| **Primary Containers** | `#151517` | Card and panel container backgrounds |
| **Nested Containers** | `#1A1A1D` | Interactive rows, inputs, table items |
| **Subtle Borders** | `#242426` | Section dividers, grid lines |
| **Hover Borders** | `#3A3A3C` | Interactive hover highlights |
| **Primary Text** | `#FFFFFF` / `#EDEDED` | Headings, active values |
| **Muted Metadata** | `#8E9299` | Labels, timestamps, secondary copy |
| **Dark Accents** | `#5A5A5E` | Subdued metadata, placeholder text |

### Severity Token Hierarchy:
- **Critical**: `#E64848` (Border/BG: `#E64848`/15)
- **High / Warning**: `#F2994A` (Border/BG: `#F2994A`/15)
- **Medium**: `#FBBF24` (Yellow-400)
- **Low / Info**: `#38BDF8` (Sky-400)
- **Success / Healthy**: `#27AE60` (Green-600 / Emerald)

### Typography Rules:
- Use **monospace** (`font-mono`) for hostnames, IP addresses, Event IDs, SHA-256 hashes, timestamps, and metric values.
- Use **clean sans-serif** (`font-sans`) for descriptions, narrative summaries, and body copy.
- Always include `title` tooltips on truncated table cells.

---

## 8. Type Checking, Linting & Build Verification

Always run validation scripts before opening a pull request:

```bash
# Validate TypeScript type safety
npm run lint

# Perform a full production build test
npm run build
```

---

## 9. Debugging & Troubleshooting

### Issue: "Port 3000 is already in use"
**Solution**: Stop any conflicting processes or specify a different port in `vite.config.ts` if developing locally.

### Issue: "Cannot read properties of undefined (reading 'toLowerCase')"
**Solution**: Always use null-safe optional chaining when processing query strings and entity properties:
```typescript
// Good pattern
const q = (search || '').trim().toLowerCase();
const matches = item.hostname?.toLowerCase().includes(q);
```

---

*For production deployment architectures, containerization, and reverse proxy setup, refer to the [Production Deployment Guide](./DEPLOYMENT.md).*
