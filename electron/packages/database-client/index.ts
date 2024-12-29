import Database, { Database as DatabaseType } from 'better-sqlite3';

export class DatabaseClient {
  private db: DatabaseType;

  private readonly dbFilePath: string;

  constructor(dbFilePath: string) {
    this.dbFilePath = dbFilePath;
    this.db = new Database(this.dbFilePath, { fileMustExist: false });
    this.db.pragma('journal_mode = WAL');
  }

  run<P = unknown>(sql: string, params?: P) {
    if (params) return this.db.prepare(sql).run(params);
    return this.db.prepare(sql).run();
  }

  get<D = unknown, P = unknown>(sql: string, params?: P) {
    if (params) return this.db.prepare(sql).get(params) as D;
    return this.db.prepare(sql).get() as D;
  }

  all<D = unknown, P = unknown>(sql: string, params?: P) {
    if (params) return this.db.prepare(sql).all(params) as unknown as D;
    return this.db.prepare(sql).all() as unknown as D;
  }

  prepareSame<D = unknown, P = unknown>(method: 'run' | 'get' | 'all', sql: string, params: P[]) {
    const stmt = this.db.prepare(sql);
    const result: D[] = [];
    for (let i = 0, len = params.length; i < len; i++) {
      const res = stmt[method](params[i]) as D;
      result.push(res);
    }
    return result;
  }

  close() {
    this.db.close();
  }
}
