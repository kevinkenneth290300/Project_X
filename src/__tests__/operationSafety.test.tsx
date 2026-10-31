import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { integrationService } from '../services/integrationService';
import { OperationUnavailableError } from '../services/operationSupport';
import { SettingsView } from '../views/SettingsView';
import { IntegrationsView } from '../views/IntegrationsView';

describe('unavailable integration operations', () => {
  it('rejects connection tests without a network request or successful result', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    const [integration] = await integrationService.getIntegrations();
    await expect(integrationService.testConnection(integration.id)).rejects.toBeInstanceOf(OperationUnavailableError);
    expect(network).not.toHaveBeenCalled();
  });

  it('cannot mark a sample exporter connected or delivered', async () => {
    const before = await integrationService.getIntegrations();
    await expect(integrationService.toggleIntegration(before[0].id)).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    expect(await integrationService.getIntegrations()).toEqual(before);
    expect(before.every((item) => item.status === 'Not Connected' && item.lastDelivery === 'Unavailable (demo)')).toBe(true);
  });

  it('rejects missing integrations explicitly', async () => {
    await expect(integrationService.testConnection('missing')).rejects.toThrow('Integration not found');
    await expect(integrationService.toggleIntegration('missing')).rejects.toThrow('Integration not found');
  });
});

describe('operator safety integration', () => {
  it('disables deployment and LDAP/TLS tests while allowing local sample edits', () => {
    render(<SettingsView onNavigate={vi.fn()} />);
    const save = screen.getByRole('button', { name: 'Save Changes' });
    const testConnection = screen.getByRole('button', { name: 'Test Connection & Bind' });
    expect(save).toBeDisabled();
    expect(testConnection).toBeDisabled();
    expect(save).toHaveAccessibleDescription(/local sample values only/);
    fireEvent.click(save);
    fireEvent.click(testConnection);
    expect(screen.queryByText(/handshake verified|synchronized to all/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('ldaps://ad01.acme.internal:636'), { target: { value: 'ldaps://example.invalid' } });
    expect(screen.getByDisplayValue('ldaps://example.invalid')).toBeInTheDocument();
    expect(screen.getByText('NOT ENFORCED (DEMO)')).toBeInTheDocument();
  });

  it('shows unavailable exporter status and never invokes an operation from a disabled control', async () => {
    const testConnection = vi.spyOn(integrationService, 'testConnection');
    const toggle = vi.spyOn(integrationService, 'toggleIntegration');
    render(<IntegrationsView onNavigate={vi.fn()} />);
    const controls = await screen.findAllByRole('button', { name: 'Test Connection' });
    for (const control of controls) {
      expect(control).toBeDisabled();
      expect(control).toHaveAccessibleDescription(/unavailable/);
      fireEvent.click(control);
    }
    for (const control of screen.getAllByRole('button', { name: 'Connect Exporter' })) {
      expect(control).toBeDisabled();
      fireEvent.click(control);
    }
    expect(testConnection).not.toHaveBeenCalled();
    expect(toggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
    expect(screen.queryByText(/TLS certificate handshake verified|ms latency/)).not.toBeInTheDocument();
  });
});