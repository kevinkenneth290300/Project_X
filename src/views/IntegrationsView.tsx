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

  useEffect(() => {
    const fetchI = async () => {
      setLoading(true);
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
      setLoading(false);
    };
    fetchI();
  }, []);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">SIEM &amp; Log Forwarding</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              SAMPLE CONFIGURATION
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Sample integration configuration. No exporters are connected and no delivery has been performed.
          </p>
        </div>
      </div>

      <p id="integration-operations-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Exporter connections and TLS connection tests are unavailable in this demonstration.
      </p>

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
                <StatusBadge status="Unavailable" size="sm" showPulse={false} />
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

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                disabled
                aria-describedby="integration-operations-unavailable"
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-xs cursor-not-allowed flex items-center gap-1.5"
              >
                <Play size={12} />
                <span>Test Connection</span>
              </button>

              <button
                disabled
                aria-describedby="integration-operations-unavailable"
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Connect Exporter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
