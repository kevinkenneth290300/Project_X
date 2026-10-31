import { Integration } from '../types';
import { MOCK_INTEGRATIONS } from './mockData';
import { OperationUnavailableError } from './operationSupport';

const integrationsStore: Integration[] = [...MOCK_INTEGRATIONS];

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    return integrationsStore.map((item) => ({
      ...item,
      status: 'Not Connected',
      lastDelivery: 'Unavailable (demo)',
    }));
  },

  async toggleIntegration(id: string): Promise<Integration | null> {
    if (!integrationsStore.some((item) => item.id === id)) throw new Error('Integration not found');
    throw new OperationUnavailableError('Exporter connection');
  },

  async testConnection(id: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    if (!integrationsStore.some((item) => item.id === id)) throw new Error('Integration not found');
    throw new OperationUnavailableError('Integration connection test');
  },
};
