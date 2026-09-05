export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type StatusLevel = 'Healthy' | 'Warning' | 'Degraded' | 'Offline' | 'Unknown';

export interface DeliveryStats {
  collected: number;
  transmitted: number;
  acknowledged: number;
  retries: number;
  dropped: number;
}

export interface ChannelStatus {
  security: boolean;
  system: boolean;
  application: boolean;
  powershell: boolean;
  defender: boolean;
}

export interface CollectionProfile {
  id: string;
  name: string;
  version?: string;
  status?: string;
  mode?: string;
  coveragePercent?: string;
  estimatedVolumeDaily?: string;
  estimatedEventsPerDay?: string;
  estimatedBandwidth?: string;
  estimatedEndpointCpu?: string;
  purpose?: string;
  description?: string;
  channels: string[] | {
    security: boolean;
    system: boolean;
    application: boolean;
    powershell: boolean;
    defender: boolean;
  };
  categories?: {
    name: string;
    enabled: boolean;
    eventIds: number[];
    description: string;
  }[];
  deploymentCoverage?: {
    totalHosts: number;
    activeHosts: number;
    percent: number;
  };
  versionHistory?: {
    version: string;
    date: string;
    author: string;
    comment: string;
  }[];
  targetCount?: number;
  eventFilters?: {
    includeEventIds: number[];
    excludeEventIds: number[];
    minSeverity: SeverityLevel;
  };
  rateLimitEps?: number;
  compression?: boolean;
  batchTimeoutMs?: number;
  isDefault?: boolean;
}

export interface Agent {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  profileId: string;
  profileName: string;
  status: StatusLevel;
  eventsPerSec: number;
  queueSize: string;
  queueBytes: number;
  version: string;
  lastSeen: string;
  lastSeenSecondsAgo: number;
  site: string;
  siteId?: string;
  siteName?: string;
  zone?: string;
  zoneId?: string;
  zoneName?: string;
  group?: string;
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  uptime: string;
  delivery: DeliveryStats;
  collection: ChannelStatus;
  investigationMode: boolean;
  enrolledAt: string;
  domain: string;
}

export interface EventRecord {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  host: string;
  site?: string;
  siteId?: string;
  siteName?: string;
  zone?: string;
  zoneId?: string;
  zoneName?: string;
  group?: string;
  channel: 'Security' | 'System' | 'Application' | 'PowerShell' | 'Defender';
  channelFull: string;
  eventId: number;
  provider: string;
  user: string;
  sourceIp: string;
  summary: string;
  details: Record<string, string | number>;
  riskIndicators: string[];
  relatedEventIds: string[];
  rawXml: string;
  rawJson: string;
  mitreAttack?: {
    tactic: string;
    technique: string;
    id: string;
  };
}

export interface EvidenceItem {
  id: string;
  eventRecordId: string;
  eventId: number;
  title: string;
  category: string;
  host: string;
  timestamp: string;
  summary: string;
  details: Record<string, string | number>;
  relatedEvidenceIds: string[];
  severity: SeverityLevel;
}

export interface InvestigationTimelineItem {
  time: string;
  timestamp: string;
  label: string;
  eventId: number;
  eventRecordId: string;
  severity: SeverityLevel;
  detail: string;
  evidenceId?: string;
}

export interface InvestigationNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  text: string;
}

export interface Investigation {
  id: string;
  title: string;
  host: string;
  site?: string;
  siteId?: string;
  siteName?: string;
  zone?: string;
  zoneId?: string;
  zoneName?: string;
  severity: SeverityLevel;
  confidence: number;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  description: string;
  aiAssistantAssessment: {
    summary: string;
    confidence: number;
    findings: {
      id: string;
      text: string;
      evidenceId: string;
      severity: SeverityLevel;
    }[];
  };
  timeline: InvestigationTimelineItem[];
  evidenceIds: string[];
  notes: InvestigationNote[];
  graphData: {
    nodes: { id: string; label: string; type: 'user' | 'host' | 'process' | 'service' | 'file' | 'event'; subtext?: string }[];
    edges: { from: string; to: string; label: string }[];
  };
}

