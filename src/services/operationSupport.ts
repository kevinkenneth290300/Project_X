export class OperationUnavailableError extends Error {
  readonly code = 'OPERATION_UNAVAILABLE';

  constructor(public readonly operation: string) {
    super(`${operation} is unavailable: this demonstration has no operational backend.`);
    this.name = 'OperationUnavailableError';
  }
}