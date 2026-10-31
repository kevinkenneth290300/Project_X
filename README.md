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
npm install

# Launch development environment (Runs Vite dev server on port 3000)
npm run dev

# Run TypeScript check & linter
npm run lint

# Compile production bundle
npm run build
```

---

## 📜 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.
