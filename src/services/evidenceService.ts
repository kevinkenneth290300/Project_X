import { EvidenceItem } from '../types';
import { MOCK_EVIDENCE } from './mockData';

export const evidenceService = {
  async getEvidenceItems(): Promise<EvidenceItem[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...MOCK_EVIDENCE];
  },

  async getEvidenceById(id?: string): Promise<EvidenceItem | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 30));
    const targetId = id.toLowerCase();
    const item = MOCK_EVIDENCE.find((e) => e.id?.toLowerCase() === targetId);
    return item || null;
  },

  async getEvidenceForInvestigation(evidenceIds?: string[]): Promise<EvidenceItem[]> {
    if (!evidenceIds || !evidenceIds.length) return [];
    return MOCK_EVIDENCE.filter((e) => evidenceIds.includes(e.id));
  },
};
