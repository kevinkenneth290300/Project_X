import React, { useState } from 'react';
import { Eye, Plus, Search, X } from 'lucide-react';
import { NavigationSection, NETWORK_DEVICE_TYPES } from '../types';
import { assetService } from '../services/assetService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';

interface NetworkDevicesViewProps { onNavigate: (section: NavigationSection) => void; }

export const NetworkDevicesView: React.FC<NetworkDevicesViewProps> = () => {
  const { scope, scopeKey } = useScope();
  const state = useDataState(assetService.getNetworkDevices, scopeKey);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState<{ scopeKey: string; id: string } | null>(null);
  const normalized = state.status === 'ready' ? state.data.map(assetService.normalizeNetworkDevice) : [];
  const invalid = normalized.find((item) => item.status !== 'ready');
  const devices = normalized.flatMap((item) => item.status === 'ready' ? [item.data] : []);
  const duplicates = new Set(devices.map((device) => device.id)).size !== devices.length;
  const displayState = invalid ?? (duplicates ? { status: 'error' as const, reason: 'Inventory returned duplicate device identifiers.' } : state);
  const visible = devices.filter((device) => (scope.siteId === 'all' || device.siteId === scope.siteId) && (scope.zoneId === 'all' || device.zoneId === scope.zoneId) && (type === 'All' || device.deviceType === type) && `${device.name} ${device.ip} ${device.mac ?? ''} ${device.model} ${device.vendor} ${device.siteName} ${device.zoneName}`.toLowerCase().includes(search.toLowerCase()));
  const detail = displayState.status === 'ready' && selected?.scopeKey === scopeKey ? devices.find((device) => device.id === selected.id) : undefined;
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"><h1 className="font-mono text-lg font-bold text-slate-100">Network Devices</h1><button disabled aria-describedby="device-creation-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Add Network Device</button></div>
    <p id="device-creation-unavailable" className="text-slate-400">Device creation requires a durable authorized inventory API.</p>
    <DataStateView state={displayState} />
    {displayState.status === 'ready' && <>
      <label className="flex items-center gap-2"><Search size={14} /><span className="sr-only">Search devices</span><input aria-label="Search devices" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-700 bg-slate-900 p-2" /></label>
      <div className="flex flex-wrap gap-2">{['All', ...NETWORK_DEVICE_TYPES].map((value) => <button key={value} aria-pressed={type === value} onClick={() => setType(value)} className="border border-slate-700 px-2 py-1">{value}</button>)}</div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Device', 'IP', 'MAC', 'Type', 'Zone', 'Firmware', 'Ports', 'Inspect'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{visible.map((device) => <tr key={device.id}><td className="p-2">{device.name}</td><td className="p-2">{device.ip}</td><td className="p-2">{device.mac ?? '-'}</td><td className="p-2">{device.deviceType ?? '-'}</td><td className="p-2">{device.zoneName}</td><td className="p-2">{device.firmware ?? '-'}</td><td className="p-2">{device.portsUp ?? '-'} / {device.portsTotal ?? '-'}</td><td className="p-2"><button aria-label={`Inspect device ${device.name}`} title="Inspect device" onClick={() => setSelected({ scopeKey, id: device.id })} className="text-cyan-300"><Eye size={14} /></button></td></tr>)}</tbody></table></div>
      {visible.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No devices match the display filters.' }} />}
    </>}
    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div role="dialog" aria-modal="true" aria-label={`Device ${detail.name}`} className="w-full max-w-lg space-y-3 rounded border border-slate-700 bg-[#0f151e] p-4"><div className="flex justify-between gap-3"><h2>{detail.name}</h2><button aria-label="Close device details" title="Close" onClick={() => setSelected(null)}><X size={16} /></button></div><dl>{[['ID', detail.id], ['Type', detail.deviceType], ['MAC', detail.mac], ['Firmware', detail.firmware], ['Model', detail.model]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd>{value ?? '-'}</dd></div>)}</dl></div></div>}
  </div>;
};