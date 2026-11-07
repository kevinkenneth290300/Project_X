import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { siteService } from '../services/siteService';
import { ScopeProvider, useScope } from '../context/ScopeContext';
import { recordsState, selectedRecord } from '../data/dataState';
import { SitesView } from '../views/SitesView';
import { SiteDetailView } from '../views/SiteDetailView';
import { Site } from '../types';
import { siteFixture, zoneFixture } from '../test/fixtures/inventory';

function TestScope({ sites, children }: { sites: readonly Site[]; children: React.ReactNode }) {
  const context = { organization: { id: 'test-organization', name: 'Test organization' }, user: { id: 'test-operator', name: 'Test operator', email: 'operator@example.invalid' }, sites };
  return <ScopeProvider authorizedContext={{ status: 'ready', data: context }}>{children}</ScopeProvider>;
}

function ScopeControls() {
  const { scope, setSiteScope } = useScope();
  return <><output aria-label="Selected scope">{`${scope.siteId}/${scope.zoneId}`}</output><button onClick={() => setSiteScope('site-one')}>First scope</button><button onClick={() => setSiteScope('site-two')}>Second scope</button></>;
}

function SiteWorkflow() {
  const [siteId, setSiteId] = useState<string>();
  return siteId ? <SiteDetailView siteId={siteId} onNavigate={() => setSiteId(undefined)} /> : <SitesView onNavigate={vi.fn()} onSelectSite={setSiteId} />;
}

it('retrieves distinct provided IDs without injecting another plant or inventory', () => {
  const first = siteFixture({ id: 'site-one', name: 'Provided plant one' });
  const second = siteFixture({ id: 'site-two', name: 'Provided plant two' });
  expect(selectedRecord([first, second], first.id)).toMatchObject({ status: 'ready', data: { id: first.id, name: first.name, zones: [] } });
  expect(selectedRecord([first, second], second.id)).toMatchObject({ status: 'ready', data: { id: second.id, name: second.name } });
});

it('never resolves unknown IDs by substring or another plant', () => {
  const site = siteFixture();
  expect(selectedRecord([site], 'missing-site')).toMatchObject({ status: 'empty' });
  expect(selectedRecord([site], 'site')).toMatchObject({ status: 'empty' });
  expect(siteService.validateSiteZone([site], 'missing-site', 'zone-test')).toMatchObject({ status: 'empty' });
});

it('rejects cross-site zones, all-zone defaults and forged parent ownership', () => {
  const first = siteFixture({ id: 'site-one' });
  const second = siteFixture({ id: 'site-two' });
  const zone = zoneFixture({ id: 'zone-one', siteId: first.id });
  first.zones = [zone];
  second.zones = [zoneFixture({ id: 'zone-two', siteId: second.id, parentZoneId: zone.id })];
  expect(siteService.validateSiteZone([first, second], first.id, zone.id)).toMatchObject({ status: 'ready', data: { siteId: first.id } });
  expect(siteService.validateSiteZone([first, second], second.id, zone.id)).toMatchObject({ status: 'forbidden' });
  expect(siteService.validateSiteZone([first, second], second.id, 'all')).toMatchObject({ status: 'forbidden' });
  expect(siteService.validateSiteZone([first, second], second.id, 'zone-two')).toMatchObject({ status: 'forbidden' });
});

it('keeps provided records independent of returned read copies', () => {
  const site = siteFixture();
  const result = selectedRecord([site], site.id);
  if (result.status !== 'ready') throw new Error('The provided record was not selected.');
  result.data.name = 'Changed outside source';
  result.data.zones.push(zoneFixture());
  expect(site.name).toBe('Provided site');
  expect(site.zones).toEqual([]);
});

it('rejects ambiguous duplicate identifiers and missing selections', () => {
  const site = siteFixture();
  expect(selectedRecord([site, siteFixture()], site.id)).toMatchObject({ status: 'error' });
  expect(selectedRecord([site], '')).toMatchObject({ status: 'empty' });
});

