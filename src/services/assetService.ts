import { Asset, NetworkDevice, TelemetrySourceItem, SNMPConfig, SiteScope, ASSET_TYPES, NETWORK_DEVICE_TYPES } from '../types';
import { DataState, unconfiguredState } from '../data/dataState';

export type AssetInput = Asset & { type?: string; macAddress?: string; firmwareOrOs?: string };
export type NetworkDeviceInput = NetworkDevice & { type?: string; macAddress?: string };

function normalizeAsset(input: AssetInput): DataState<Asset> {
  if (!input.id || !input.name || !input.siteId || !input.zoneId) return { status: 'error', reason: 'Asset identity or ownership is incomplete.' };
  const { type, macAddress, firmwareOrOs, ...record } = input;
  const declaredType = input.assetType ?? type;
  const assetType = ASSET_TYPES.find((value) => value === declaredType);
  if (declaredType && !assetType) return { status: 'error', reason: 'Unsupported asset type.' };
  if ((input.assetType && type && input.assetType !== type) || (input.mac && macAddress && input.mac.toLowerCase() !== macAddress.toLowerCase()) || (input.osFirmware && firmwareOrOs && input.osFirmware !== firmwareOrOs)) return { status: 'error', reason: 'Conflicting asset field aliases.' };
  return { status: 'ready', data: { ...structuredClone(record), assetType, mac: input.mac ?? macAddress, osFirmware: input.osFirmware ?? firmwareOrOs } };
}

function normalizeNetworkDevice(input: NetworkDeviceInput): DataState<NetworkDevice> {
  if (!input.id || !input.name || !input.siteId || !input.zoneId) return { status: 'error', reason: 'Device identity or ownership is incomplete.' };
  const { type, macAddress, ...record } = input;
  const declaredType = input.deviceType ?? type;
  const deviceType = NETWORK_DEVICE_TYPES.find((value) => value === declaredType);
  if (declaredType && !deviceType) return { status: 'error', reason: 'Unsupported device type.' };
  if ((input.deviceType && type && input.deviceType !== type) || (input.mac && macAddress && input.mac.toLowerCase() !== macAddress.toLowerCase())) return { status: 'error', reason: 'Conflicting device field aliases.' };
  return { status: 'ready', data: { ...structuredClone(record), deviceType, mac: input.mac ?? macAddress } };
}

