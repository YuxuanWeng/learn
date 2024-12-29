import { QuoteSync } from '@fepkg/services/types/common';
import squel from 'squel';
import { quoteSql } from '../../sql/quote';
import { QuoteDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatQuoteDb2QuoteSync } from './utils';

export class QuoteReadableDao extends BaseDao implements Readable {
  selectByKeyMarketBroker(bond_key_market: string, broker_id?: string, ignoreRetail?: boolean): QuoteSync[] {
    const queryList = squel
      .select()
      .from('quote')
      .field('quote.*')
      .where('bond_key_market = ?', bond_key_market)
      .where('enable = ?', 1)
      .order('sync_version', false)
      .limit(100);

    if (broker_id) {
      queryList.where('broker_id = ?', broker_id);
    }
    // 是否忽略散量
    if (ignoreRetail) {
      queryList.where('MOD(volume, 1000) = 0');
    }

    const result = this.databaseClient.all<QuoteDb[]>(queryList.toString());
    return result.map(formatQuoteDb2QuoteSync);
  }

  searchById(quote_id: string): QuoteSync | undefined {
    const queryList = squel
      .select()
      .from('quote')
      .field('quote.*')
      .where('quote_id = ?', quote_id)
      .where('enable = ?', 1)
      .limit(1);

    const result = this.databaseClient.get<QuoteDb | undefined>(queryList.toString());

    if (result) {
      return formatQuoteDb2QuoteSync(result);
    }
    return void 0;
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(quoteSql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(quoteSql.getTotal);
    return result.total;
  }
}
