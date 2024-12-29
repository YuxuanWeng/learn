import { FiccBondBasic, ReceiptDeal, ReceiptDealPayForOp, ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { cloneDeep, intersection, isEmpty, omit } from 'lodash-es';
import { RequestWithModalOptions } from '@/common/request/with-modal-factory';
import { getUpdateDiffData, hasBridge, isReceiptDealToBeConfirmed } from '..';
import { IUpdateReceiptDealWithoutId } from '../../types';
import { handleHasBridgeNotBeConfirmed } from './handleHasBridgeNotBeConfirmed';
import { handleHasBridgeToBeConfirmed } from './handleHasBridgeToBeConfirmed';
import { handleNoBridgeNotBeConfirmed } from './handleNoBridgeNotBeConfirmed';
import { handleNoBridgeToBeConfirmed } from './handleNoBridgeToBeConfirmed';
import { handleDealChangedParams } from './type';

/** 检查成交单修改的内容是否需要弹窗提示用户 */
const checkDiff = (diffData: IUpdateReceiptDealWithoutId, initialRowData?: Partial<ReceiptDeal>) => {
  const diffKeys = Object.keys(diffData ?? {});
  if (!diffKeys.length) {
    return false;
  }
  const isBidRealTrader = initialRowData?.receipt_deal_id === initialRowData?.bid_real_receipt_deal_id;
  const isOfrRealTrader = initialRowData?.receipt_deal_id === initialRowData?.ofr_real_receipt_deal_id;

  const updatePeerFiled: (keyof IUpdateReceiptDealWithoutId)[] = [
    // 发单信息
    'flag_send_market',

    // 成交单信息
    'direction',
    'deal_time',

    // 成交单要素
    'price',
    'volume',
    'bond_key_market',
    'deal_market_type', // 成交市场
    'yield', // 收益率
    'spread', // 利差
    'full_price', // 全价
    'clean_price', // 净价
    'is_exercise', // 行权/到期
    'flag_rebate', //
    'return_point', // 返点数值
    'yield_to_execution', // 行权收益率

    // 结算信息
    'settlement_mode',
    'settlement_amount',

    // 其他信息
    'flag_internal'
  ];

  const peerDiff = !!intersection(diffKeys, updatePeerFiled).length;
  let deepDiff = false;

  const omitTradeFiled: (keyof ReceiptDealTradeOp)[] = [
    'city',

    'trader_tag',
    'brokerage',
    'brokerage_type',
    'trade_mode',
    'broker_id',
    'broker_id_b',
    'broker_id_c',
    'broker_id_d',
    'broker_percent',
    'broker_percent_b',
    'broker_percent_c',
    'broker_percent_d',
    'flag_bridge',
    'flag_nc',
    'nc',
    'pay_for_info',

    'inst_brokerage_comment', // 佣金备注会影响该字段
    'inst_special',
    'flag_pay_for_inst',
    'traded_date',
    'delivery_date',
    'liquidation_speed_list'
  ];

  const omitTradePayForFiled: (keyof ReceiptDealPayForOp)[] = [
    'pay_for_city',
    'flag_pay_for_nc',
    'pay_for_nc',
    'pay_for_trader_tag'
  ];
  // 特别的，交易双方(非真实对手方)存在代付信息中的修改（不包含flag_pay_for_nc），则提示
  if (
    !isEmpty(omit(diffData?.bid_trade_info?.pay_for_info, omitTradePayForFiled)) ||
    !isEmpty(omit(diffData?.bid_trade_info, omitTradeFiled))
  ) {
    deepDiff = !isBidRealTrader;
  }

  if (
    !isEmpty(omit(diffData?.ofr_trade_info?.pay_for_info, omitTradePayForFiled)) ||
    !isEmpty(omit(diffData?.ofr_trade_info, omitTradeFiled))
  ) {
    deepDiff = !isOfrRealTrader;
  }

  return peerDiff || deepDiff;
};

/** 处理含桥情况 */
const handleHasBridge = async ({ initialRowData, receiptDealInfo, hasSyncEditDiff }: handleDealChangedParams) => {
  if (isReceiptDealToBeConfirmed(initialRowData)) {
    /** 处理含桥、待确认情况 */
    return handleHasBridgeToBeConfirmed({ initialRowData, receiptDealInfo, hasSyncEditDiff });
  }
  /** 处理含桥、非待确认情况 */
  return handleHasBridgeNotBeConfirmed({ initialRowData, receiptDealInfo, hasSyncEditDiff });
};

/** 处理非含桥情况 */
const handleNoBridge = async ({ initialRowData, receiptDealInfo, hasSyncEditDiff }: handleDealChangedParams) => {
  /** 处理非含桥、待确认情况 */
  if (isReceiptDealToBeConfirmed(initialRowData)) {
    return handleNoBridgeToBeConfirmed({ initialRowData, receiptDealInfo, hasSyncEditDiff });
  }
  /** 处理非含桥、非待确认情况 */
  return handleNoBridgeNotBeConfirmed({ initialRowData, receiptDealInfo, hasSyncEditDiff });
};

type HandleDealChangedParams = {
  receiptDealInfo: ReceiptDealMulAdd.CreateReceiptDeal;
  formattedRawData?: ReceiptDealMulAdd.CreateReceiptDeal;
  initialRowData?: Partial<ReceiptDeal>;
  bond?: FiccBondBasic;
};

// 多重if-else可考虑用new Map<Object, Function>+filter来实现, 本期暂采用函数拆分，对齐https://shihetech.feishu.cn/wiki/X4sLwp1fBif6dPkSwTyc4jYgnHb
export const handleDealChanged = async ({
  receiptDealInfo,
  formattedRawData,
  initialRowData
}: HandleDealChangedParams): Promise<RequestWithModalOptions> => {
  const updateParams = cloneDeep(receiptDealInfo);
  const deepDiff = getUpdateDiffData(updateParams, formattedRawData, true);

  const hasSyncEditDiff = checkDiff(deepDiff, initialRowData);

  // 处理含桥情况
  if (hasBridge(initialRowData)) {
    return handleHasBridge({ initialRowData, receiptDealInfo, hasSyncEditDiff });
  }
  // 处理非含桥情况
  return handleNoBridge({ initialRowData, receiptDealInfo, hasSyncEditDiff });
};
