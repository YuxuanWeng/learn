import { getInstName } from '@fepkg/business/utils/get-name';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message } from '@fepkg/components/Message';
import {
  DealConfirmSnapshot,
  DealConfirmTradeInfo,
  ReceiptDeal,
  ReceiptDealDetail,
  ReceiptDealTrade
} from '@fepkg/services/types/common';
import { ProductType, ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { first, last } from 'lodash-es';
import { DealBrokerArea, DealContainerData, DiffDealType, TypeDealItem } from '@/components/IDCDealDetails/type';
import { getBridgeNumber } from '@/pages/Spot/utils/bridge';
import { EditBridgeMode, EditBridgeType } from '../Bridge/types';
import { getDiffModalDataBySnapshot } from './components/DiffModal.tsx/util';

const ONE_YEAR = 365;

const endsWithNumber = (str: string) => {
  return /\d+$/.test(str);
};

/** 将Y/D的字符串转换成对应的天 */
export const formatTermWithYD = (val: string, allowDigit = false) => {
  if (val.endsWith('Y') || val.endsWith('y')) {
    const numberPart = val.slice(0, -1);
    if (allowDigit) return (Number(numberPart) ?? 0) * ONE_YEAR;
    return Math.round((Number(numberPart) ?? 0) * ONE_YEAR);
  }
  return parseInt(val, 10);
};

export const checkYearIsValid = (val: string) => {
  if (val.endsWith('y') || val.endsWith('Y')) {
    const numberPart = val.slice(0, -1);
    if (numberPart.endsWith('.')) return false;
    if (Number(numberPart) > 99.99) return false;
  }
  return true;
};

export const checkDayIsValid = (val: string) => {
  const isDay = val.endsWith('d') || val.endsWith('D') || endsWithNumber(val) || val.endsWith('.');
  if (!isDay) return true;
  if (val.includes('.')) return false;

  let numberPart = 0;
  if (val.endsWith('d') || val.endsWith('D')) numberPart = Number(val.slice(0, -1));
  if (endsWithNumber(val)) numberPart = Number(val);

  if (numberPart > 365 || !Number.isInteger(numberPart)) return false;
  return true;
};

/** 获取两个数字(左闭右开)中间的连续数字 */
export const getGapNumbers = (a: number, b: number) => {
  const res: number[] = [];
  if (b <= a) return res;
  for (let i = a; i < b; i++) {
    res.push(i);
  }
  return res;
};

/** 判断单桥双桥信息 */
export const getBirderEditState = (selectedDeals: TypeDealItem[]) => {
  const res = { enable: false, mode: EditBridgeMode.Single, type: EditBridgeType.None };
  if (!selectedDeals.length) return res;

  if (selectedDeals.length === 1) {
    // 单条编辑
    const deal = selectedDeals[0];
    const bridgeNum = getBridgeNumber(deal?.details);

    // 单桥
    if (bridgeNum === 1) res.type = EditBridgeType.One;
    // 多桥
    if (bridgeNum > 1) res.type = EditBridgeType.Mul;

    return { ...res, enable: true };
  }

  return { enable: true, mode: EditBridgeMode.Batch, type: EditBridgeType.One };
};

/** 桥机构 */
export const getBridgeInst = (details?: ReceiptDeal[]) => {
  if (!details?.length || details?.length < 2) return {};
  return { bidInst: details[0]?.ofr_trade_info.inst, ofrInst: details.at(-1)?.bid_trade_info.inst };
};

/** 桥机构信息 */
export const getBridgeInfo = (details?: ReceiptDeal[]) => {
  if (!details?.length || details?.length < 2) return {};
  return { [Side.SideBid]: details[0], [Side.SideOfr]: details.at(-1) };
};

/** 是否存在毁单的成交单 */
export const checkIsDestroyedDeal = (dealList: ReceiptDealDetail[]) => {
  const isDestroy = dealList.some(
    v =>
      !!v.details?.[0].destroy_reason &&
      (v.details?.[0].receipt_deal_status === ReceiptDealStatus.ReceiptDealSubmitApproval ||
        v.details?.[0].receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeExamined)
  );

  if (isDestroy) {
    message.error('当前成交已发起毁单，不可编辑！');
    return true;
  }
  return false;
};

const dealTradeInfo2SnapshotTradeInfo = (
  tradeInfo: ReceiptDealTrade,
  sendOrderInfo: string,
  productType: ProductType
): DealConfirmTradeInfo => {
  return {
    broker_id: tradeInfo.broker?.user_id,
    broker_name: tradeInfo.broker?.name_cn,
    broker_id_b: tradeInfo.broker_b?.user_id,
    broker_name_b: tradeInfo.broker_b?.name_cn,
    broker_id_c: tradeInfo.broker_c?.user_id,
    broker_name_c: tradeInfo.broker_c?.name_cn,
    broker_id_d: tradeInfo.broker_d?.user_id,
    broker_name_d: tradeInfo.broker_d?.name_cn,
    trader_id: tradeInfo.trader?.trader_id,
    trader_name: tradeInfo.trader?.name_zh,
    inst_id: tradeInfo.inst?.inst_id,
    inst_name: getInstName({ inst: tradeInfo.inst, productType }),
    send_order_info: sendOrderInfo
  };
};

const receiptDeal2Snapshot = (deal: ReceiptDealDetail, productType: ProductType): DealConfirmSnapshot => {
  const bid_deal_confirm_trade_info = dealTradeInfo2SnapshotTradeInfo(
    first(deal.details)!.bid_trade_info,
    deal.parent_deal.bid_send_order_info ?? '',
    productType
  );
  const ofr_deal_confirm_trade_info = dealTradeInfo2SnapshotTradeInfo(
    last(deal.details)!.ofr_trade_info,
    deal.parent_deal.ofr_send_order_info ?? '',
    productType
  );

  return {
    bid_deal_confirm_trade_info,
    ofr_deal_confirm_trade_info,
    bond_key_market: deal.parent_deal.bond_basic_info.key_market,
    price: deal.parent_deal.price ?? SERVER_NIL,
    confirm_volume: deal.parent_deal.volume ?? SERVER_NIL,
    return_point: deal.parent_deal.return_point,
    flag_bridge: deal.flag_bridge || (deal.details ?? []).length > 1,
    delivery_info_list: (deal.details ?? []).map(i => ({
      traded_date: i.traded_date,
      delivery_date: i.delivery_date
    })),
    bid_delivery_info: { traded_date: '', delivery_date: '' },
    ofr_delivery_info: { traded_date: '', delivery_date: '' }
  };
};

export const transformReceiptDeal2DiffType = (
  productType: ProductType,
  deal: ReceiptDealDetail
): DiffDealType | undefined => {
  if ((deal.details ?? []).length < 1) return undefined;

  return getDiffModalDataBySnapshot(deal.deal_confirm_snapshot, receiptDeal2Snapshot(deal, productType), true);
};

/** 计算授权人成交数 */
export const transToShowBrokerStruct = (value: DealBrokerArea) => {
  const allDeals: TypeDealItem[] = [];
  for (const group of value.groups) {
    allDeals.push(...(group.deals || []), ...(group.historyDeals || []));
  }
  const needBridge = allDeals.some(
    singleDeal => singleDeal.parent_deal.flag_need_bridge || singleDeal.details?.some(item => item.flag_need_bridge)
  );
  return { brokerId: value.broker.user_id, count: allDeals.length, needBridge };
};

/** 判断成交明细中的成交单是否未提交过 */

export const isDealNotSubmitted = (deal?: ReceiptDealDetail) => {
  // 是否提交过的判断依据改成是否有订单号
  return !deal?.parent_deal.order_no;
};

/** 明细右键是否需要展示<加桥>选项 */
export const checkDealsShowAddBridge = (data: DealContainerData[]) => {
  /**
   * condition 1: 选中的所有的明细其中有不含桥
   * condition 2: 成交单状态为未提交
   * condition 3: 成交单未代付
   */
  return data.some(item => {
    const { parent_deal } = item;
    const { bid_trade_info, ofr_trade_info } = parent_deal;
    const payfor = bid_trade_info.flag_pay_for_inst || ofr_trade_info.flag_pay_for_inst;
    return !parent_deal.bridge_code && isDealNotSubmitted(item) && !payfor;
  });
};
