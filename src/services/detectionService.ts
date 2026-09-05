import { Detection, SeverityLevel } from '../types';
import { MOCK_DETECTIONS } from './mockData';

let detectionsStore: Detection[] = [...MOCK_DETECTIONS];

export const detectionService = {
  async getDetections(filters?: {
    severity?: SeverityLevel | 'All';
    status?: 'All' | 'Active' | 'Testing' | 'Disabled';
    search?: string;
  }): Promise<Detection[]> {
    await new Promise((r) => setTimeout(r, 50));
    let result = [...detectionsStore];

    if (filters?.severity && filters.severity !== 'All') {
      result = result.filter((d) => d.severity === filters.severity);
    }
    if (filters?.status && filters.status !== 'All') {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters?.search) {
      const q = (filters.search || '').toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.mitreAttack?.id?.toLowerCase().includes(q) ||
          d.mitreAttack?.name?.toLowerCase().includes(q) ||
          d.ruleQuery?.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getDetectionById(id?: string): Promise<Detection | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 30));
    const targetId = id.toLowerCase();
    const det = detectionsStore.find((d) => d.id?.toLowerCase() === targetId);
    return det || null;
  },

  async toggleDetectionStatus(id?: string): Promise<Detection | null> {
    if (!id) return null;
    const targetId = id.toLowerCase();
    const idx = detectionsStore.findIndex((d) => d.id?.toLowerCase() === targetId);
    if (idx !== -1) {
      const current = detectionsStore[idx].status;
      detectionsStore[idx] = {
        ...detectionsStore[idx],
        status: current === 'Active' ? 'Disabled' : 'Active',
      };
      return detectionsStore[idx];
    }
    return null;
  },

  async createDetection(data: Partial<Detection>): Promise<Detection> {
    const newDet: Detection = {
      id: `det-${String(detectionsStore.length + 1).padStart(3, '0')}`,
      name: data.name || 'Custom Telemetry Detection Rule',
      description: data.description || 'Custom detection created from event telemetry investigation.',
      severity: data.severity || 'High',
      confidence: data.confidence || 85,
      triggersCount: 0,
      hostsImpacted: data.hostsImpacted || ['SERVER-42'],
      lastTriggered: 'Never',
      status: 'Active',
      ruleQuery: data.ruleQuery || 'event.code: 7045',
      mitreAttack: data.mitreAttack || {
        id: 'T1543.003',
        name: 'Windows Service',
        tactic: 'Persistence',
      },
      evidenceTemplate: data.evidenceTemplate || 'Investigate target process and parent execution tree.',
      recentMatchEventIds: data.recentMatchEventIds || [],
    };
    detectionsStore = [newDet, ...detectionsStore];
    return newDet;
  },
};
