import { SyslogSource, SyslogListener, SyslogMessage } from '../types';
import { MOCK_SYSLOG_SOURCES, MOCK_SYSLOG_LISTENERS, MOCK_SYSLOG_MESSAGES } from './mockData';

let syslogSources: SyslogSource[] = [...MOCK_SYSLOG_SOURCES];
let syslogListeners: SyslogListener[] = [...MOCK_SYSLOG_LISTENERS];
let syslogMessages: SyslogMessage[] = [...MOCK_SYSLOG_MESSAGES];

export const syslogService = {
  async getStats() {
    await new Promise((r) => setTimeout(r, 40));
    return {
      sourcesCount: 47,
      messagesPerSec: 3821,
      messagesToday: '18.4M',
      deliverySuccessRate: '99.99%',
    };
  },

  async getSources(): Promise<SyslogSource[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...syslogSources];
  },

  async getListeners(): Promise<SyslogListener[]> {
    await new Promise((r) => setTimeout(r, 30));
    return [...syslogListeners];
  },

  async getMessages(): Promise<SyslogMessage[]> {
    await new Promise((r) => setTimeout(r, 30));
    return [...syslogMessages];
  },

  async testParser(rawSample: string): Promise<{
    status: 'success' | 'error';
    extractedFields: Record<string, string>;
    normalizedMapping: Record<string, string>;
    confidence: number;
    recommendedParser: string;
  }> {
    await new Promise((r) => setTimeout(r, 350));
    // Deterministic parsing simulation
    if (rawSample.includes('USER=') || rawSample.includes('user=')) {
      return {
        status: 'success',
        extractedFields: {
          timestamp: '2026-09-02 10:49:12',
          username: 'john.doe',
          action: 'LOGIN',
          source_ip: '10.1.2.3',
          auth_mechanism: 'NTLM_V2',
          status: 'SUCCESS',
        },
        normalizedMapping: {
          'user.name': 'username',
          'source.ip': 'source_ip',
          'event.action': 'action',
          '@timestamp': 'timestamp',
          'event.outcome': 'status',
        },
        confidence: 96,
        recommendedParser: 'Key-Value Delimited Parser (ECS Schema)',
      };
    } else if (rawSample.includes('sshd')) {
      return {
        status: 'success',
        extractedFields: {
          timestamp: '2026-09-02T10:48:58Z',
          host: 'APP-LOG-01',
          process: 'sshd',
          pid: '14820',
          auth_method: 'publickey',
          user: 'ansible',
          client_ip: '10.10.0.5',
          client_port: '49120',
        },
        normalizedMapping: {
          '@timestamp': 'timestamp',
          'host.hostname': 'host',
          'process.name': 'process',
          'user.name': 'user',
          'source.ip': 'client_ip',
          'source.port': 'client_port',
        },
        confidence: 98,
        recommendedParser: 'Linux OpenSSH RFC5424 Parser',
      };
    } else {
      return {
        status: 'success',
        extractedFields: {
          timestamp: '2026-09-02T10:49:12Z',
          facility: 'local0',
          severity: 'informational',
          device: 'FW-HQ-01',
          src_ip: '192.168.40.88',
          dst_ip: '10.20.4.42',
          action: 'drop',
        },
        normalizedMapping: {
          '@timestamp': 'timestamp',
          'observer.hostname': 'device',
          'source.ip': 'src_ip',
          'destination.ip': 'dst_ip',
          'event.action': 'action',
        },
        confidence: 91,
        recommendedParser: 'Generic RFC 3164/5424 Syslog Extractor',
      };
    }
  },
};
