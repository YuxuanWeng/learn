import { transformProductType } from '@fepkg/business/constants/map';
import { InstSync } from '@fepkg/services/types/common';
import { Enable, InstStatus, ProductType, UsageStatus } from '@fepkg/services/types/enum';
import type { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import squel from 'squel';
import { instSql } from '../../sql/inst';
import { InstDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatInstDb2InstSync, getKeywordParams } from './utils';

export class InstReadableDao extends BaseDao implements Readable {
  fuzzySearch(params: InstFuzzySearch.Request): { list?: InstSync[]; total: number } {
    const { keyword, product_type, count, offset, need_invalid } = params;

    const queryList = squel
      .select()
      .from('inst')
      .field('inst.*')
      .field(instSql.fuzzyOrder)
      .where(instSql.fuzzyWhere)
      .where('inst.enable = ?', Enable.DataEnable)
      .order('matching_order', true)
      .order('inst.pinyin_full', true)
      .offset(offset ?? 0)
      .limit(count ?? 20);

    if (product_type) {
      queryList.where('inst.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }
    if (!need_invalid) {
      queryList.where('inst.inst_status = ?', InstStatus.StartBiz);
      queryList.where('inst.usage_status = ?', UsageStatus.Using);
    }

    const fuzzyParams = getKeywordParams(keyword);

    const list = this.databaseClient.all<InstDb[] | undefined>(queryList.toString(), fuzzyParams);

    if (!list?.length) {
      return { total: 0, list: void 0 };
    }
    return { list: list.map(formatInstDb2InstSync), total: 0 };
  }

  getInstByIdList(idList: string[], product_type?: ProductType, allStatus?: boolean) {
    if (!idList.length) return void 0;

    const queryList = squel
      .select()
      .from('inst')
      .field('inst.*')
      .where('inst.enable = ?', Enable.DataEnable)
      .where('inst_id in '.concat('(', idList.map(id => `'${id}'`).join(','), ')'));

    if (!allStatus) {
      queryList.where('inst.inst_status = ?', InstStatus.StartBiz);
      queryList.where('inst.usage_status = ?', UsageStatus.Using);
    }

    if (product_type) {
      queryList.where('inst.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }

    const result = this.databaseClient.all<InstDb[] | undefined>(queryList.toString());
    if (!result?.length) return void 0;
    return result.map(formatInstDb2InstSync);
  }

  getInstMapByIdSet(instIdSet: Set<string>, product_type?: ProductType, allStatus?: boolean) {
    const instMap = new Map<string, InstSync>();
    const instList = this.getInstByIdList([...instIdSet], product_type, allStatus);
    instList?.forEach(i => instMap.set(i.inst_id, i));
    return instMap;
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(instSql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(instSql.getTotal);
    return result.total;
  }
}
