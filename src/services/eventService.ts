import { EventRecord, SeverityLevel } from '../types';
import { MOCK_EVENTS } from './mockData';

let eventsStore: EventRecord[] = [...MOCK_EVENTS];

export const eventService = {
  async getEvents(filters?: {
    search?: string;
    severity?: SeverityLevel | 'All';
    host?: string;
    siteId?: string;
    zoneId?: string;
    channel?: string;
    eventId?: number | string;
    user?: string;
    timeRange?: string;
  }): Promise<EventRecord[]> {
    await new Promise((r) => setTimeout(r, 40));
    let result = [...eventsStore];

    if (filters?.severity && filters.severity !== 'All') {
      result = result.filter((e) => e.severity === filters.severity);
    }
    if (filters?.siteId && filters.siteId !== 'all') {
      result = result.filter((e) => e.siteId === filters.siteId || (e.site && e.site.toLowerCase().includes(filters.siteId.toLowerCase())));
    }
    if (filters?.zoneId && filters.zoneId !== 'all') {
      result = result.filter((e) => e.zoneId === filters.zoneId || e.zone === filters.zoneId);
    }
    if (filters?.host && filters.host !== 'All') {
      const hostTarget = filters.host.toLowerCase();
      result = result.filter((e) => e.host?.toLowerCase() === hostTarget);
    }
    if (filters?.channel && filters.channel !== 'All') {
      const channelTarget = filters.channel.toLowerCase();
      result = result.filter((e) => e.channel?.toLowerCase() === channelTarget);
    }
    if (filters?.eventId && filters.eventId !== 'All') {
      result = result.filter((e) => String(e.eventId) === String(filters.eventId));
    }
    if (filters?.user && filters.user !== 'All') {
      const userTarget = (filters.user || '').toLowerCase();
      result = result.filter((e) => e.user?.toLowerCase().includes(userTarget));
    }
    if (filters?.search) {
      const q = (filters.search || '').toLowerCase();
      result = result.filter(
        (e) =>
          e.summary?.toLowerCase().includes(q) ||
          e.host?.toLowerCase().includes(q) ||
          e.user?.toLowerCase().includes(q) ||
          String(e.eventId).includes(q) ||
          e.provider?.toLowerCase().includes(q) ||
          e.sourceIp?.includes(q) ||
          JSON.stringify(e.details || {}).toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getEventById(id?: string): Promise<EventRecord | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 40));
    const targetId = id.toLowerCase();
    const evt = eventsStore.find((e) => e.id?.toLowerCase() === targetId || String(e.eventId) === id);
    return evt || null;
  },

  async searchEvents(query: string): Promise<EventRecord[]> {
    return this.getEvents({ search: query });
  },
};
