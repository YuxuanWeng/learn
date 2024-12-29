import { transformProductType } from '@fepkg/business/constants/map';
import { StatusCode } from '@fepkg/request/types';
import { Institution, Trader, TraderSync, User } from '@fepkg/services/types/common';
import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import type { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import { ProductType } from '@fepkg/services/types/enum';
import { InstReadableDao } from '../../database-client/dao/readable/inst';
import { TraderReadableDao } from '../../database-client/dao/readable/trader';
import { UserReadableDao } from '../../database-client/dao/readable/user';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import { formatInstSync2Institution, formatTraderSync2Trader, formatUserSync2User } from '../utils';

const formatTrader = (
  traderList: TraderSync[],
  instMap: Map<string, Institution>,
  userMap: Map<string, User>,
  product_type?: ProductType
) => {
  const resultList: Trader[] = traderList.map(t => {
    let instInfo;
    const brokerList: User[] = [];
    if (t.inst_id) instInfo = instMap.get(t.inst_id);
    if (t.broker_ids?.length) {
      let brokerIds = t.broker_ids;
      // 带出交易员首选项
      if (product_type && t.default_broker_list?.length) {
        const productCode = transformProductType(product_type).en;
        const defaultBrokerId = t.default_broker_list.find(v => v.product_code === productCode)?.broker_id;
        if (defaultBrokerId && brokerIds.includes(defaultBrokerId)) {
          brokerIds = [defaultBrokerId, ...brokerIds.filter(id => id !== defaultBrokerId)];
        }
      }
      for (const b of brokerIds) {
        const broker = userMap.get(b);
        if (broker) {
          brokerList.push(broker);
        }
      }
    }
    return formatTraderSync2Trader(t, instInfo, brokerList);
  });
  return resultList;
};

export class TraderService extends RealtimeService {
  private traderDao: TraderReadableDao;

  private userDao: UserReadableDao;

  private instDao: InstReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({ ...config, syncDataTypeList: Service2SyncDataTypeMap[ServiceType.TraderService] });
    const { databaseClient } = config;
    this.traderDao = new TraderReadableDao(databaseClient);
    this.userDao = new UserReadableDao(databaseClient);
    this.instDao = new InstReadableDao(databaseClient);
  }

  search(params: LocalTraderSearch.Request): LocalTraderSearch.Response {
    const fuzzyResult = this.traderDao.fuzzySearch(params);
    const { total, list: traderList } = fuzzyResult;

    if (!traderList?.length)
      return { list: [], total: total ?? 0, base_response: { code: StatusCode.Success, msg: 'success' } };

    // 机构使用类型在此过滤
    const { product_type } = params;
    const { instMap, userMap } = this.getAssociatedData(traderList, product_type);
    const resultList = formatTrader(traderList, instMap, userMap, product_type);

    return {
      list: resultList
    };
  }

  getInstTraderList(params: LocalInstTraderList.Request): LocalInstTraderList.Response {
    const { list: traderList } = this.traderDao.getInstTraderList(params);
    if (!traderList?.length) return { list: void 0 };
    const { product_type } = params;
    const { instMap, userMap } = this.getAssociatedData(traderList, product_type);
    const resultList = formatTrader(traderList, instMap, userMap, product_type);

    return {
      list: resultList
    };
  }

  private getAssociatedData(traderList: TraderSync[], product_type?: ProductType) {
    const instIdSet = new Set<string>();
    const userIdSet = new Set<string>();

    for (const trader of traderList) {
      if (trader.inst_id) instIdSet.add(trader.inst_id);
      if (trader.broker_ids?.length) trader.broker_ids.map(b => userIdSet.add(b));
    }

    const instMap = new Map<string, Institution>();
    const userMap = new Map<string, User>();

    const instList = this.instDao.getInstByIdList([...instIdSet], product_type);
    const userList = this.userDao.getUsersByIdList([...userIdSet], product_type);

    if (instList) {
      for (const i of instList) {
        if (!product_type || i.product_codes?.includes(transformProductType(product_type).en ?? ''))
          instMap.set(i.inst_id, formatInstSync2Institution(i));
      }
    }

    if (userList) {
      for (const u of userList) {
        if (u.enable) userMap.set(u.user_id, formatUserSync2User(u));
      }
    }

    return { instMap, userMap };
  }

  getByIdList(params: LocalTraderGetByIdList.Request): LocalTraderGetByIdList.Response {
    const { trader_id_list: traderIdList } = params;
    if (!traderIdList?.length) {
      return { trader_sync_list: [] };
    }
    const result = this.traderDao.getTraderByIdList(traderIdList);
    return { trader_sync_list: result };
  }
}
