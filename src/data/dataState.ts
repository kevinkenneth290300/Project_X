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

export function selectedRecord<Data extends { id: string }>(records: readonly Data[], id: string): DataState<Data> {
  if (!id) return { status: 'empty', reason: 'No record has been selected.' };
  const matches = records.filter((record) => record.id === id);
  if (matches.length > 1) return { status: 'error', reason: 'Inventory returned duplicate record identifiers.' };
  const record = matches[0];
  return record ? { status: 'ready', data: structuredClone(record) } : { status: 'empty', reason: 'Record not found.' };
}