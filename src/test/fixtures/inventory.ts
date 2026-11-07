import { AssetGroup, Site, Zone } from '../../types';

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