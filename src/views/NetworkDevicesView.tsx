import React, { useState, useEffect } from 'react';
import {
  Network,
  Search,
  Plus,
  Radio,
  Activity,
  Layers,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  X,
  Cpu,
  Server,
  Lock,
} from 'lucide-react';
import { NetworkDevice, NavigationSection } from '../types';
import { assetService, MOCK_NETWORK_DEVICES } from '../services/assetService';
import { useScope } from '../context/ScopeContext';

interface NetworkDevicesViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const NetworkDevicesView: React.FC<NetworkDevicesViewProps> = ({ onNavigate }) => {
  const { scope } = useScope();
  const [devices, setDevices] = useState<NetworkDevice[]>(MOCK_NETWORK_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let filtered = [...MOCK_NETWORK_DEVICES];
    if (scope.siteId !== 'all') {
      filtered = filtered.filter(
        (d) => d.siteId === scope.siteId || d.siteName?.toLowerCase().includes(scope.siteId.toLowerCase())
      );
    }
    if (scope.zoneId !== 'all') {
      filtered = filtered.filter((d) => d.zoneId === scope.zoneId);
    }
    setDevices(filtered);
  }, [scope.siteId, scope.zoneId]);

  const filteredDevices = devices.filter((dev) => {
    if (typeFilter !== 'All' && dev.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        dev.name.toLowerCase().includes(q) ||
        dev.ip.toLowerCase().includes(q) ||
        dev.model.toLowerCase().includes(q) ||
        dev.vendor.toLowerCase().includes(q) ||
        dev.siteName.toLowerCase().includes(q) ||
        dev.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Network Devices</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              INDUSTRIAL SWITCHES &amp; OT FIREWALLS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            L2/L3 industrial network infrastructure, VLAN boundaries, SNMP telemetry, and syslog stream health
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
        >
          <Plus size={14} />
          <span>Add Network Device</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#0f151e] border border-slate-800 font-mono">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search switch name, IP address, model, firmware, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'Industrial Switch', 'Firewall', 'Core Switch', 'Router'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Network Devices Table */}
      <div className="rounded-xl bg-[#0f151e] border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b1017] text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3 font-semibold">Device Hostname</th>
                <th className="py-2.5 px-3 font-semibold">IP Address</th>
                <th className="py-2.5 px-3 font-semibold">Purdue Zone</th>
                <th className="py-2.5 px-3 font-semibold">Model / OS</th>
                <th className="py-2.5 px-3 font-semibold">Port Status</th>
                <th className="py-2.5 px-3 font-semibold">SNMP Status</th>
                <th className="py-2.5 px-3 font-semibold">Syslog</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDevices.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-500">
                        <Network size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {dev.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{dev.type}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-slate-200">{dev.ip}</td>

                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{dev.siteName}</div>
                    <div className="text-[10px] text-cyan-400">{dev.zoneName}</div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{dev.vendor} {dev.model}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{dev.firmware}</div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">{dev.portsUp} UP</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-400">{dev.portsTotal} Total</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                        dev.snmpStatus === 'Active'
                          ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold'
                          : 'bg-slate-900 border border-slate-700 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dev.snmpStatus === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      {dev.snmpVersion} {dev.snmpStatus}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    {dev.syslogStatus === 'Active' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400">
                        <Radio size={10} />
                        Active
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Disabled</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDevice(dev);
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

      {/* Device Detail Drawer */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50">
          <div className="w-full max-w-lg bg-[#0f151e] border-l border-slate-800 h-full p-5 overflow-y-auto space-y-4 font-sans text-xs text-slate-200 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
                  <Network size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">{selectedDevice.name}</h2>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedDevice.vendor} {selectedDevice.model} • {selectedDevice.type}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDevice(null)}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2.5 rounded bg-[#0b1017] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Ports Active</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {selectedDevice.portsUp} / {selectedDevice.portsTotal}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#0b1017] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">SNMP Feed</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">{selectedDevice.snmpVersion}</div>
              </div>
              <div className="p-2.5 rounded bg-[#0b1017] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Throughput</div>
                <div className="text-base font-bold text-slate-200 mt-0.5">{selectedDevice.eps} EPS</div>
              </div>
            </div>

            {/* Network Specification */}
            <div className="space-y-2 font-mono">
              <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                Network &amp; Firmware Configuration
              </div>
              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Management IP:</span>
                  <span className="text-slate-200 font-bold">{selectedDevice.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MAC Address:</span>
                  <span className="text-slate-200">{selectedDevice.macAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Firmware / OS:</span>
                  <span className="text-cyan-300">{selectedDevice.firmware}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plant Location:</span>
                  <span className="text-slate-200 font-bold">{selectedDevice.siteName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purdue Zone:</span>
                  <span className="text-cyan-300">{selectedDevice.zoneName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device Uptime:</span>
                  <span className="text-slate-200">{selectedDevice.uptime}</span>
                </div>
              </div>
            </div>

            {/* Configured Interfaces Preview */}
            <div className="space-y-2 font-mono">
              <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                Physical Interfaces Status
              </div>
              <div className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-1 text-[10px]">
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>Interface</span>
                  <span>VLAN</span>
                  <span>Speed</span>
                  <span>Link</span>
                </div>
                <div className="flex justify-between py-1 text-slate-200">
                  <span className="font-bold">Gi1/0/1 (Uplink OT DMZ)</span>
                  <span>VLAN 10</span>
                  <span>1000 Mbps</span>
                  <span className="text-emerald-400 font-bold">UP</span>
                </div>
                <div className="flex justify-between py-1 text-slate-200">
                  <span className="font-bold">Gi1/0/2 (SCADA Server 01)</span>
                  <span>VLAN 20</span>
                  <span>1000 Mbps</span>
                  <span className="text-emerald-400 font-bold">UP</span>
                </div>
                <div className="flex justify-between py-1 text-slate-200">
                  <span className="font-bold">Gi1/0/3 (PLC Stacking Line 1)</span>
                  <span>VLAN 30</span>
                  <span>100 Mbps</span>
                  <span className="text-emerald-400 font-bold">UP</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Gi1/0/4 (Spare Port)</span>
                  <span>VLAN 30</span>
                  <span>Auto</span>
                  <span className="text-slate-500">DOWN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Network size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">Add Industrial Network Device</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddModal(false);
              }}
              className="space-y-3 font-mono"
            >
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Device Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SW-CELL-LINE04"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">IP Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="10.10.10.15"
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Device Type</label>
                  <select className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer">
                    <option value="Industrial Switch">Industrial Switch</option>
                    <option value="Firewall">OT Firewall</option>
                    <option value="Core Switch">Core Switch</option>
                    <option value="Router">Edge Router</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Vendor</label>
                  <input
                    type="text"
                    placeholder="Cisco / Moxa / Fortinet"
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="IE-4000-8GS4G-E"
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
