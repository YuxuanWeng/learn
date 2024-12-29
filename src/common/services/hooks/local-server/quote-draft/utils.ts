import { InstitutionTiny, Trader, TraderLite, User } from '@fepkg/services/types/bdm-common';
import { FiccBondBasic, QuoteDraftDetail, QuoteDraftMessage } from '@fepkg/services/types/bds-common';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';

export const getDiffIdList = (map: Map<string, unknown>, set: Set<string>) => {
  const diffList: string[] = [];
  for (const id of set) {
    if (!map.has(id)) {
      diffList.push(id);
    }
  }
  return diffList;
};

export const getBaseDataIdSet = (messages?: QuoteDraftMessage[]) => {
  const bondKeyMarketSet = new Set<string>();
  const instIdSet = new Set<string>();
  const traderIdSet = new Set<string>();
  const userIdSet = new Set<string>();
  if (messages) {
    for (const message of messages) {
      if (message.inst_id) instIdSet.add(message.inst_id);
      if (message.trader_id) traderIdSet.add(message.trader_id);
      if (message.broker_id) userIdSet.add(message.broker_id);
      if (message.creator) userIdSet.add(message.creator);
      if (message.operator) userIdSet.add(message.operator);
      if (message.detail_list) {
        for (const detail of message.detail_list) {
          if (detail.key_market) bondKeyMarketSet.add(detail.key_market);
        }
      }
    }
  }
  return { bondKeyMarketSet, instIdSet, traderIdSet, userIdSet };
};

export const formatTrader2TraderLite = (trader: Trader): TraderLite => {
  return {
    trader_id: trader.trader_id,
    name_zh: trader.name_zh,
    name_en: trader.name_en,
    trader_tag_list: trader.tags,
    QQ: trader.qq,
    is_vip: false
  };
};

export const formatLocalQuoteDraftDetail = (data: {
  detail: QuoteDraftDetail;
  bond_info?: FiccBondBasic;
}): LocalQuoteDraftDetail => ({
  ...data.detail,
  bond_info: data.bond_info
});

export const formatLocalQuoteDraftMessage = (data: {
  message: QuoteDraftMessage;
  inst_info?: InstitutionTiny;
  trader_info?: TraderLite;
  broker_info?: User;
  operator_info?: User;
  creator_info?: User;
  detail_list?: LocalQuoteDraftDetail[];
}): LocalQuoteDraftMessage => {
  const { message, inst_info, trader_info, broker_info, operator_info, creator_info, detail_list } = data;
  return {
    ...message,
    inst_info,
    trader_info,
    broker_info,
    operator_info,
    creator_info,
    detail_list
  };
};
