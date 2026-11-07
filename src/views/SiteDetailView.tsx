import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { NavigationSection } from '../types';
import { siteService } from '../services/siteService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';
import { StatusBadge } from '../components/status/StatusBadge';

interface SiteDetailViewProps {
  siteId?: string;
  onNavigate: (section: NavigationSection) => void;
}

export const SiteDetailView: React.FC<SiteDetailViewProps> = ({ siteId, onNavigate }) => {
  const { selectSite, setSiteScope } = useScope();
  const state = useDataState(siteService.getSiteById, siteId ?? '');
  const candidateSite = state.status === 'ready' && state.data.id === siteId ? state.data : undefined;
  const invalidZones = candidateSite?.zones.some((zone) => siteService.validateSiteZone([candidateSite], candidateSite.id, zone.id).status !== 'ready');
  const site = invalidZones ? undefined : candidateSite;
  const displayState = invalidZones
    ? { status: 'error' as const, reason: 'Inventory returned invalid zone ownership or metadata.' }
    : state.status === 'ready' && !site
    ? { status: 'empty' as const, reason: 'Site not found. No other site has been selected.' }
    : state;
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <div className="flex items-center gap-3"><button aria-label="Back to Sites List" onClick={() => onNavigate('sites')} className="text-slate-300"><ArrowLeft size={16} /></button><h1 className="font-mono text-lg font-bold text-slate-100">{site?.name ?? 'Site Detail'}</h1></div>
      <button disabled aria-describedby="zone-creation-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Create Zone</button>
    </div>
    <p id="zone-creation-unavailable" className="text-slate-400">Zone creation requires a durable authorized inventory API.</p>
    <DataStateView state={displayState} title={displayState.status === 'empty' ? (siteId ? 'Site not found' : 'Nothing selected') : undefined} />
    {site && <>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-slate-400">{site.code} / {site.location}</p><StatusBadge status={site.status} showPulse={false} /></div>
      <p>{site.description}</p>
      <dl className="grid grid-cols-3 gap-4"><div><dt>Assets</dt><dd>{site.assetsCount}</dd></div><div><dt>Zones</dt><dd>{site.zones.length}</dd></div><div><dt>Health</dt><dd>{site.healthScore ?? '-'}</dd></div></dl>
      <button onClick={() => { selectSite(site.id); onNavigate('dashboard'); }} className="text-cyan-300">Focus display scope on this site</button>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Zone', 'Purdue level', 'Classification', 'Assets', 'Scope'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{site.zones.map((zone) => <tr key={zone.id}><td className="p-2">{zone.name}</td><td className="p-2">{zone.purdueLevel}</td><td className="p-2">{zone.securityClassification}</td><td className="p-2">{zone.assetCount}</td><td className="p-2"><button aria-label={`Select zone ${zone.name}`} onClick={() => setSiteScope(site.id, zone.id)} className="text-cyan-300">Select</button></td></tr>)}</tbody></table></div>
      {site.zones.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No zones are available for this site.' }} />}
    </>}
  </div>;
};