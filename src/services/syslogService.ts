import { SyslogSource, SyslogListener, SyslogMessage } from '../types';
import { MOCK_SYSLOG_SOURCES, MOCK_SYSLOG_LISTENERS, MOCK_SYSLOG_MESSAGES } from './mockData';
import { OperationUnavailableError } from './operationSupport';

const syslogSources: SyslogSource[] = [...MOCK_SYSLOG_SOURCES];
const syslogListeners: SyslogListener[] = [...MOCK_SYSLOG_LISTENERS];
const syslogMessages: SyslogMessage[] = [...MOCK_SYSLOG_MESSAGES];

export interface SyslogStats {
  dataSource: 'sample';
  sourcesCount: number;
  sampleMessageCount: number;
  messagesPerSec: null;
  messagesToday: null;
  deliverySuccessRate: null;
}

export const syslogService = {
  async getStats(): Promise<SyslogStats> {
    return {
      dataSource: 'sample',
      sourcesCount: syslogSources.length,
      sampleMessageCount: syslogMessages.length,
      messagesPerSec: null,
      messagesToday: null,
      deliverySuccessRate: null,
    };
  },

  async getSources(): Promise<SyslogSource[]> {
    await new Promise((r) => setTimeout(r, 40));
    return structuredClone(syslogSources);
  },

  async getListeners(): Promise<SyslogListener[]> {
    await new Promise((r) => setTimeout(r, 30));
    return syslogListeners.map<SyslogListener>((listener) => ({ ...structuredClone(listener), status: 'Unavailable' }));
  },

  async getMessages(): Promise<SyslogMessage[]> {
    await new Promise((r) => setTimeout(r, 30));
    return syslogMessages.map((message) => ({ ...structuredClone(message), parsedFields: {} }));
  },

  async testParser(rawSample: string): Promise<{
    status: 'success' | 'error';
    extractedFields: Record<string, string>;
    normalizedMapping: Record<string, string>;
    confidence: number;
    recommendedParser: string;
  }> {
    throw new OperationUnavailableError('Syslog parser testing');
  },
};
