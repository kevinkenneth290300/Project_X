# Warden — Industrial OT/ICS & Enterprise Security Telemetry Platform

Warden is currently a fixture-backed demonstration console for industrial and enterprise security telemetry. It is not a production monitoring, authentication, detection, or incident-response platform.

All console views display a persistent demonstration notice. Evidence is unverified sample data: no artifact digest, immutable preservation, chain of custody, or forensic admissibility is established. Evidence export is disabled until a verified workflow exists. Client-side scope is not an authorization boundary.

The modules below describe intended product direction, not implemented production capabilities. See [issue #1 documentation](docs/remediation/001-demo-evidence-safety.md) and [the stabilization epic](https://github.com/kevinkenneth290300/Project_X/issues/23).

---

## 🏛️ System Architecture

The prototype models hierarchical asset and telemetry scope based on the **ISA-99 / IEC 62443** and **Purdue Model for Industrial Control Systems (ICS)**:

```
Warden Enterprise Master Console
│
├── Organization (Acme Global Manufacturing)
│   ├── Site / Plant (e.g., Chennai Plant [CHN-01], Pune Automotive Plant [PUN-02])
│   │   ├── Purdue Zone (Level 3.5 DMZ, Level 3 Operations, Level 2 Control, Level 1 Safety)
│   │   │   ├── Logical Asset Group (e.g., Assembly Line PLCs, SCADA Historians)
│   │   │   │   └── Monitored Asset (Windows Server, PLC, HMI, Industrial Switch)
```

---

## 🚀 Key Modules & Capabilities

### 1. Multi-Site Global Console & Hierarchy Navigation
- **Scope Hierarchy Context**: Instant global filtering across Organizations, Sites, and Purdue Zones.
- **Plant Telemetry Health**: Real-time EPS (events per second), collector sync status, and latency monitoring across distributed manufacturing facilities.
- **Purdue Model Visualization**: Segmentation monitoring across Level 4/5 (Enterprise), Level 3.5 (OT DMZ), Level 3 (Supervisory), Level 2 (Area Control), Level 1 (Direct Control), and Level 0 (Field Devices).

### 2. Unified IT/OT Asset & Device Inventory
- **Asset Directory**: Ingestion and posture evaluation for Windows Servers, Engineering Workstations, HMIs, PLCs (Rockwell/Allen-Bradley, Siemens S7, Schneider Modicon), RTUs, and SCADA Historians.
- **Network Infrastructure**: Monitoring of industrial switches (Moxa, Hirschmann, Cisco Industrial Ethernet), OT firewalls (Palo Alto, Fortinet), and boundary routers with port health, temp/fan metrics, and interface error rates.

### 3. Comprehensive Telemetry Ingestion
- **Agent Telemetry**: Lightweight kernel-level Windows event collection (Security, System, PowerShell, Defender, Sysmon).
- **RFC 5424 / RFC 3164 Syslog**: High-throughput UDP/TCP/TLS syslog collectors for network appliances and firewalls.
- **SNMPv3 / SNMPv2c Poller**: Cryptographically authenticated telemetry polling with localized Engine IDs and trap listeners.
- **Roadmap Ingestion Modules**: Deep Packet Inspection (DPI) for Modbus TCP, S7comm, and EtherNet/IP.

### 4. Enterprise Identity & Role-Based Access Control (RBAC)
- **Authentication Providers**: Mock configuration and integration for LDAP / Active Directory, Okta SAML 2.0, and Microsoft Entra ID (OIDC).
- **Role Hierarchy**: Predefined roles for Platform Administrators, OT Security Analysts, Site Administrators, Network Operators, and Auditors.
- **Granular Scoped Permissions**: Plant- and zone-level access control with mandatory Hardware FIDO2 / YubiKey and TOTP MFA enforcement.

### 5. Threat Detection & Rapid Incident Response
- **SOC Detections Engine**: Real-time MITRE ATT&CK and MITRE ATT&CK for ICS mapping.
- **Interactive Graph Correlator**: Node/edge correlation between compromised credentials, command cradles, and field controller anomalies.
- **Incident Response (IR) Mode**: Remote telemetry boost and forensic artifact preservation.

---

## 🛠️ Quick Start

```bash
# Install dependencies
npm ci

# Launch development environment (Runs Vite dev server on port 3000)
npm run dev

# Run TypeScript check & linter
npm run lint

# Run unit and component/integration regressions
npm test

# Compile production bundle
npm run build

# Portable artifact cleanup (Windows and Linux)
npm run clean
```

---

Build/development uses Node 24 LTS pinned in [.node-version](.node-version). Run the locked installation, portable cleanup, strict TypeScript, tests, and production build locally. Native Linux execution is not implied by Windows results. Hosted CI: not run (owner decision). See [development](DEVELOPMENT.md) and [deployment limits](DEPLOYMENT.md).

Unused cloud-AI/template packages and middleware have been removed; no AI Studio secret setup is required. Dependency reachability can be checked with `npm run report:modules`. [The cleanup evidence](docs/remediation/055-unused-template-scaffolding.md) records the module graph, local gates, and remaining external-font/runtime-data limits. This does not implement an AI engine or complete the real-data-only cleanup.

## Data states

Core data is represented as ready, empty, unconfigured, unavailable, unauthenticated, forbidden, error or loading. Only ready states carry records; unknown measurements must not become invented zeros. The shared state view and scoped loader announce conditions, cancel obsolete requests and ignore stale responses.

The default header has no organisation, person or inventory scope, and detail routes have no initial entity selection. An authorised display context must come from a future verified server/session path; client selection is not authorization. [Identity/state evidence and limits](docs/remediation/038-core-identity-data-states.md) distinguish this foundation from the remaining runtime-data and authentication work.

Sites, zones and groups no longer initialise from runtime fixtures. With no authorised inventory API, their screens show unconfigured and creation remains unavailable; no browser-only inventory is invented. [Site/group state evidence](docs/remediation/044-site-zone-group-state.md) covers exact IDs, ownership, test-only builders and the remaining inventory work.

Assets and network devices now use canonical type/MAC fields and unconfigured readers rather than seeded lists. Creation remains unavailable, and invalid aliases or duplicate IDs are explicit errors, not guessed/merged records. [The model and identity note](docs/remediation/044-asset-device-models.md) records supported field boundaries, test evidence and remaining agent/telemetry/backend work.

## 📜 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.
