import { transformProductType } from '@fepkg/business/constants/map';
import { Enable, JobStatus, TraderUsageStatus } from '@fepkg/services/types/bdm-enum';
import { TraderSync } from '@fepkg/services/types/common';
import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import type { InstTraderList } from '@fepkg/services/types/inst/trader-list';
import squel from 'squel';
import { traderSql } from '../../sql/trader';
import { InstTraderDb, TraderDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatTraderDb2TraderSync, getKeywordParams } from './utils';

export class TraderReadableDao extends BaseDao implements Readable {
  fuzzySearch(params: LocalTraderSearch.Request): { list?: TraderSync[]; total: number } {
    const { keyword, product_type, is_precise, trader_id_list, count, offset, need_invalid } = params;

    const queryList = squel
      .select()
      .from('trader')
      .field('trader.*')
      .field(is_precise ? traderSql.preciseOrder : traderSql.fuzzyOrder)
      .where('trader.enable = ?', Enable.DataEnable)
      .where(is_precise ? traderSql.preciseWhere : traderSql.fuzzyWhere)
      .order('matching_order', true)
      .order('trader.pinyin_full', true)
      .offset(offset ?? 0)
      .limit(count ?? 20);

    if (product_type) {
      queryList.where('trader.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }
    if (!need_invalid) {
      queryList.where('trader.job_status = ?', JobStatus.OnJob);
      queryList.where('trader.usage_status = ?', TraderUsageStatus.TraderEnable);
    }

    if (trader_id_list?.length) {
      // 这个string[]需要加一层单引号，否则会有奇怪报错
      queryList.where('trader.trader_id in'.concat('(', trader_id_list.map(id => `'${id}'`).join(','), ')'));
    }

    const fuzzyParams = getKeywordParams(keyword);

    const list = this.databaseClient.all<TraderDb[] | undefined>(queryList.toString(), fuzzyParams);

    if (!list?.length) {
      return { total: 0, list: void 0 };
    }
    return { list: list.map(formatTraderDb2TraderSync), total: 0 };
  }

  getInstTraderList(params: InstTraderList.Request): { list?: TraderSync[]; total: number } {
    const { inst_id, product_type, offset, count } = params;

    if (!inst_id) {
      return { total: 0, list: void 0 };
    }
    const queryList = squel
      .select()
      .from('trader')
      .field('trader.*')
      .where('trader.inst_id = ?', inst_id)
      .where('trader.enable = ?', Enable.DataEnable)
      .where('trader.job_status = ?', JobStatus.OnJob)
      .where('trader.usage_status = ?', TraderUsageStatus.TraderEnable)
      .order('trader.trader_id', true)
      .offset(offset ?? 0)
      .limit(count ?? 20);

    if (product_type) {
      queryList.where('trader.product_codes like ?', `%"${transformProductType(product_type).en}"%`);
    }

    const list = this.databaseClient.all<TraderDb[] | undefined>(queryList.toString());

    if (!list?.length) {
      return { total: 0, list: void 0 };
    }
    return { list: list.map(formatTraderDb2TraderSync), total: 0 };
  }

  getTraderByIdList(idList: string[], allStatus?: boolean) {
    if (!idList.length) return void 0;
    const queryList = squel
      .select()
      .from('trader')
      .field('trader.*')
      .where('trader.enable = ?', Enable.DataEnable)
      .where('trader.trader_id in'.concat('(', idList.map(id => `'${id}'`).join(','), ')'));

    if (!allStatus) {
      queryList.where('trader.job_status = ?', JobStatus.OnJob);
      queryList.where('trader.usage_status = ?', TraderUsageStatus.TraderEnable);
    }

    const result = this.databaseClient.all<TraderDb[] | undefined>(queryList.toString());
    if (!result?.length) return void 0;
    return result.map(formatTraderDb2TraderSync);
  }

  getInstTraderByIdList(idList: string[], allStatus?: boolean) {
    if (!idList.length) return void 0;

    const queryList = squel
      .select()
      .from('trader')
      .field('inst.inst_id')
      .field('inst.standard_code')
      .field('inst.inst_type')
      .field('inst.short_name_zh')
      .field('inst.full_name_zh')
      .field('inst.short_name_en')
      .field('inst.full_name_en')
      .field('inst.pinyin', 'inst_pinyin')
      .field('inst.pinyin_full', 'inst_pinyin_full')
      .field('inst.product_codes', 'inst_product_codes')
      .field('inst.product_short_name_set')
      .field('trader.trader_id')
      .field('trader.name_zh')
      .field('trader.pinyin', 'trader_pinyin')
      .field('trader.pinyin_full', 'trader_pinyin_full')
      .field('trader.name_en')
      .field('trader.code')
      .field('trader.department')
      .field('trader.position')
      .field('trader.qq')
      .field('trader.product_codes', 'trader_product_codes')
      .field('trader.tags')
      .field('trader.broker_ids')
      .field('trader.qm_account')
      .field('trader.white_list')
      .field('trader.product_marks')
      .field('trader.default_broker_list')
      .join('inst', undefined, 'trader.inst_id = inst.inst_id')
      .where('trader.enable = ?', Enable.DataEnable)
      .where('trader.trader_id in'.concat('(', idList.map(id => `'${id}'`).join(','), ')'));

    if (!allStatus) {
      queryList.where('trader.job_status = ?', JobStatus.OnJob);
      queryList.where('trader.usage_status = ?', TraderUsageStatus.TraderEnable);
    }
    const result = this.databaseClient.all<InstTraderDb[] | undefined>(queryList.toString());

    if (!result?.length) return void 0;
    return result;
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(traderSql.getLastVersion);
    return result?.sync_version;
  }

  getTraderMapByIdSet(traderIdSet: Set<string>, allStatus?: boolean) {
    const traderMap = new Map<string, TraderSync>();
    const traderList = this.getTraderByIdList([...traderIdSet], allStatus);
    traderList?.forEach(t => traderMap.set(t.trader_id, t));
    return traderMap;
  }

  getInstTraderMapByIdSet(traderIdSet: Set<string>, allStatus?: boolean) {
    const instTraderMap = new Map<string, InstTraderDb>();
    const instTraderList = this.getInstTraderByIdList([...traderIdSet], allStatus);
    instTraderList?.forEach(t => instTraderMap.set(t.trader_id, t));
    return instTraderMap;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(traderSql.getTotal);
    return result.total;
  }
}
