import { hasOption } from '@fepkg/business/utils/bond';
import { CP_NONE, getInstName } from '@fepkg/business/utils/get-name';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { formatDate } from '@fepkg/common/utils/date';
import { Trader, UserLite } from '@fepkg/services/types/bdm-common';
import {
  BridgeInstInfo,
  FiccBondBasic,
  LiquidationSpeed,
  ReceiptDeal,
  ReceiptDealDetail,
  ReceiptDealTrade
} from '@fepkg/services/types/bds-common';
import { ExerciseType, ProductType, ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { isNil, uniqBy } from 'lodash-es';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { isFRALiquidation } from '@packages/utils/liq-speed';
import { defaultDetailShowConfig, DetailShowConfig } from '@/components/IDCDealDetails/hooks/usePreference';
import { miscStorage } from '@/localdb/miscStorage';
import { getLGBType, getPrice, getSettlementStrWithFlagExchange, getVolume } from '@/pages/Deal/Bridge/utils';
import { GroupsType } from '@/pages/Deal/Detail/components/GroupSettingModal/provider';
import { getReceiptDealSettlement } from '../EditBridge/utils';
import { ReceiverState } from '../IDCHistory/types';
import {
  DealBrokerArea,
  DealContainerData,
  DiffDealType,
  DiffKeys,
  GroupItem,
  TypeDealGroup,
  TypeDealItem,
  TypeSearchFilter
} from './type';
import { ReactNode } from 'react';
import { getChangeText } from '@/components/IDCDealDetails/getChangedText';

export const initSearchFilter: TypeSearchFilter = {
  intelligence_sorting: false,
  only_display_today: false,
  include_history: false,
  is_lack_of_bridge: false,
  mkt_type: [],
  internal_code: void 0,
  bond_category: [],
  bond_short_name_list: [],
  listed_market: [],
  trader: void 0,
  traded_date: '',
  price: '',
  bond: void 0,
  inst: void 0,
  key: uuidv4(),
  product_type: ProductType.BNC
};

/** 生成 成交无机构 区域的数据  */
const getDataNoInst = (dealList: ReceiptDealDetail[], today: number, brokerId?: string): TypeDealGroup[] => {
  if (dealList.length === 0) {
    return [];
  }
  const deals: TypeDealItem[] = [];
  const historyDeals: TypeDealItem[] = [];
  for (const receiptDeal of dealList) {
    const dealDate = formatDate(receiptDeal.parent_deal.deal_time, 'YYYY-MM-DD');
    const dealTimeDay = moment(dealDate).valueOf();
    if (dealTimeDay > today) {
      continue;
    }
    const { bid_trade_info, parent_deal_id } = receiptDeal.parent_deal;
    const dealSide =
      isNil(bid_trade_info?.inst) && brokerId === bid_trade_info?.broker?.user_id ? Side.SideBid : Side.SideOfr;
    const id = (brokerId ?? '') + parent_deal_id + dealSide;
    if (dealTimeDay < today) {
      historyDeals.push({
        ...receiptDeal,
        index: historyDeals.length + 1,
        id,
        parentGroupId: `无机构-${brokerId}`,
        dealSide
      });
    } else {
      deals.push({
        ...receiptDeal,
        index: deals.length + 1,
        id,
        parentGroupId: `无机构-${brokerId}`,
        dealSide
      });
    }
  }

  return [
    {
      groupId: `无机构-${brokerId}`,
      groupName: '机构待定',
      trader: '',
      deals,
      historyDeals,
      showHead: false
    }
  ];
};

/** 将没有在任一分组内的用户塞进Map之中 */
const fillNoneGroupedDealMap = (
  productType: ProductType,
  map: Map<string, TypeDealGroup>,
  oneSideTradeInfo: ReceiptDealTrade,
  addedTraderIdList: string[],
  receiptDeal: ReceiptDealDetail,
  dealSide: Side,
  today: number,
  brokerId?: string
) => {
  const sideMapK = (oneSideTradeInfo?.inst?.inst_id ?? '') + (oneSideTradeInfo?.trader?.trader_id ?? '');
  if (
    oneSideTradeInfo.inst &&
    brokerId === oneSideTradeInfo.broker?.user_id &&
    oneSideTradeInfo.trader &&
    !addedTraderIdList.includes(sideMapK)
  ) {
    const obj = map.get(sideMapK);
    const dealDate = formatDate(receiptDeal.parent_deal.deal_time, 'YYYY-MM-DD');
    const dealTimeDay = moment(dealDate).valueOf();
    if (dealTimeDay > today) {
      return;
    }
    if (obj) {
      if (dealTimeDay === today) {
        obj.deals.push({
          ...receiptDeal,
          index: obj.deals.length + 1,
          id: (oneSideTradeInfo.inst.short_name_zh || '') + receiptDeal.parent_deal.parent_deal_id + dealSide,
          parentGroupId: `${brokerId}:${oneSideTradeInfo.inst.short_name_zh || ''}`,
          dealSide
        });
      } else {
        obj.historyDeals.push({
          ...receiptDeal,
          index: obj.historyDeals.length + 1,
          id: (oneSideTradeInfo.inst.short_name_zh || '') + receiptDeal.parent_deal.parent_deal_id + dealSide,
          parentGroupId: `${brokerId}:${oneSideTradeInfo.inst.short_name_zh || ''}`,
          dealSide
        });
      }
    } else if (dealTimeDay === today) {
      map.set(sideMapK, {
        groupId: oneSideTradeInfo.trader.trader_id,
        groupName: getInstName({ inst: oneSideTradeInfo.inst, productType }) || '',
        showHead: true,
        trader: oneSideTradeInfo?.trader?.name_zh,
        deals: [
          {
            ...receiptDeal,
            index: 1,
            id: (oneSideTradeInfo.inst.short_name_zh || '') + receiptDeal.parent_deal.parent_deal_id + dealSide,
            parentGroupId: `${brokerId}:${oneSideTradeInfo.inst.short_name_zh || ''}`,
            dealSide
          }
        ],
        historyDeals: []
      });
    } else {
      map.set(sideMapK, {
        groupId: oneSideTradeInfo.trader.trader_id,
        groupName: getInstName({ inst: oneSideTradeInfo.inst, productType }) || '',
        showHead: true,
        trader: oneSideTradeInfo.trader.name_zh,
        deals: [],
        historyDeals: [
          {
            ...receiptDeal,
            index: 1,
            id: (oneSideTradeInfo.inst.short_name_zh || '') + receiptDeal.parent_deal.parent_deal_id + dealSide,
            parentGroupId: `${brokerId}:${oneSideTradeInfo.inst.short_name_zh || ''}`,
            dealSide
          }
        ]
      });
    }
  }
};

// 生成显示设置中对应的分组
const fillGroupedDealMapValue = (
  dealList: ReceiptDealDetail[],
  groupItemList: GroupItem[],
  brokerId: string,
  contentList: TypeDealGroup[],
  today: number,
  sideMap = new Map<Side, string[]>()
) => {
  for (const groupItem of groupItemList) {
    const deals: TypeDealItem[] = [];
    const historyDeals: TypeDealItem[] = [];
    for (const v of dealList) {
      const dealDate = formatDate(v.parent_deal.deal_time, 'YYYY-MM-DD');
      const dealTimeDay = moment(dealDate).valueOf();
      let currentDeals = deals;
      if (dealTimeDay < today) {
        currentDeals = historyDeals;
      } else if (dealTimeDay > today) {
        continue;
      }
      const { parent_deal } = v;
      if (
        parent_deal.bid_trade_info.inst &&
        groupItem.idList.includes(parent_deal.bid_trade_info?.trader?.trader_id ?? '') &&
        brokerId === parent_deal?.bid_trade_info?.broker?.user_id
      ) {
        currentDeals.push({
          ...v,
          index: currentDeals.length + 1,
          id: groupItem.id + parent_deal.parent_deal_id + Side.SideBid,
          parentGroupId: `${brokerId}:${groupItem.id}`,
          dealSide: Side.SideBid
        });
        const tmp = sideMap.get(Side.SideBid) ?? [];
        tmp.push(parent_deal.bid_trade_info.inst.inst_id + (parent_deal.bid_trade_info.trader?.trader_id ?? ''));
        sideMap.set(Side.SideBid, tmp);
      }
      if (
        parent_deal.ofr_trade_info.inst &&
        groupItem.idList.includes(parent_deal.ofr_trade_info?.trader?.trader_id ?? '') &&
        brokerId === parent_deal?.ofr_trade_info?.broker?.user_id
      ) {
        currentDeals.push({
          ...v,
          index: currentDeals.length + 1,
          id: groupItem.id + parent_deal.parent_deal_id + Side.SideOfr,
          parentGroupId: `${brokerId}:${groupItem.id}`,
          dealSide: Side.SideOfr
        });
        const tmp = sideMap.get(Side.SideOfr) ?? [];
        tmp.push(parent_deal.ofr_trade_info.inst.inst_id + (parent_deal.ofr_trade_info?.trader?.trader_id ?? ''));
        sideMap.set(Side.SideOfr, tmp);
      }
    }
    if (deals.length || historyDeals.length) {
      contentList.push({
        groupId: groupItem.id,
        groupName: groupItem.name,
        trader: '',
        deals,
        historyDeals,
        showHead: true
      });
    }
  }
};

type CategoryDeals = {
  // 有机构/无机构
  haveInstDealList: ReceiptDealDetail[];
  noInstDealList: ReceiptDealDetail[];
};

const transDealListToCategoryDeals = (dealList: ReceiptDealDetail[], brokerId): CategoryDeals => {
  const haveInstDealList: ReceiptDealDetail[] = [];
  const noInstDealList: ReceiptDealDetail[] = [];
  for (const item of dealList) {
    const { bid_trade_info, ofr_trade_info } = item.parent_deal;
    // 有机构
    if (
      (bid_trade_info?.broker?.user_id === brokerId && bid_trade_info?.inst) ||
      (ofr_trade_info?.broker?.user_id === brokerId && ofr_trade_info?.inst)
    ) {
      haveInstDealList.push(item);
    }

    // 无机构
    if (
      (bid_trade_info?.broker?.user_id === brokerId && !bid_trade_info?.inst) ||
      (ofr_trade_info?.broker?.user_id === brokerId && !ofr_trade_info?.inst)
    ) {
      noInstDealList.push(item);
    }
  }

  return {
    haveInstDealList,
    noInstDealList
  };
};

/**  生成 成交 有机构区域的 分组数据 */
const getTypeDealGroups = (
  productType: ProductType,
  dealList: ReceiptDealDetail[],
  groupItemList: GroupItem[],
  brokerId: string,
  isClassifyByGroup: boolean,
  today: number
): TypeDealGroup[] => {
  if (dealList.length === 0) {
    return [];
  }
  const categoryDeals = transDealListToCategoryDeals(dealList, brokerId);
  const contentList: TypeDealGroup[] = [];
  const sideMap = new Map<Side, string[]>();

  if (isClassifyByGroup) {
    fillGroupedDealMapValue(categoryDeals.haveInstDealList, groupItemList, brokerId, contentList, today, sideMap);
  }
  // 已经被添加过的bid和ofr交易员数组  同方向的交易员id只会出现在一个分组中
  const bidAddedTraderIdList = sideMap.get(Side.SideBid) ?? [];
  const ofrAddedTraderIdList = sideMap.get(Side.SideOfr) ?? [];

  // 其他的分组  如果bid和ofr方向的经纪人都是本人且机构不同或者交易员不同，可能一条成交记录出现在两个分组中
  const typeDealMap = new Map<string, TypeDealGroup>();
  for (const item of categoryDeals.haveInstDealList) {
    const { bid_trade_info, ofr_trade_info } = item.parent_deal;
    fillNoneGroupedDealMap(
      productType,
      typeDealMap,
      bid_trade_info,
      bidAddedTraderIdList,
      item,
      Side.SideBid,
      today,
      brokerId
    );
    fillNoneGroupedDealMap(
      productType,
      typeDealMap,
      ofr_trade_info,
      ofrAddedTraderIdList,
      item,
      Side.SideOfr,
      today,
      brokerId
    );
  }
  const noGroupValue = getDataNoInst(categoryDeals.noInstDealList, today, brokerId);
  return [...contentList, ...typeDealMap.values(), ...noGroupValue];
};

const getGroupItemList = (groupList: GroupsType[]) => {
  return groupList.map(item => ({
    id: item.group_combination_id,
    name: item.group_combination_name,
    idList: item.trader_info_list?.map(v => v.trader_id) || []
  }));
};

type UserDeal = {
  user: UserLite;
  dealList: ReceiptDealDetail[];
};

export const getDealContentList = (
  productType: ProductType,
  receiptDealList: ReceiptDealDetail[],
  groupList: GroupsType[],
  includeHistory: boolean,
  hasOtherGrants: boolean,
  granterUsers?: UserLite[]
): DealBrokerArea[] => {
  const today = moment(formatDate(Date.now(), 'YYYY-MM-DD')).valueOf();
  const dataList: DealBrokerArea[] = [];

  // 本人和显示设置中的所有traderId
  const groupItemList = getGroupItemList(groupList);

  const userDealMap = new Map<string, UserDeal>();
  if (granterUsers)
    for (const user of granterUsers)
      userDealMap.set(user.user_id, {
        user,
        dealList: []
      });

  // 根据首先根据交易员将原始deal数据进行分类
  for (const deal of receiptDealList) {
    const bidSideUser = granterUsers?.find(item => item.user_id === deal.parent_deal.bid_trade_info.broker?.user_id);
    const ofrSideUser = granterUsers?.find(item => item.user_id === deal.parent_deal.ofr_trade_info.broker?.user_id);
    if (bidSideUser) {
      userDealMap.get(bidSideUser?.user_id)?.dealList?.push(deal);
    }
    if (ofrSideUser && ofrSideUser?.user_id != bidSideUser?.user_id) {
      userDealMap.get(ofrSideUser?.user_id)?.dealList?.push(deal);
    }
  }

  userDealMap.forEach(item => {
    const isMySelf = item.user.user_id === miscStorage.userInfo?.user_id;
    const groups = getTypeDealGroups(productType, item.dealList, groupItemList, item.user.user_id, isMySelf, today);
    const dealBrokerArea: DealBrokerArea = { broker: item.user, groups };
    dataList.push(dealBrokerArea);
  });

  return dataList;
};

/** 获取债券代码 */
export const getBondCodeWithBidOfr = (
  otherSide: Side,
  bidSettlement: LiquidationSpeed,
  bid_traded_date: string,
  ofrSettlement: LiquidationSpeed,
  ofr_traded_date: string,
  bond_info?: FiccBondBasic
) => {
  const bidIsFar = isFRALiquidation(bidSettlement);
  const ofrIsFar = isFRALiquidation(ofrSettlement);
  let bondCode = bond_info?.display_code;
  if (otherSide === Side.SideBid && ofrIsFar) {
    bondCode += `(${formatDate(ofr_traded_date, 'MM.DD')} 远)`;
  } else if (otherSide === Side.SideOfr && bidIsFar) {
    bondCode += `(${formatDate(bid_traded_date, 'MM.DD')} 远)`;
  }
  return bondCode;
};

/** 获取债券代码 */
export const getBondCode = (traded_date: string, delivery_date: string, bond_info?: FiccBondBasic) => {
  const nowSettlement = getSettlement(traded_date, delivery_date);
  const isFRA = isFRALiquidation(nowSettlement);
  let bondCode = bond_info?.display_code;
  if (isFRA) {
    bondCode += `(${formatDate(traded_date, 'MM.DD')} 远)`;
  }
  return bondCode;
};

export type ReceiptDisplayItem = {
  internalCode: string | undefined;
  dealTime: string;
  index: number | undefined;
  bidBroker: string | undefined;
  ofrBroker: string | undefined;
  fieldList: string[];
  nodeList: ReactNode[];
  ofrBrokerFull: string | undefined;
  bidBrokerFull: string | undefined;
};

// 获取直接与自己相关的Deal
export const findDirectDealDetail = (deal?: TypeDealItem): ReceiptDeal | undefined => {
  const detailLength = deal?.details?.length || 0;
  if (detailLength > 0) {
    if (deal?.dealSide === Side.SideBid) {
      return deal?.details?.[0];
    }
    return deal?.details?.[detailLength - 1];
  }
  return undefined;
};

/**
 *  成交明细的展示逻辑
 * @param dealDetail 成交明细详情
 * @param showConfig 是否显示（方向、简称、期限） 首页菜单的功能
 * @param showTrader  带交易员信息
 * @param showRating 是否展示主体评级
 * @param replaceOtherDealItem  隐藏对手方
 * @returns
 */
export const getDisplayItemData = (
  dealDetail: TypeDealItem & DiffDealType,
  showConfig = defaultDetailShowConfig,
  showTrader = false,
  showRating = false,
  replaceOtherDealItem?: ReceiptDeal
) => {
  const { index, dealSide = Side.SideNone, parent_deal: deal, next: diffDeals = [] } = dealDetail;
  const {
    bond_basic_info,
    price,
    price_type,
    return_point,
    volume,
    traded_date,
    delivery_date,
    is_exercise,
    flag_stock_exchange
  } = deal;

  const fieldList: string[] = [];
  const nodeList: ReactNode[] = [];

  const bid_trade_info = replaceOtherDealItem ? replaceOtherDealItem.bid_trade_info : deal.bid_trade_info;
  const ofr_trade_info = replaceOtherDealItem ? replaceOtherDealItem.ofr_trade_info : deal.ofr_trade_info;

  // 方向
  let direction = '';
  if (dealSide === Side.SideBid) {
    direction = '买入';
  } else if (dealSide === Side.SideOfr) {
    direction = '卖出';
  }
  if (showConfig.showSide) {
    fieldList.push(direction);
    nodeList.push(getChangeText(direction));
  }

  // 债券代码
  const bondCode = getBondCode(traded_date, delivery_date, bond_basic_info) ?? '';

  // 剩余期限 债券代码  债券简称
  if (showConfig.showTimeRange) {
    fieldList.push(bond_basic_info?.time_to_maturity ?? '');
    nodeList.push(getChangeText(bond_basic_info?.time_to_maturity ?? ''));
  }
  nodeList.push(getChangeText(bondCode, diffDeals, DiffKeys.BondCode));
  if (showConfig.showShortName) {
    fieldList.push(bond_basic_info?.short_name ?? '');
    nodeList.push(getChangeText(bond_basic_info?.short_name ?? ''));
  }
  if (showRating) {
    fieldList.push(bond_basic_info?.issuer_rating ?? '');
    nodeList.push(getChangeText(bond_basic_info?.issuer_rating ?? ''));
  }

  // 地方债类型
  const category = getLGBType(bond_basic_info);
  if (category) {
    fieldList.push(category);
    nodeList.push(getChangeText(category));
  }
  const realHasOption = hasOption(bond_basic_info);
  // 成交价
  const dealPrice = getPrice({
    price,
    price_type,
    return_point,
    exercise_type: is_exercise,
    exercise_manual: realHasOption && is_exercise != ExerciseType.ExerciseTypeNone
  });

  if (dealPrice) {
    fieldList.push(dealPrice);
    nodeList.push(getChangeText(dealPrice, diffDeals, DiffKeys.DealPrice));
  }
  // 成交量
  const dealVolume = getVolume(volume || 0);
  if (dealVolume) {
    fieldList.push(String(dealVolume));
    nodeList.push(getChangeText(String(dealVolume), diffDeals, DiffKeys.DealVolume));
  }

  let settlementStr = '';
  if (replaceOtherDealItem) {
    const targetDeal = findDirectDealDetail(dealDetail);
    settlementStr = getSettlementStrWithFlagExchange(
      targetDeal?.liquidation_speed_list?.at(0) ??
        getSettlement(targetDeal?.traded_date ?? '', targetDeal?.delivery_date ?? ''),
      targetDeal?.traded_date,
      flag_stock_exchange
    );
    if (flag_stock_exchange) settlementStr += '交易所';
  } else {
    settlementStr = getReceiptDealSettlement(dealDetail.details ?? [], flag_stock_exchange);
  }

  fieldList.push(settlementStr);
  nodeList.push(getChangeText(settlementStr, diffDeals, DiffKeys.LiqSpeed));

  // ofr机构
  let ofrInst = getInstName({ inst: ofr_trade_info.inst, productType: bond_basic_info.product_type }) || CP_NONE;
  // bid机构
  let bidInst = getInstName({ inst: bid_trade_info.inst, productType: bond_basic_info.product_type }) || CP_NONE;

  if (showTrader) {
    const ofrTraderName = ofr_trade_info.trader ? `(${ofr_trade_info?.trader?.name_zh})` : '';
    const bidTraderName = bid_trade_info.trader ? `(${bid_trade_info?.trader.name_zh})` : '';

    ofrInst += ofrTraderName;
    bidInst += bidTraderName;
  }
  fieldList.push(ofrInst, '出给');
  nodeList.push(getChangeText(ofrInst), getChangeText('出给'));
  // 发单信息
  const sendMsg = dealSide === Side.SideBid ? deal?.bid_send_order_info : deal?.ofr_send_order_info;

  if (sendMsg) {
    bidInst += ',';
    fieldList.push(bidInst, sendMsg);
    nodeList.push(getChangeText(bidInst));
    if (diffDeals?.some(item => item.key === DiffKeys.SendMsg && item.hasChanged)) {
      nodeList.push(getChangeText(sendMsg, diffDeals, DiffKeys.SendMsg));
    } else {
      nodeList.push(
        getChangeText(sendMsg, diffDeals, dealSide === Side.SideBid ? DiffKeys.BidSendMsg : DiffKeys.OfrSendMsg)
      );
    }
  } else {
    fieldList.push(bidInst);
    nodeList.push(getChangeText(bidInst));
  }

  return {
    internalCode: dealDetail.parent_deal.internal_code,
    dealTime: dealDetail.parent_deal.deal_time,
    index,
    bidBroker: bid_trade_info?.broker?.name_cn,
    ofrBroker: ofr_trade_info?.broker?.name_cn,
    fieldList,
    nodeList,
    ofrBrokerFull: ofr_trade_info?.broker?.name_cn,
    bidBrokerFull: bid_trade_info?.broker?.name_cn
  } as ReceiptDisplayItem;
};

/** 获取成交明细展示内容(不包括内码和经纪人) */
export const getNoInternalCodeAndBrokerDisplayData = (
  itemList: TypeDealItem[],
  showConfig: DetailShowConfig,
  isNCD: boolean
) => {
  let str = '';
  for (const item of itemList) {
    const { index, fieldList } = getDisplayItemData(item, showConfig, false, isNCD);
    str += `${index}) ${fieldList.join(' ')}\n`;
  }
  return str;
};

/** 获取直接与自己相连的桥，如果没有桥就返回空 */
export const findDirectBridgeDeal = (deal?: DealContainerData): ReceiptDeal | undefined => {
  const detailLength = deal?.details?.length || 0;

  // 详细的成交单数量大于1认为有桥
  if (detailLength <= 1) return undefined;

  if (deal?.dealSide === Side.SideBid) return deal?.details?.[0];

  return deal?.details?.[detailLength - 1];
};

/** 获取当前的桥机构交易员列表 */
export const getBridgeTraderList = (details?: ReceiptDeal[]): Trader[] => {
  // 详细的成交单数量大于1认为有桥
  const detailLength = details?.length || 0;
  if (detailLength <= 1) return [];

  return (
    details
      ?.slice(0, -1)
      .map(detail => detail?.ofr_trade_info.trader)
      .filter(Boolean) || []
  );
};

/** 判断自己是不是某一方的broker，不传代表判断双方 */
export const isOneSideBroker = (deal?: ReceiptDealDetail, side?: Side) => {
  const bidDeal = deal?.parent_deal.bid_trade_info.broker?.user_id === miscStorage.userInfo?.user_id;
  const ofrDeal = deal?.parent_deal.ofr_trade_info.broker?.user_id === miscStorage.userInfo?.user_id;

  if (side === Side.SideBid) return bidDeal;
  if (side === Side.SideOfr) return ofrDeal;

  return bidDeal && ofrDeal;
};

/** 获取当前桥机构id列表 */
export const getBridgeInstIds = (deal?: ReceiptDealDetail) => {
  if (!deal?.details?.length || deal?.details?.length <= 1) return [];
  const newList = deal.details.slice(0, -1);
  return newList.map(item => item.ofr_trade_info.inst?.inst_id || '');
};

/** 获取所有桥的发给信息 */
export const getSendMsgList = (
  allBridges: BridgeInstInfo[],
  currentModifyDeal?: ReceiptDealDetail
): string[] | false => {
  const traders = getBridgeTraderList(currentModifyDeal?.details);
  const traderIdList = new Set(traders.map(trader => trader.trader_id));

  const sendMsgList = allBridges
    .filter(bridge => traderIdList.has(bridge.contact_trader.trader_id))
    .map(bridge => bridge.send_msg);
  if (sendMsgList?.length != traderIdList?.size) return false;
  return sendMsgList;
};

/** 判断成交明细中的成交单是否未移交 */
export const isDealNotHandOver = (deal?: ReceiptDealDetail) => {
  return (
    (deal?.details?.[0]?.receipt_deal_status || ReceiptDealStatus.ReceiptDealStatusNone) <=
    ReceiptDealStatus.ReceiptDealToBeHandOver
  );
};

/** 获取发单用户组 */
export const getUrgeUsers = (deal: DealContainerData) => {
  /**
   * 催单逻辑:
   * 1. 催单用户选择:
   * ---- 1.1 如果有桥，则催单用户为加桥操作人(所有的)
   * ---- 1.2 如果没有桥，则催单用户对手方经纪人
   *
   * 2. 判断是否要展示催单项
   * ---- 2.1 缺桥 不显示催单用户
   * ---- 2.2 发送用户为本人 不显示催单用户
   */

  let isAddBridgeUser = false;
  let sendInfo: ReceiverState[] = [];
  const { parent_deal, details } = deal;

  // 无桥，则取对手方经纪人
  if (details && details.length <= 1) {
    // 过桥标志为点亮状态时，催单用户为直连桥机构的经纪人
    const target = parent_deal.bridge_code ? findDirectBridgeDeal(deal) : parent_deal;

    const receiver = [target?.ofr_trade_info.broker, target?.bid_trade_info.broker];
    const receiverFilter = receiver.filter(v => v?.user_id !== miscStorage.userInfo?.user_id);

    // 非缺桥
    if (!target?.flag_need_bridge) {
      for (const v of receiverFilter) {
        sendInfo.push({ name: v?.name_cn ?? '', qq: v?.QQ, userId: v?.user_id });
      }
    }
  } else {
    // 有桥，则取加桥操作人
    sendInfo =
      details
        ?.filter(v => v.add_bridge_operator?.QQ !== miscStorage.userInfo?.QQ && !v.flag_need_bridge)
        .map(v => ({
          name: v.add_bridge_operator?.name_cn ?? '',
          qq: v.add_bridge_operator?.QQ,
          userId: v.add_bridge_operator?.user_id
        }))
        .filter(v => !!v.name) ?? [];
    isAddBridgeUser = true;
  }
  return { sendInfo: uniqBy(sendInfo, 'userId'), isAddBridgeUser };
};
