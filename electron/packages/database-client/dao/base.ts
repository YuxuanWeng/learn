import { DatabaseClient } from '..';

export abstract class BaseDao {
  protected databaseClient: DatabaseClient;

  constructor(databaseClient: DatabaseClient) {
    this.databaseClient = databaseClient;
  }
}