export const MOCK_TELEMETRY_SOURCES: TelemetrySourceItem[] = [
  {
    id: 'ts-win-agent', name: 'Windows Event Log (Warden Agent)', category: 'Windows',
    protocol: 'gRPC / TLS 1.3 Strict mTLS', port: 8443, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 12480, connectedDevices: 685,
    description: 'High-throughput kernel event collection from Security, System, Sysmon, and PowerShell channels.',
    configSummary: 'Encrypted buffer with 1.2 GB disk spooling per endpoint.',
  },
  {
    id: 'ts-syslog-tls', name: 'Syslog over TLS (RFC 5424)', category: 'Syslog',
    protocol: 'TCP / TLS 1.3 (RFC 5424 / 6514)', port: 6514, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 4820, connectedDevices: 87,
    description: 'Palo Alto, Fortinet, Cisco ASA, and Linux Server encrypted syslog ingestion stream.',
    configSummary: 'Automated RFC 5424 / CEF / LEEF grammar parser matching.',
  },
  {
    id: 'ts-syslog-udp', name: 'Legacy UDP Syslog (RFC 3164)', category: 'Syslog',
    protocol: 'UDP (RFC 3164 BSD)', port: 514, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 2150, connectedDevices: 126,
    description: 'Unencrypted standard syslog for legacy industrial switches and embedded instrumentation.',
    configSummary: 'High-speed zero-copy UDP ring buffer.',
  },
  {
    id: 'ts-snmp-v3', name: 'SNMPv3 Polling Collector', category: 'Network',
    protocol: 'SNMPv3 (AuthPriv SHA-256 / AES-256)', port: 161, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 640, connectedDevices: 323,
    description: 'Cryptographically authenticated SNMP telemetry polling switch interfaces, CPU, temperature, and errors.',
    configSummary: 'Poll cycle: 60 seconds. MIBs: IF-MIB, CISCO-PROCESS-MIB, ENTITY-MIB.',
  },
  {
    id: 'ts-netflow', name: 'NetFlow / IPFIX Flow Collector', category: 'Network',
    protocol: 'IPFIX / NetFlow v9 (UDP)', port: 2055, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 1820, connectedDevices: 48,
    description: 'Layer 3/4 flow records exported by perimeter and inter-zone routing devices.',
    configSummary: '1:1000 sampling interval with uniflow flow cache.',
  },
  {
    id: 'ts-rest-api', name: 'Warden REST Telemetry Ingestion API', category: 'API',
    protocol: 'HTTPS REST (JSON / Protobuf)', port: 8443, siteId: 'all', siteName: 'All Sites',
    status: 'Active', eps: 950, connectedDevices: 34,
    description: 'Custom OT middleware, MES platforms, and security tool programmatic event push.',
    configSummary: 'Bearer API Token auth with rate-limiting at 5,000 req/min.',
  },
  {
    id: 'ts-modbus-tcp', name: 'Modbus TCP / OT Telemetry Collector', category: 'Industrial OT',
    protocol: 'Modbus/TCP (Port 502)', port: 502, siteId: 'all', siteName: 'All Sites',
    status: 'Preview / Roadmap', eps: 0, connectedDevices: 0,
    description: 'Direct register polling from PLC holding registers and power meters.',
    configSummary: 'Scheduled for Phase 2 OT Protocol Bridge integration.',
  },
  {
    id: 'ts-opcua-bridge', name: 'OPC-UA Secure Telemetry Bridge', category: 'Industrial OT',
    protocol: 'OPC-UA Binary (TCP 4840)', port: 4840, siteId: 'all', siteName: 'All Sites',
    status: 'Preview / Roadmap', eps: 0, connectedDevices: 0,
    description: 'Certified OPC Foundation binary channel with Basic256Sha256 security profile.',
    configSummary: 'Scheduled for Phase 2 SCADA Connector rollout.',
  },
];

export const MOCK_SNMP_CONFIG: SNMPConfig = {
  version: 'v3', port: 161, pollingIntervalSec: 60, v3Username: 'warden_snmp_collector',
  v3AuthProtocol: 'SHA-256', v3PrivProtocol: 'AES-256', securityLevel: 'authPriv',
  engineId: '800000090300005056B3912C', devicesCount: 323, lastPoll: '8 seconds ago', status: 'Polling Active',
};

export const assetService = {
  normalizeAsset,
  normalizeNetworkDevice,
  async getAssets(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly Asset[]>> {
    return unconfiguredState('No authorized asset inventory source is configured.');
  },
  async getAssetById(id: string, _signal?: AbortSignal): Promise<DataState<Asset>> {
    return id ? unconfiguredState('No authorized asset inventory source is configured.') : { status: 'empty', reason: 'No asset has been selected.' };
  },
  async getNetworkDevices(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly NetworkDevice[]>> {
    return unconfiguredState('No authorized device inventory source is configured.');
  },
  async getNetworkDeviceById(id: string, _signal?: AbortSignal): Promise<DataState<NetworkDevice>> {
    return id ? unconfiguredState('No authorized device inventory source is configured.') : { status: 'empty', reason: 'No device has been selected.' };
  },
  async getTelemetrySources(scope?: SiteScope): Promise<TelemetrySourceItem[]> {
    if (!scope || scope.siteId === 'all') return MOCK_TELEMETRY_SOURCES;
    return MOCK_TELEMETRY_SOURCES.filter((source) => source.siteId === 'all' || source.siteId === scope.siteId);
  },
  async getSNMPConfig(): Promise<SNMPConfig> { return MOCK_SNMP_CONFIG; },
};