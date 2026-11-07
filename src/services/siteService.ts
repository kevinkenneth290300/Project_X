import { AssetGroup, Site, Zone, ZONE_TYPES, ZONE_SECURITY_CLASSES } from '../types';
import { DataState, unconfiguredState } from '../data/dataState';

const inventoryUnavailable = 'No authorized site inventory source is configured.';

export const siteService = {
  async getSites(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly Site[]>> {
    return unconfiguredState(inventoryUnavailable);
  },
  async getSiteById(siteId: string, _signal?: AbortSignal): Promise<DataState<Site>> {
    return siteId ? unconfiguredState(inventoryUnavailable) : { status: 'empty', reason: 'No site has been selected.' };
  },
  async getZones(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly Zone[]>> {
    return unconfiguredState(inventoryUnavailable);
  },
  async getGroups(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly AssetGroup[]>> {
    return unconfiguredState('No authorized group inventory source is configured.');
  },
  validateSiteZone(sites: readonly Site[], siteId: string, zoneId: string): DataState<Zone> {
    const site = sites.find((candidate) => candidate.id === siteId);
    if (!site) return { status: 'empty', reason: 'Site not found.' };
    const zone = site.zones.find((candidate) => candidate.id === zoneId && candidate.siteId === siteId);
    if (!zone) return { status: 'forbidden', reason: 'Zone does not belong to the selected site.' };
    if (zone.parentZoneId && (zone.parentZoneId === zone.id || !site.zones.some((parent) => parent.id === zone.parentZoneId && parent.siteId === siteId))) return { status: 'forbidden', reason: 'Parent zone does not belong to the selected site.' };
    if (!ZONE_TYPES.some((type) => type === zone.zoneType) || !ZONE_SECURITY_CLASSES.some((classification) => classification === zone.securityClassification)) return { status: 'error', reason: 'Unsupported zone metadata.' };
    return { status: 'ready', data: structuredClone(zone) };
  },
  async createLocalSite(): Promise<DataState<Site>> {
    return { status: 'unavailable', reason: 'Site creation requires a durable authorized inventory API.' };
  },
  async createZone(): Promise<DataState<Zone>> {
    return { status: 'unavailable', reason: 'Zone creation requires a durable authorized inventory API.' };
  },
};