import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Server,
  Network,
  Cpu,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  FileCode2,
  Layers,
  Settings,
  Shield,
  Sliders,
} from 'lucide-react';
import { TelemetrySource, NavigationSection } from '../types';
import { assetService, MOCK_TELEMETRY_SOURCES } from '../services/assetService';
import { useScope } from '../context/ScopeContext';

interface TelemetrySourcesViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const TelemetrySourcesView: React.FC<TelemetrySourcesViewProps> = ({ onNavigate }) => {
  const { scope } = useScope();
  const [sources, setSources] = useState<TelemetrySource[]>(MOCK_TELEMETRY_SOURCES);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showSnmpModal, setShowSnmpModal] = useState(false);

  // SNMP Config Modal state
  const [snmpConfig, setSnmpConfig] = useState({
    version: 'SNMPv3' as 'SNMPv2c' | 'SNMPv3',
    securityLevel: 'authPriv' as 'noAuthNoPriv' | 'authNoPriv' | 'authPriv',
    username: 'warden_snmp_collector',
    authProtocol: 'SHA-256',
    authPass: '••••••••••••••••',
    privProtocol: 'AES-256',
    privPass: '••••••••••••••••',
    pollingInterval: '60',
    communityString: 'public',
    port: '161',
  });

  const filteredSources = sources.filter((src) => {
    if (scope.siteId !== 'all' && src.siteId !== 'all' && src.siteId !== scope.siteId) {
      return false;
    }
    if (typeFilter !== 'All' && src.type !== typeFilter) return false;
    return true;
  });

  const handleSaveSnmp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSnmpModal(false);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Telemetry Ingestion Sources</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              COLLECTORS &amp; PROTOCOLS
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Windows event streams, RFC 5424 syslog listeners, SNMP v2c/v3 network pollers, and OT protocol bridges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSnmpModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Sliders size={14} />
            <span>Configure SNMP v3</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Windows Streams</span>
            <Server size={13} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">685 Agents</div>
          <div className="text-[10px] text-emerald-400 mt-1">mTLS TLS 1.3 Active</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Syslog Listeners</span>
            <Radio size={13} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">217 Sources</div>
          <div className="text-[10px] text-cyan-300 mt-1">RFC 5424 + RFC 3164</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Network &amp; SNMP</span>
            <Network size={13} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">323 Switches</div>
          <div className="text-[10px] text-amber-300 mt-1">SNMPv3 SHA-256 / AES-256</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Aggregated Ingestion</span>
            <Activity size={13} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {sources.reduce((acc, s) => acc + s.eps, 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">EPS</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">0 Dropped Packets</div>
        </div>
      </div>

      {/* Protocol Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0f151e] border border-slate-800 font-mono text-[11px] overflow-x-auto">
        {['All', 'Windows Agent', 'Syslog', 'Network / SNMP', 'API / Integrations'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
              typeFilter === t
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Telemetry Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="rounded-xl bg-[#0f151e] border border-slate-800 hover:border-slate-700 transition-all p-4 flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div>
                  <h2 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {source.name}
                  </h2>
                  <span className="text-[10px] font-mono text-cyan-400">{source.type}</span>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {source.status}
                </span>
              </div>

              {/* Source Attributes */}
              <div className="mt-3.5 space-y-2 p-2.5 rounded-lg bg-[#0b1017] border border-slate-800/70 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Protocol:</span>
                  <span className="text-slate-200 font-bold">{source.protocol}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Port / Endpoint:</span>
                  <span className="text-cyan-300">{source.portOrPath}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Active Streams:</span>
                  <span className="text-slate-200">{source.deviceCount} Endpoints</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Ingestion Throughput:</span>
                  <span className="text-emerald-400 font-bold">{source.eps.toLocaleString()} EPS</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 font-mono text-xs">
              <span className="text-[10px] text-slate-400">{source.siteName}</span>
              <span className="text-[10px] text-slate-500 font-mono">Parser: {source.parserName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SNMP v3 Enterprise Configuration Modal */}
      {showSnmpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0f151e] border border-slate-800 shadow-2xl p-5 text-slate-200 text-xs space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">SNMP Polling &amp; Trap Configuration</span>
              </div>
              <button
                onClick={() => setShowSnmpModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 font-mono text-xs cursor-pointer"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleSaveSnmp} className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">SNMP Version</label>
                  <select
                    value={snmpConfig.version}
                    onChange={(e: any) => setSnmpConfig({ ...snmpConfig, version: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="SNMPv3">SNMPv3 (Secure / USM)</option>
                    <option value="SNMPv2c">SNMPv2c (Community)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Security Level</label>
                  <select
                    value={snmpConfig.securityLevel}
                    onChange={(e: any) => setSnmpConfig({ ...snmpConfig, securityLevel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="authPriv">authPriv (Authentication + Encryption)</option>
                    <option value="authNoPriv">authNoPriv (Authentication Only)</option>
                    <option value="noAuthNoPriv">noAuthNoPriv (No Auth / No Priv)</option>
                  </select>
                </div>
              </div>

              {snmpConfig.version === 'SNMPv3' ? (
                <>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Security Username</label>
                    <input
                      type="text"
                      value={snmpConfig.username}
                      onChange={(e) => setSnmpConfig({ ...snmpConfig, username: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Auth Protocol</label>
                      <select
                        value={snmpConfig.authProtocol}
                        onChange={(e) => setSnmpConfig({ ...snmpConfig, authProtocol: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                      >
                        <option value="SHA-256">SHA-256 (FIPS 140-2)</option>
                        <option value="SHA-512">SHA-512</option>
                        <option value="MD5">MD5 (Legacy)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Auth Passphrase</label>
                      <input
                        type="password"
                        value={snmpConfig.authPass}
                        onChange={(e) => setSnmpConfig({ ...snmpConfig, authPass: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Privacy (Encryption)</label>
                      <select
                        value={snmpConfig.privProtocol}
                        onChange={(e) => setSnmpConfig({ ...snmpConfig, privProtocol: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                      >
                        <option value="AES-256">AES-256</option>
                        <option value="AES-128">AES-128</option>
                        <option value="DES">DES (Deprecated)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Priv Passphrase</label>
                      <input
                        type="password"
                        value={snmpConfig.privPass}
                        onChange={(e) => setSnmpConfig({ ...snmpConfig, privPass: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Community String</label>
                  <input
                    type="password"
                    value={snmpConfig.communityString}
                    onChange={(e) => setSnmpConfig({ ...snmpConfig, communityString: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield size={13} />
                  Industrial MIBs Loaded
                </div>
                <p className="text-slate-300 text-[10px]">
                  IF-MIB (Interface Counters), IP-MIB (Routes), CISCO-OT-MIB, and MOXA-TRAP-MIB are active on port 161/UDP.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSnmpModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save SNMP Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
