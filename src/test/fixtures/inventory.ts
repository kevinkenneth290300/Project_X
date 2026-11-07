import { Agent, Asset, AssetGroup, NetworkDevice, Site, Zone } from '../../types';

export function siteFixture(overrides: Partial<Site> = {}): Site {
  return {
    id: 'site-test', name: 'Provided site', code: 'TEST', organization: 'Test organization',
    status: 'Unknown', location: 'Test location', description: 'Provided inventory record',
    healthScore: null, assetsCount: 0, agentsCount: 0, networkDevicesCount: 0, syslogSourcesCount: 0,
    eps: 0, activeDetections: 0, activeInvestigations: 0, lastTelemetry: 'Unavailable',
    lastTelemetrySecondsAgo: 0, connectivity: 'Unavailable', certStatus: 'Unavailable',
    configSync: 'Unavailable', zones: [], collectorEndpoint: '', ...overrides,
  };
}

export function zoneFixture(overrides: Partial<Zone> = {}): Zone {
  return {
    id: 'zone-test', siteId: 'site-test', siteName: 'Provided site', name: 'Provided zone',
    description: 'Provided zone record', zoneType: 'Control Zone', purdueLevel: 'Level 2',
    securityClassification: 'High Security', networkRanges: [], assetCount: 0,
    networkDevicesCount: 0, eps: 0, status: 'Unknown', telemetrySources: [],
    collectionPolicies: [], assignedGroups: [], ...overrides,
  };
}

export function groupFixture(overrides: Partial<AssetGroup> = {}): AssetGroup {
  return {
    id: 'group-test', name: 'Provided group', description: 'Provided group record', type: 'Asset Group',
    siteId: 'site-test', siteName: 'Provided site', zoneId: 'zone-test', zoneName: 'Provided zone',
    memberCount: 0, assetIds: [], ...overrides,
  };
}

export function assetFixture(overrides: Partial<Asset> = {}): Asset {
  return {
    id: 'asset-test', name: 'Provided asset', ip: '198.51.100.10', mac: '00:11:22:33:44:55',
    assetType: 'Windows Server', siteId: 'site-test', siteName: 'Provided site',
    zoneId: 'zone-test', zoneName: 'Provided zone', vendor: 'Test vendor', model: 'Test model',
    criticality: 'Low', telemetryStatus: 'Unmonitored', lastSeen: 'Unavailable',
    status: 'Unknown', ...overrides,
  };
}

export function networkDeviceFixture(overrides: Partial<NetworkDevice> = {}): NetworkDevice {
  return {
    id: 'device-test', name: 'Provided device', ip: '198.51.100.11', mac: '00:11:22:33:44:66',
    deviceType: 'Core Switch', vendor: 'Other', model: 'Test model', firmware: 'Test firmware',
    siteId: 'site-test', siteName: 'Provided site', zoneId: 'zone-test', zoneName: 'Provided zone',
    status: 'Unknown', ...overrides,
  };
}

export function agentFixture(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'agent-test', hostname: 'Provided host', ip: '198.51.100.12', os: 'Provided OS',
    profileId: 'profile-test', profileName: 'Provided profile', status: 'Unknown',
    eventsPerSec: 0, queueSize: 'Unavailable', queueBytes: 0, version: 'Test version',
    lastSeen: 'Unavailable', lastSeenSecondsAgo: 0, site: 'Provided site', siteId: 'site-test',
    zone: 'Provided zone', zoneId: 'zone-test', cpuPercent: 0, memoryPercent: 0, diskPercent: 0,
    uptime: 'Unavailable', delivery: { collected: 0, transmitted: 0, acknowledged: 0, retries: 0, dropped: 0 },
    collection: { security: true, system: false, application: false, powershell: false, defender: false },
    investigationMode: false, enrolledAt: 'Unavailable', domain: 'example.invalid', ...overrides,
  };
}