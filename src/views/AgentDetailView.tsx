import React from 'react';
import { ArrowLeft, Layers, Sliders } from 'lucide-react';
import { EventRecord, NavigationSection } from '../types';
import { agentService } from '../services/agentService';
import { eventService } from '../services/eventService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataState } from '../data/dataState';
import { DataStateView } from '../components/status/DataStateView';
import { StatusBadge } from '../components/status/StatusBadge';

interface AgentDetailViewProps {
  agentId?: string;
  onNavigate: (section: NavigationSection, params?: { hostFilter?: string }) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectInvestigation: (invId: string) => void;
}

async function loadHostEvents(host: string, signal: AbortSignal): Promise<DataState<readonly EventRecord[]>> {
  return host ? eventService.getEventsForHost(host, signal) : { status: 'empty', reason: 'No host has been selected.' };
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({ agentId, onNavigate, onSelectEvent }) => {
  const { scope, scopeKey } = useScope();
  const state = useDataState(agentService.getAgentById, agentId ?? '', scopeKey);
  const candidate = state.status === 'ready' && state.data.id === agentId ? state.data : undefined;
  const outsideScope = candidate && ((scope.siteId !== 'all' && candidate.siteId !== scope.siteId) || (scope.zoneId !== 'all' && candidate.zoneId !== scope.zoneId));
  const agent = outsideScope ? undefined : candidate;
  const eventsState = useDataState(loadHostEvents, agent?.hostname ?? '', scopeKey);
  const events = eventsState.status === 'ready' ? eventsState.data : [];
  const invalidEvents = events.some((event) => event.host.toLowerCase() !== agent?.hostname.toLowerCase());
  const eventDisplayState = invalidEvents ? { status: 'error' as const, reason: 'Event source returned records for another host.' } : eventsState;
  const displayState = outsideScope ? { status: 'error' as const, reason: 'Agent source returned a record outside the selected display scope.' } : state.status === 'ready' && !agent ? { status: 'empty' as const, reason: 'Agent not found. No other host has been selected.' } : state;
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"><div className="flex items-center gap-3"><button aria-label="Back to Agent Fleet" onClick={() => onNavigate('agents')}><ArrowLeft size={16} /></button><h1 className="font-mono text-lg font-bold text-slate-100">{agent?.hostname ?? 'Agent Detail'}</h1></div>{agent && <button onClick={() => onNavigate('events', { hostFilter: agent.hostname })} className="flex items-center gap-1.5 text-cyan-300"><Layers size={14} />Host Events</button>}</div>
    <DataStateView state={displayState} title={displayState.status === 'empty' ? (agentId ? 'Agent not found' : 'Nothing selected') : undefined} />
    {agent && <>
      <StatusBadge status={agent.status} showPulse={false} />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['ID', agent.id], ['IP', agent.ip], ['OS', agent.os], ['Profile', agent.profileName]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd>{value || '-'}</dd></div>)}</dl>
      <p id="agent-operations-unavailable" className="text-slate-400">Enrollment, restart and IR/profile deployment are unavailable without an authorized control plane.</p>
      <button disabled aria-describedby="agent-operations-unavailable" className="flex items-center gap-1.5 text-slate-400"><Sliders size={14} />Deploy Investigation Mode</button>
      <h2 className="font-mono text-sm font-semibold">Collection Channels</h2>
      <ul>{Object.entries(agent.collection).filter(([, enabled]) => enabled).map(([channel]) => <li key={channel}>{channel}</li>)}</ul>
      <h2 className="font-mono text-sm font-semibold">Host Event Records</h2>
      <DataStateView state={eventDisplayState} />
      {eventDisplayState.status === 'ready' && <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Event', 'Host', 'Timestamp', 'Summary'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{events.map((event) => <tr key={event.id}><td className="p-2"><button onClick={() => onSelectEvent(event.id)} className="text-cyan-300">{event.eventId}</button></td><td className="p-2">{event.host}</td><td className="p-2">{event.timestamp}</td><td className="p-2">{event.summary}</td></tr>)}</tbody></table></div>}
    </>}
  </div>;
};