import type { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import { logger } from 'app/utility-process/data-localization/utils';
import { BondDetailReadableDao } from '../../database-client/dao/readable/bond-detail';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';

export class BondService extends RealtimeService {
  private bondDetailDao: BondDetailReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({
      ...config,
      syncDataTypeList: Service2SyncDataTypeMap[ServiceType.BondService]
    });
    const { databaseClient } = config;
    this.bondDetailDao = new BondDetailReadableDao(databaseClient);
  }

  search(params: LocalBondSearch.Request): LocalBondSearch.Response {
    const matchList = params.keyword.match(/[^.]+/);

    let { keyword } = params;

    if (matchList) {
      const market = params.keyword.substring(matchList[0].length + 1).toLocaleUpperCase();

      if (/^(SH|SZ|IB)$/.test(market)) {
        [keyword] = matchList;
      }
    }

    if (!keyword) {
      return {
        bond_basic_list: [],
        total: `0`
      };
    }

    const result = this.bondDetailDao.fuzzySearch({ ...params, keyword });

    return result;
  }

  getByKeyMarketList(params: LocalBondGetByKeyMarketList.Request): LocalBondGetByKeyMarketList.Response {
    const { key_market_list } = params;
    if (!key_market_list?.length) {
      return { bond_list: [] };
    }

    logger.e(
      {
        keyword: 'dao层step1',
        key_market_list
      },
      { immediate: true }
    );
    const bondLiteList = this.bondDetailDao.getBondLiteByKeyMarketList(key_market_list) ?? [];
    logger.e(
      {
        keyword: 'dao层 step2',
        bondLiteList
      },
      { immediate: true }
    );
    return { bond_list: bondLiteList };
  }
}
