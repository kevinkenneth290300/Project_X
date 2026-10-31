import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EvidenceView } from '../views/EvidenceView';
import { InvestigationDetailView } from '../views/InvestigationDetailView';
import { evidenceService } from '../services/evidenceService';

const navigation = {
  onNavigate: vi.fn(),
  onSelectEvent: vi.fn(),
  onSelectInvestigation: vi.fn(),
  onSelectAgent: vi.fn(),
};

describe('sample evidence safety', () => {
  it('never presents fixture artifacts as verified or hashed', async () => {
    render(<EvidenceView {...navigation} />);
    expect((await screen.findAllByText('Unverified')).length).toBeGreaterThan(0);
    expect(screen.queryByText('100% Valid')).not.toBeInTheDocument();
    expect(screen.queryByText('VERIFIED')).not.toBeInTheDocument();
    expect(screen.getAllByText('Unavailable')).toHaveLength(3);
    expect(screen.getAllByText('Not calculated').length).toBeGreaterThan(0);
  });

  it('shows unavailable integrity even for an empty result', async () => {
    vi.spyOn(evidenceService, 'getEvidenceItems').mockResolvedValue([]);
    render(<EvidenceView {...navigation} />);
    expect(await screen.findByRole('status')).toHaveTextContent('Integrity verification is unavailable');
    expect(screen.getAllByText('Unavailable')).toHaveLength(3);
  });

  it('does not invent a digest for an unknown evidence ID', async () => {
    const [fixture] = await evidenceService.getEvidenceItems();
    vi.spyOn(evidenceService, 'getEvidenceItems').mockResolvedValue([{ ...fixture, id: 'unknown-evidence' }]);
    render(<EvidenceView {...navigation} />);
    expect(await screen.findByText('unknown-evidence')).toBeInTheDocument();
    expect(screen.getByText('Not calculated')).toBeInTheDocument();
    expect(screen.queryByText(/e3b0c442/)).not.toBeInTheDocument();
  });

  it('cannot download or claim an evidence export', async () => {
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click');
    render(<InvestigationDetailView investigationId="INV-000142" {...navigation} />);
    const exportButton = await screen.findByRole('button', { name: 'Export Evidence Package' });
    expect(exportButton).toBeDisabled();
    expect(exportButton).toHaveAccessibleDescription(/Evidence export unavailable/);
    fireEvent.click(exportButton);
    expect(download).not.toHaveBeenCalled();
    expect(screen.queryByText(/exported with SHA-256 integrity/)).not.toBeInTheDocument();
  });
});