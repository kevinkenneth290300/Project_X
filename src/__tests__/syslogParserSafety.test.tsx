import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { syslogService } from '../services/syslogService';
import { SyslogParserAssistantView } from '../views/SyslogParserAssistantView';
import { SyslogView } from '../views/SyslogView';
import { SyslogListenerModal } from '../components/dialogs/SyslogListenerModal';

describe('unsupported syslog parser boundary', () => {
  it.each([
    '',
    'arbitrary unstructured input',
    '<broken syslog message',
    'USER=someone-else SOURCE_IP=192.0.2.20',
    '<134>1 2026-09-02T10:48:58Z sample-host sshd 42 - - message',
    'Sep 02 10:49:12 sample-fw %ASA-4-106023: Deny tcp',
  ])('never fabricates extraction, mapping, or confidence for %j', async (sample) => {
    const network = vi.spyOn(globalThis, 'fetch');
    await expect(syslogService.testParser(sample)).rejects.toMatchObject({ code: 'OPERATION_UNAVAILABLE', operation: 'Syslog parser testing' });
    expect(network).not.toHaveBeenCalled();
  });
});

describe('parser input UI without fabricated results', () => {
  it.each(['', 'arbitrary text', '<malformed', 'USER=changed SOURCE_IP=192.0.2.50', '<134>1 2026-09-02T10:48:58Z host sshd 42 - - message'])('keeps testing/deployment unavailable for %j', (sample) => {
    const parse = vi.spyOn(syslogService, 'testParser');
    const network = vi.spyOn(globalThis, 'fetch');
    render(<SyslogParserAssistantView onNavigate={vi.fn()} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Sample syslog message' }), { target: { value: sample } });
    const test = screen.getByRole('button', { name: 'Test & Extract Fields' });
    const save = screen.getByRole('button', { name: 'Save Parser Definition' });
    expect(test).toBeDisabled();
    expect(save).toBeDisabled();
    expect(test).toHaveAccessibleDescription(/No submitted message is parsed/);
    fireEvent.click(test);
    fireEvent.click(save);
    expect(parse).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading', { name: 'Extracted Raw Token Fields' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Normalized ECS Schema Target' })).not.toBeInTheDocument();
    expect(screen.queryByText(/% confidence|definition compiled and assigned/)).not.toBeInTheDocument();
  });

  it('loads representative presets only as unparsed local sample text', () => {
    const parse = vi.spyOn(syslogService, 'testParser');
    const navigate = vi.fn();
    render(<SyslogParserAssistantView onNavigate={navigate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Key-Value Delimited Log' }));
    expect(screen.getByRole('textbox', { name: 'Sample syslog message' })).toHaveDisplayValue(/USER=/);
    expect(screen.getByText('PARSING UNAVAILABLE')).toBeInTheDocument();
    expect(parse).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTitle('Back to Syslog'));
    expect(navigate).toHaveBeenCalledWith('syslog');
  });
});

describe('sample syslog workflow without live pipeline claims', () => {
  it('provides real sample counts and no fabricated parser/connectivity/delivery results', async () => {
    const sources = await syslogService.getSources();
    const messages = await syslogService.getMessages();
    expect(await syslogService.getStats()).toMatchObject({ dataSource: 'sample', sourcesCount: sources.length, sampleMessageCount: messages.length, messagesPerSec: null, messagesToday: null, deliverySuccessRate: null });
    expect((await syslogService.getListeners()).every((listener) => listener.status === 'Unavailable')).toBe(true);
    expect(messages.every((message) => Object.keys(message.parsedFields).length === 0)).toBe(true);
  });

  it('renders canonical sources and routes to unparsed input without a live buffer', async () => {
    const sources = await syslogService.getSources();
    const navigate = vi.fn();
    render(<SyslogView onNavigate={navigate} />);
    await waitFor(() => expect(screen.getByLabelText('Sample syslog source count')).toHaveTextContent(String(sources.length)));
    expect(screen.getByRole('heading', { name: 'Unparsed Sample Raw Messages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Configure Listener' })).toBeDisabled();
    expect(screen.queryByText(/99\.99%|Realtime buffer|Live Syslog Raw Payload Stream/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search source IP, host, parser...'), { target: { value: sources[0].source } });
    expect(screen.getByRole('cell', { name: sources[0].source })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sample Parser Input' }));
    expect(navigate).toHaveBeenCalledWith('parser-assistant');
  });

  it('cannot start a listener or acknowledge TLS from the direct sample dialog', () => {
    const saved = vi.fn();
    render(<SyslogListenerModal isOpen onClose={vi.fn()} onSaved={saved} />);
    const start = screen.getByRole('button', { name: 'Start Listener' });
    expect(start).toBeDisabled();
    expect(start).toHaveAccessibleDescription(/no port is opened/);
    fireEvent.click(start);
    expect(saved).not.toHaveBeenCalled();
    expect(screen.queryByText(/TLS 1\.3 Mutual Auth using/)).not.toBeInTheDocument();
  });

  it('marks failed sample-record loading unavailable rather than a measured zero', async () => {
    vi.spyOn(syslogService, 'getSources').mockRejectedValue(new Error('Unavailable'));
    render(<SyslogView onNavigate={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sample syslog data unavailable');
    expect(screen.getByLabelText('Sample syslog source count')).toHaveTextContent('Unavailable');
  });
});