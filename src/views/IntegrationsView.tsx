import React, { useState, useEffect } from 'react';
import {
  Workflow,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Send,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { Integration, NavigationSection } from '../types';
import { integrationService } from '../services/integrationService';
import { StatusBadge } from '../components/status/StatusBadge';

interface IntegrationsViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onNavigate }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchI = async () => {
      setLoading(true);
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
      setLoading(false);
    };
    fetchI();
  }, []);

  const handleToggle = async (id: string) => {
    const updated = await integrationService.toggleIntegration(id);
    if (updated) {
      setIntegrations(integrations.map((i) => (i.id === id ? updated : i)));
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    const res = await integrationService.testConnection(id);
    setTestResults((prev) => ({
      ...prev,
      [id]: `${res.message} (${res.latencyMs}ms latency)`,
    }));
    setTestingId(null);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">SIEM &amp; Log Forwarding</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              EXTERNAL EXPORTERS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Configure real-time event replication and normalized forwarding to enterprise SIEM, Data Lake, and Object Storage
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#0f151e] border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    <Workflow size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{item.name}</h3>
                    <span className="text-[10px] text-slate-400">{item.type}</span>
                  </div>
                </div>
                <StatusBadge status={item.status} size="sm" showPulse={item.status === 'Connected'} />
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Destination Endpoint:</span>
                  <span className="text-cyan-300 truncate max-w-[220px]" title={item.endpoint}>
                    {item.endpoint}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Payload Format:</span>
                  <span className="text-slate-200">{item.format}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Last Delivery:</span>
                  <span className="text-slate-300">{item.lastDelivery}</span>
                </div>
              </div>
            </div>

            {testResults[item.id] && (
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{testResults[item.id]}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestConnection(item.id)}
                disabled={testingId === item.id}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Play size={12} className={testingId === item.id ? 'animate-spin' : ''} />
                <span>{testingId === item.id ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  item.status === 'Connected'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {item.status === 'Connected' ? 'Disconnect' : 'Connect Exporter'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