export interface Detection {
  id: string;
  name: string;
  description: string;
  site?: string;
  siteId?: string;
  siteName?: string;
  zone?: string;
  zoneId?: string;
  zoneName?: string;
  severity: SeverityLevel;
  confidence: number;
  triggersCount: number;
  hostsImpacted: string[];
  lastTriggered: string;
  status: 'Active' | 'Testing' | 'Disabled';
  ruleQuery: string;
  mitreAttack: {
    id: string;
    name: string;
    tactic: string;
  };
  evidenceTemplate: string;
  recentMatchEventIds: string[];
}

// ----------------------------------------------------
// MULTI-SITE OT/ICS & HIERARCHY TYPES
// ----------------------------------------------------

export interface SiteScope {
  organizationId: string;
  organizationName: string;
  siteId: string | 'all';
  siteName: string;
  zoneId: string | 'all';
  zoneName: string;
}

export type ZoneType =
  | 'Enterprise IT'
  | 'OT DMZ'
  | 'Manufacturing Zone'
  | 'Control Zone'
  | 'Safety Zone'
  | 'SCADA'
  | 'Engineering'
  | 'Historian'
  | 'PLC Network'
  | 'Cell/Area Zone';

export interface Zone {
  id: string;
  siteId: string;
  siteName: string;
  name: string;
  description: string;
  zoneType: ZoneType;
  purdueLevel: string;
  securityClassification: 'Critical Restricted' | 'High Security' | 'Monitored Internal' | 'Enterprise Standard';
  parentZoneId?: string;
  networkRanges: string[];
  assetCount: number;
  networkDevicesCount: number;
  eps: number;
  status: StatusLevel;
  telemetrySources: string[];
  collectionPolicies: string[];
  assignedGroups: string[];
}

export interface Site {
  id: string;
  name: string;
  code: string;
  organization: string;
  status: StatusLevel;
  location: string;
  healthScore: number;
  assetsCount: number;
  agentsCount: number;
  zonesCount?: number;
  networkDevicesCount: number;
  syslogSourcesCount: number;
  eps: number;
  activeDetections: number;
  activeInvestigations: number;
  lastTelemetry: string;
  lastTelemetrySecondsAgo: number;
  connectivity: 'Connected / Online' | 'High Latency' | 'Intermittent' | 'Offline';
  certStatus: 'Valid / TLS 1.3 Active' | 'Expiring Soon' | 'Untrusted';
  configSync: 'Synchronized (v0.1.0)' | 'Pending Update' | 'Out of Sync';
  description: string;
  zones: Zone[];
  collectorEndpoint: string;
}

export type PurdueLevel = 'Level 0' | 'Level 1' | 'Level 2' | 'Level 3' | 'Level 3.5' | 'Level 4/5' | string;

export type AssetType =
  | 'Windows Server'
  | 'Windows Workstation'
  | 'Linux Server'
  | 'Firewall'
  | 'Router'
  | 'Switch'
  | 'Industrial Switch'
  | 'PLC'
  | 'PLC Controller'
  | 'RTU'
  | 'RTU / Field Device'
  | 'HMI'
  | 'HMI Panel'
  | 'SCADA Server'
  | 'SCADA Historian'
  | 'Historian'
  | 'Engineering Workstation'
  | 'Network Appliance'
  | 'Security Appliance'
  | 'OT Firewall'
  | 'Other';

export interface Asset {
  id: string;
  name: string;
  ip: string;
  mac?: string;
  macAddress?: string;
  siteId: string;
  siteName: string;
  zoneId: string;
  zoneName: string;
  groupId?: string;
  groupName?: string;
  assetType?: AssetType;
  type?: AssetType | string;
  purdueLevel?: PurdueLevel;
  vendor: string;
  model: string;
  osFirmware?: string;
  firmwareOrOs?: string;
  criticality: SeverityLevel | 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore?: number;
  status?: StatusLevel | 'Healthy' | 'Warning' | 'Offline';
  telemetryStatus: 'Agent Active' | 'Syslog Streaming' | 'SNMP Monitored' | 'Passive Observed' | 'Unmonitored' | 'Active' | 'Degraded' | 'Inactive' | 'Pending';
  eps?: number;
  lastSeen: string;
  lastSeenSecondsAgo?: number;
  activeDetectionsCount?: number;
  activeInvestigationsCount?: number;
  openPorts?: number[];
  protocols?: string[];
  collectorNode?: string;
  dataSources?: string[];
  details?: Record<string, string | number>;
}

