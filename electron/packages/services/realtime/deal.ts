import { DealInfoSync } from '@fepkg/services/types/common';
import type { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import { BridgeInfoSync } from 'app/types/DataLocalization/local-common';
import { BondDetailReadableDao } from '../../database-client/dao/readable/bond-detail';
import { DealInfoReadableDao } from '../../database-client/dao/readable/deal-info';
import { InstReadableDao } from '../../database-client/dao/readable/inst';
import { TraderReadableDao } from '../../database-client/dao/readable/trader';
import { UserReadableDao } from '../../database-client/dao/readable/user';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import { formatDealInfoSync2DealRecord } from '../utils';

export class DealService extends RealtimeService {
  private dealInfoDao: DealInfoReadableDao;

  private bondDetailDao: BondDetailReadableDao;

  private instDao: InstReadableDao;

  private traderDao: TraderReadableDao;

  private userDao: UserReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({
      ...config,
      syncDataTypeList: Service2SyncDataTypeMap[ServiceType.DealService]
    });
    const { databaseClient } = config;
    this.dealInfoDao = new DealInfoReadableDao(databaseClient);
    this.bondDetailDao = new BondDetailReadableDao(databaseClient);
    this.instDao = new InstReadableDao(databaseClient);
    this.traderDao = new TraderReadableDao(databaseClient);
    this.userDao = new UserReadableDao(databaseClient);
  }

  getRecordList(params: LocalDealRecordList.Request): LocalDealRecordList.Response {
    const { product_type, broker_list, deal_time } = params;

    const result = this.dealInfoDao.getAccessGrantDealInfoByDealTime(product_type, broker_list, deal_time);
    const dealInfoSyncList = result.deal_info_list ?? [];
    const confirmTotal = result.confirm_total;

    const { bondLiteMap, instMap, traderMap, userMap, instTraderMap } =
      this.getDealRecordAssociatedData(dealInfoSyncList);

    const resultList = dealInfoSyncList.map(d =>
      formatDealInfoSync2DealRecord({
        dealInfo: d,
        bondInfo: bondLiteMap.get(d.bond_key_market),
        operator: userMap.get(d.operator),
        bidInst: instMap.get(d.bid_inst_id),
        ofrInst: instMap.get(d.ofr_inst_id),
        bidTrader: traderMap.get(d.bid_trader_id),
        ofrTrader: traderMap.get(d.ofr_trader_id),
        bidBroker: userMap.get(d.bid_broker_id),
        bidBrokerB: userMap.get(d.bid_broker_id_b),
        bidBrokerC: userMap.get(d.bid_broker_id_c),
        bidBrokerD: userMap.get(d.bid_broker_id_d),
        ofrBroker: userMap.get(d.ofr_broker_id),
        ofrBrokerB: userMap.get(d.ofr_broker_id_b),
        ofrBrokerC: userMap.get(d.ofr_broker_id_c),
        ofrBrokerD: userMap.get(d.ofr_broker_id_d),
        bidOldContentBidTrader: d.bid_old_content.bid_trader_id
          ? instTraderMap.get(d.bid_old_content.bid_trader_id)
          : undefined,
        bidOldContentOfrTrader: d.bid_old_content.ofr_trader_id
          ? instTraderMap.get(d.bid_old_content.ofr_trader_id)
          : undefined,
        ofrOldContentBidTrader: d.ofr_old_content.bid_trader_id
          ? instTraderMap.get(d.ofr_old_content.bid_trader_id)
          : undefined,
        ofrOldContentOfrTrader: d.ofr_old_content.ofr_trader_id
          ? instTraderMap.get(d.ofr_old_content.ofr_trader_id)
          : undefined,
        bidOldContentBidBroker: d.bid_old_content.bid_broker_id
          ? userMap.get(d.bid_old_content.bid_broker_id)
          : undefined,
        bidOldContentOfrBroker: d.bid_old_content.ofr_broker_id
          ? userMap.get(d.bid_old_content.ofr_broker_id)
          : undefined,
        ofrOldContentBidBroker: d.ofr_old_content.bid_broker_id
          ? userMap.get(d.ofr_old_content.bid_broker_id)
          : undefined,
        ofrOldContentOfrBroker: d.ofr_old_content.ofr_broker_id
          ? userMap.get(d.ofr_old_content.ofr_broker_id)
          : undefined,
        addBidBridgeOperator: d.bid_add_bridge_operator_id ? userMap.get(d.bid_add_bridge_operator_id) : undefined,
        addOfrBridgeOperator: d.ofr_add_bridge_operator_id ? userMap.get(d.ofr_add_bridge_operator_id) : undefined,
        bridgeList: d.bridge_list
          .map(bridge => {
            return {
              user: userMap.get(bridge.broker_id),
              trader: traderMap.get(bridge.trader_id),
              trader_tag: bridge.trader_tag,
              inst: instMap.get(bridge.inst_id)
            };
          })
          .filter(Boolean) as BridgeInfoSync[]
      })
    );

    return { deal_info_list: resultList, confirm_total: confirmTotal };
  }

  private getDealRecordAssociatedData(dealInfoList: DealInfoSync[]) {
    const keyMarketSet = new Set<string>();
    const traderIdSet = new Set<string>();
    const instTraderIdSet = new Set<string>();
    const userIdSet = new Set<string>();
    const instIdSet = new Set<string>();

    for (const d of dealInfoList) {
      if (d.bond_key_market) keyMarketSet.add(d.bond_key_market);
      if (d.operator) userIdSet.add(d.operator);
      if (d.bid_inst_id) instIdSet.add(d.bid_inst_id);
      if (d.ofr_inst_id) instIdSet.add(d.ofr_inst_id);
      if (d.bid_trader_id) traderIdSet.add(d.bid_trader_id);
      if (d.ofr_trader_id) traderIdSet.add(d.ofr_trader_id);

      if (d.bid_broker_id) userIdSet.add(d.bid_broker_id);
      if (d.bid_broker_id_b) userIdSet.add(d.bid_broker_id_b);
      if (d.bid_broker_id_c) userIdSet.add(d.bid_broker_id_c);
      if (d.bid_broker_id_d) userIdSet.add(d.bid_broker_id_d);

      if (d.ofr_broker_id) userIdSet.add(d.ofr_broker_id);
      if (d.ofr_broker_id_b) userIdSet.add(d.ofr_broker_id_b);
      if (d.ofr_broker_id_c) userIdSet.add(d.ofr_broker_id_c);
      if (d.ofr_broker_id_d) userIdSet.add(d.ofr_broker_id_d);

      if (d.bid_add_bridge_operator_id) userIdSet.add(d.bid_add_bridge_operator_id);
      if (d.ofr_add_bridge_operator_id) userIdSet.add(d.ofr_add_bridge_operator_id);
      if (d.bridge_list)
        for (const t of d.bridge_list) {
          if (t) {
            userIdSet.add(t.broker_id);
            traderIdSet.add(t.trader_id);
            instIdSet.add(t.inst_id);
          }
        }

      if (d.bid_old_content?.bid_trader_id) instTraderIdSet.add(d.bid_old_content.bid_trader_id);
      if (d.bid_old_content?.ofr_trader_id) instTraderIdSet.add(d.bid_old_content.ofr_trader_id);
      if (d.ofr_old_content?.bid_trader_id) instTraderIdSet.add(d.ofr_old_content.bid_trader_id);
      if (d.ofr_old_content?.ofr_trader_id) instTraderIdSet.add(d.ofr_old_content.ofr_trader_id);
      if (d.bid_old_content?.bid_broker_id) userIdSet.add(d.bid_old_content.bid_broker_id);
      if (d.bid_old_content?.ofr_broker_id) userIdSet.add(d.bid_old_content.ofr_broker_id);
      if (d.ofr_old_content?.bid_broker_id) userIdSet.add(d.ofr_old_content.bid_broker_id);
      if (d.ofr_old_content?.ofr_broker_id) userIdSet.add(d.ofr_old_content.ofr_broker_id);
    }

    const bondLiteMap = this.bondDetailDao.getBondLiteMapByKeyMarketSet(keyMarketSet);
    const instMap = this.instDao.getInstMapByIdSet(instIdSet, undefined, true);
    const traderMap = this.traderDao.getTraderMapByIdSet(traderIdSet, true);
    const instTraderMap = this.traderDao.getInstTraderMapByIdSet(instTraderIdSet, true);
    const userMap = this.userDao.getUserMapByIdSet(userIdSet, undefined, true);

    return { instMap, bondLiteMap, traderMap, userMap, instTraderMap };
  }
}
