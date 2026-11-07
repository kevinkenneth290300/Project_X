import { Agent } from '../types';
import { DataState, unconfiguredState } from '../data/dataState';

const noAgentSource = 'No authorized agent inventory source is configured.';

export const agentService = {
  async getAgents(_scopeKey = '', _signal?: AbortSignal): Promise<DataState<readonly Agent[]>> {
    return unconfiguredState(noAgentSource);
  },
  async getAgentById(id = '', _signal?: AbortSignal): Promise<DataState<Agent>> {
    return id ? unconfiguredState(noAgentSource) : { status: 'empty', reason: 'No agent has been selected.' };
  },
  async toggleInvestigationMode(id = ''): Promise<DataState<Agent>> {
    return id ? { status: 'unavailable', reason: 'Remote IR/profile deployment requires an authorized control plane.' } : { status: 'empty', reason: 'No agent has been selected.' };
  },
  async restartAgent(id = ''): Promise<DataState<boolean>> {
    return id ? { status: 'unavailable', reason: 'Remote agent restart requires an authorized control plane.' } : { status: 'empty', reason: 'No agent has been selected.' };
  },
  async enrollAgent(_data: { hostname: string; ip: string; site: string; os: string; profileId: string }): Promise<DataState<Agent>> {
    return { status: 'unavailable', reason: 'Agent enrollment requires an authorized control plane.' };
  },
};