export interface AssetGroup {
  id: string;
  name: string;
  description: string;
  type?: string;
  siteId: string;
  siteName: string;
  zoneId?: string;
  zoneName?: string;
  memberCount?: number;
  assetCount?: number;
  assetIds?: string[];
  policyName?: string;
  collectionPolicy?: string;
  criticality?: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  health?: StatusLevel;
  status?: string;
  eps?: number;
  activeDetections?: number;
  assetTypes?: string[];
}

export interface NetworkDeviceInterface {
  name: string;
  status: 'Up' | 'Down';
  speed: string;
  errors: number;
  utilizationPercent: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  hostname?: string;
  ip: string;
  mac?: string;
  macAddress?: string;
  vendor: 'Cisco' | 'Palo Alto' | 'Siemens' | 'Hirschmann' | 'Fortinet' | 'Moxa' | 'Juniper' | 'Arista' | 'Other' | string;
  model: string;
  firmware?: string;
  siteId: string;
  siteName: string;
  zoneId: string;
  zoneName: string;
  type?: string;
  deviceType?: 'Core Switch' | 'OT Firewall' | 'Industrial Switch' | 'Boundary Router' | 'Security Gateway';
  telemetryProtocols?: ('SNMPv2c' | 'SNMPv3' | 'Syslog' | 'NetFlow' | 'IPFIX' | 'sFlow')[];
  portsUp?: number;
  portsTotal?: number;
  snmpStatus?: 'Active' | 'Warning' | 'Disabled' | string;
  snmpVersion?: 'SNMPv3' | 'SNMPv2c' | string;
  syslogStatus?: 'Active' | 'Disabled' | string;
  uptime?: string;
  status?: StatusLevel;
  healthScore?: number;
  lastSeen?: string;
  eps?: number;
  interfaces?: NetworkDeviceInterface[];
  metrics?: {
    cpu: number;
    memory: number;
    tempC: number;
    fanStatus: 'Normal' | 'Warning' | 'Error';
    powerSupply: 'Redundant' | 'Single' | 'Fault';
    interfaceErrorsTotal: number;
  };
  relatedAssetIds?: string[];
}

export interface TelemetrySourceItem {
  id: string;
  name: string;
  category?: 'Windows' | 'Syslog' | 'Network' | 'API' | 'Industrial OT' | string;
  type?: string;
  protocol: string;
  port?: number;
  portOrPath?: string;
  siteId: string;
  siteName: string;
  zoneId?: string;
  zoneName?: string;
  status: 'Active' | 'Listening' | 'Warning' | 'Disabled' | 'Preview / Roadmap' | string;
  eps: number;
  deviceCount?: number;
  connectedDevices?: number;
  parserName?: string;
  description: string;
  configSummary?: string;
}

export type TelemetrySource = TelemetrySourceItem;

export interface SNMPConfig {
  version: 'v2c' | 'v3';
  port: number;
  pollingIntervalSec: number;
  v2cCommunity?: string;
  v3Username?: string;
  v3AuthProtocol?: 'MD5' | 'SHA' | 'SHA-256';
  v3PrivProtocol?: 'DES' | 'AES-128' | 'AES-256';
  securityLevel?: 'noAuthNoPriv' | 'authNoPriv' | 'authPriv';
  engineId?: string;
  devicesCount: number;
  lastPoll: string;
  status: 'Configured' | 'Polling Active' | 'Warning' | 'Disabled';
}

export interface AuthProviderConfig {
  id: string;
  name: string;
  type: 'LDAP' | 'SAML' | 'OIDC' | 'Local';
  status: 'Active' | 'Configured' | 'Disabled';
  details: string;
}

