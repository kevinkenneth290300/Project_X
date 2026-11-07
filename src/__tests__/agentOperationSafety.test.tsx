import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { agentService } from '../services/agentService';
import { OperationUnavailableError } from '../services/operationSupport';
import { EnrollAgentModal } from '../components/dialogs/EnrollAgentModal';
import { AgentsView } from '../views/AgentsView';
import { AgentDetailView } from '../views/AgentDetailView';

describe('unavailable remote agent operations', () => {
  it('cannot enroll a fabricated healthy agent or create delivery counters', async () => {
    const before = structuredClone(await agentService.getAgents());
    await expect(agentService.enrollAgent({ hostname: 'NEW-HOST', ip: '192.0.2.10', site: 'example', os: 'Example OS', profileId: 'profile-baseline' })).rejects.toBeInstanceOf(OperationUnavailableError);
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('cannot acknowledge restart or change a heartbeat/health result', async () => {
    const before = structuredClone(await agentService.getAgents());
    await expect(agentService.restartAgent(before[0].id)).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('cannot acknowledge IR-mode deployment or change a profile', async () => {
    const before = structuredClone(await agentService.getAgents());
    await expect(agentService.toggleInvestigationMode(before[0].id)).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    expect(await agentService.getAgents()).toEqual(before);
  });

  it('fails explicitly for missing remote-control targets', async () => {
    await expect(agentService.restartAgent('missing')).rejects.toThrow('Agent not found');
    await expect(agentService.toggleInvestigationMode('missing')).rejects.toThrow('Agent not found');
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
    const [sample] = await agentService.getAgents();
    render(<AgentsView onNavigate={vi.fn()} onSelectAgent={vi.fn()} />);
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
    const [sample] = await agentService.getAgents();
    render(<AgentDetailView agentId={sample.id} onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectInvestigation={vi.fn()} />);
    const deploy = await screen.findByRole('button', { name: 'Deploy Investigation Mode' });
    expect(deploy).toBeDisabled();
    expect(deploy).toHaveAccessibleDescription(/not connected endpoints/);
    fireEvent.click(deploy);
    expect(toggle).not.toHaveBeenCalled();
    expect(restart).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Sample Channels' })).toBeInTheDocument();
    expect(screen.queryByText('INVESTIGATION MODE ACTIVE')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Restart/ })).not.toBeInTheDocument();
  });
});