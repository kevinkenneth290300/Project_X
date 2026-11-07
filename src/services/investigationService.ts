import { Investigation, InvestigationNote } from '../types';
import { MOCK_INVESTIGATIONS } from './mockData';

let investigationsStore: Investigation[] = [...MOCK_INVESTIGATIONS];

export const investigationService = {
  async getInvestigations(filters?: {
    status?: 'All' | 'Open' | 'Investigating' | 'Resolved' | 'Closed';
    severity?: string;
    host?: string;
    search?: string;
  }): Promise<Investigation[]> {
    await new Promise((r) => setTimeout(r, 60));
    let result = [...investigationsStore];

    if (filters?.status && filters.status !== 'All') {
      result = result.filter((inv) => inv.status === filters.status);
    }
    if (filters?.severity && filters.severity !== 'All') {
      result = result.filter((inv) => inv.severity === filters.severity);
    }
    if (filters?.host && filters.host !== 'All') {
      const hostTarget = filters.host.toLowerCase();
      result = result.filter((inv) => inv.host?.toLowerCase() === hostTarget);
    }
    if (filters?.search) {
      const q = (filters.search || '').toLowerCase();
      result = result.filter(
        (inv) =>
          inv.id?.toLowerCase().includes(q) ||
          inv.title?.toLowerCase().includes(q) ||
          inv.host?.toLowerCase().includes(q) ||
          inv.description?.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getInvestigationById(id?: string): Promise<Investigation | null> {
    if (!id) return null;
    await new Promise((r) => setTimeout(r, 40));
    const targetId = id.toLowerCase();
    const inv = investigationsStore.find((i) => i.id?.toLowerCase() === targetId);
    return inv || null;
  },

  async updateStatus(id: string, status: 'Open' | 'Investigating' | 'Resolved' | 'Closed'): Promise<Investigation | null> {
    if (!id) throw new Error('Investigation not found');
    const targetId = id.toLowerCase();
    const idx = investigationsStore.findIndex((i) => i.id?.toLowerCase() === targetId);
    if (idx !== -1) {
      investigationsStore[idx] = {
        ...investigationsStore[idx],
        status,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      };
      return investigationsStore[idx];
    }
    throw new Error('Investigation not found');
  },

  async addNote(id: string, author: string, role: string, text: string): Promise<InvestigationNote> {
    const targetId = id?.toLowerCase();
    const index = investigationsStore.findIndex((item) => item.id.toLowerCase() === targetId);
    if (index === -1) throw new Error('Investigation not found');
    if (!text.trim()) throw new Error('Note text is required');
    const newNote: InvestigationNote = {
      id: `note-${crypto.randomUUID()}`,
      author,
      role,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      text: text.trim(),
    };
    investigationsStore[index] = {
      ...investigationsStore[index],
      notes: [newNote, ...investigationsStore[index].notes],
      updatedAt: newNote.timestamp,
    };
    return newNote;
  },

  async createInvestigation(data: { title: string; host: string; severity: any; description: string }): Promise<Investigation> {
    if (!data.title.trim() || !data.host.trim()) throw new Error('Investigation title and host are required');
    const newId = `INV-${crypto.randomUUID()}`;
    const newInv: Investigation = {
      id: newId,
      title: data.title.trim(),
      host: data.host.trim(),
      severity: data.severity || 'High',
      confidence: 0,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      assignedTo: 'Unassigned',
      description: data.description,
      aiAssistantAssessment: {
        summary: 'Not analyzed. This is a locally created sample investigation.',
        confidence: 0,
        findings: [],
      },
      timeline: [],
      evidenceIds: [],
      notes: [],
      graphData: {
        nodes: [{ id: 'n-host', label: data.host.trim(), type: 'host' }],
        edges: [],
      },
    };
    investigationsStore = [newInv, ...investigationsStore];
    return newInv;
  },
};
