import React, { useState } from 'react';
import { ArrowRight, Building2, Plus, Search } from 'lucide-react';
import { NavigationSection } from '../types';
import { siteService } from '../services/siteService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';
import { StatusBadge } from '../components/status/StatusBadge';

interface SitesViewProps {
  onNavigate: (section: NavigationSection, params?: { siteId?: string }) => void;
  onSelectSite: (siteId: string) => void;
}

export const SitesView: React.FC<SitesViewProps> = ({ onNavigate, onSelectSite }) => {
  const { scope, selectSite, scopeKey } = useScope();
  const state = useDataState(siteService.getSites, scopeKey);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const sites = state.status === 'ready' ? state.data : [];
  const filtered = sites.filter((site) =>
    (scope.siteId === 'all' || site.id === scope.siteId)
    && (status === 'All' || site.status === status)
    && `${site.name} ${site.code} ${site.location} ${site.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <h1 className="font-mono text-lg font-bold text-slate-100">Sites &amp; OT Zones</h1>
      <button disabled aria-describedby="site-creation-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Create Site</button>
    </div>
    <p id="site-creation-unavailable" className="text-slate-400">Site creation requires a durable authorized inventory API.</p>
    <DataStateView state={state} />
    {state.status === 'ready' && <>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2"><Search size={14} /><span className="sr-only">Search sites</span><input aria-label="Search sites" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-700 bg-slate-900 p-2" /></label>
        <select aria-label="Site status" value={status} onChange={(event) => setStatus(event.target.value)} className="border border-slate-700 bg-slate-900 p-2">{['All', 'Healthy', 'Warning', 'Offline', 'Unknown'].map((value) => <option key={value}>{value}</option>)}</select>
        <span>{filtered.length} site records</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((site) => <div key={site.id} className="space-y-3 rounded border border-slate-800 bg-[#0f151e] p-4">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Building2 size={16} /><h2 className="font-mono text-sm font-semibold">{site.name}</h2><span className="text-slate-400">{site.code}</span></div><StatusBadge status={site.status} showPulse={false} /></div>
          <p className="text-slate-400">{site.location}</p><p>{site.description}</p>
          <dl className="grid grid-cols-3 gap-3"><div><dt>Assets</dt><dd>{site.assetsCount}</dd></div><div><dt>Zones</dt><dd>{site.zones.length}</dd></div><div><dt>Health</dt><dd>{site.healthScore ?? '-'}</dd></div></dl>
          <div className="flex flex-wrap gap-2">{site.zones.map((zone) => <span key={zone.id} className="text-slate-400">{zone.name}</span>)}</div>
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-3">
            <button onClick={() => { selectSite(site.id); onNavigate('dashboard'); }} className="text-cyan-300">Set display scope</button>
            <button aria-label={`Open site ${site.name}`} onClick={() => { onSelectSite(site.id); onNavigate('site-detail', { siteId: site.id }); }} className="flex items-center gap-1.5 text-cyan-300">Site Detail<ArrowRight size={14} /></button>
          </div>
        </div>)}
      </div>
      {filtered.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No sites match the display filters.' }} />}
    </>}
  </div>;
};