export interface AuthConfig {
  local: {
    enabled: boolean;
    passwordMinLength: number;
    requireSpecial: boolean;
    lockoutThreshold: number;
    sessionTimeoutMin: number;
  };
  ldap: {
    enabled: boolean;
    serverUrl: string;
    port: number;
    useTls: boolean;
    baseDn: string;
    bindAccount: string;
    userSearchBase: string;
    groupSearchBase: string;
    usernameAttr: string;
    groupAttr: string;
    status: 'Connected' | 'Unconfigured' | 'Error';
  };
  saml: {
    enabled: boolean;
    idpName: string;
    entityId: string;
    ssoUrl: string;
    certFingerprint: string;
    autoProvision: boolean;
    status: 'Configured' | 'Unconfigured';
  };
  oidc: {
    enabled: boolean;
    issuerUrl: string;
    clientId: string;
    authEndpoint: string;
    tokenEndpoint: string;
    scopes: string;
    groupClaim: string;
    status: 'Configured' | 'Unconfigured';
  };
  mfa: {
    enabled: boolean;
    totp: boolean;
    webauthn: boolean;
    idpMfa: boolean;
    requiredRoles: string[];
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  siteScope: string;
  authProvider: string;
  mfaEnabled: boolean;
  mfaMethod: string;
  lastLogin: string;
  status: string;
}

export interface UserScoped {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  scope: {
    siteId: string | 'all';
    siteName: string;
    zoneIds: string[];
    zoneNames: string[];
  };
  mfaStatus: string;
  lastLogin: string;
  status: 'Active' | 'Suspended' | 'Pending';
  permissions: string[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  scopeType?: string;
  isSystem?: boolean;
  permissions: string[] | Record<string, boolean> | any;
}

export interface SyslogSource {
  id: string;
  source: string;
  type: 'Firewall' | 'Network Switch' | 'Linux Server' | 'VPN Gateway' | 'Proxy' | 'Storage' | 'Industrial Gateway';
  ip: string;
  siteId?: string;
  siteName?: string;
  zoneId?: string;
  zoneName?: string;
  messagesPerSec: number;
  status: StatusLevel;
  lastMessage: string;
  parser: string;
  todayCount: number;
}

export interface SyslogListener {
  id: string;
  protocol: 'UDP' | 'TCP' | 'TCP TLS';
  port: number;
  status: 'Active' | 'Listening' | 'Warning' | 'Disabled';
  messagesPerSec: number;
  connectedSources: number;
  tlsCertExpiry?: string;
  bufferSize: string;
}

export interface SyslogMessage {
  id: string;
  timestamp: string;
  facility: string;
  severity: SeverityLevel;
  host: string;
  appName: string;
  procId: string;
  msgId: string;
  rawMessage: string;
  parsedFields: Record<string, string | number>;
}

export interface Integration {
  id: string;
  name: string;
  category: 'SIEM' | 'Transport' | 'AI';
  status: 'Connected' | 'Not Connected' | 'Degraded';
  lastDelivery: string;
  eventsSent: string;
  description: string;
  endpoint: string;
  tlsEnabled: boolean;
  version: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  role?: string;
  action: string;
  target?: string;
  object: string;
  site?: string;
  siteId?: string;
  siteName?: string;
  zone?: string;
  zoneId?: string;
  zoneName?: string;
  result: 'Success' | 'Failure' | 'Warning';
  ipAddress?: string;
  sourceIp: string;
  details?: string;
}

export type AuditLogEntry = AuditRecord;

export interface HealthStatus {
  clusterResources: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkThroughput: string;
  };
  components: {
    name: string;
    status: 'Healthy' | 'Warning' | 'Degraded' | 'Operational';
    latency: string;
    throughput: string;
    details: string;
  }[];
}

export interface SystemHealthComponent {
  name: string;
  status: 'Operational' | 'Warning' | 'Degraded';
  metrics: {
    throughput?: string;
    latency?: string;
    errors?: string;
    queueDepth?: string;
    connectedCount?: string;
  };
  description: string;
}

export type NavigationSection =
  | 'dashboard'
  | 'sites'
  | 'site-detail'
  | 'groups'
  | 'assets'
  | 'asset-detail'
  | 'agents'
  | 'agent-detail'
  | 'events'
  | 'event-detail'
  | 'syslog'
  | 'parser-assistant'
  | 'network-devices'
  | 'network-device-detail'
  | 'telemetry-sources'
  | 'collection-profiles'
  | 'collection-profile-detail'
  | 'detections'
  | 'detection-detail'
  | 'investigations'
  | 'investigation-detail'
  | 'evidence'
  | 'evidence-detail'
  | 'integrations'
  | 'health'
  | 'audit-log'
  | 'policies'
  | 'certificates'
  | 'users'
  | 'settings';
