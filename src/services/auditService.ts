import { AuditRecord } from '../types';
import { MOCK_AUDIT_LOGS } from './mockData';

export const auditService = {
  async getAuditLogs(filters?: { user?: string; action?: string; search?: string }): Promise<AuditRecord[]> {
    await new Promise((r) => setTimeout(r, 40));
    let result = [...MOCK_AUDIT_LOGS];

    if (filters?.user && filters.user !== 'All') {
      const userTarget = filters.user.toLowerCase();
      result = result.filter((a) => a.user?.toLowerCase() === userTarget);
    }
    if (filters?.search) {
      const q = (filters.search || '').toLowerCase();
      result = result.filter(
        (a) =>
          a.action?.toLowerCase().includes(q) ||
          a.object?.toLowerCase().includes(q) ||
          a.user?.toLowerCase().includes(q) ||
          a.sourceIp?.includes(q)
      );
    }
    return result;
  },
};
