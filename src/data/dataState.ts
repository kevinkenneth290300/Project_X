export type DataStatus = 'ready' | 'empty' | 'unconfigured' | 'unavailable' | 'unauthenticated' | 'forbidden' | 'error' | 'loading';

export type DataState<Data> =
  | { status: 'ready'; data: Data }
  | { status: Exclude<DataStatus, 'ready'>; reason: string };

export function recordsState<RecordType>(records: readonly RecordType[]): DataState<readonly RecordType[]> {
  return records.length > 0
    ? { status: 'ready', data: records }
    : { status: 'empty', reason: 'No records are available.' };
}

export function unconfiguredState<Data>(reason = 'No data source is configured.'): DataState<Data> {
  return { status: 'unconfigured', reason };
}