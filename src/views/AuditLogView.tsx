import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  User,
  Shield,
  Layers,
  Clock,
  Download,
} from 'lucide-react';
import { AuditLogEntry, NavigationSection } from '../types';
import { auditService } from '../services/auditService';

interface AuditLogViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const data = await auditService.getAuditLogs({ user: userFilter, search });
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, [userFilter, search]);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Platform Audit Log</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
              TAMPER-EVIDENT JOURNAL
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Immutable tracking of operator actions, policy updates, status modifications, and agent enrollments
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, target, user, IP..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-400">Analyst / Actor:</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
          >
            <option value="All">All Operators</option>
            <option value="alex.vance">alex.vance</option>
            <option value="marcus.reid">marcus.reid</option>
            <option value="system">system</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Timestamp (UTC)</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Target Entity</th>
                <th className="px-3 py-2.5">IP Address</th>
                <th className="px-3 py-2.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-200">{log.user}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[11px]">{log.role}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-slate-200">{log.target}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[11px]">{log.ipAddress}</td>
                  <td className="px-3 py-2.5 text-slate-300 max-w-[280px] truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
