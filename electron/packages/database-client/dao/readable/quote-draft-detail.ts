import { QuoteDraftDetailSync } from '@fepkg/services/types/common';
import squel from 'squel';
import { quoteDraftDetailSql } from '../../sql/quote_draft_detail';
import { QuoteDraftDetailDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatQuoteDraftDetailDb2QuoteDraftDetailSync } from './utils';

export class QuoteDraftDetailReadableDao extends BaseDao implements Readable {
  private getDetailListByMessageIdList(messageIdList?: string[]) {
    if (!messageIdList?.length) return [];
    const query = squel
      .select()
      .from('quote_draft_detail')
      .field('*')
      .where('enable = 1')
      .where('message_id in '.concat('(', messageIdList.map(id => `'${id}'`).join(','), ')'))
      .order('message_id');

    const result = this.databaseClient.all<QuoteDraftDetailDb[]>(query.toString());
    return result.map(formatQuoteDraftDetailDb2QuoteDraftDetailSync);
  }

  getDetailMapByMessageIdList(messageIdList?: string[]) {
    const detailList = this.getDetailListByMessageIdList(messageIdList);
    const detailMap = new Map<string, QuoteDraftDetailSync>();
    detailList.forEach(d => detailMap.set(d.detail_id, d));
    return { detailList, detailMap };
  }

  getDetailListByIdList(detailIdList?: string[]) {
    if (!detailIdList?.length) return [];
    const query = squel
      .select()
      .from('quote_draft_detail')
      .field('*')
      .where('enable = 1')
      .where('detail_id in '.concat('(', detailIdList.map(id => `'${id}'`).join(','), ')'));
    const result = this.databaseClient.all<QuoteDraftDetailDb[]>(query.toString());
    return result.map(formatQuoteDraftDetailDb2QuoteDraftDetailSync);
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(quoteDraftDetailSql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(quoteDraftDetailSql.getTotal);
    return result.total;
  }
}
