import { QuoteDraftDetailSync } from '@fepkg/services/types/common';
import { quoteDraftDetailSql } from '../../sql/quote_draft_detail';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getQuoteDraftDetailDeleteParams, getQuoteDraftDetailUpsertParams } from './utils';

export class QuoteDraftDetailWritableDao extends BaseDao implements Writable<QuoteDraftDetailSync> {
  createTable() {
    return this.databaseClient.run(quoteDraftDetailSql.createTable);
  }

  dropTable() {
    return this.databaseClient.run(quoteDraftDetailSql.dropTable);
  }

  upsertList(list: QuoteDraftDetailSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame(
      'run',
      quoteDraftDetailSql.upsert,
      list.map(getQuoteDraftDetailUpsertParams)
    );
  }

  deleteList(list: QuoteDraftDetailSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame<{ detail_id: string; message_id: string }>(
      'all',
      quoteDraftDetailSql.remove,
      list.map(getQuoteDraftDetailDeleteParams)
    );
  }

  hardDeleteDisabled() {
    return this.databaseClient.run(quoteDraftDetailSql.hardDeleteDisabledList);
  }
}
