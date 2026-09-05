import { Integration } from '../types';
import { MOCK_INTEGRATIONS } from './mockData';

let integrationsStore: Integration[] = [...MOCK_INTEGRATIONS];

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...integrationsStore];
  },

  async toggleIntegration(id: string): Promise<Integration | null> {
    const idx = integrationsStore.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const current = integrationsStore[idx].status;
      integrationsStore[idx] = {
        ...integrationsStore[idx],
        status: current === 'Connected' ? 'Not Connected' : 'Connected',
        lastDelivery: current === 'Connected' ? 'Disconnected' : 'Just now',
      };
      return integrationsStore[idx];
    }
    return null;
  },

  async testConnection(id: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const item = integrationsStore.find((i) => i.id === id);
    if (!item) return { success: false, latencyMs: 0, message: 'Integration not found' };
    return {
      success: true,
      latencyMs: Math.floor(12 + Math.random() * 25),
      message: `Successfully reached ${item.endpoint} with TLS certificate handshake verified.`,
    };
  },
};
