import { Agent, StatusLevel } from '../types';
import { MOCK_AGENTS } from './mockData';

// Simulated in-memory store for reactive prototype interactions
let agentsStore: Agent[] = [...MOCK_AGENTS];

export interface AgentFilters {
  status?: StatusLevel | 'All';
  site?: string;
  siteId?: string;
  zoneId?: string;
  os?: string;
  profileId?: string;
  search?: string;
}

export const agentService = {
  async getAgents(
    filtersOrSiteId?: AgentFilters | string,
    zoneIdParam?: string
  ): Promise<Agent[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 40));
    let result = [...agentsStore];

    let filters: AgentFilters = {};
    if (typeof filtersOrSiteId === 'string') {
      filters = { siteId: filtersOrSiteId, zoneId: zoneIdParam };
    } else if (filtersOrSiteId) {
      filters = filtersOrSiteId;
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters.siteId && filters.siteId !== 'all') {
      result = result.filter(
        (a) => a.siteId === filters.siteId || (a.site && a.site.toLowerCase().includes(filters.siteId!.toLowerCase()))
      );
    } else if (filters.site && filters.site !== 'All') {
      result = result.filter((a) => a.site === filters.site);
    }
    if (filters.zoneId && filters.zoneId !== 'all') {
      result = result.filter((a) => a.zoneId === filters.zoneId || a.zone === filters.zoneId);
    }
    if (filters.profileId && filters.profileId !== 'All') {
      result = result.filter((a) => a.profileId === filters.profileId);
    }
    if (filters.search) {
      const q = (filters.search || '').toLowerCase();
      result = result.filter(
        (a) =>
          a.hostname?.toLowerCase().includes(q) ||
          a.ip?.includes(q) ||
          a.os?.toLowerCase().includes(q) ||
          a.site?.toLowerCase().includes(q) ||
          a.zone?.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getAgentById(id?: string): Promise<Agent | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 60));
    const targetId = id.toLowerCase();
    const agent = agentsStore.find(
      (a) => a.id?.toLowerCase() === targetId || a.hostname?.toLowerCase() === targetId
    );
    return agent || null;
  },

  async toggleInvestigationMode(id?: string): Promise<Agent | null> {
    if (!id) return null;
    const targetId = id.toLowerCase();
    const idx = agentsStore.findIndex(
      (a) => a.id?.toLowerCase() === targetId || a.hostname?.toLowerCase() === targetId
    );
    if (idx !== -1) {
      const updated = {
        ...agentsStore[idx],
        investigationMode: !agentsStore[idx].investigationMode,
        profileName: !agentsStore[idx].investigationMode ? 'Incident Response / Investigation' : 'Windows Server Baseline',
        profileId: !agentsStore[idx].investigationMode ? 'profile-investigation' : 'profile-baseline',
      };
      agentsStore[idx] = updated;
      return updated;
    }
    return null;
  },

  async restartAgent(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    const idx = agentsStore.findIndex((a) => a.id === id || a.hostname === id);
    if (idx !== -1) {
      agentsStore[idx] = {
        ...agentsStore[idx],
        lastSeen: '1 sec ago',
        lastSeenSecondsAgo: 1,
        status: 'Healthy',
      };
      return true;
    }
    return false;
  },

  async enrollAgent(data: { hostname: string; ip: string; site: string; os: string; profileId: string }): Promise<Agent> {
    const newAgent: Agent = {
      id: `agent-custom-${Date.now().toString().slice(-4)}`,
      hostname: data.hostname.toUpperCase(),
      ip: data.ip,
      os: data.os || 'Windows Server 2022 Datacenter (Build 20348.1607)',
      profileId: data.profileId,
      profileName: data.profileId === 'profile-dc' ? 'Domain Controller' : 'Windows Server Baseline',
      status: 'Healthy',
      eventsPerSec: 24,
      queueSize: '0 MB',
      queueBytes: 0,
      version: '0.1.0',
      lastSeen: 'Just now',
      lastSeenSecondsAgo: 1,
      site: data.site || 'US-East-DC1',
      cpuPercent: 8.0,
      memoryPercent: 26.5,
      diskPercent: 42.0,
      uptime: '0d 0h 01m',
      delivery: {
        collected: 420,
        transmitted: 420,
        acknowledged: 420,
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
      enrolledAt: new Date().toISOString(),
      domain: 'CORP.INTERNAL',
    };
    agentsStore = [newAgent, ...agentsStore];
    return newAgent;
  },
};
