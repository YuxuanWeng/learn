import Database from 'better-sqlite3';

export interface Writable<T> {
  createTable(): Database.RunResult;

  dropTable(): Database.RunResult;

  upsertList(list: T[]): unknown[];

  deleteList(list: T[]): unknown[];

  hardDeleteDisabled(): Database.RunResult;
}
