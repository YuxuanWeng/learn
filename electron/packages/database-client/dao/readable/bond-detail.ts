import { BondDetailSync, FiccBondBasic } from '@fepkg/services/types/common';
import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import { BondSearchType } from '@fepkg/services/types/enum';
import moment from 'moment';
import squel from 'squel';
import { bondDetailSql } from '../../sql/bond_detail';
import { BondDetailDb } from '../../types';
import { HolidayReadableDao } from './holiday';
import { formatBondDetailDb2BondDetailSync, formatBondDetailDb2BondLite, getKeywordParams, isNumber } from './utils';

export class BondDetailReadableDao extends HolidayReadableDao {
  fuzzySearch(params: LocalBondSearch.Request): LocalBondSearch.Response {
    const { keyword, search_type, product_type, count, offset, key_market_list } = params;

    const queryList = squel
      .select()
      .from('bond_detail')
      .field('bond_detail.*')
      .field(bondDetailSql.fuzzyOrder)
      .where('bond_detail.enable = 1')
      .where('maturity_date > ?', moment().startOf('day').valueOf())
      .where(squel.expr().or('delisted_date > ?', moment().startOf('day').valueOf()).or('delisted_date = ?', ''))
      .order('matching_order', true)
      .order('bond_detail.display_code', true)
      .offset(isNumber(offset) ? Number(offset) : 0)
      .limit(isNumber(count) ? Number(count) : 20);

    if (product_type) {
      queryList.where('bond_detail.product_type = ?', product_type);
    }
    // 默认是undefined，如果是数组(包括空数组)，返回债券数组对应的债券信息  行情追踪中key_market_list 会始终有值，如果是空数组，返回[]
    if (key_market_list) {
      queryList.where('bond_detail.key_market in'.concat('(', key_market_list.map(id => `'${id}'`).join(','), ')'));
    }

    const fuzzyParams = getKeywordParams(keyword);

    switch (search_type) {
      case BondSearchType.SearchAllField:
        queryList.where(bondDetailSql.fuzzyWhere);
        break;
      case BondSearchType.SearchCode:
        queryList.where('bond_detail.bond_code like $fuzzy');
        break;
      case BondSearchType.SearchShortName:
        queryList.where('bond_detail.short_name like $fuzzy');
        break;
      case BondSearchType.SearchFullName:
        queryList.where('bond_detail.full_name like $fuzzy');
        break;
      case BondSearchType.SearchPinyin:
        queryList.where('bond_detail.pinyin like $fuzzy');
        break;
      case BondSearchType.SearchDealProcess:
        queryList.where(bondDetailSql.fuzzyIDCWhere);
        break;
      default:
        queryList.where(bondDetailSql.fuzzyWhere);
    }
    const list = this.databaseClient.all<BondDetailDb[] | undefined>(queryList.toString(), fuzzyParams);

    if (!list?.length) {
      return { bond_basic_list: void 0 };
    }

    return {
      bond_basic_list: list.map(b =>
        formatBondDetailDb2BondLite(b, b.maturity_date ? this.getRestDayToWorkday(b.maturity_date) : undefined)
      )
    };
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(bondDetailSql.getLastVersion);
    return result?.sync_version;
  }

  getBondLiteByKeyMarketList(keyMarketList?: string[]): FiccBondBasic[] | undefined {
    if (!keyMarketList?.length) return void 0;
    const result = this.databaseClient.all<BondDetailDb[] | undefined>(
      `${bondDetailSql.getByKeyMarketList}(${keyMarketList.map(key => `'${key}'`).join(',')})`
    );
    return (
      result?.map(b =>
        formatBondDetailDb2BondLite(b, b.maturity_date ? this.getRestDayToWorkday(b.maturity_date) : undefined)
      ) ?? []
    );
  }

  getBondLiteMapByKeyMarketSet(keyMarketSet: Set<string>) {
    const bondLiteMap = new Map<string, FiccBondBasic>();
    const bondLiteList = this.getBondLiteByKeyMarketList([...keyMarketSet]);
    if (bondLiteList) for (const bond of bondLiteList) bondLiteMap.set(bond.key_market, bond);
    return bondLiteMap;
  }

  getBondDetailSyncMapByKeyMarketSet(keyMarketSet: Set<string>, keyList?: string[]) {
    const bondDetailSyncMap = new Map<string, Partial<BondDetailSync>>();
    const queryList = squel
      .select()
      .from('bond_detail')
      .where('key_market in '.concat('(', [...keyMarketSet].map(key => `'${key}'`).join(','), ')'));
    if (!keyList) {
      queryList.field('bond_detail.*');
    } else {
      for (const key of keyList) {
        queryList.field(key);
      }
    }
    const bondDetailSyncList = this.databaseClient.all<Partial<BondDetailDb>[] | undefined>(queryList.toString());
    bondDetailSyncList?.map(formatBondDetailDb2BondDetailSync)?.forEach(bond => {
      if (bond.key_market) bondDetailSyncMap.set(bond?.key_market, bond);
    });
    return bondDetailSyncMap;
  }

  getBondDetailByRandom(): FiccBondBasic[] | undefined {
    const query = squel
      .select()
      .from('bond_detail')
      .where('maturity_date > ?', moment().startOf('day').valueOf())
      .where(squel.expr().or('delisted_date > ?', moment().startOf('day').valueOf()).or('delisted_date = ?', ''))
      .order('RANDOM()')
      .limit(100);
    const result = this.databaseClient.all<BondDetailDb[] | undefined>(query.toString());
    return (
      result?.map(b =>
        formatBondDetailDb2BondLite(b, b.maturity_date ? this.getRestDayToWorkday(b.maturity_date) : undefined)
      ) ?? []
    );
  }

  getTotalNum(): { localTotal: number; localEnableTotal: number } {
    const query = squel.select().from('bond_detail').field('count(*)', 'total');
    const result = this.databaseClient.get<{ total: number } | undefined>(query.toString());

    const enableQuery = squel.select().from('bond_detail').field('count(*)', 'total').where('enable = 1');
    const enableResult = this.databaseClient.get<{ total: number } | undefined>(enableQuery.toString());

    return {
      localTotal: result?.total ?? 0,
      localEnableTotal: enableResult?.total ?? 0
    };
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(bondDetailSql.getTotal);
    return result.total;
  }
}
