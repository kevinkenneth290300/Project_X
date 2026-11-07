import { useEffect, useState } from 'react';
import { DataState } from '../data/dataState';

export type DataLoader<Data> = (key: string, signal: AbortSignal) => Promise<DataState<Data>>;

export function useDataState<Data>(load: DataLoader<Data>, key: string, scopeKey = ''): DataState<Data> {
  const [snapshot, setSnapshot] = useState<{ key: string; scopeKey: string; load: DataLoader<Data>; state: DataState<Data> }>({
    key, scopeKey, load, state: { status: 'loading', reason: 'Loading data.' },
  });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setSnapshot({ key, scopeKey, load, state: { status: 'loading', reason: 'Loading data.' } });
    Promise.resolve().then(() => load(key, controller.signal)).then(
      (state) => { if (active) setSnapshot({ key, scopeKey, load, state }); },
      () => { if (active) setSnapshot({ key, scopeKey, load, state: { status: 'error', reason: 'The data source could not be loaded.' } }); },
    );
    return () => { active = false; controller.abort(); };
  }, [load, key, scopeKey]);
  return snapshot.key === key && snapshot.scopeKey === scopeKey && snapshot.load === load
    ? snapshot.state
    : { status: 'loading', reason: 'Loading data.' };
}