import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { detectionService } from '../services/detectionService';
import { CreateDetectionModal } from '../components/dialogs/CreateDetectionModal';
import { DetectionDetailView } from '../views/DetectionDetailView';
import { DetectionsView } from '../views/DetectionsView';

describe('unevaluated sample detection definitions', () => {
  it('never accepts active state, confidence, or match claims as evaluation results', async () => {
    const definition = await detectionService.createDetection({
      name: 'Sample definition',
      ruleQuery: 'event.code: 1234',
      status: 'Active',
      confidence: 99,
      triggersCount: 12,
      hostsImpacted: ['UNRELATED-HOST'],
      recentMatchEventIds: ['unrelated-event'],
    });
    expect(definition.status).toBe('Disabled');
    expect(definition.confidence).toBe(0);
    expect(definition.triggersCount).toBe(0);
    expect(definition.hostsImpacted).toEqual([]);
    expect(definition.recentMatchEventIds).toEqual([]);
    expect(definition.lastTriggered).toBe('Not evaluated (demo)');
  });

  it('keeps separately created sample definitions distinct and unevaluated', async () => {
    const first = await detectionService.createDetection({ name: 'First sample', ruleQuery: 'host: FIRST' });
    const second = await detectionService.createDetection({ name: 'Second sample', ruleQuery: 'host: SECOND' });
    expect(first.id).not.toBe(second.id);
    expect(first.ruleQuery).toBe('host: FIRST');
    expect(second.ruleQuery).toBe('host: SECOND');
    expect((await detectionService.getDetections()).every((item) => item.status === 'Disabled')).toBe(true);
  });

  it('rejects deployment instead of activating a sample rule', async () => {
    const before = structuredClone(await detectionService.getDetections());
    await expect(detectionService.toggleDetectionStatus(before[0].id)).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE' });
    expect(await detectionService.getDetections()).toEqual(before);
  });

  it('fails explicitly for missing definitions and incomplete input', async () => {
    await expect(detectionService.toggleDetectionStatus('missing')).rejects.toThrow('Detection not found');
    await expect(detectionService.createDetection({ name: ' ', ruleQuery: ' ' })).rejects.toThrow('Rule name and logic are required');
  });
});

describe('detection operation UI integration', () => {
  it('saves a local sample definition without validation, matches, or deployment', async () => {
    const created = vi.fn();
    const network = vi.spyOn(globalThis, 'fetch');
    render(<CreateDetectionModal isOpen onClose={vi.fn()} onDetectionCreated={created} prefillTitle="LOCAL SAMPLE" prefillQuery="host: SAMPLE" />);
    const validation = screen.getByRole('button', { name: 'Test Against Telemetry' });
    expect(validation).toBeDisabled();
    expect(validation).toHaveAccessibleDescription(/not active rules/);
    fireEvent.click(validation);
    expect(screen.queryByText(/Rule validated|1 match found/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save Sample Definition' }));
    await waitFor(() => expect(created).toHaveBeenCalledOnce());
    expect(created).toHaveBeenCalledWith(expect.objectContaining({ name: 'LOCAL SAMPLE', status: 'Disabled', confidence: 0, hostsImpacted: [], recentMatchEventIds: [] }));
    expect(network).not.toHaveBeenCalled();
  });

  it('cannot run a backtest or deploy from the detail view', async () => {
    const network = vi.spyOn(globalThis, 'fetch');
    const toggle = vi.spyOn(detectionService, 'toggleDetectionStatus');
    render(<DetectionDetailView detectionId="det-001" onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectAgent={vi.fn()} />);
    const backtest = await screen.findByRole('button', { name: 'Test Against History' });
    const deploy = screen.getByRole('button', { name: 'Deploy Rule' });
    expect(backtest).toBeDisabled();
    expect(deploy).toBeDisabled();
    expect(backtest).toHaveAccessibleDescription(/backtesting, and deployment are unavailable/);
    fireEvent.click(backtest);
    fireEvent.click(deploy);
    expect(toggle).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
    expect(screen.queryByText(/Historical Backtest Completed|Deterministic Engine|Enabled for Tier-1/)).not.toBeInTheDocument();
    expect(screen.getByText('Sample definition (not deployed)')).toBeInTheDocument();
  });

  it('labels list definitions as samples and disables every deployment control', async () => {
    const toggle = vi.spyOn(detectionService, 'toggleDetectionStatus');
    render(<DetectionsView onNavigate={vi.fn()} onSelectDetection={vi.fn()} />);
    const controls = await screen.findAllByRole('button', { name: /Deploy sample definition/ });
    expect(screen.getByRole('heading', { name: 'Sample Detection Definitions' })).toBeInTheDocument();
    for (const control of controls) {
      expect(control).toBeDisabled();
      fireEvent.click(control);
    }
    expect(toggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('does not substitute a different sample definition for a missing ID', async () => {
    render(<DetectionDetailView detectionId="missing" onNavigate={vi.fn()} onSelectEvent={vi.fn()} onSelectAgent={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Detection definition not found.');
    expect(screen.queryByRole('button', { name: 'Test Against History' })).not.toBeInTheDocument();
  });
});