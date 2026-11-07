import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DataState, DataStatus } from '../../data/dataState';

const stateTitles: Record<Exclude<DataStatus, 'ready'>, string> = {
  empty: 'No data',
  unconfigured: 'Not configured',
  unavailable: 'Unavailable',
  unauthenticated: 'Not signed in',
  forbidden: 'Access denied',
  error: 'Could not load data',
  loading: 'Loading',
};

export function DataStateView({ state, title, action, compact = false }: {
  state: DataState<unknown>;
  title?: string;
  action?: { label: string; onClick: () => void };
  compact?: boolean;
}) {
  if (state.status === 'ready') return null;
  if (compact) return <span role="status" aria-live="polite" title={state.reason} className="font-mono text-xs text-slate-400">{title ?? stateTitles[state.status]}<span className="sr-only">: {state.reason}</span></span>;
  return (
    <div role="status" aria-live="polite" className="space-y-2 py-3 text-xs text-slate-400">
      <h2 className="font-mono text-sm font-semibold text-slate-200">{title ?? stateTitles[state.status]}</h2>
      <p>{state.reason}</p>
      {action && <button type="button" onClick={action.onClick} className="flex items-center gap-1.5 text-cyan-300"><ArrowLeft size={14} />{action.label}</button>}
    </div>
  );
}