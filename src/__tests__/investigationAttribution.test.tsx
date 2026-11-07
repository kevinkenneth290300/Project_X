import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { investigationService } from '../services/investigationService';
import { eventService } from '../services/eventService';
import { Investigation } from '../types';
import { InvestigationDetailView } from '../views/InvestigationDetailView';
import { EventDetailView } from '../views/EventDetailView';

const navigation = { onNavigate: vi.fn(), onSelectEvent: vi.fn(), onSelectAgent: vi.fn(), onSelectInvestigation: vi.fn() };

const createCase = (host: string) => investigationService.createInvestigation({
  title: `Sample case for ${host}`,
  host,
  severity: 'High',
  description: 'Created manually in the demonstration.',
});

describe('explicit local investigation attribution', () => {
  it('creates distinct cases for two hosts without fabricated evidence or analysis', async () => {
    const first = await createCase('HOST-A');
    const second = await createCase('HOST-B');
    expect(first.id).not.toBe(second.id);
    for (const [investigation, host] of [[first, 'HOST-A'], [second, 'HOST-B']] as const) {
      expect(investigation.host).toBe(host);
      expect(investigation.evidenceIds).toEqual([]);
      expect(investigation.timeline).toEqual([]);
      expect(investigation.aiAssistantAssessment.findings).toEqual([]);
      expect(investigation.confidence).toBe(0);
      expect(investigation.graphData?.edges).toEqual([]);
    }
  });

  it('adds a note only to the requested case, without mutating a previously read case', async () => {
    const first = await createCase('HOST-NOTE-A');
    const second = await createCase('HOST-NOTE-B');
    const note = await investigationService.addNote(first.id, 'Sample analyst', 'Demo', 'A local note');
    expect((await investigationService.getInvestigationById(first.id))?.notes).toEqual([note]);
    expect((await investigationService.getInvestigationById(second.id))?.notes).toEqual([]);
    expect(first.notes).toEqual([]);
  });

  it('never acknowledges a note or status update for a missing case', async () => {
    await expect(investigationService.addNote('missing-case', 'Sample analyst', 'Demo', 'No target')).rejects.toThrow('Investigation not found');
    await expect(investigationService.updateStatus('missing-case', 'Closed')).rejects.toThrow('Investigation not found');
    expect(await investigationService.getInvestigationById('missing-case')).toBeNull();
  });

  it('rejects empty host or title without creating a fabricated case', async () => {
    await expect(createCase(' ')).rejects.toThrow('title and host are required');
    await expect(investigationService.createInvestigation({ title: ' ', host: 'HOST-A', severity: 'Low', description: '' })).rejects.toThrow('title and host are required');
  });
});

describe('case and event detail attribution integration', () => {
  it('shows the selected host/case without an unrelated sample graph or evidence', async () => {
    const first = await createCase('HOST-UI-A');
    const second = await createCase('HOST-UI-B');
    const view = render(<InvestigationDetailView investigationId={first.id} {...navigation} />);
    expect(await screen.findByRole('heading', { name: first.title })).toBeInTheDocument();
    expect(screen.getByText('Evidence Ledger (0)')).toBeInTheDocument();
    expect(screen.getByText('Not assessed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Relationship Graph' }));
    expect(screen.getByText(/No evidence relationship graph/)).toBeInTheDocument();
    expect(screen.queryByText('EVID-001')).not.toBeInTheDocument();
    view.rerender(<InvestigationDetailView investigationId={second.id} {...navigation} />);
    expect(await screen.findByRole('heading', { name: second.title })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: first.title })).not.toBeInTheDocument();
    expect(screen.queryByText(/10\.20\.4\.42|sha256:7f3a9e21/)).not.toBeInTheDocument();
  });

  it('does not substitute a fixture investigation for a missing ID', async () => {
    render(<InvestigationDetailView investigationId="missing-case" {...navigation} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Investigation not found.');
    expect(screen.queryByText(/INV-000142/)).not.toBeInTheDocument();
  });

  it('cannot claim an evidence attachment by writing a note to a fixed case', async () => {
    const addNote = vi.spyOn(investigationService, 'addNote');
    render(<EventDetailView eventId="evt-7045-svc" {...navigation} />);
    const link = await screen.findByRole('button', { name: 'Add to Investigation' });
    expect(link).toBeDisabled();
    expect(link).toHaveAccessibleDescription(/Evidence linking unavailable/);
    fireEvent.click(link);
    expect(addNote).not.toHaveBeenCalled();
    expect(screen.queryByText(/Attached to INV|INV-000142|sha256 verified/)).not.toBeInTheDocument();
  });

  it('does not substitute another event for a missing ID', async () => {
    render(<EventDetailView eventId="missing-event" {...navigation} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Event not found.');
    expect(screen.queryByRole('button', { name: 'Add to Investigation' })).not.toBeInTheDocument();
  });

  it('ignores a stale response after switching to a different case', async () => {
    const first = await createCase('HOST-RACE-A');
    const second = await createCase('HOST-RACE-B');
    let finishFirst!: (value: Investigation | null) => void;
    const delayed = new Promise<Investigation | null>((resolve) => { finishFirst = resolve; });
    vi.spyOn(investigationService, 'getInvestigationById').mockImplementation((id) => id === first.id ? delayed : Promise.resolve(second));
    const view = render(<InvestigationDetailView investigationId={first.id} {...navigation} />);
    view.rerender(<InvestigationDetailView investigationId={second.id} {...navigation} />);
    expect(await screen.findByRole('heading', { name: second.title })).toBeInTheDocument();
    await act(async () => { finishFirst(first); });
    expect(screen.getByRole('heading', { name: second.title })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: first.title })).not.toBeInTheDocument();
  });
});