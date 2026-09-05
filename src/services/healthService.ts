import { HealthStatus, SystemHealthComponent } from '../types';
import { MOCK_SYSTEM_HEALTH } from './mockData';

export const healthService = {
  async getHealthStatus(): Promise<HealthStatus> {
    await new Promise((r) => setTimeout(r, 40));
    return {
      clusterResources: {
        cpuUsage: 28.4,
        memoryUsage: 54.2,
        diskUsage: 31.8,
        networkThroughput: '12,410 eps',
      },
      components: [
        {
          name: 'Ingestion Pipeline & Binary Parser',
          status: 'Operational',
          latency: '12ms',
          throughput: '12,410 eps',
          details: 'Node warden-ingest-01 (gRPC / TLS 1.3)',
        },
        {
          name: 'Syslog Listener Daemon',
          status: 'Operational',
          latency: '4ms',
          throughput: '3,821 eps',
          details: 'Listening on UDP/514, TCP/514, TCP-TLS/6514',
        },
        {
          name: 'Local Spool Disk Buffer',
          status: 'Operational',
          latency: '2ms',
          throughput: '18.2 GB / 250 GB',
          details: 'NVMe Ring Buffer (7% utilization)',
        },
        {
          name: 'Database & Indexing Core',
          status: 'Operational',
          latency: '45ms',
          throughput: '99.98% uptime',
          details: 'Distributed Sharded Index Tier',
        },
        {
          name: 'TLS Cryptographic Engine',
          status: 'Operational',
          latency: '<1ms',
          throughput: '100% mTLS verified',
          details: 'Warden Enclave Internal CA G3',
        },
      ],
    };
  },
  async getSystemComponents(): Promise<SystemHealthComponent[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...MOCK_SYSTEM_HEALTH];
  },
};
