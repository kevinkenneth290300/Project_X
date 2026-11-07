import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ScopeProvider, useScope } from '../context/ScopeContext';
import { assetService } from '../services/assetService';
import { AssetsView } from '../views/AssetsView';
import { NetworkDevicesView } from '../views/NetworkDevicesView';
import { assetFixture, networkDeviceFixture, siteFixture } from '../test/fixtures/inventory';

vi.mock('../services/assetService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/assetService')>();
  const fixtures = await import('../test/fixtures/inventory');
  return { ...actual, MOCK_ASSETS: [fixtures.assetFixture()], MOCK_NETWORK_DEVICES: [fixtures.networkDeviceFixture()] };
});

it('has unconfigured asset and device sources instead of runtime fixture inventories', async () => {
  expect(await assetService.getAssets()).toMatchObject({ status: 'unconfigured' });
  expect(await assetService.getNetworkDevices()).toMatchObject({ status: 'unconfigured' });
});

it('renders and searches a supplied canonical asset without alias-field crashes', async () => {
  vi.spyOn(assetService, 'getAssets').mockResolvedValue({ status: 'ready', data: [assetFixture()] });
  render(<ScopeProvider><AssetsView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByText('Provided asset')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '00:11:22:33:44:55' } });
  expect(screen.getByText('Provided asset')).toBeInTheDocument();
});

it('filters devices using their canonical deviceType', async () => {
  vi.spyOn(assetService, 'getNetworkDevices').mockResolvedValue({ status: 'ready', data: [networkDeviceFixture()] });
  render(<ScopeProvider><NetworkDevicesView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByText('Provided device')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Core Switch' }));
  expect(screen.getByText('Provided device')).toBeInTheDocument();
});

it('shows unconfigured devices and disables the no-op add/save workflow', async () => {
  render(<ScopeProvider><NetworkDevicesView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Not configured' })).toBeInTheDocument();
  const add = screen.getByRole('button', { name: 'Add Network Device' });
  expect(add).toBeDisabled();
  fireEvent.click(add);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('normalizes supported asset aliases without changing identifiers or source records', () => {
  const input = { ...assetFixture(), assetType: undefined, mac: undefined, type: 'Windows Server', macAddress: '00:11:22:33:44:55', firmwareOrOs: 'Provided OS' };
  const result = assetService.normalizeAsset(input);
  expect(result).toMatchObject({ status: 'ready', data: { id: input.id, assetType: 'Windows Server', mac: input.macAddress, osFirmware: 'Provided OS' } });
  if (result.status !== 'ready') throw new Error('Supported asset was not normalized.');
  expect(result.data).not.toHaveProperty('type');
  expect(result.data).not.toHaveProperty('macAddress');
  result.data.name = 'Changed read copy';
  expect(input.name).toBe('Provided asset');
});

it('normalizes device aliases without guessing physical identity or type', () => {
  const input = { ...networkDeviceFixture(), deviceType: undefined, mac: undefined, type: 'Core Switch', macAddress: '00:11:22:33:44:66' };
  expect(assetService.normalizeNetworkDevice(input)).toMatchObject({ status: 'ready', data: { id: input.id, deviceType: 'Core Switch', mac: input.macAddress } });
});

it('rejects conflicting asset aliases and unsupported categories explicitly', () => {
  expect(assetService.normalizeAsset({ ...assetFixture(), type: 'PLC' })).toMatchObject({ status: 'error' });
  expect(assetService.normalizeAsset({ ...assetFixture(), macAddress: '00:00:00:00:00:00' })).toMatchObject({ status: 'error' });
  expect(assetService.normalizeAsset({ ...assetFixture(), assetType: undefined, type: 'Unsupported category' })).toMatchObject({ status: 'error' });
});

it('rejects conflicting device aliases and incomplete ownership explicitly', () => {
  expect(assetService.normalizeNetworkDevice({ ...networkDeviceFixture(), type: 'Router' })).toMatchObject({ status: 'error' });
  expect(assetService.normalizeNetworkDevice({ ...networkDeviceFixture(), siteId: '' })).toMatchObject({ status: 'error' });
});

it('does not invent values for genuinely optional asset metadata', async () => {
  vi.spyOn(assetService, 'getAssets').mockResolvedValue({ status: 'ready', data: [assetFixture({ mac: undefined, assetType: undefined })] });
  render(<ScopeProvider><AssetsView onNavigate={vi.fn()} /></ScopeProvider>);
  const row = await screen.findByRole('row', { name: /Provided asset/ });
  expect(within(row).getAllByRole('cell')[2]).toHaveTextContent('-');
  expect(within(row).getAllByRole('cell')[3]).toHaveTextContent('-');
});

it.each([
  ['empty', 'No data'], ['unavailable', 'Unavailable'], ['unauthenticated', 'Not signed in'],
  ['forbidden', 'Access denied'], ['error', 'Could not load data'],
] as const)('renders %s asset sources without fixture fallback', async (status, title) => {
  vi.spyOn(assetService, 'getAssets').mockResolvedValue({ status, reason: 'Factual inventory condition.' });
  render(<ScopeProvider><AssetsView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  expect(screen.queryByText('Provided asset')).not.toBeInTheDocument();
});

it('reports duplicate supplied IDs instead of silently merging records', async () => {
  vi.spyOn(assetService, 'getAssets').mockResolvedValue({ status: 'ready', data: [assetFixture(), assetFixture()] });
  render(<ScopeProvider><AssetsView onNavigate={vi.fn()} /></ScopeProvider>);
  expect(await screen.findByRole('heading', { name: 'Could not load data' })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('duplicate asset identifiers');
});

function AssetScopeControls() {
  const { setSiteScope } = useScope();
  return <><button onClick={() => setSiteScope('site-one')}>First asset scope</button><button onClick={() => setSiteScope('site-two')}>Second asset scope</button></>;
}

it('filters supplied assets by exact scope and hides an old-scope inspector', async () => {
  const sites = [siteFixture({ id: 'site-one' }), siteFixture({ id: 'site-two' })];
  const context = { organization: { id: 'test-org', name: 'Test organization' }, user: { id: 'test-user', name: 'Test operator', email: 'operator@example.invalid' }, sites };
  const first = assetFixture({ id: 'asset-one', name: 'Asset one', siteId: 'site-one' });
  const second = assetFixture({ id: 'asset-two', name: 'Asset two', siteId: 'site-two' });
  vi.spyOn(assetService, 'getAssets').mockResolvedValue({ status: 'ready', data: [first, second] });
  render(<ScopeProvider authorizedContext={{ status: 'ready', data: context }}><AssetsView onNavigate={vi.fn()} /><AssetScopeControls /></ScopeProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'First asset scope' }));
  await screen.findByText('Asset one');
  expect(screen.queryByText('Asset two')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Inspect asset Asset one' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Second asset scope' }));
  await screen.findByText('Asset two');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByText('Asset one')).not.toBeInTheDocument();
});