import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import squel from 'squel';
import { quoteDraftMessageSql } from '../../sql/quote_draft_message';
import { QuoteDraftMessageDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatQuoteDraftMessageDb2QuoteDraftMessageSync } from './utils';

export class QuoteDraftMessageReadableDao extends BaseDao implements Readable {
  getMessageByCreatorList(params: LocalQuoteDraftMessageList.Request) {
    const { creator_list, product_type, status, timestamp, offset, count } = params;
    if (!creator_list.length || product_type === undefined)
      return {
        messageList: [],
        total: 0,
        hasMore: false,
        latestCreateTime: '0'
      };

    const baseQuery = squel
      .select()
      .from('quote_draft_message')
      .where('quote_draft_message.enable = 1')
      .where(`quote_draft_message.product_type = ${product_type}`)
      .where('quote_draft_message.creator in '.concat('(', creator_list.map(id => `'${id}'`).join(','), ')'))
      .where(`quote_draft_message.status = ${status}`);

    const hasMoreQuery = baseQuery.clone().field('count(*)', 'more_total');
    let hasMore = false;

    if (timestamp) {
      baseQuery.where(`quote_draft_message.create_time <= ${timestamp}`);
      hasMoreQuery.where(`quote_draft_message.create_time > ${timestamp}`);
      const { more_total } = this.databaseClient.get<{ more_total: number }>(hasMoreQuery.toString());
      hasMore = more_total > 0;
    }

    const query = baseQuery.clone().field('quote_draft_message.*').order('quote_draft_message.create_time', false);
    const latestMessageCreateTime = baseQuery
      .clone()
      .field('quote_draft_message.create_time')
      .order('quote_draft_message.create_time', false)
      .limit(1);
    const totalCountQuery = baseQuery.clone().field('count(*)', 'total');

    if (offset) query.offset(Math.max(0, offset));
    if (count) query.limit(count);

    const result = this.databaseClient.all<QuoteDraftMessageDb[]>(query.toString());
    const { total } = this.databaseClient.get<{ total: number }>(totalCountQuery.toString()) ?? {};
    const { create_time } = this.databaseClient.get<{ create_time: string }>(latestMessageCreateTime.toString()) ?? {};

    return {
      messageList: result.map(formatQuoteDraftMessageDb2QuoteDraftMessageSync),
      hasMore,
      total,
      latestCreateTime: create_time
    };
  }

  getMessageById(idList: string[]) {
    if (!idList.length) return [];

    const query = squel
      .select()
      .from('quote_draft_message')
      .field('quote_draft_message.*')
      .where('quote_draft_message.enable = 1')
      .where('quote_draft_message.message_id in '.concat('(', idList.map(id => `'${id}'`).join(','), ')'));

    const result = this.databaseClient.all<QuoteDraftMessageDb[]>(query.toString());

    return result.map(formatQuoteDraftMessageDb2QuoteDraftMessageSync);
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(quoteDraftMessageSql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(quoteDraftMessageSql.getTotal);
    return result.total;
  }
}
