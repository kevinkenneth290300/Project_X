import { Agent, StatusLevel } from '../types';
import { MOCK_AGENTS } from './mockData';
import { OperationUnavailableError } from './operationSupport';

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
    if (!await agentService.getAgentById(id)) throw new Error('Agent not found');
    throw new OperationUnavailableError('IR-mode deployment');
  },

  async restartAgent(id: string): Promise<boolean> {
    if (!await agentService.getAgentById(id)) throw new Error('Agent not found');
    throw new OperationUnavailableError('Remote agent restart');
  },

  async enrollAgent(data: { hostname: string; ip: string; site: string; os: string; profileId: string }): Promise<Agent> {
    throw new OperationUnavailableError('Agent enrollment');
  },
};
