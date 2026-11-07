import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ScopeProvider } from '../context/ScopeContext';
import { siteService } from '../services/siteService';
import { SitesView } from '../views/SitesView';
import { GroupsView } from '../views/GroupsView';
import { SiteDetailView } from '../views/SiteDetailView';
import { groupFixture } from '../test/fixtures/inventory';

it('returns unconfigured site, zone and group data without runtime fixtures', async () => {
  expect(await siteService.getSites()).toMatchObject({ status: 'unconfigured' });
  expect(await siteService.getZones()).toMatchObject({ status: 'unconfigured' });
  expect(await siteService.getGroups()).toMatchObject({ status: 'unconfigured' });
});

it('renders unconfigured sites with creation disabled instead of invented totals', async () => {
  render(<ScopeProvider><SitesView onNavigate={vi.fn()} onSelectSite={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Not configured' })).toBeInTheDocument();
  const create = screen.getByRole('button', { name: /Create.*Site/i });
  expect(create).toBeDisabled();
  fireEvent.click(create);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByText(/3 Online|685 Windows|Real-time mTLS Stream|Chennai Plant/)).not.toBeInTheDocument();
});

it('renders unconfigured groups and prevents a pretend browser-only save', async () => {
  render(<ScopeProvider><GroupsView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Not configured' })).toBeInTheDocument();
  const create = screen.getByRole('button', { name: /Create.*Group/i });
  expect(create).toBeDisabled();
  fireEvent.click(create);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('distinguishes an unconfigured site reader from a confirmed missing site', async () => {
  render(<ScopeProvider><SiteDetailView siteId="unconfigured-site" onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Not configured' })).toBeInTheDocument();
  expect(screen.queryByText(/Site not found/)).not.toBeInTheDocument();
});

it.each([
  ['empty', 'No data'], ['unavailable', 'Unavailable'], ['unauthenticated', 'Not signed in'],
  ['forbidden', 'Access denied'], ['error', 'Could not load data'],
] as const)('renders %s without returning a fixture fallback', async (status, title) => {
  vi.spyOn(siteService, 'getSites').mockResolvedValue({ status, reason: 'Factual inventory condition.' });
  render(<ScopeProvider><SitesView onNavigate={vi.fn()} onSelectSite={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Open site/ })).not.toBeInTheDocument();
});

it('shows unknown optional group metadata without inventing a measured zero', async () => {
  const group = groupFixture({ memberCount: undefined, zoneName: undefined });
  vi.spyOn(siteService, 'getGroups').mockResolvedValue({ status: 'ready', data: [group] });
  render(<ScopeProvider><GroupsView onNavigate={vi.fn()} /></ScopeProvider>);
  const row = await screen.findByRole('row', { name: /Provided group/ });
  expect(within(row).getAllByRole('cell')[4]).toHaveTextContent('-');
});