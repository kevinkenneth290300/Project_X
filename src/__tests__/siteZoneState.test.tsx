import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { siteService } from '../services/siteService';
import { ScopeProvider, useScope } from '../context/ScopeContext';
import { SitesView } from '../views/SitesView';
import { SiteDetailView } from '../views/SiteDetailView';
import { Zone } from '../types';

const createSite = (name: string, code: string) => siteService.createLocalSite({ name, code, location: 'Sample location', description: 'Local demo record' });

describe('shared transient site and zone records', () => {
  it('retrieves distinct new IDs without injecting plant inventory or connectivity', async () => {
    const first = createSite('Local Plant A', 'LOCAL-A');
    const second = createSite('Local Plant B', 'LOCAL-B');
    expect(first.id).not.toBe(second.id);
    expect(await siteService.getSiteById(first.id)).toMatchObject({ name: 'Local Plant A', assetsCount: 0, zones: [], healthScore: null, connectivity: 'Unavailable', certStatus: 'Unavailable', configSync: 'Unavailable' });
    expect(await siteService.getSiteById(second.id)).toMatchObject({ name: 'Local Plant B' });
  });

  it('never resolves unknown IDs by substring or by another plant', async () => {
    expect(await siteService.getSiteById('missing-site')).toBeUndefined();
    expect(await siteService.getSiteById('Plant')).toBeUndefined();
    await expect(siteService.createZone('missing-site', { name: 'Missing zone' })).rejects.toThrow('Site not found');
  });

  it('rejects cross-site zones, all-zone defaults, and forged parent ownership', async () => {
    const first = createSite('Zone Plant A', 'ZONE-A');
    const second = createSite('Zone Plant B', 'ZONE-B');
    const zone = await siteService.createZone(first.id, { name: 'Local control zone' });
    const child = await siteService.createZone(first.id, { name: 'Local child zone', parentZoneId: zone.id });
    expect(child.parentZoneId).toBe(zone.id);
    expect(siteService.validateSiteZone(first.id, zone.id).siteId).toBe(first.id);
    expect(() => siteService.validateSiteZone(second.id, zone.id)).toThrow('Zone does not belong');
    expect(() => siteService.validateSiteZone(second.id, 'all')).toThrow('Zone does not belong');
    await expect(siteService.createZone(second.id, { name: 'Invalid zone', siteId: first.id })).rejects.toThrow('Zone does not belong');
    await expect(siteService.createZone(second.id, { name: 'Invalid child', parentZoneId: zone.id })).rejects.toThrow('Zone does not belong');
    expect((await siteService.getSiteById(second.id))?.zones).toEqual([]);
  });

  it('publishes stable snapshots and keeps returned copies independent', async () => {
    const subscriber = vi.fn();
    const unsubscribe = siteService.subscribeSites(subscriber);
    const before = siteService.getSitesSnapshot();
    expect(siteService.getSitesSnapshot()).toBe(before);
    expect(() => { before[0].name = 'Accidental mutation'; }).toThrow(TypeError);
    expect(() => { before[0].zones.push(before[0].zones[0]); }).toThrow(TypeError);
    const created = createSite('Snapshot Plant', 'SNAPSHOT');
    expect(subscriber).toHaveBeenCalledOnce();
    expect(siteService.getSitesSnapshot()).not.toBe(before);
    created.name = 'Changed outside store';
    expect((await siteService.getSiteById(created.id))?.name).toBe('Snapshot Plant');
    unsubscribe();
    await siteService.createZone(created.id, { name: 'Snapshot zone' });
    expect(subscriber).toHaveBeenCalledOnce();
  });

  it('rejects duplicate site codes and incomplete local records', () => {
    createSite('Unique Plant', 'UNIQUE');
    expect(() => createSite('Another Plant', 'unique')).toThrow('Site code already exists');
    expect(() => createSite(' ', 'EMPTY')).toThrow('site name');
  });

  it('rejects invalid zone model values instead of silently storing them', async () => {
    const site = createSite('Model Validation Plant', 'MODEL-VALID');
    await expect(siteService.createZone(site.id, { name: 'Invalid type', zoneType: 'Not a zone type' as Zone['zoneType'] })).rejects.toThrow('Unsupported zone type');
    await expect(siteService.createZone(site.id, { name: 'Invalid class', securityClassification: 'Not a class' as Zone['securityClassification'] })).rejects.toThrow('Unsupported zone security classification');
    expect((await siteService.getSiteById(site.id))?.zones).toEqual([]);
  });
});

function SiteWorkflow() {
  const [siteId, setSiteId] = useState<string>();
  const { sites } = useScope();
  return (
    <>
      <output aria-label="Shared site names">{sites.map((site) => site.name).join(', ')}</output>
      {siteId ? <SiteDetailView siteId={siteId} onNavigate={() => setSiteId(undefined)} /> : <SitesView onNavigate={vi.fn()} onSelectSite={setSiteId} />}
    </>
  );
}

describe('shared site/zone navigation integration', () => {
  it('creates and opens the actual local site across list, detail, and scope consumers', async () => {
    render(<ScopeProvider><SiteWorkflow /></ScopeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Create Local Sample Site' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Sample site name' }), { target: { value: 'UI Sample Plant' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Sample site code' }), { target: { value: 'UI-PLANT' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Local Site' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText('Shared site names')).toHaveTextContent('UI Sample Plant');
    fireEvent.click(screen.getByText('UI Sample Plant'));
    expect(await screen.findByRole('heading', { name: 'UI Sample Plant' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Chennai Plant' })).not.toBeInTheDocument();
    expect(screen.getByText('Not configured')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create Local Sample Zone' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Sample zone name' }), { target: { value: 'UI Sample Control Zone' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Local Zone' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const site = (await siteService.getSites()).find((candidate) => candidate.name === 'UI Sample Plant');
    expect(site?.zones).toEqual([expect.objectContaining({ name: 'UI Sample Control Zone', siteId: site?.id, siteName: 'UI Sample Plant', assetCount: 0, status: 'Unknown' })]);
    expect(screen.getByText('UI Sample Control Zone')).toBeInTheDocument();
  });

  it('shows not found for a missing site ID instead of any fixture plant', () => {
    render(<ScopeProvider><SiteDetailView siteId="missing-site" onNavigate={vi.fn()} /></ScopeProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent('Site not found.');
    expect(screen.queryByRole('heading', { name: 'Chennai Plant' })).not.toBeInTheDocument();
  });

  it('updates an already mounted scope consumer when another component creates a site', async () => {
    render(<ScopeProvider><SiteWorkflow /></ScopeProvider>);
    await act(async () => { createSite('Externally Created Sample', 'EXT-CREATED'); });
    expect(screen.getByLabelText('Shared site names')).toHaveTextContent('Externally Created Sample');
  });
});