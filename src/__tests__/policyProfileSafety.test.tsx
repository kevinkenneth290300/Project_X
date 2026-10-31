import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PoliciesView } from '../views/PoliciesView';
import { CollectionProfileDetailView } from '../views/CollectionProfileDetailView';
import { CollectionProfilesView } from '../views/CollectionProfilesView';
import { profileService, getProfileChannelNames, getProfileCoveredEventIds } from '../services/profileService';

describe('local sample preferences without enforcement', () => {
  it('cannot apply or synchronize policies', () => {
    const network = vi.spyOn(globalThis, 'fetch');
    render(<PoliciesView onNavigate={vi.fn()} />);
    const apply = screen.getByRole('button', { name: 'Apply Policies' });
    expect(apply).toBeDisabled();
    expect(apply).toHaveAccessibleDescription(/deployment and synchronization are unavailable/);
    fireEvent.click(apply);
    expect(network).not.toHaveBeenCalled();
    expect(screen.queryByText(/Policies synchronized|AIR-GAP ENCLAVE COMPLIANCE/)).not.toBeInTheDocument();
  });

  it('keeps air-gap and TLS edits local and explicitly non-enforcing', () => {
    const network = vi.spyOn(globalThis, 'fetch');
    render(<PoliciesView onNavigate={vi.fn()} />);
    const airGap = screen.getByRole('checkbox', { name: 'Sample Air-Gap Preference' });
    const mutualTls = screen.getByRole('checkbox', { name: 'Sample Mutual TLS Preference' });
    expect(airGap).toBeChecked();
    expect(mutualTls).toBeChecked();
    fireEvent.click(airGap);
    fireEvent.click(mutualTls);
    expect(airGap).not.toBeChecked();
    expect(mutualTls).not.toBeChecked();
    expect(screen.getByText('NOT ENFORCED')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('not enforced security controls');
    expect(network).not.toHaveBeenCalled();
  });
});

describe('sample profile definitions without deployment or validation', () => {
  it('returns local drafts instead of active deployed profiles', async () => {
    const profiles = await profileService.getProfiles();
    expect(profiles.length).toBeGreaterThan(0);
    expect(profiles.every((profile) => profile.status === 'Draft' && profile.deploymentCoverage?.activeHosts === 0)).toBe(true);
    expect(await profileService.getProfileById('missing')).toBeNull();
    expect(await profileService.cloneProfile('missing')).toBeNull();
  });

  it('copies profiles independently with no fabricated deployed fleet', async () => {
    const original = await profileService.getProfileById('profile-baseline');
    const first = await profileService.cloneProfile('profile-baseline');
    const second = await profileService.cloneProfile('profile-baseline');
    expect(first?.id).not.toBe(second?.id);
    expect(first?.deploymentCoverage).toEqual({ totalHosts: 0, activeHosts: 0, percent: 0 });
    if (!first) throw new Error('Sample copy was not created');
    first.channels = [];
    expect(await profileService.getProfileById('profile-baseline')).toEqual(original);
    expect((await profileService.getProfileById(first.id))?.channels).not.toEqual([]);
  });

  it('normalizes canonical channel shapes and enabled definition event IDs', async () => {
    const profile = await profileService.getProfileById('profile-baseline');
    if (!profile) throw new Error('Sample profile missing');
    expect(getProfileChannelNames(profile)).toEqual(['Security', 'System', 'Application', 'Defender']);
    expect(getProfileChannelNames({ ...profile, channels: { security: true, system: false, application: false, powershell: true, defender: false } })).toEqual(['Security', 'PowerShell']);
    expect(getProfileCoveredEventIds(profile)).toContain(4624);
    expect(getProfileCoveredEventIds(profile)).not.toContain(4104);
  });

  it('renders actual fixture channels with disabled deployment and query validation', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    render(<CollectionProfileDetailView profileId="profile-baseline" onNavigate={vi.fn()} />);
    const deploy = await screen.findByRole('button', { name: 'Deploy to Fleet' });
    const validate = screen.getByRole('button', { name: 'Validate Query' });
    expect(deploy).toBeDisabled();
    expect(validate).toBeDisabled();
    expect(validate).toHaveAccessibleDescription(/XPath validation are unavailable/);
    fireEvent.click(deploy);
    fireEvent.click(validate);
    fireEvent.click(screen.getByRole('button', { name: 'Sample Channels (4)' }));
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(network).not.toHaveBeenCalled();
    expect(screen.queryByText(/queued for rolling deployment|XPath syntax valid|Deployed on 144/)).not.toBeInTheDocument();
  });

  it('does not substitute a different sample profile for a missing ID', async () => {
    render(<CollectionProfileDetailView profileId="missing" onNavigate={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Collection profile not found.');
  });

  it('does not claim a sample was copied if clipboard access fails', async () => {
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) } });
    render(<CollectionProfileDetailView profileId="profile-baseline" onNavigate={vi.fn()} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Copy Sample JSON' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to copy');
    expect(screen.queryByText('Sample copied')).not.toBeInTheDocument();
  });

  it('renders the canonical sample list and navigates to the selected profile ID', async () => {
    const select = vi.fn();
    const navigate = vi.fn();
    render(<CollectionProfilesView onNavigate={navigate} onSelectProfile={select} />);
    const profile = await screen.findByRole('button', { name: 'Inspect sample profile Windows Server Baseline' });
    expect(screen.getByRole('heading', { name: 'Sample Collection Profiles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Profile' })).toBeDisabled();
    expect(screen.getAllByText('Sample definition only; not deployed').length).toBeGreaterThan(0);
    fireEvent.keyDown(profile, { key: 'Enter' });
    expect(select).toHaveBeenCalledWith('profile-baseline');
    expect(navigate).toHaveBeenCalledWith('collection-profile-detail');
  });

  it('distinguishes an empty sample profile list from a failed load', async () => {
    vi.spyOn(profileService, 'getProfiles').mockResolvedValue([]);
    const view = render(<CollectionProfilesView onNavigate={vi.fn()} onSelectProfile={vi.fn()} />);
    expect(await screen.findByText('No sample profiles found.')).toBeInTheDocument();
    view.unmount();
    vi.spyOn(profileService, 'getProfiles').mockRejectedValue(new Error('Unavailable'));
    render(<CollectionProfilesView onNavigate={vi.fn()} onSelectProfile={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sample profiles unavailable');
    expect(screen.queryByText('No sample profiles found.')).not.toBeInTheDocument();
  });

  it('copies only a real sample JSON definition after clipboard acknowledgement', async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: copy } });
    render(<CollectionProfileDetailView profileId="profile-baseline" onNavigate={vi.fn()} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Copy Sample JSON' }));
    await waitFor(() => expect(screen.getByText('Sample copied')).toBeInTheDocument());
    expect(copy).toHaveBeenCalledOnce();
    expect(JSON.parse(copy.mock.calls[0][0])).toMatchObject({ id: 'profile-baseline', status: 'Draft', deploymentCoverage: { activeHosts: 0 } });
  });
});