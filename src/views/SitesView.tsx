import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Server,
  Network,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Site, NavigationSection } from '../types';
import { siteService } from '../services/siteService';
import { StatusBadge } from '../components/status/StatusBadge';
import { useScope } from '../context/ScopeContext';

interface SitesViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectSite: (siteId: string) => void;
}

export const SitesView: React.FC<SitesViewProps> = ({ onNavigate, onSelectSite }) => {
  const { selectSite, sites, scope } = useScope();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Warning' | 'Offline'>('All');
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [newSiteData, setNewSiteData] = useState({
    name: '',
    code: '',
    location: '',
    description: '',
  });

  const filteredSites = sites.filter((site) => {
    if (statusFilter !== 'All' && site.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        site.name.toLowerCase().includes(q) ||
        site.code.toLowerCase().includes(q) ||
        site.location.toLowerCase().includes(q) ||
        site.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProvisionSite = (e: React.FormEvent) => {
    e.preventDefault();
    setCreationError(null);
    try {
      siteService.createLocalSite(newSiteData, scope.organizationName);
      setShowProvisionModal(false);
      setNewSiteData({ name: '', code: '', location: '', description: '' });
    } catch (error) {
      setCreationError(error instanceof Error ? error.message : 'Unable to create the local sample site.');
    }
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={`Sample: ${status}`} size="sm" showPulse={false} />;
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sites &amp; OT Zones</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              MULTI-PLANT ARCHITECTURE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Distributed manufacturing plants, Purdue model segmentation, and local Warden telemetry collectors
          </p>
        </div>

        <button
          onClick={() => { setCreationError(null); setShowProvisionModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Create Local Sample Site</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800/80 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Sites</span>
            <Building2 size={13} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{sites.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">3 Online • 1 Intermittent</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800/80 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total OT/IT Zones</span>
            <Layers size={13} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {sites.reduce((acc, s) => acc + s.zones.length, 0)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Purdue Model L1 - L5</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800/80 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Aggregated Assets</span>
            <Server size={13} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {sites.reduce((acc, s) => acc + s.assetsCount, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-cyan-300 mt-1">685 Windows • 323 Network</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800/80 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Global Ingestion Rate</span>
            <Activity size={13} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {sites.reduce((acc, s) => acc + s.eps, 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">EPS</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Real-time mTLS Stream</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#0f151e] border border-slate-800 font-mono">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plant name, code, location, or telemetry endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Healthy', 'Warning', 'Offline'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="rounded-xl bg-[#0f151e] border border-slate-800 hover:border-slate-700 transition-all p-4.5 flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Site Card Top Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-500 transition-colors">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        onClick={() => {
                          onSelectSite(site.id);
                          onNavigate('site-detail');
                        }}
                        className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {site.name}
                      </h2>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                        {site.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{site.location}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(site.status)}
                  <span className="text-[10px] font-mono text-slate-400">
                    Sample health: <strong className="text-slate-200">{site.healthScore === null ? 'Unavailable' : `${site.healthScore}%`}</strong>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-xs mt-3 line-clamp-2 leading-relaxed">
                {site.description}
              </p>

              {/* Technical Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 my-3.5 p-2.5 rounded-lg bg-[#0b1017] border border-slate-800/70 font-mono text-[11px]">
                <div>
                  <div className="text-slate-400 text-[9px] uppercase">Total Assets</div>
                  <div className="font-bold text-slate-200 mt-0.5">{site.assetsCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[9px] uppercase">Win Agents</div>
                  <div className="font-bold text-slate-200 mt-0.5">{site.agentsCount}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[9px] uppercase">Net Devices</div>
                  <div className="font-bold text-slate-200 mt-0.5">{site.networkDevicesCount}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[9px] uppercase">Throughput</div>
                  <div className="font-bold text-cyan-300 mt-0.5">{site.eps.toLocaleString()} EPS</div>
                </div>
              </div>

              {/* Zones Pill Tags */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Configured Zones ({site.zones.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {site.activeDetections > 0 ? (
                      <span className="text-rose-400 font-semibold">{site.activeDetections} Active Alerts</span>
                    ) : (
                      <span className="text-emerald-400">Clean</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {site.zones.map((z) => (
                    <span
                      key={z.id}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {z.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-800/80 font-mono text-xs">
              <div className="text-[10px] text-slate-400">
                Collector: <span className="text-slate-300">{site.collectorEndpoint || 'Not configured'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    selectSite(site.id);
                    onNavigate('dashboard');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold cursor-pointer transition-colors"
                >
                  Set Global Scope
                </button>
                <button
                  onClick={() => {
                    onSelectSite(site.id);
                    onNavigate('site-detail');
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  <span>Site Detail</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provision Site Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="local-site-title" aria-describedby="local-site-limits" className="w-full max-w-lg rounded-lg bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-cyan-400" />
                <span id="local-site-title" className="text-sm font-bold text-slate-100">Create Local Sample Site</span>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <p id="local-site-limits" role="status" className="text-amber-300">Local sample only. Records are shared within this browser session and lost on refresh; no site, collector, certificate, or security policy is provisioned.</p>
            {creationError && <p role="alert" className="text-amber-300">{creationError}</p>}

            <form onSubmit={handleProvisionSite} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Plant / Site Name *</label>
                <input
                  type="text"
                  aria-label="Sample site name"
                  required
                  placeholder="e.g., Ahmedabad Battery Plant"
                  value={newSiteData.name}
                  onChange={(e) => setNewSiteData({ ...newSiteData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Site Code *</label>
                  <input
                    type="text"
                    aria-label="Sample site code"
                    required
                    placeholder="e.g., AHM-PLANT-05"
                    value={newSiteData.code}
                    onChange={(e) => setNewSiteData({ ...newSiteData, code: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Sanand GIDC, Gujarat"
                    value={newSiteData.location}
                    onChange={(e) => setNewSiteData({ ...newSiteData, location: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Operational Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe industrial operations, assembly lines, and machinery..."
                  value={newSiteData.description}
                  onChange={(e) => setNewSiteData({ ...newSiteData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield size={13} />
                  No Automatic Provisioning
                </div>
                <p className="text-slate-300 text-[10px]">
                  New sample sites start with no zones or inventory and with unavailable health/connectivity. No endpoint or TLS certificate is created.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save Local Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
