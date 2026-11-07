import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import App from '../App';
import { ScopeProvider, useScope } from '../context/ScopeContext';
import { ScopeSelector } from '../components/navigation/ScopeSelector';
import { TopBar } from '../components/navigation/TopBar';
import { DataState, recordsState, unconfiguredState } from '../data/dataState';
import { DataStateView } from '../components/status/DataStateView';
import { DataLoader, useDataState } from '../hooks/useDataState';

function ScopeSnapshot() {
  const { scope, sites } = useScope();
  return <output aria-label="Scope snapshot">{JSON.stringify({ organization: scope.organizationId, sites: sites.map((site) => site.id) })}</output>;
}

it('starts without a fabricated organization or inventory scope', () => {
  render(<ScopeProvider><ScopeSelector /><ScopeSnapshot /></ScopeProvider>);
  expect(screen.getByText('No scope configured')).toBeInTheDocument();
  expect(screen.getByLabelText('Scope snapshot')).toHaveTextContent('"organization":""');
  expect(screen.getByLabelText('Scope snapshot')).toHaveTextContent('"sites":[]');
  expect(screen.queryByText(/Acme Manufacturing|Chennai|Pune/)).not.toBeInTheDocument();
});

it('distinguishes configured empty records from an unconfigured source', () => {
  expect(recordsState([])).toMatchObject({ status: 'empty' });
  expect(recordsState(['record-a'])).toEqual({ status: 'ready', data: ['record-a'] });
  expect(unconfiguredState()).toMatchObject({ status: 'unconfigured' });
  const denied: DataState<string[]> = { status: 'forbidden', reason: 'No grant is available.' };
  expect(denied).not.toHaveProperty('data');
});

it('does not invent a signed-in operator in the header', () => {
  render(<ScopeProvider><TopBar onNavigate={vi.fn()} /></ScopeProvider>);
  expect(screen.getByText('Not signed in')).toBeInTheDocument();
  expect(screen.queryByText(/^JD$|John Doe|j\.doe@security\.internal/)).not.toBeInTheDocument();
});

it('does not choose a seeded investigation when a detail route has no selection', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'System Notifications' }));
  fireEvent.click(screen.getByText('INV-000142 Triggered'));
  expect(await screen.findByRole('heading', { name: 'Nothing selected' })).toBeInTheDocument();
  expect(screen.queryByText('Not analyzed. This is a locally created sample investigation.')).not.toBeInTheDocument();
});

it('shows only supplied authorized context and removes it on revocation', () => {
  const context = { organization: { id: 'org-test', name: 'Test organization' }, user: { id: 'operator-test', name: 'Test operator', email: 'operator@example.invalid' }, sites: [] };
  const view = render(<ScopeProvider authorizedContext={{ status: 'ready', data: context }}><TopBar onNavigate={vi.fn()} /><ScopeSnapshot /></ScopeProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Test operator' }));
  expect(screen.getByText('operator@example.invalid')).toBeInTheDocument();
  expect(screen.getByLabelText('Scope snapshot')).toHaveTextContent('org-test');
  view.rerender(<ScopeProvider authorizedContext={{ status: 'forbidden', reason: 'No display grant.' }}><TopBar onNavigate={vi.fn()} /><ScopeSnapshot /></ScopeProvider>);
  expect(screen.getByText('Not signed in')).toBeInTheDocument();
  expect(screen.getByText('Access denied')).toBeInTheDocument();
  expect(screen.queryByText('operator@example.invalid')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Scope snapshot')).toHaveTextContent('"organization":""');
});

it.each(['empty', 'unconfigured', 'unavailable', 'unauthenticated', 'forbidden', 'error', 'loading'] as const)('announces the %s state without invented records', (status) => {
  render(<DataStateView state={{ status, reason: 'Factual source condition.' }} />);
  expect(screen.getByRole('status')).toHaveTextContent('Factual source condition.');
  expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
});

function DataProbe({ load, dataKey, scopeKey = '' }: { load: DataLoader<string>; dataKey: string; scopeKey?: string }) {
  const state = useDataState(load, dataKey, scopeKey);
  return <output aria-label="Loaded data">{state.status === 'ready' ? state.data : state.status}</output>;
}

it('aborts old scope requests and ignores late results after a scope change', async () => {
  const responses = new Map<string, (state: DataState<string>) => void>();
  const signals: AbortSignal[] = [];
  const load: DataLoader<string> = (key, signal) => {
    signals.push(signal);
    return new Promise((resolve) => responses.set(key, resolve));
  };
  const view = render(<DataProbe load={load} dataKey="first" />);
  await waitFor(() => expect(responses.has('first')).toBe(true));
  view.rerender(<DataProbe load={load} dataKey="second" />);
  expect(screen.getByLabelText('Loaded data')).toHaveTextContent('loading');
  await waitFor(() => expect(responses.has('second')).toBe(true));
  expect(signals[0].aborted).toBe(true);
  const secondResponse = responses.get('second');
  const firstResponse = responses.get('first');
  if (!secondResponse || !firstResponse) throw new Error('The requested scopes were not loaded.');
  await act(async () => secondResponse({ status: 'ready', data: 'Current scope record' }));
  await act(async () => firstResponse({ status: 'ready', data: 'Stale scope record' }));
  expect(screen.getByLabelText('Loaded data')).toHaveTextContent('Current scope record');
  expect(screen.queryByText('Stale scope record')).not.toBeInTheDocument();
  view.unmount();
  expect(signals[1].aborted).toBe(true);
});

it('preserves expected denial and sanitizes unexpected loader errors', async () => {
  const denied: DataLoader<string> = async () => ({ status: 'forbidden', reason: 'No grant.' });
  const view = render(<DataProbe load={denied} dataKey="denied" />);
  await waitFor(() => expect(screen.getByLabelText('Loaded data')).toHaveTextContent('forbidden'));
  const failed: DataLoader<string> = async () => { throw new Error('Private source detail'); };
  view.rerender(<DataProbe load={failed} dataKey="failed" />);
  await waitFor(() => expect(screen.getByLabelText('Loaded data')).toHaveTextContent('error'));
  expect(screen.queryByText('Private source detail')).not.toBeInTheDocument();
});

it('retires an old identity response even when the selected entity ID is unchanged', async () => {
  const responses: Array<(state: DataState<string>) => void> = [];
  const signals: AbortSignal[] = [];
  const load: DataLoader<string> = (_key, signal) => { signals.push(signal); return new Promise((resolve) => responses.push(resolve)); };
  const view = render(<DataProbe load={load} dataKey="same-entity" scopeKey="identity-one" />);
  await waitFor(() => expect(responses).toHaveLength(1));
  view.rerender(<DataProbe load={load} dataKey="same-entity" scopeKey="identity-two" />);
  await waitFor(() => expect(responses).toHaveLength(2));
  expect(signals[0].aborted).toBe(true);
  await act(async () => responses[1]({ status: 'ready', data: 'Current identity' }));
  await act(async () => responses[0]({ status: 'ready', data: 'Stale identity' }));
  expect(screen.getByLabelText('Loaded data')).toHaveTextContent('Current identity');
});