import React, { useState } from 'react';
import { Eye, Plus, Search, X } from 'lucide-react';
import { ASSET_TYPES, NavigationSection } from '../types';
import { assetService } from '../services/assetService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';

interface AssetsViewProps {
  onNavigate: (section: NavigationSection) => void;
  onInspectAsset?: (assetId: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ onInspectAsset }) => {
  const { scope, scopeKey } = useScope();
  const state = useDataState(assetService.getAssets, scopeKey);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState<{ scopeKey: string; id: string } | null>(null);
  const normalized = state.status === 'ready' ? state.data.map(assetService.normalizeAsset) : [];
  const invalid = normalized.find((item) => item.status !== 'ready');
  const assets = normalized.flatMap((item) => item.status === 'ready' ? [item.data] : []);
  const duplicateIds = new Set(assets.map((asset) => asset.id)).size !== assets.length;
  const displayState = invalid ?? (duplicateIds ? { status: 'error' as const, reason: 'Inventory returned duplicate asset identifiers.' } : state);
  const visible = assets.filter((asset) => (scope.siteId === 'all' || asset.siteId === scope.siteId) && (scope.zoneId === 'all' || asset.zoneId === scope.zoneId) && (type === 'All' || asset.assetType === type) && `${asset.name} ${asset.ip} ${asset.mac ?? ''} ${asset.vendor} ${asset.model} ${asset.siteName} ${asset.zoneName}`.toLowerCase().includes(search.toLowerCase()));
  const detail = displayState.status === 'ready' && selected?.scopeKey === scopeKey ? assets.find((asset) => asset.id === selected.id) : undefined;
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"><h1 className="font-mono text-lg font-bold text-slate-100">Unified Asset Inventory</h1><button disabled aria-describedby="asset-registration-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Register Asset</button></div>
    <p id="asset-registration-unavailable" className="text-slate-400">Registration requires a durable authorized asset inventory API.</p>
    <DataStateView state={displayState} />
    {displayState.status === 'ready' && <>
      <div className="flex flex-wrap gap-3"><label className="flex items-center gap-2"><Search size={14} /><span className="sr-only">Search assets</span><input aria-label="Search assets" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-700 bg-slate-900 p-2" /></label><select aria-label="Asset type" value={type} onChange={(event) => setType(event.target.value)} className="border border-slate-700 bg-slate-900 p-2"><option>All</option>{ASSET_TYPES.map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Asset', 'IP', 'MAC', 'Type', 'Site', 'Zone', 'Model', 'Telemetry', 'Inspect'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{visible.map((asset) => <tr key={asset.id}><td className="p-2">{asset.name}</td><td className="p-2">{asset.ip}</td><td className="p-2">{asset.mac ?? '-'}</td><td className="p-2">{asset.assetType ?? '-'}</td><td className="p-2">{asset.siteName}</td><td className="p-2">{asset.zoneName}</td><td className="p-2">{asset.model}</td><td className="p-2">{asset.telemetryStatus}</td><td className="p-2"><button aria-label={`Inspect asset ${asset.name}`} title="Inspect asset" onClick={() => { setSelected({ scopeKey, id: asset.id }); onInspectAsset?.(asset.id); }} className="text-cyan-300"><Eye size={14} /></button></td></tr>)}</tbody></table></div>
      {visible.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No assets match the display filters.' }} />}
    </>}
    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div role="dialog" aria-modal="true" aria-label={`Asset ${detail.name}`} className="w-full max-w-lg space-y-3 rounded border border-slate-700 bg-[#0f151e] p-4"><div className="flex justify-between gap-3"><h2>{detail.name}</h2><button aria-label="Close asset details" title="Close" onClick={() => setSelected(null)}><X size={16} /></button></div><dl>{[['ID', detail.id], ['Type', detail.assetType], ['MAC', detail.mac], ['OS / firmware', detail.osFirmware], ['Vendor', detail.vendor], ['Model', detail.model]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd>{value ?? '-'}</dd></div>)}</dl></div></div>}
  </div>;
};