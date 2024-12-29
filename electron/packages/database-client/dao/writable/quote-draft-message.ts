import { QuoteDraftMessageSync } from '@fepkg/services/types/common';
import { quoteDraftMessageSql } from '../../sql/quote_draft_message';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getQuoteDraftMessageDeleteParams, getQuoteDraftMessageUpsertParams } from './utils';

export class QuoteDraftMessageWritableDao extends BaseDao implements Writable<QuoteDraftMessageSync> {
  createTable() {
    return this.databaseClient.run(quoteDraftMessageSql.createTable);
  }

  dropTable() {
    return this.databaseClient.run(quoteDraftMessageSql.dropTable);
  }

  upsertList(list: QuoteDraftMessageSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame(
      'run',
      quoteDraftMessageSql.upsert,
      list.map(getQuoteDraftMessageUpsertParams)
    );
  }

  deleteList(list: QuoteDraftMessageSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame<{ message_id: string }>(
      'all',
      quoteDraftMessageSql.remove,
      list.map(getQuoteDraftMessageDeleteParams)
    );
  }

  hardDeleteDisabled() {
    return this.databaseClient.run(quoteDraftMessageSql.hardDeleteDisabledList);
  }
}
