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
    if (!id) return null;
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
    return null;
  },

  async addNote(id: string, author: string, role: string, text: string): Promise<InvestigationNote> {
    const newNote: InvestigationNote = {
      id: `note-${Date.now()}`,
      author,
      role,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      text,
    };
    if (id) {
      const targetId = id.toLowerCase();
      const idx = investigationsStore.findIndex((i) => i.id?.toLowerCase() === targetId);
      if (idx !== -1) {
        investigationsStore[idx].notes = [newNote, ...investigationsStore[idx].notes];
      }
    }
    return newNote;
  },

  async createInvestigation(data: { title: string; host: string; severity: any; description: string }): Promise<Investigation> {
    const newId = `INV-000${Math.floor(143 + Math.random() * 50)}`;
    const newInv: Investigation = {
      id: newId,
      title: data.title,
      host: data.host,
      severity: data.severity || 'High',
      confidence: 85,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      assignedTo: 'SOC Analyst',
      description: data.description,
      aiAssistantAssessment: {
        summary: `Preliminary automated correlation for host ${data.host}. Telemetry analysis indicates anomalous event chain.`,
        confidence: 85,
        findings: [
          {
            id: `f-${Date.now()}`,
            text: 'Triggered security rule matched endpoint behavioral threshold.',
            evidenceId: 'EVID-001',
            severity: data.severity || 'High',
          },
        ],
      },
      timeline: [
        {
          time: new Date().toISOString().slice(11, 19),
          timestamp: new Date().toISOString(),
          label: 'Investigation Opened',
          eventId: 7045,
          eventRecordId: 'evt-7045-svc',
          severity: data.severity || 'High',
          detail: `Initial investigation opened for ${data.host}`,
          evidenceId: 'EVID-001',
        },
      ],
      evidenceIds: ['EVID-001'],
      notes: [],
      graphData: {
        nodes: [
          { id: 'n-host', label: data.host, type: 'host' },
          { id: 'n-event', label: 'Security Trigger', type: 'event' },
        ],
        edges: [{ from: 'n-host', to: 'n-event', label: 'Emitted' }],
      },
    };
    investigationsStore = [newInv, ...investigationsStore];
    return newInv;
  },
};
