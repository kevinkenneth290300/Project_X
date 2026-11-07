import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ScopeProvider, useScope } from '../context/ScopeContext';
import { agentService } from '../services/agentService';
import { eventService } from '../services/eventService';
import { AgentDetailView } from '../views/AgentDetailView';
import { AgentsView } from '../views/AgentsView';
import { agentFixture, siteFixture } from '../test/fixtures/inventory';
import { EventRecord } from '../types';

it('starts with unconfigured agent inventory instead of sample hosts', async () => {
  expect(await agentService.getAgents()).toMatchObject({ status: 'unconfigured' });
});

it('renders unconfigured fleet state with enrollment disabled', async () => {
  render(<ScopeProvider><AgentsView onNavigate={vi.fn()} onSelectAgent={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Not configured' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Enroll Agent' })).toBeDisabled();
  expect(screen.queryByText('SERVER-42')).not.toBeInTheDocument();
});

it('shows a confirmed missing agent without another-host fallback', async () => {
  const getAgent = vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status: 'empty', reason: 'Agent not found.' });
  const events = vi.spyOn(eventService, 'getEventsForHost');
  render(<ScopeProvider><AgentDetailView agentId="missing-agent" onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Agent not found' })).toBeInTheDocument();
  expect(getAgent).not.toHaveBeenCalledWith('agent-042');
  expect(events).not.toHaveBeenCalled();
});

it.each(['Provided host one', 'Provided host two'])('uses only selected host %s for event query and navigation', async (hostname) => {
  const agent = agentFixture({ hostname });
  vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status: 'ready', data: agent });
  const events = vi.spyOn(eventService, 'getEventsForHost').mockResolvedValue({ status: 'empty', reason: 'No host events.' });
  const navigate = vi.fn();
  render(<ScopeProvider><AgentDetailView agentId={agent.id} onNavigate={navigate} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
  await screen.findByRole('heading', { name: hostname });
  await waitFor(() => expect(events).toHaveBeenCalledWith(hostname, expect.any(AbortSignal)));
  fireEvent.click(screen.getByRole('button', { name: /Host Events/ }));
  expect(navigate).toHaveBeenCalledWith('events', { hostFilter: hostname });
});

it.each([
  ['unconfigured', 'Not configured'], ['unavailable', 'Unavailable'], ['unauthenticated', 'Not signed in'],
  ['forbidden', 'Access denied'], ['error', 'Could not load data'],
] as const)('renders %s agent sources without another-host lookup', async (status, title) => {
  const source = vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status, reason: 'Factual agent source condition.' });
  render(<ScopeProvider><AgentDetailView agentId="selected-agent" onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  expect(source).not.toHaveBeenCalledWith('agent-042');
});

function eventFixture(host: string): EventRecord {
  return { id: 'event-test', timestamp: '2026-11-07T00:00:00Z', severity: 'Low', host, channel: 'Security', channelFull: 'Security', eventId: 4624, provider: 'Test provider', user: 'Test user', sourceIp: '198.51.100.20', summary: 'Provided event', details: {}, riskIndicators: [], relatedEventIds: [], rawXml: '', rawJson: '{}' };
}

it('rejects event records attributed to another host instead of showing them', async () => {
  const agent = agentFixture();
  vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status: 'ready', data: agent });
  vi.spyOn(eventService, 'getEventsForHost').mockResolvedValue({ status: 'ready', data: [eventFixture('Another host')] });
  render(<ScopeProvider><AgentDetailView agentId={agent.id} onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Could not load data' })).toBeInTheDocument();
  expect(screen.queryByText('Another host')).not.toBeInTheDocument();
});

function AgentScopeControl() {
  const { setSiteScope } = useScope();
  return <button onClick={() => setSiteScope('site-one')}>Select agent display scope</button>;
}

it('does not show a provided agent outside the selected display scope', async () => {
  const agent = agentFixture({ siteId: 'site-two' });
  const context = { organization: { id: 'test-org', name: 'Test organization' }, user: { id: 'test-user', name: 'Test operator', email: 'operator@example.invalid' }, sites: [siteFixture({ id: 'site-one' }), siteFixture({ id: 'site-two' })] };
  vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status: 'ready', data: agent });
  render(<ScopeProvider authorizedContext={{ status: 'ready', data: context }}><AgentScopeControl /><AgentDetailView agentId={agent.id} onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Select agent display scope' }));
  expect(await screen.findByRole('heading', { name: 'Could not load data' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: agent.hostname })).not.toBeInTheDocument();
});