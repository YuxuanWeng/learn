import { QuoteSync } from '@fepkg/services/types/common';
import { quoteSql } from '../../sql/quote';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getQuoteDeleteParams, getQuoteUpsertParams } from './utils';

export class QuoteWritableDao extends BaseDao implements Writable<QuoteSync> {
  createTable() {
    return this.databaseClient.run(quoteSql.createTable);
  }

  dropTable() {
    return this.databaseClient.run(quoteSql.dropTable);
  }

  upsertList(list: QuoteSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', quoteSql.upsert, list.map(getQuoteUpsertParams));
  }

  deleteList(list: QuoteSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame<{ quote_id: string; bond_key_market: string }>(
      'all',
      quoteSql.remove,
      list.map(getQuoteDeleteParams)
    );
  }

  hardDeleteDisabled() {
    return this.databaseClient.run(quoteSql.hardDeleteDisabledList);
  }
}
