import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { NavigationSection } from '../types';
import { siteService } from '../services/siteService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';

interface GroupsViewProps {
  onNavigate: (section: NavigationSection) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = () => {
  const { scope, scopeKey } = useScope();
  const state = useDataState(siteService.getGroups, scopeKey);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const groups = state.status === 'ready' ? state.data.filter((group) =>
    (scope.siteId === 'all' || group.siteId === scope.siteId)
    && (scope.zoneId === 'all' || group.zoneId === scope.zoneId)
    && (type === 'All' || group.type === type)
    && `${group.name} ${group.description} ${group.siteName} ${group.zoneName ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  ) : [];
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"><h1 className="font-mono text-lg font-bold text-slate-100">Asset &amp; Device Groups</h1><button disabled aria-describedby="group-creation-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Create Asset Group</button></div>
    <p id="group-creation-unavailable" className="text-slate-400">Group creation requires a durable authorized inventory API.</p>
    <DataStateView state={state} />
    {state.status === 'ready' && <>
      <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2"><Search size={14} /><span className="sr-only">Search groups</span><input aria-label="Search groups" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-700 bg-slate-900 p-2" /></label><select aria-label="Group type" value={type} onChange={(event) => setType(event.target.value)} className="border border-slate-700 bg-slate-900 p-2">{['All', 'Agent Group', 'Network Group', 'OT Controller Group', 'Asset Group'].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Group', 'Type', 'Site', 'Zone', 'Members', 'Policy'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{groups.map((group) => <tr key={group.id}><td className="p-2">{group.name}</td><td className="p-2">{group.type ?? '-'}</td><td className="p-2">{group.siteName}</td><td className="p-2">{group.zoneName ?? '-'}</td><td className="p-2">{group.memberCount ?? group.assetCount ?? '-'}</td><td className="p-2">{group.collectionPolicy ?? group.policyName ?? '-'}</td></tr>)}</tbody></table></div>
      {groups.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No groups match the display filters.' }} />}
    </>}
  </div>;
};