import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Layers,
  Building2,
  Server,
  Network,
  Radio,
  Shield,
  ShieldAlert,
  SearchCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  Lock,
  Activity,
  X,
  FileCode2,
  History,
  HardDrive,
  Eye,
} from 'lucide-react';
import { Asset, NavigationSection, AssetType, PurdueLevel } from '../types';
import { assetService, MOCK_ASSETS } from '../services/assetService';
import { useScope } from '../context/ScopeContext';

interface AssetsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onInspectAsset?: (assetId: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ onNavigate }) => {
  const { scope } = useScope();
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [telemetryFilter, setTelemetryFilter] = useState<string>('All');
  const [purdueFilter, setPurdueFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // New asset form state
  const [newAssetData, setNewAssetData] = useState({
    name: '',
    ip: '10.10.20.',
    type: 'PLC Controller' as AssetType,
    purdueLevel: 'Level 1' as PurdueLevel,
    vendor: 'Siemens',
    model: 'S7-1500 Modular PLC',
    criticality: 'Critical' as const,
  });

  useEffect(() => {
    let filtered = [...MOCK_ASSETS];
    if (scope.siteId !== 'all') {
      filtered = filtered.filter(
        (a) => a.siteId === scope.siteId || a.siteName?.toLowerCase().includes(scope.siteId.toLowerCase())
      );
    }
    if (scope.zoneId !== 'all') {
      filtered = filtered.filter((a) => a.zoneId === scope.zoneId);
    }
    setAssets(filtered);
  }, [scope.siteId, scope.zoneId]);

  const filteredAssets = assets.filter((asset) => {
    if (typeFilter !== 'All' && asset.type !== typeFilter) return false;
    if (telemetryFilter !== 'All' && asset.telemetryStatus !== telemetryFilter) return false;
    if (purdueFilter !== 'All' && asset.purdueLevel !== purdueFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.ip.toLowerCase().includes(q) ||
        asset.macAddress.toLowerCase().includes(q) ||
        asset.vendor.toLowerCase().includes(q) ||
        asset.model.toLowerCase().includes(q) ||
        asset.siteName.toLowerCase().includes(q) ||
        asset.zoneName.toLowerCase().includes(q) ||
        asset.groupName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('Asset registration is unavailable until a shared authoritative asset registry exists. No site or zone will be guessed.');
  };

  const getTelemetryBadge = (status: string) => {
    switch (status) {
      case 'Agent Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Agent Active
          </span>
        );
      case 'Syslog Streaming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Radio size={10} className="text-cyan-400" />
            Syslog Stream
          </span>
        );
      case 'SNMP Monitored':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">
            SNMP v3 Polled
          </span>
        );
      case 'Passive Observed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-800/40 text-amber-300">
            Passive Flow
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400">
            Unmonitored
          </span>
        );
    }
  };

  const getCriticalityBadge = (crit: string) => {
    switch (crit) {
      case 'Critical':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/60 border border-rose-800/40 text-rose-400">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/60 border border-amber-800/40 text-amber-400">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-950/60 border border-blue-800/40 text-blue-400">
            MED
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-700 text-slate-400">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Unified Asset Inventory</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              IT/OT FEDERATED LEDGER
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Unified visibility across Windows endpoints, PLCs, RTUs, HMIs, SCADA servers, and industrial switches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled
            aria-describedby="asset-registration-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs font-semibold cursor-not-allowed"
          >
            <Plus size={14} />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      <p id="asset-registration-unavailable" role="status" className="text-amber-300 font-mono text-xs">Asset registration is unavailable until a shared authoritative registry exists. No default plant/zone, device discovery, or live telemetry will be fabricated.</p>
      {registrationError && <p role="alert" className="text-amber-300">{registrationError}</p>}

      {/* Filter and Search Controls */}
      <div className="p-3.5 rounded-xl bg-[#0f151e] border border-slate-800 space-y-3 font-mono">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search asset name, IP, MAC address, vendor, model, firmware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-[11px]">
            <span className="text-slate-400 text-[10px] uppercase">Telemetry:</span>
            {['All', 'Agent Active', 'Syslog Streaming', 'SNMP Monitored', 'Passive Observed'].map((t) => (
              <button
                key={t}
                onClick={() => setTelemetryFilter(t)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  telemetryFilter === t
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row: Purdue Level & Asset Type */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase">Purdue:</span>
          {['All', 'Level 4/5', 'Level 3.5', 'Level 3', 'Level 2', 'Level 1', 'Level 0'].map((p) => (
            <button
              key={p}
              onClick={() => setPurdueFilter(p)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                purdueFilter === p
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-slate-400 text-[10px] uppercase ml-3">Type:</span>
          {[
            'All',
            'Windows Server',
            'PLC Controller',
            'HMI Panel',
            'SCADA Server',
            'Industrial Switch',
            'OT Firewall',
          ].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                typeFilter === type
                  ? 'bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="rounded-xl bg-[#0f151e] border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b1017] text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3 font-semibold">Asset Identity</th>
                <th className="py-2.5 px-3 font-semibold">IP / Network</th>
                <th className="py-2.5 px-3 font-semibold">Site / Purdue Zone</th>
                <th className="py-2.5 px-3 font-semibold">Vendor &amp; Model</th>
                <th className="py-2.5 px-3 font-semibold">Telemetry Feed</th>
                <th className="py-2.5 px-3 font-semibold text-center">Alerts</th>
                <th className="py-2.5 px-3 font-semibold">Last Seen</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                >
                  {/* Asset Identity */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-500">
                        {asset.type.includes('Windows') ? (
                          <Server size={14} />
                        ) : asset.type.includes('Switch') || asset.type.includes('Firewall') ? (
                          <Network size={14} />
                        ) : (
                          <Cpu size={14} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          <span>{asset.name}</span>
                          {getCriticalityBadge(asset.criticality)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {asset.type} • {asset.purdueLevel}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* IP / Network */}
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200 font-bold">{asset.ip}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{asset.macAddress}</div>
                  </td>

                  {/* Site / Zone */}
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{asset.siteName}</div>
                    <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                      <span>{asset.zoneName}</span>
                    </div>
                  </td>

                  {/* Vendor / Model */}
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{asset.vendor}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{asset.model}</div>
                  </td>

                  {/* Telemetry feed */}
                  <td className="py-2.5 px-3">{getTelemetryBadge(asset.telemetryStatus)}</td>

                  {/* Alerts */}
                  <td className="py-2.5 px-3 text-center">
                    {asset.activeDetectionsCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-400 font-bold text-[10px]">
                        {asset.activeDetectionsCount}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Last Seen */}
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] whitespace-nowrap">
                    {asset.lastSeen}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Inspection Drawer / Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50">
          <div className="w-full max-w-xl bg-[#0f151e] border-l border-slate-800 h-full p-5 overflow-y-auto space-y-4 font-sans text-xs text-slate-200 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-100">{selectedAsset.name}</h2>
                    {getCriticalityBadge(selectedAsset.criticality)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedAsset.type} • {selectedAsset.purdueLevel}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  onNavigate('events');
                }}
                className="flex-1 px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-300 font-semibold text-center cursor-pointer transition-colors"
              >
                View Event Stream
              </button>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  onNavigate('investigations');
                }}
                className="flex-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-center cursor-pointer transition-colors"
              >
                Create Investigation
              </button>
            </div>

            {/* Hardware & Identity Specs */}
            <div className="space-y-2 font-mono">
              <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                Identity &amp; Purdue Specification
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-400">Primary IP:</span>
                  <div className="font-bold text-slate-200">{selectedAsset.ip}</div>
                </div>
                <div>
                  <span className="text-slate-400">MAC Address:</span>
                  <div className="font-bold text-slate-200">{selectedAsset.macAddress}</div>
                </div>
                <div>
                  <span className="text-slate-400">Vendor:</span>
                  <div className="font-bold text-slate-200">{selectedAsset.vendor}</div>
                </div>
                <div>
                  <span className="text-slate-400">Hardware Model:</span>
                  <div className="font-bold text-slate-200">{selectedAsset.model}</div>
                </div>
                <div>
                  <span className="text-slate-400">Firmware / OS:</span>
                  <div className="font-bold text-cyan-300">{selectedAsset.firmwareOrOs}</div>
                </div>
                <div>
                  <span className="text-slate-400">Purdue Hierarchy:</span>
                  <div className="font-bold text-slate-200">{selectedAsset.purdueLevel}</div>
                </div>
              </div>
            </div>

            {/* Network & Telemetry Posture */}
            <div className="space-y-2 font-mono">
              <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                Location &amp; Collector Binding
              </div>
              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plant Facility:</span>
                  <span className="text-slate-200 font-bold">{selectedAsset.siteName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purdue Zone:</span>
                  <span className="text-cyan-300 font-bold">{selectedAsset.zoneName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Group:</span>
                  <span className="text-slate-200">{selectedAsset.groupName || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telemetry Feed:</span>
                  <span>{getTelemetryBadge(selectedAsset.telemetryStatus)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Collector Relay:</span>
                  <span className="text-slate-300">{selectedAsset.collectorNode || 'Warden Local Proxy'}</span>
                </div>
              </div>
            </div>

            {/* Industrial Protocols & Open Ports */}
            {selectedAsset.openPorts && selectedAsset.openPorts.length > 0 && (
              <div className="space-y-2 font-mono">
                <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                  Open OT/ICS Ports &amp; Protocols
                </div>
                <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-2 text-[11px]">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.protocols?.map((proto) => (
                      <span
                        key={proto}
                        className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px]"
                      >
                        {proto}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Listening Ports: <strong className="text-slate-200">{selectedAsset.openPorts.join(', ')}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register Asset Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">Register Asset into Warden Ledger</span>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Asset Hostname / Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., PLC-STAMP-LINE01"
                  value={newAssetData.name}
                  onChange={(e) => setNewAssetData({ ...newAssetData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">IP Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="10.10.20.101"
                    value={newAssetData.ip}
                    onChange={(e) => setNewAssetData({ ...newAssetData, ip: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Asset Type</label>
                  <select
                    value={newAssetData.type}
                    onChange={(e: any) => setNewAssetData({ ...newAssetData, type: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="PLC Controller">PLC Controller</option>
                    <option value="RTU / Field Device">RTU / Field Device</option>
                    <option value="HMI Panel">HMI Panel</option>
                    <option value="SCADA Server">SCADA Server</option>
                    <option value="Windows Server">Windows Server</option>
                    <option value="Windows Workstation">Windows Workstation</option>
                    <option value="Linux Server">Linux Server</option>
                    <option value="Industrial Switch">Industrial Switch</option>
                    <option value="OT Firewall">OT Firewall</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Purdue Level</label>
                  <select
                    value={newAssetData.purdueLevel}
                    onChange={(e: any) => setNewAssetData({ ...newAssetData, purdueLevel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Level 4/5">Level 4/5 (Enterprise)</option>
                    <option value="Level 3.5">Level 3.5 (OT DMZ)</option>
                    <option value="Level 3">Level 3 (Operations)</option>
                    <option value="Level 2">Level 2 (Control)</option>
                    <option value="Level 1">Level 1 (Direct Control)</option>
                    <option value="Level 0">Level 0 (Physical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Criticality</label>
                  <select
                    value={newAssetData.criticality}
                    onChange={(e: any) => setNewAssetData({ ...newAssetData, criticality: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g., Rockwell / Siemens"
                    value={newAssetData.vendor}
                    onChange={(e) => setNewAssetData({ ...newAssetData, vendor: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., ControlLogix 5580"
                    value={newAssetData.model}
                    onChange={(e) => setNewAssetData({ ...newAssetData, model: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled
                  aria-describedby="asset-registration-unavailable"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
