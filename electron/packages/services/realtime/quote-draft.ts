import { QuoteDraftDetailSync, QuoteDraftMessageSync } from '@fepkg/services/types/common';
import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { QuoteDraftDetail, QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { BondDetailReadableDao } from '../../database-client/dao/readable/bond-detail';
import { InstReadableDao } from '../../database-client/dao/readable/inst';
import { QuoteDraftDetailReadableDao } from '../../database-client/dao/readable/quote-draft-detail';
import { QuoteDraftMessageReadableDao } from '../../database-client/dao/readable/quote-draft-message';
import { TraderReadableDao } from '../../database-client/dao/readable/trader';
import { UserReadableDao } from '../../database-client/dao/readable/user';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import { formatQuoteDraftMessageSync2QuoteDraftMessage } from '../utils';

export class QuoteDraftService extends RealtimeService {
  private quoteDraftMessageDao: QuoteDraftMessageReadableDao;

  private quoteDraftDetailDao: QuoteDraftDetailReadableDao;

  private instDao: InstReadableDao;

  private traderDao: TraderReadableDao;

  private userDao: UserReadableDao;

  private bondDetailDao: BondDetailReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({
      ...config,
      syncDataTypeList: Service2SyncDataTypeMap[ServiceType.QuoteDraftService]
    });
    const { databaseClient } = config;
    this.quoteDraftMessageDao = new QuoteDraftMessageReadableDao(databaseClient);
    this.quoteDraftDetailDao = new QuoteDraftDetailReadableDao(databaseClient);
    this.instDao = new InstReadableDao(databaseClient);
    this.traderDao = new TraderReadableDao(databaseClient);
    this.userDao = new UserReadableDao(databaseClient);
    this.bondDetailDao = new BondDetailReadableDao(databaseClient);
  }

  getMessageList(params: LocalQuoteDraftMessageList.Request): LocalQuoteDraftMessageList.Response {
    const { messageList, total, hasMore, latestCreateTime } = this.quoteDraftMessageDao.getMessageByCreatorList(params);
    const messageIdList = messageList.map(m => m.message_id);

    const { detailList, detailMap } = this.quoteDraftDetailDao.getDetailMapByMessageIdList(messageIdList);

    const { instMap, traderMap, userMap } = this.getMessageAssociatedData(messageList);
    const { bondDetailMap } = this.getDetailAssociatedData(detailList);

    const result: QuoteDraftMessage[] = messageList.map(m =>
      formatQuoteDraftMessageSync2QuoteDraftMessage({
        quoteDraftMessage: m,
        inst: instMap.get(m.inst_id ?? '') ?? { inst_id: m.inst_id },
        trader: traderMap.get(m.trader_id ?? '') ?? { trader_id: m.trader_id },
        broker: userMap.get(m.broker_id ?? '') ?? { user_id: m.broker_id },
        operator: userMap.get(m.operator ?? '') ?? { user_id: m.operator },
        creator: userMap.get(m.creator ?? '') ?? { user_id: m.creator },
        quote_draft_detail_list: (m?.detail_order_list ?? [])
          ?.flatMap(o => o.detail_id_list ?? [])
          ?.filter(id => {
            const keyMarket = detailMap.get(id)?.key_market;
            return keyMarket && bondDetailMap.get(keyMarket);
          })
          .map(id => {
            const detail = detailMap.get(id);
            const bond = detail?.key_market ? bondDetailMap.get(detail?.key_market) : undefined;
            return {
              ...detail,
              bond_info: bond
            } as QuoteDraftDetail;
          })
      })
    );
    return { quote_draft_message_list: result, total, hasMore, latestCreateTime };
  }

  getDetailByIdList(idList: string[]) {
    const detailList = this.quoteDraftDetailDao.getDetailListByIdList(idList);
    const { bondDetailMap } = this.getDetailAssociatedData(detailList);

    return detailList.map(detail => {
      const bond = detail?.key_market ? bondDetailMap.get(detail?.key_market) : undefined;
      return {
        ...detail,
        bond_info: bond
      } as QuoteDraftDetail;
    });
  }

  private getDetailAssociatedData(detailList: QuoteDraftDetailSync[]) {
    const keyMarketSet = new Set<string>();

    detailList.forEach(detail => {
      if (detail.key_market) keyMarketSet.add(detail.key_market);
    });
    const bondDetailMap = this.bondDetailDao.getBondLiteMapByKeyMarketSet(keyMarketSet);

    return {
      bondDetailMap
    };
  }

  private getMessageAssociatedData(messageList: QuoteDraftMessageSync[]) {
    const instIdSet = new Set<string>();
    const traderIdSet = new Set<string>();
    const userIdSet = new Set<string>();

    messageList.forEach(message => {
      if (message.inst_id) instIdSet.add(message.inst_id);
      if (message.trader_id) traderIdSet.add(message.trader_id);
      if (message.broker_id) userIdSet.add(message.broker_id);
      if (message.operator) userIdSet.add(message.operator);
      if (message.creator) userIdSet.add(message.creator);
    });

    const instMap = this.instDao.getInstMapByIdSet(instIdSet);
    const traderMap = this.traderDao.getTraderMapByIdSet(traderIdSet);
    const userMap = this.userDao.getUserMapByIdSet(userIdSet, void 0, true);

    return {
      instMap,
      traderMap,
      userMap
    };
  }
}
