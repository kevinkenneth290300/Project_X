import { Detection, SeverityLevel } from '../types';
import { MOCK_DETECTIONS } from './mockData';
import { OperationUnavailableError } from './operationSupport';

let detectionsStore: Detection[] = MOCK_DETECTIONS.map((item) => ({ ...item, status: 'Disabled' }));

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
    if (!await detectionService.getDetectionById(id)) throw new Error('Detection not found');
    throw new OperationUnavailableError('Detection deployment');
  },

  async createDetection(data: Partial<Detection>): Promise<Detection> {
    if (!data.name?.trim() || !data.ruleQuery?.trim()) throw new Error('Rule name and logic are required');
    const newDet: Detection = {
      id: `det-${crypto.randomUUID()}`,
      name: data.name.trim(),
      description: data.description || 'Locally saved sample definition; not deployed or evaluated.',
      severity: data.severity || 'High',
      confidence: 0,
      triggersCount: 0,
      hostsImpacted: [],
      lastTriggered: 'Not evaluated (demo)',
      status: 'Disabled',
      ruleQuery: data.ruleQuery.trim(),
      mitreAttack: data.mitreAttack || {
        id: 'Unmapped',
        name: 'Unmapped',
        tactic: 'Unmapped',
      },
      evidenceTemplate: data.evidenceTemplate || 'No sample evidence template configured.',
      recentMatchEventIds: [],
    };
    detectionsStore = [newDet, ...detectionsStore];
    return newDet;
  },
};
