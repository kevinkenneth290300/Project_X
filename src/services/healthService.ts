import { HealthStatus, SystemHealthComponent } from '../types';
import { OperationUnavailableError } from './operationSupport';

export const healthService = {
  async getHealthStatus(): Promise<HealthStatus> {
    throw new OperationUnavailableError('Live system health');
  },

  async getSampleHealthStatus(): Promise<HealthStatus> {
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
          status: 'Unavailable',
          latency: 'Unavailable',
          throughput: 'Unavailable',
          details: 'Sample component; no ingestion backend connected',
        },
        {
          name: 'Syslog Listener Daemon',
          status: 'Unavailable',
          latency: 'Unavailable',
          throughput: 'Unavailable',
          details: 'Sample component; no syslog listener is running in this console',
        },
        {
          name: 'Local Spool Disk Buffer',
          status: 'Unavailable',
          latency: 'Unavailable',
          throughput: 'Unavailable',
          details: 'Sample component; no local spool measurements available',
        },
        {
          name: 'Database & Indexing Core',
          status: 'Unavailable',
          latency: 'Unavailable',
          throughput: 'Unavailable',
          details: 'Sample component; no database health query performed',
        },
        {
          name: 'TLS Cryptographic Engine',
          status: 'Unavailable',
          latency: 'Unavailable',
          throughput: 'Unavailable',
          details: 'Sample component; no TLS or certificate verification performed',
        },
      ],
    };
  },
  async getSystemComponents(): Promise<SystemHealthComponent[]> {
    throw new OperationUnavailableError('Live system components');
  },
};
