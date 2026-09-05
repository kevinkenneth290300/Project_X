import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Send,
  Database,
  ShieldAlert,
  SearchCheck,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  Building2,
  Cpu,
  Radio,
  Network,
  AlertTriangle,
} from 'lucide-react';
import { EventRateChart } from '../components/charts/EventRateChart';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { StatusBadge } from '../components/status/StatusBadge';
import { NavigationSection, Agent, Investigation, Site } from '../types';
import { agentService } from '../services/agentService';
import { investigationService } from '../services/investigationService';
import { siteService, MOCK_SITES } from '../services/siteService';
import { useScope } from '../context/ScopeContext';

interface DashboardViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectAgent: (agentId: string) => void;
  onSelectInvestigation: (invId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectAgent,
  onSelectInvestigation,
}) => {
  const { scope, sites, setSiteScope } = useScope();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [agentsData, invData] = await Promise.all([
        agentService.getAgents(scope.siteId, scope.zoneId),
        investigationService.getInvestigations(),
      ]);
      setAgents(agentsData);
      setInvestigations(invData);
      setLoading(false);
    };
    fetchData();
  }, [scope.siteId, scope.zoneId]);

  const healthyCount = agents.filter((a) => a.status === 'Healthy').length || (scope.siteId === 'all' ? 685 : 184);
  const warningCount = agents.filter((a) => a.status === 'Warning').length || (scope.siteId === 'all' ? 12 : 3);
  const offlineCount = agents.filter((a) => a.status === 'Offline').length || (scope.siteId === 'all' ? 3 : 1);
  const totalAgents = agents.length || (scope.siteId === 'all' ? 700 : 188);

  const topAgents = agents.slice(0, 4);

  return (
    <div className="space-y-4 font-sans text-xs select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#242426]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-base font-bold text-white tracking-tight">
              {scope.siteId === 'all' ? 'Enterprise Multi-Site Operations' : `${scope.siteName} Operations`}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              {scope.siteId === 'all' ? 'GLOBAL FLEET CONSOLE' : `ZONE: ${scope.zoneName.toUpperCase()}`}
            </span>
          </div>
          <p className="text-[#8E9299] text-xs mt-0.5">
            {scope.siteId === 'all'
              ? 'Aggregated IT/OT telemetry across all manufacturing plants, data centers, and industrial enclaves'
              : `Real-time Purdue model telemetry, PLC health, and threat posture for ${scope.siteName}`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px]">
          <span className="text-[#8E9299] flex items-center gap-1.5">
            <Clock size={13} className="text-[#8E9299]" />
            02 Sep 2026 10:50 UTC
          </span>
          <button
            onClick={() => onNavigate('events')}
            className="px-3 py-1.5 rounded bg-[#151517] hover:bg-[#1A1A1D] border border-[#242426] hover:border-[#3A3A3C] text-white cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Layers size={13} />
            <span>Event Explorer</span>
          </button>
        </div>
      </div>

      {/* Top Operational KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        {/* Assets / Agents KPI */}
        <div
          onClick={() => onNavigate('assets')}
          className="p-3.5 rounded bg-[#151517] border border-[#242426] hover:border-cyan-500/50 hover:bg-[#1A1A1D] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E9299] text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider">Fleet Assets</span>
            <Cpu size={14} className="text-[#8E9299] group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-xl font-bold text-white">{scope.siteId === 'all' ? '1,248' : totalAgents}</div>
          <div className="text-[10px] text-[#8E9299] flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[#27AE60]">{healthyCount} Online</span>
            <span>•</span>
            <span className="text-[#F2994A]">{warningCount} Warn</span>
            <span>•</span>
            <span className="text-[#E64848]">{offlineCount} Off</span>
          </div>
        </div>

        {/* Ingestion KPI */}
        <div
          onClick={() => onNavigate('telemetry-sources')}
          className="p-3.5 rounded bg-[#151517] border border-[#242426] hover:border-cyan-500/50 hover:bg-[#1A1A1D] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E9299] text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider">Telemetry Stream</span>
            <Activity size={14} className="text-[#8E9299] group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-xl font-bold text-white">
            {scope.siteId === 'all' ? '38,400 / s' : '12,481 / s'}
          </div>
          <div className="text-[10px] text-[#27AE60] flex items-center gap-1 mt-1">
            <TrendingUp size={11} />
            <span>0 dropped packets</span>
          </div>
        </div>

        {/* Ingestion Listeners */}
        <div
          onClick={() => onNavigate('telemetry-sources')}
          className="p-3.5 rounded bg-[#151517] border border-[#242426] hover:border-cyan-500/50 hover:bg-[#1A1A1D] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E9299] text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider">OT &amp; Syslog Feeds</span>
            <Radio size={14} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{scope.siteId === 'all' ? '24 Collectors' : '6 Streams'}</div>
          <div className="text-[10px] text-cyan-300 mt-1">SNMPv3 &amp; RFC 5424</div>
        </div>

        {/* Network Infrastructure */}
        <div
          onClick={() => onNavigate('network-devices')}
          className="p-3.5 rounded bg-[#151517] border border-[#242426] hover:border-cyan-500/50 hover:bg-[#1A1A1D] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E9299] text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider">Industrial Switches</span>
            <Network size={14} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{scope.siteId === 'all' ? '323 Switches' : '84 Switches'}</div>
          <div className="text-[10px] text-[#27AE60] mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} /> 99.8% Port Uptime
          </div>
        </div>

        {/* Detections KPI */}
        <div
          onClick={() => onNavigate('detections')}
          className="p-3.5 rounded bg-[#151517] border border-[#242426] hover:border-rose-500/50 hover:bg-[#1A1A1D] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E9299] text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider">Active Threats</span>
            <ShieldAlert size={14} className="text-[#E64848] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">
            {scope.siteId === 'all' ? '31 Active' : '7 Active'}
          </div>
          <div className="text-[10px] text-[#8E9299] flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[#E64848] font-semibold">2 Critical</span>
            <span>•</span>
            <span className="text-[#F2994A]">8 High</span>
          </div>
        </div>
      </div>

      {/* If Scope is ALL SITES: Multi-Site Operations Grid */}
      {scope.siteId === 'all' && (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 size={15} className="text-cyan-400" />
              <span>Plant &amp; Facility Telemetry Status</span>
            </h2>
            <button
              onClick={() => onNavigate('sites')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Manage All {sites.length} Sites &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sites.map((site) => (
              <div
                key={site.id}
                onClick={() => {
                  setSiteScope(site.id, 'all');
                  onNavigate('site-detail', { siteId: site.id });
                }}
                className="p-3.5 rounded-xl bg-[#0f151e] border border-slate-800 hover:border-cyan-500/60 hover:bg-[#131b26] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {site.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{site.location}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                      {site.code}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-[11px] bg-[#0b1017] p-2.5 rounded-lg border border-slate-800/70">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Purdue Zones:</span>
                      <span className="text-slate-200 font-bold">{site.zones?.length || site.zonesCount || 4} Zones</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assets Monitored:</span>
                      <span className="text-cyan-300 font-bold">{site.agentsCount} Assets</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ingestion:</span>
                      <span className="text-emerald-400 font-bold">{site.eps.toLocaleString()} EPS</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/80 text-[10px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {site.status}
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    Inspect Site &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Telemetry Health Chart & Security Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Telemetry Health (2 cols) */}
        <div className="lg:col-span-2 rounded bg-[#151517] border border-[#242426] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#242426] pb-2.5">
            <div>
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Telemetry Health &amp; Ingestion Stream
              </h2>
              <p className="text-[11px] text-[#8E9299]">
                Continuous event rate stream from Windows agents, syslog listeners, and SNMP pollers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1D] border border-[#242426] text-[#8E9299]">
                1m sample window
              </span>
            </div>
          </div>

          <EventRateChart
            currentRate={scope.siteId === 'all' ? '38,400 / s' : '12,481 / s'}
            trend="+8.4%"
            height={140}
          />

          {/* Operational Metrics Sub-row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#242426] font-mono text-[11px]">
            <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
              <span className="text-[#5A5A5E] text-[10px] block uppercase font-bold">Delivery Success</span>
              <span className="font-semibold text-[#27AE60]">99.998%</span>
            </div>
            <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
              <span className="text-[#5A5A5E] text-[10px] block uppercase font-bold">Dropped Events</span>
              <span className="font-semibold text-white">0 events</span>
            </div>
            <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
              <span className="text-[#5A5A5E] text-[10px] block uppercase font-bold">Fleet Queue Depth</span>
              <span className="font-semibold text-[#F2994A]">3.2 GB</span>
            </div>
            <div className="p-2.5 rounded bg-[#1A1A1D] border border-[#242426]">
              <span className="text-[#5A5A5E] text-[10px] block uppercase font-bold">Collector Relay</span>
              <span className="font-semibold text-cyan-300">mTLS 1.3 Active</span>
            </div>
          </div>
        </div>

        {/* Security Activity (1 col) */}
        <div className="rounded bg-[#151517] border border-[#242426] p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#242426] pb-2.5">
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Security Activity
              </h2>
              <span className="text-[10px] font-mono text-[#5A5A5E]">24H SUMMARY</span>
            </div>
            <p className="text-[11px] text-[#8E9299] mt-2">
              Select any severity tier to inspect detections and correlation rules.
            </p>

            <div className="space-y-2 mt-3 font-mono">
              <div
                onClick={() => onNavigate('detections', { severity: 'Critical' })}
                className="flex items-center justify-between p-2.5 rounded bg-[#1A1A1D] border border-[#242426] hover:border-[#E64848]/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#E64848]" />
                  <span className="text-[#E64848] font-semibold">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">2</span>
                  <ArrowRight size={13} className="text-[#E64848]" />
                </div>
              </div>

              <div
                onClick={() => onNavigate('detections', { severity: 'High' })}
                className="flex items-center justify-between p-2.5 rounded bg-[#1A1A1D] border border-[#242426] hover:border-[#F2994A]/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F2994A]" />
                  <span className="text-[#F2994A] font-semibold">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">8</span>
                  <ArrowRight size={13} className="text-[#F2994A]" />
                </div>
              </div>

              <div
                onClick={() => onNavigate('detections', { severity: 'Medium' })}
                className="flex items-center justify-between p-2.5 rounded bg-[#1A1A1D] border border-[#242426] hover:border-yellow-400/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">21</span>
                  <ArrowRight size={13} className="text-yellow-400" />
                </div>
              </div>

              <div
                onClick={() => onNavigate('detections', { severity: 'Low' })}
                className="flex items-center justify-between p-2.5 rounded bg-[#1A1A1D] border border-[#242426] hover:border-blue-400/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-blue-400 font-semibold">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">94</span>
                  <ArrowRight size={13} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('detections')}
            className="w-full py-2 rounded bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] text-[#E0E0E0] font-mono text-[11px] text-center transition-colors cursor-pointer"
          >
            Open Detections Console &rarr;
          </button>
        </div>
      </div>

      {/* Bottom Grid: Active Investigations & Fleet Assets Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Investigations */}
        <div className="rounded bg-[#151517] border border-[#242426] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#242426] pb-2.5">
            <div className="flex items-center gap-2">
              <SearchCheck size={16} className="text-[#F2994A]" />
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Active Investigations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('investigations')}
              className="text-[11px] font-mono text-[#8E9299] hover:text-white cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2 font-mono">
            <div
              onClick={() => {
                onSelectInvestigation('INV-000142');
                onNavigate('investigation-detail');
              }}
              className="p-3 rounded bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    Suspicious service installation
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#242426] border border-[#3A3A3C] text-white">
                    SERVER-42
                  </span>
                </div>
                <div className="text-[11px] text-[#8E9299] font-sans">
                  Executable in C:\Users\Public • Base64 PowerShell cradle
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] shrink-0">
                <SeverityBadge severity="High" size="sm" />
                <span className="text-[#5A5A5E] text-[10px]">4m ago</span>
                <ArrowRight size={13} className="text-[#8E9299]" />
              </div>
            </div>

            <div
              onClick={() => {
                onSelectInvestigation('INV-000141');
                onNavigate('investigation-detail');
              }}
              className="p-3 rounded bg-[#1A1A1D] hover:bg-[#242426] border border-[#242426] hover:border-[#3A3A3C] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    Unusual privileged login
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#242426] border border-[#3A3A3C] text-white">
                    DC-02
                  </span>
                </div>
                <div className="text-[11px] text-[#8E9299] font-sans">
                  Service account created interactive domain account
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] shrink-0">
                <SeverityBadge severity="High" size="sm" />
                <span className="text-[#5A5A5E] text-[10px]">11m ago</span>
                <ArrowRight size={13} className="text-[#8E9299]" />
              </div>
            </div>
          </div>
        </div>

        {/* Agent & Asset Status Table */}
        <div className="rounded bg-[#151517] border border-[#242426] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#242426] pb-2.5">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-[#8E9299]" />
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Active Fleet Endpoints
              </h2>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-[11px] font-mono text-[#8E9299] hover:text-white cursor-pointer"
            >
              View All Endpoints &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#242426] text-[10px] text-[#5A5A5E] uppercase tracking-wider">
                  <th className="pb-2 px-2">Host</th>
                  <th className="pb-2 px-2">Status</th>
                  <th className="pb-2 px-2">Events/s</th>
                  <th className="pb-2 px-2">Queue</th>
                  <th className="pb-2 px-2">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242426]">
                {topAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => {
                      onSelectAgent(agent.id);
                      onNavigate('agent-detail');
                    }}
                    className="hover:bg-[#1A1A1D] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-2 font-bold text-white flex items-center gap-1.5">
                      <span>{agent.hostname}</span>
                      {agent.investigationMode && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#F2994A]/20 text-[#F2994A] border border-[#F2994A]/40">
                          IR MODE
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <StatusBadge status={agent.status} size="sm" showPulse />
                    </td>
                    <td className="py-2.5 px-2 text-white font-semibold">{agent.eventsPerSec}</td>
                    <td className="py-2.5 px-2">
                      <span className={agent.queueSize.includes('GB') ? 'text-[#F2994A] font-semibold' : 'text-[#8E9299]'}>
                        {agent.queueSize}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-[#8E9299] text-[11px]">{agent.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
