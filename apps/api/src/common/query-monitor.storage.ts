import { AsyncLocalStorage } from 'async_hooks';

export interface QueryStore {
  count: number;
}

export const queryMonitorStorage = new AsyncLocalStorage<QueryStore>();
