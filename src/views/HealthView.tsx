import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  HardDrive,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { HealthStatus, NavigationSection } from '../types';
import { healthService } from '../services/healthService';
import { StatusBadge } from '../components/status/StatusBadge';

interface HealthViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({ onNavigate }) => {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setHealthData(await healthService.getSampleHealthStatus());
    } catch {
      setHealthData(null);
      setLoadError('Sample diagnostics unavailable: the data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-mono text-slate-400">Loading sample diagnostics...</div>;
  }

  if (!healthData) return <div role="alert" className="p-8 font-mono text-amber-300">{loadError || 'Sample diagnostics unavailable.'}</div>;

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sample System &amp; Pipeline Diagnostics</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 font-semibold">
              LIVE HEALTH UNAVAILABLE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Static resource illustrations only. No live pipeline, connectivity, delivery, or cryptographic health is verified.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Sample Diagnostics</span>
        </button>
      </div>

      <p role="status" className="text-amber-300 font-mono text-xs">Sample data only. Live health and connectivity measurements are unavailable.</p>

      {/* Cluster Hardware Resources */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Sample CPU Utilization</span>
            <Cpu size={14} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">{healthData.clusterResources.cpuUsage}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${healthData.clusterResources.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Sample Memory Allocated</span>
            <Activity size={14} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">{healthData.clusterResources.memoryUsage}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${healthData.clusterResources.memoryUsage}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Sample Disk Spool Capacity</span>
            <HardDrive size={14} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">{healthData.clusterResources.diskUsage}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${healthData.clusterResources.diskUsage}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Live Pipeline Ingress</span>
            <Server size={14} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300">
            Unavailable
          </div>
          <span className="text-[10px] text-slate-500 block">No live measurements</span>
        </div>
      </div>

      {/* Pipeline Subsystems Component Status */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Sample Telemetry Pipeline Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthData.components.map((comp) => (
            <div
              key={comp.name}
              className="p-3.5 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-300" />
                  <span className="font-bold text-slate-100 text-xs">{comp.name}</span>
                </div>
                <StatusBadge status={comp.status} size="sm" showPulse={false} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <div>
                  <span className="text-slate-500 block">Latency:</span>
                  <span className="text-slate-200 font-semibold">{comp.latency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Throughput:</span>
                  <span className="text-cyan-300 font-semibold">{comp.throughput}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1">
                Sample entry: <span className="text-slate-400">{comp.details}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