it('keeps local site and zone creation unavailable rather than storing transient records', async () => {
  expect(await siteService.createLocalSite()).toMatchObject({ status: 'unavailable' });
  expect(await siteService.createZone()).toMatchObject({ status: 'unavailable' });
  expect(await siteService.getSites()).toMatchObject({ status: 'unconfigured' });
});

it('rejects invalid zone model values rather than accepting them', () => {
  const site = siteFixture();
  const zone = zoneFixture();
  site.zones = [zone];
  Reflect.set(zone, 'zoneType', 'Unsupported type');
  expect(siteService.validateSiteZone([site], site.id, zone.id)).toMatchObject({ status: 'error' });
  Reflect.set(zone, 'zoneType', 'Control Zone');
  Reflect.set(zone, 'securityClassification', 'Unsupported class');
  expect(siteService.validateSiteZone([site], site.id, zone.id)).toMatchObject({ status: 'error' });
});

it('opens the actual provided site and selects only its zone', async () => {
  const site = siteFixture({ id: 'site-one', name: 'Provided plant one' });
  site.zones = [zoneFixture({ id: 'zone-one', siteId: site.id })];
  vi.spyOn(siteService, 'getSites').mockResolvedValue(recordsState([site]));
  vi.spyOn(siteService, 'getSiteById').mockImplementation(async (id) => selectedRecord([site], id));
  render(<TestScope sites={[site]}><SiteWorkflow /><ScopeControls /></TestScope>);
  fireEvent.click(await screen.findByRole('button', { name: 'Open site Provided plant one' }));
  expect(await screen.findByRole('heading', { name: site.name })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Select zone Provided zone' }));
  expect(screen.getByLabelText('Selected scope')).toHaveTextContent('site-one/zone-one');
  expect(screen.getByRole('button', { name: 'Create Zone' })).toBeDisabled();
});

it('shows confirmed missing IDs without selecting any fixture plant', async () => {
  const site = siteFixture();
  vi.spyOn(siteService, 'getSiteById').mockImplementation(async (id) => selectedRecord([site], id));
  render(<TestScope sites={[site]}><SiteDetailView siteId="missing-site" onNavigate={vi.fn()} /></TestScope>);
  expect(await screen.findByRole('heading', { name: 'Site not found' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: site.name })).not.toBeInTheDocument();
});

it('updates scoped browsing without displaying another scope as fallback', async () => {
  const first = siteFixture({ id: 'site-one', name: 'Provided plant one' });
  const second = siteFixture({ id: 'site-two', name: 'Provided plant two' });
  vi.spyOn(siteService, 'getSites').mockResolvedValue(recordsState([first, second]));
  render(<TestScope sites={[first, second]}><SitesView onNavigate={vi.fn()} onSelectSite={vi.fn()} /><ScopeControls /></TestScope>);
  fireEvent.click(screen.getByRole('button', { name: 'First scope' }));
  await screen.findByRole('button', { name: 'Open site Provided plant one' });
  expect(screen.queryByRole('button', { name: 'Open site Provided plant two' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Second scope' }));
  await screen.findByRole('button', { name: 'Open site Provided plant two' });
  expect(screen.queryByRole('button', { name: 'Open site Provided plant one' })).not.toBeInTheDocument();
});

it('rejects another returned site and malformed zone ownership visibly', async () => {
  const site = siteFixture();
  vi.spyOn(siteService, 'getSiteById').mockResolvedValue({ status: 'ready', data: site });
  const view = render(<ScopeProvider><SiteDetailView siteId="another-site" onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Site not found' })).toBeInTheDocument();
  view.unmount();
  site.zones = [zoneFixture({ siteId: 'forged-site' })];
  render(<ScopeProvider><SiteDetailView siteId={site.id} onNavigate={vi.fn()} /></ScopeProvider>);
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Could not load data' })).toBeInTheDocument());
  expect(screen.queryByRole('heading', { name: site.name })).not.toBeInTheDocument();
});