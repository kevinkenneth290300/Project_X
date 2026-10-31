import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventsView } from '../views/EventsView';
import { eventService } from '../services/eventService';
import { healthService } from '../services/healthService';
import { agentService } from '../services/agentService';
import { HealthView } from '../views/HealthView';
import { DashboardView } from '../views/DashboardView';
import { ScopeProvider } from '../context/ScopeContext';
import { EventRateChart } from '../components/charts/EventRateChart';

const navigation = { onNavigate: vi.fn(), onSelectEvent: vi.fn() };

describe('sample events and unavailable streaming', () => {
  it('cannot start a fake stream or schedule a no-op streaming heartbeat', async () => {
    const interval = vi.spyOn(window, 'setInterval');
    const network = vi.spyOn(globalThis, 'fetch');
    render(<EventsView {...navigation} />);
    const stream = screen.getByRole('button', { name: 'Live Stream Unavailable' });
    expect(stream).toBeDisabled();
    expect(stream).toHaveAccessibleDescription(/no collector stream is connected/);
    fireEvent.click(stream);
    expect(await screen.findByText(/\d+ sample event records\./)).toBeInTheDocument();
    expect(interval.mock.calls.some((call) => call[1] === 4000)).toBe(false);
    expect(network).not.toHaveBeenCalled();
    expect(screen.queryByText('Streaming Live')).not.toBeInTheDocument();
  });

  it('distinguishes an empty sample result from unavailable streaming', async () => {
    vi.spyOn(eventService, 'getEvents').mockResolvedValue([]);
    render(<EventsView {...navigation} />);
    expect(await screen.findByText('No sample events found.')).toBeInTheDocument();
    expect(screen.getByText(/0 sample event records\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Live Stream Unavailable' })).toBeDisabled();
  });

  it('shows a load failure as unavailable, not zero successfully monitored events', async () => {
    vi.spyOn(eventService, 'getEvents').mockRejectedValue(new Error('Unavailable'));
    render(<EventsView {...navigation} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sample events unavailable');
    expect(screen.getByText(/Record count unavailable/)).toBeInTheDocument();
    expect(screen.queryByText(/0 sample event records/)).not.toBeInTheDocument();
  });
});

describe('sample health and unknown live measurements', () => {
  it('rejects live health/component queries instead of reporting nominal services', async () => {
    await expect(healthService.getHealthStatus()).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    await expect(healthService.getSystemComponents()).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    const sample = await healthService.getSampleHealthStatus();
    expect(sample.components.every((item) => item.status === 'Unavailable' && item.latency === 'Unavailable' && item.throughput === 'Unavailable')).toBe(true);
  });

  it('returns independent sample data instead of mutable shared diagnostics', async () => {
    const sample = await healthService.getSampleHealthStatus();
    sample.clusterResources.cpuUsage = 0;
    sample.components.length = 0;
    const next = await healthService.getSampleHealthStatus();
    expect(next.clusterResources.cpuUsage).toBe(28.4);
    expect(next.components).toHaveLength(5);
  });

  it('renders samples without successful connectivity, TLS, latency, or uptime claims', async () => {
    const live = vi.spyOn(healthService, 'getHealthStatus');
    render(<HealthView onNavigate={vi.fn()} />);
    expect(await screen.findByRole('heading', { name: 'Sample System & Pipeline Diagnostics' })).toBeInTheDocument();
    expect(screen.getByText('LIVE HEALTH UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('Sample CPU Utilization')).toBeInTheDocument();
    expect(screen.queryByText(/ALL SERVICES NOMINAL|100% mTLS verified|99\.98% uptime|Listening on UDP/)).not.toBeInTheDocument();
    expect(live).not.toHaveBeenCalled();
  });

  it('reports unavailable sample diagnostics when loading fails', async () => {
    vi.spyOn(healthService, 'getSampleHealthStatus').mockRejectedValue(new Error('Unavailable'));
    render(<HealthView onNavigate={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sample diagnostics unavailable');
    expect(screen.queryByText('ALL SERVICES NOMINAL')).not.toBeInTheDocument();
  });

  it('keeps an empty agent result at zero instead of inventing a healthy fleet', async () => {
    vi.spyOn(agentService, 'getAgents').mockResolvedValue([]);
    render(<ScopeProvider><DashboardView onNavigate={vi.fn()} onSelectAgent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
    await waitFor(() => expect(screen.getByLabelText('Sample agent record count')).toHaveTextContent(/^0$/));
    expect(screen.getByText('0 Sample Healthy')).toBeInTheDocument();
    expect(screen.queryByText(/685 Online|184 Online|99\.998%|mTLS 1\.3 Active|0 dropped packets/)).not.toBeInTheDocument();
    expect(screen.getByText('Drop count unknown')).toBeInTheDocument();
  });

  it('reports failed dashboard counts as unavailable rather than a measured zero', async () => {
    vi.spyOn(agentService, 'getAgents').mockRejectedValue(new Error('Unavailable'));
    render(<ScopeProvider><DashboardView onNavigate={vi.fn()} onSelectAgent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Counts could not be loaded');
    expect(screen.getByLabelText('Sample agent record count')).toHaveTextContent('Unavailable');
  });

  it('identifies the fixed chart as samples, not current live metrics', () => {
    render(<EventRateChart />);
    expect(screen.getByText('Static sample illustration')).toBeInTheDocument();
    expect(screen.getByText('Live latency unavailable')).toBeInTheDocument();
    expect(screen.queryByText(/EPS: 1,420|LATENCY: 12ms|ACTIVE HOSTS: 184|Now \(/)).not.toBeInTheDocument();
  });
});