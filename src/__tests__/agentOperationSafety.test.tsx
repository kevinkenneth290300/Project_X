import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { agentService } from '../services/agentService';
import { EnrollAgentModal } from '../components/dialogs/EnrollAgentModal';
import { AgentsView } from '../views/AgentsView';
import { AgentDetailView } from '../views/AgentDetailView';
import { ScopeProvider } from '../context/ScopeContext';
import { agentFixture } from '../test/fixtures/inventory';

describe('unavailable remote agent operations', () => {
  it('cannot enroll a fabricated healthy agent or create delivery counters', async () => {
    const before = structuredClone(await agentService.getAgents());
    await expect(agentService.enrollAgent({ hostname: 'NEW-HOST', ip: '192.0.2.10', site: 'example', os: 'Example OS', profileId: 'profile-test' })).resolves.toMatchObject({ status: 'unavailable' });
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('cannot acknowledge restart or change a heartbeat/health result', async () => {
    const before = structuredClone(await agentService.getAgents());
    const result = await agentService.restartAgent('provided-agent');
    expect(result).toMatchObject({ status: 'unavailable' });
    expect(result).not.toHaveProperty('data');
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('cannot acknowledge IR-mode deployment or change a profile', async () => {
    const before = structuredClone(await agentService.getAgents());
    const result = await agentService.toggleInvestigationMode('provided-agent');
    expect(result).toMatchObject({ status: 'unavailable' });
    expect(result).not.toHaveProperty('data');
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('fails explicitly for missing remote-control targets', async () => {
    await expect(agentService.restartAgent('')).resolves.toMatchObject({ status: 'empty' });
    await expect(agentService.toggleInvestigationMode('')).resolves.toMatchObject({ status: 'empty' });
    await expect(agentService.restartAgent('missing')).resolves.toMatchObject({ status: 'unavailable' });
  });
});

describe('agent operation UI integration', () => {
  it('shows an accessible unavailable dialog without installer commands or credentials', () => {
    const enrolled = vi.fn();
    const close = vi.fn();
    const enroll = vi.spyOn(agentService, 'enrollAgent');
    render(<EnrollAgentModal isOpen onClose={close} onAgentEnrolled={enrolled} />);
    const dialog = screen.getByRole('dialog', { name: 'Agent Enrollment Unavailable' });
    const submit = screen.getByRole('button', { name: 'Enroll Host' });
    expect(dialog).toHaveAccessibleDescription(/Enrollment is unavailable/);
    expect(submit).toBeDisabled();
    fireEvent.click(submit);
    expect(enroll).not.toHaveBeenCalled();
    expect(enrolled).not.toHaveBeenCalled();
    expect(screen.queryByText(/msiexec|ENROLL_KEY|wrden_sec_|WARDEN_ENDPOINT/)).not.toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(close).toHaveBeenCalledOnce();
  });

  it('cannot initiate enrollment from the sample fleet', async () => {
    const enroll = vi.spyOn(agentService, 'enrollAgent');
    const sample = agentFixture();
    vi.spyOn(agentService, 'getAgents').mockResolvedValue({ status: 'ready', data: [sample] });
    render(<ScopeProvider><AgentsView onNavigate={vi.fn()} onSelectAgent={vi.fn()} /></ScopeProvider>);
    expect(await screen.findByText(sample.hostname)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Enroll Agent' });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(/deployment are unavailable/);
    fireEvent.click(button);
    expect(enroll).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders real fixture channel fields and cannot deploy IR or restart an endpoint', async () => {
    const toggle = vi.spyOn(agentService, 'toggleInvestigationMode');
    const restart = vi.spyOn(agentService, 'restartAgent');
    const sample = agentFixture();
    vi.spyOn(agentService, 'getAgentById').mockResolvedValue({ status: 'ready', data: sample });
    render(<ScopeProvider><AgentDetailView agentId={sample.id} onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} /></ScopeProvider>);
    const deploy = await screen.findByRole('button', { name: 'Deploy Investigation Mode' });
    expect(deploy).toBeDisabled();
    expect(deploy).toHaveAccessibleDescription(/authorized control plane/);
    fireEvent.click(deploy);
    expect(toggle).not.toHaveBeenCalled();
    expect(restart).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Collection Channels' })).toBeInTheDocument();
    expect(screen.queryByText('INVESTIGATION MODE ACTIVE')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Restart/ })).not.toBeInTheDocument();
  });
});