import React, { useState } from 'react';
import {
  Building2,
  Layers,
  ArrowLeft,
  Server,
  Network,
  Radio,
  Activity,
  ShieldAlert,
  SearchCheck,
  Plus,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  FileCode2,
  HardDrive,
  Workflow,
} from 'lucide-react';
import { Site, Zone, NavigationSection } from '../types';
import { siteService, MOCK_SITES } from '../services/siteService';
import { useScope } from '../context/ScopeContext';

interface SiteDetailViewProps {
  siteId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const SiteDetailView: React.FC<SiteDetailViewProps> = ({
  siteId = 'chennai',
  onNavigate,
}) => {
  const { selectSite, selectZone } = useScope();
  const [site, setSite] = useState<Site>(() => {
    return MOCK_SITES.find((s) => s.id === siteId) || MOCK_SITES[0];
  });
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneData, setNewZoneData] = useState({
    name: '',
    description: '',
    zoneType: 'Cell Control Zone' as const,
    purdueLevel: 'Level 2' as const,
    securityClassification: 'Restricted OT' as const,
    networkRanges: '10.10.30.0/24',
  });

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneData.name) return;
    const newZone: Zone = {
      id: `${site.code.toLowerCase()}-${newZoneData.name.toLowerCase().replace(/\s+/g, '-')}`,
      siteId: site.id,
      siteName: site.name,
      name: newZoneData.name,
      description: newZoneData.description || 'Custom defined Purdue model zone.',
      zoneType: newZoneData.zoneType,
      purdueLevel: newZoneData.purdueLevel,
      securityClassification: newZoneData.securityClassification,
      networkRanges: newZoneData.networkRanges.split(',').map((s) => s.trim()),
      assetCount: 18,
      networkDevicesCount: 3,
      eps: 120,
      status: 'Healthy',
      telemetrySources: ['Windows Event Log', 'Syslog'],
      collectionPolicies: ['Production Baseline'],
      assignedGroups: ['PLC Controllers'],
    };

    const updatedSite = {
      ...site,
      zones: [...site.zones, newZone],
    };
    setSite(updatedSite);
    setShowAddZoneModal(false);
    setNewZoneData({
      name: '',
      description: '',
      zoneType: 'Cell Control Zone',
      purdueLevel: 'Level 2',
      securityClassification: 'Restricted OT',
      networkRanges: '10.10.30.0/24',
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Back Button & Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sites')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Back to Sites List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-lg font-bold text-slate-100">{site.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
                {site.code}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {site.status}
              </span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">{site.location} • {site.organization}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              selectSite(site.id);
              onNavigate('dashboard');
            }}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            Focus Dashboard on this Site
          </button>
          <button
            onClick={() => setShowAddZoneModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Create OT Zone</span>
          </button>
        </div>
      </div>

      {/* High-Level Site Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Total Assets</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{site.assetsCount.toLocaleString()}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Physical &amp; Virtual</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Windows Agents</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{site.agentsCount}</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">238 Healthy • 2 Warning</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Network Devices</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{site.networkDevicesCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Switches &amp; Firewalls</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Syslog Sources</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{site.syslogSourcesCount}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">RFC 5424 / TLS 6514</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Ingestion Rate</div>
          <div className="text-xl font-bold text-cyan-300 mt-0.5">{site.eps.toLocaleString()} <span className="text-xs font-normal">EPS</span></div>
          <div className="text-[9px] text-emerald-400 mt-0.5">mTLS Real-time Stream</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">Active Alerts</div>
          <div className="text-xl font-bold text-rose-400 mt-0.5">{site.activeDetections}</div>
          <div className="text-[9px] text-amber-400 mt-0.5">{site.activeInvestigations} Investigation Open</div>
        </div>
      </div>

      {/* Collector Telemetry Flow Architecture Panel */}
      <div className="p-4 rounded-xl bg-[#0f151e] border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono">
          <div className="flex items-center gap-2">
            <Workflow size={15} className="text-cyan-400" />
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Site Telemetry Flow Architecture
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">
              Collector: <strong className="text-slate-200">{site.collectorEndpoint}</strong>
            </span>
            <span className="text-slate-400">
              Cert: <strong className="text-emerald-400">{site.certStatus}</strong>
            </span>
          </div>
        </div>

        {/* Visual Pipeline Block Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono py-2">
          {/* Box 1: Sources */}
          <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu size={13} className="text-indigo-400" />
              <span>Plant OT/IT Sources</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Windows Agents:</span>
                <span className="text-slate-200 font-bold">{site.agentsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Network Devices:</span>
                <span className="text-slate-200 font-bold">{site.networkDevicesCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Syslog Collectors:</span>
                <span className="text-slate-200 font-bold">{site.syslogSourcesCount}</span>
              </div>
            </div>
            <div className="text-[9px] text-emerald-400 pt-1 border-t border-slate-800">
              Local segmented networks
            </div>
          </div>

          {/* Box 2: Local Warden Collector */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/50 space-y-2">
            <div className="text-[11px] font-bold text-cyan-200 flex items-center gap-1.5">
              <Server size={13} className="text-cyan-400" />
              <span>Local Site Collector</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>Buffer Queue:</span>
                <span className="text-emerald-400 font-bold">12 MB / 2 GB</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Interval:</span>
                <span className="text-slate-200">500 ms</span>
              </div>
              <div className="flex justify-between">
                <span>Drop Count:</span>
                <span className="text-emerald-400 font-bold">0 dropped</span>
              </div>
            </div>
            <div className="text-[9px] text-cyan-300 pt-1 border-t border-cyan-800/40">
              In-memory ring buffer active
            </div>
          </div>

          {/* Box 3: Encrypted Site Link */}
          <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <Lock size={13} className="text-amber-400" />
              <span>mTLS WAN Uplink</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Cipher:</span>
                <span className="text-slate-200">TLS_AES_256_GCM</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-emerald-400 font-bold">18 ms</span>
              </div>
              <div className="flex justify-between">
                <span>Compression:</span>
                <span className="text-cyan-300 font-bold">4.2x Zstandard</span>
              </div>
            </div>
            <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-800">
              Hardware encrypted IPsec tunnel
            </div>
          </div>

          {/* Box 4: Master Core Ingestion */}
          <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" />
              <span>Master SOC Core</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Active Ingestion</span>
              </div>
              <div className="flex justify-between">
                <span>Index Latency:</span>
                <span className="text-slate-200 font-bold">&lt; 100 ms</span>
              </div>
              <div className="flex justify-between">
                <span>Evidence Hash:</span>
                <span className="text-slate-200">SHA-256 Valid</span>
              </div>
            </div>
            <div className="text-[9px] text-emerald-400 pt-1 border-t border-slate-800">
              Audit immutable storage
            </div>
          </div>
        </div>
      </div>

      {/* Zones Overview & Purdue Level Hierarchy */}
      <div className="p-4 rounded-xl bg-[#0f151e] border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-amber-400" />
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Purdue Model OT/IT Zones ({site.zones.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click a zone to set global scope or view details
          </span>
        </div>

        {/* Zones Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2 font-semibold">Zone Name</th>
                <th className="pb-2 font-semibold">Purdue Level</th>
                <th className="pb-2 font-semibold">Security Class</th>
                <th className="pb-2 font-semibold">Network CIDR</th>
                <th className="pb-2 font-semibold text-right">Assets</th>
                <th className="pb-2 font-semibold text-right">Devices</th>
                <th className="pb-2 font-semibold text-right">EPS</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {site.zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-900/50 transition-colors group">
                  <td className="py-2.5 font-bold text-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{zone.name}</span>
                    </div>
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">{zone.description}</div>
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-[10px]">
                      {zone.purdueLevel}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">{zone.securityClassification}</td>
                  <td className="py-2.5 text-slate-400 font-mono">
                    {zone.networkRanges.join(', ')}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-200">{zone.assetCount}</td>
                  <td className="py-2.5 text-right font-bold text-slate-200">{zone.networkDevicesCount}</td>
                  <td className="py-2.5 text-right text-cyan-300 font-bold">{zone.eps}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {zone.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => {
                        selectSite(site.id);
                        selectZone(zone.id);
                        onNavigate('assets');
                      }}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      Filter Assets
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Filter Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
        <button
          onClick={() => {
            selectSite(site.id);
            onNavigate('agents');
          }}
          className="p-3 rounded-lg bg-[#0f151e] hover:bg-slate-900 border border-slate-800 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-300">
            <span className="text-xs font-bold">View Site Agents</span>
            <Server size={14} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Explore {site.agentsCount} Windows agents in {site.name}
          </div>
        </button>

        <button
          onClick={() => {
            selectSite(site.id);
            onNavigate('network-devices');
          }}
          className="p-3 rounded-lg bg-[#0f151e] hover:bg-slate-900 border border-slate-800 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-300">
            <span className="text-xs font-bold">Network Devices</span>
            <Network size={14} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Inspect {site.networkDevicesCount} industrial switches &amp; firewalls
          </div>
        </button>

        <button
          onClick={() => {
            selectSite(site.id);
            onNavigate('events');
          }}
          className="p-3 rounded-lg bg-[#0f151e] hover:bg-slate-900 border border-slate-800 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-300">
            <span className="text-xs font-bold">Event Stream</span>
            <Activity size={14} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Real-time {site.eps} EPS telemetry logs
          </div>
        </button>

        <button
          onClick={() => {
            selectSite(site.id);
            onNavigate('detections');
          }}
          className="p-3 rounded-lg bg-[#0f151e] hover:bg-slate-900 border border-slate-800 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-400">
            <span className="text-xs font-bold">Site Detections</span>
            <ShieldAlert size={14} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {site.activeDetections} active alerts in {site.name}
          </div>
        </button>
      </div>

      {/* Add Custom Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                <span className="text-sm font-bold text-slate-100">Create Purdue OT/IT Zone</span>
              </div>
              <button
                onClick={() => setShowAddZoneModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleAddZone} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Zone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Battery Stacking Cell Zone"
                  value={newZoneData.name}
                  onChange={(e) => setNewZoneData({ ...newZoneData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Purdue Level</label>
                  <select
                    value={newZoneData.purdueLevel}
                    onChange={(e: any) => setNewZoneData({ ...newZoneData, purdueLevel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Level 4/5">Level 4/5 (Enterprise IT)</option>
                    <option value="Level 3.5">Level 3.5 (OT DMZ)</option>
                    <option value="Level 3">Level 3 (Operations / SCADA)</option>
                    <option value="Level 2">Level 2 (Control Systems)</option>
                    <option value="Level 1">Level 1 (Basic Control / PLC)</option>
                    <option value="Level 0">Level 0 (Physical Process)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Security Class</label>
                  <select
                    value={newZoneData.securityClassification}
                    onChange={(e: any) =>
                      setNewZoneData({ ...newZoneData, securityClassification: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Enterprise Standard">Enterprise Standard</option>
                    <option value="DMZ Isolation">DMZ Isolation</option>
                    <option value="High Security">High Security</option>
                    <option value="Restricted OT">Restricted OT</option>
                    <option value="Critical Safety">Critical Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Network CIDR Ranges (comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 10.10.30.0/24, 10.10.31.0/24"
                  value={newZoneData.networkRanges}
                  onChange={(e) => setNewZoneData({ ...newZoneData, networkRanges: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Operational purpose and equipment..."
                  value={newZoneData.description}
                  onChange={(e) => setNewZoneData({ ...newZoneData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
