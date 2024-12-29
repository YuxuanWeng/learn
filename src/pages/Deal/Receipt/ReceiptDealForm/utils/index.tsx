import { BondSearchState } from '@fepkg/business/components/Search/BondSearch';
import { BrokerageCommentMap } from '@fepkg/business/constants/map';
import { DealDateMutationState } from '@fepkg/business/hooks/useDealDateMutation';
import { getDefaultExerciseType } from '@fepkg/business/utils/bond';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { formatNumber2ServerNil } from '@fepkg/business/utils/price';
import { message } from '@fepkg/components/Message';
import { handleRequestError } from '@fepkg/request/utils';
import { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import {
  ReceiptDeal,
  ReceiptDealBridgeOp,
  ReceiptDealDeliveryAndTradedDate,
  ReceiptDealTrade,
  ReceiptDealTradeOp
} from '@fepkg/services/types/bds-common';
import {
  BondQuoteType,
  BrokerageType,
  ExerciseType,
  ProductType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment,
  Side
} from '@fepkg/services/types/enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { AxiosResponse } from 'axios';
import { isEmpty } from 'lodash-es';
import moment from 'moment';
import { PriceImmerWrapper, PriceState } from '@/components/business/PriceGroup';
import {
  FORM_DISABLED_STATUES,
  ModalOptionsType,
  ReceiptDealErrorMsgMap,
  WARNING_MODAL_OPTIONS_MAP,
  noExerciseSettlementProductTypeSet
} from '../constants';
import { ReceiptDealBridgeState } from '../providers/BridgeProvider';
import {
  CheckBridgeFlagChangeByTradeInfoParams,
  CheckBridgeFlagChangeParams,
  IUpdateReceiptDealWithoutId,
  ReceiptDealBrokerState,
  ReceiptDealFormDialogContext,
  ReceiptDealFormState,
  ReceiptDealFormWidth,
  ReceiptDealRealTradeStatus,
  ReceiptDealTradeFlag,
  ReceiptDealTradeState,
  SideType
} from '../types';
import { formatDay2TodayTimestamp, getTradeInfoByDefaultValue } from './IB';

export const getReceiptDealBatchFormConfig = (productType: ProductType, context: ReceiptDealFormDialogContext) => ({
  name: WindowName.ReceiptDealBatchForm,
  custom: { route: CommonRoute.ReceiptDealBatchForm, routePathParams: [productType.toString()], context },
  options: { width: 968 + 2 + 2, height: 456 + 2, resizable: false }
});

export const getReceiptDealFormConfig = (productType: ProductType, context: ReceiptDealFormDialogContext) => ({
  name: WindowName.ReceiptDealForm,
  custom: { route: CommonRoute.ReceiptDealForm, routePathParams: [productType.toString()], context },
  options: { width: ReceiptDealFormWidth.Default, height: 720 + 2, resizable: false }
});

export const getPopupContainer = (): HTMLElement =>
  document.querySelector('#receipt-deal-form-scroll') ?? document.body;

const formatNumber = (str?: string) => {
  if (!str) return undefined;
  const res = Number(str);
  return Number.isNaN(res) ? undefined : res;
};

export const getReceiptDeal = (params: {
  exercise: ExerciseType;
  bondSearchState: BondSearchState;
  priceInfo: PriceImmerWrapper<PriceState>;
  formState: ReceiptDealFormState;
  bridges: ReceiptDealBridgeState[];
  bridgeDealDates: DealDateMutationState[];
  bridgeFlags: Record<SideType, ReceiptDealTradeFlag>;
  trades: Record<SideType, ReceiptDealTradeState>;
  brokers: Record<SideType, ReceiptDealBrokerState[]>;
  realTradeStatus: ReceiptDealRealTradeStatus;
  productType: ProductType;
  highlyAccurateData: Partial<BaseDataMulCalculate.CalculateResult> | undefined;
}) => {
  const {
    bondSearchState,
    formState,
    exercise,
    priceInfo,
    bridges,
    bridgeDealDates,
    bridgeFlags,
    trades,
    brokers,
    realTradeStatus,
    productType,
    highlyAccurateData
  } = params ?? {};
  const bond = bondSearchState.selected?.original;
  const { key_market } = bond ?? {};
  const {
    direction,
    dealMarketType,
    volume,
    internal,
    yield: yield_,
    yieldToExecution,
    cleanPrice,
    backendMessage,
    fullPrice,
    spread,
    otherDetail,
    sendMarket,
    settlementAmount,
    settlementMode,
    bidCommentState,
    ofrCommentState,
    dealTime
  } = formState ?? {};
  const modifiedPriceInfo = priceInfo[Side.SideNone];

  const { quote_price, flag_rebate, return_point, quote_type = BondQuoteType.TypeNone } = modifiedPriceInfo ?? {};

  const isExercise = noExerciseSettlementProductTypeSet.has(productType)
    ? getDefaultExerciseType(productType, quote_type)
    : exercise;

  const bridgeInfo: ReceiptDealBridgeOp[] = bridges.map(
    ({ key, instError, brokerError, traderError, ...rest }) => rest
  );
  const bidBrokers = brokers[Side.SideBid];
  const bidTrader = trades[Side.SideBid];
  const isBidRealTrader = realTradeStatus[Side.SideBid];

  const ofrBrokers = brokers[Side.SideOfr];
  const ofrTrader = trades[Side.SideOfr];
  const isOfrRealTrader = realTradeStatus[Side.SideOfr];

  // 是否有桥信息，（非成交单是否含桥的判断）
  const hasBridgeInfo = Boolean(bridgeInfo.length);

  if (!key_market || !modifiedPriceInfo) {
    return { bond };
  }

  const bidTradeInfo = getTradeInfoByDefaultValue(bidTrader, bidBrokers, bidCommentState, isBidRealTrader);
  // 无桥时，ofr使用bid方向的交易日交割日
  const ofrTradeInfo = {
    ...getTradeInfoByDefaultValue(ofrTrader, ofrBrokers, ofrCommentState, isOfrRealTrader),
    ...(!hasBridgeInfo
      ? {
          traded_date: bidTradeInfo.traded_date,
          delivery_date: bidTradeInfo.delivery_date,
          liquidation_speed_list: bidTradeInfo.liquidation_speed_list
        }
      : {})
  };

  let delivery_and_traded_date_list: ReceiptDealDeliveryAndTradedDate[] | undefined = [];
  if (hasBridgeInfo) {
    for (const item of bridgeDealDates) {
      const { tradedDate, deliveryDate } = item;
      const traded_date = formatDay2TodayTimestamp(tradedDate);
      const delivery_date = formatDay2TodayTimestamp(deliveryDate);
      const liquidation_speed_list = [getSettlement(traded_date ?? '', delivery_date ?? '')];
      delivery_and_traded_date_list.push({ traded_date, delivery_date, liquidation_speed_list });
    }

    if (bridgeInfo.length === 1) delivery_and_traded_date_list = undefined;
    if (bridgeInfo.length === 2) delivery_and_traded_date_list = delivery_and_traded_date_list?.slice(0, 1);
  } else {
    delivery_and_traded_date_list = undefined;
  }

  const receiptDealInfo: ReceiptDealMulAdd.CreateReceiptDeal = {
    bond_key_market: key_market,
    direction,
    deal_market_type: dealMarketType,
    flag_internal: internal,
    flag_send_market: sendMarket,
    price_type: quote_type,
    yield: formatNumber(yield_),
    yield_to_execution: formatNumber(yieldToExecution),
    clean_price: formatNumber(cleanPrice),
    full_price: formatNumber(fullPrice),
    volume: formatNumber(volume),
    spread: formatNumber(spread),
    return_point: formatNumber(return_point),
    settlement_amount: formatNumber(settlementAmount),
    settlement_mode: settlementMode,
    flag_rebate,
    is_exercise: isExercise,
    bid_trade_info: bidTradeInfo,
    ofr_trade_info: ofrTradeInfo,
    other_detail: otherDetail,
    backend_msg: backendMessage,
    price: formatNumber(quote_price),
    deal_time: dealTime?.valueOf().toString(),
    flag_bid_pay_for_inst: bridgeFlags[Side.SideBid] === ReceiptDealTradeFlag.Payfor,
    flag_ofr_pay_for_inst: bridgeFlags[Side.SideOfr] === ReceiptDealTradeFlag.Payfor,
    bridge_info: hasBridgeInfo ? bridgeInfo : undefined,
    delivery_and_traded_date_list
  };

  // 若有高精度数据，说明调用了计算器，此时需要进行 toFixed(4) 对比判断用户是否手动更改部分价格要素，
  // 若手动更改，则传更改后的值，反之传高精度数据
  if (highlyAccurateData) {
    for (const key of ['yield', 'yield_to_execution', 'clean_price', 'full_price', 'settlement_amount'] as const) {
      if (Object.hasOwn(receiptDealInfo, key)) {
        if (receiptDealInfo?.[key]?.toFixed(4) === highlyAccurateData?.[key]?.toFixed(4)) {
          receiptDealInfo[key] = highlyAccurateData[key];
        }
      }
    }
  }

  return { receiptDealInfo, bond };
};

const deepDiff = <T extends object>(cur: object, prev?: object) => {
  const diffData = {} as T;
  if (cur === null) return diffData;
  for (const key of Object.keys(cur)) {
    if (typeof cur[key] === 'object' && typeof prev?.[key] === 'object') {
      const diff = deepDiff(cur[key], prev?.[key]);
      if (!isEmpty(diff)) diffData[key] = diff;
    } else if (cur[key] !== prev?.[key]) {
      diffData[key] = cur[key];
    }
  }
  return diffData;
};

export const getUpdateDiffData = (
  cur: ReceiptDealMulAdd.CreateReceiptDeal,
  prev?: ReceiptDealMulAdd.CreateReceiptDeal,
  deep?: boolean
): IUpdateReceiptDealWithoutId => {
  if (prev === undefined) return cur;
  let diffData: IUpdateReceiptDealWithoutId = {};
  if (deep) diffData = deepDiff<IUpdateReceiptDealWithoutId>(cur, prev);
  else {
    for (const key of Object.keys(cur)) {
      if (cur[key] !== prev[key]) {
        diffData[key] = cur[key];
      }
    }
  }

  formatNumber2ServerNil(diffData, ['yield', 'yield_to_execution', 'spread', 'clean_price']);

  return diffData;
};

export const toastRequestError = error => {
  handleRequestError({
    error,
    onMessage: (msg, code) => {
      message.error(ReceiptDealErrorMsgMap[code ?? ''] ?? msg);
    },
    defaultHandler: () => {
      message.error('请求错误');
    }
  });
};

/**
 * 检查已通过状态的成交单是否可编辑
 * @description 待移交/已毁单/已删除的不可编辑
 * @description 已通过的
 *   - 对于交易日晚于等于当月的成交单，当日前台可以修改编辑后重新提交；
     - 如果当日早于或等于本月第一个工作日，那么除了交易日晚于等于当月的成交单之外，还可以对所有交易日在上个月的成交单进行修改编辑后重新提交。
 * @description 其余状态可编辑
 * @returns false不可编辑, true可编辑
 */
export const checkCanEdit = (deal: Partial<ReceiptDeal> | undefined, isOnOrBeforeFirstWorkdayOfMonth: boolean) => {
  if (!deal?.receipt_deal_status || FORM_DISABLED_STATUES.has(deal.receipt_deal_status)) {
    return false;
  }
  if (deal.receipt_deal_status !== ReceiptDealStatus.ReceiptDealPass) {
    return true;
  }

  // 已成交的单，若无交易日不可编辑
  if (!deal.traded_date) {
    return false;
  }

  const canEditDate = isOnOrBeforeFirstWorkdayOfMonth ? moment().subtract(1, 'M').startOf('M') : moment().startOf('M');
  return moment(Number(deal.traded_date)).isSameOrAfter(canEditDate);
};

/** 获取备注下拉选项 */
export const getInstCommentOpts = (selected?: BrokerageType, disabled?: boolean) => {
  const options = Object.entries(BrokerageCommentMap).map(([value, label]) => ({ label, value: Number(value) }));

  if (disabled) return options.filter(Boolean);

  if (selected === BrokerageType.BrokerageTypeN) {
    return options.filter(
      item =>
        item.label &&
        item.value !== ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage &&
        item.value !== ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentSpecial
    );
  }

  if (selected === BrokerageType.BrokerageTypeR) {
    return options.filter(
      item => item.value === ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentSpecial
    );
  }

  return options.filter(
    item => item.value === ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage
  );
};

/** 成交单是否含桥 */
export const hasBridge = (receiptDeal?: Partial<ReceiptDeal>) => {
  return Boolean(receiptDeal?.bridge_code);
};

/** 成交单是否为待确认状态 */
export const isReceiptDealToBeConfirmed = (receiptDeal?: Partial<ReceiptDeal>) => {
  return receiptDeal?.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeConfirmed;
};

/** 获取交易方的桥标识 */
const getBridgeFlag = (tradeInfo?: ReceiptDealTradeOp | ReceiptDealTrade) => {
  if (tradeInfo?.flag_pay_for_inst) return ReceiptDealTradeFlag.Payfor;
  if (tradeInfo?.flag_bridge) return ReceiptDealTradeFlag.Bridge;
  return ReceiptDealTradeFlag.Real;
};
/** 确认成交单桥标识是否由prevFlag变化为curFlag */
const checkBridgeFlagChangeByTradeInfo = ({
  curTrade,
  oldTrade,
  prevFlag,
  curFlag
}: CheckBridgeFlagChangeByTradeInfoParams) => {
  const cur = getBridgeFlag(curTrade);
  const prev = getBridgeFlag(oldTrade);
  return prevFlag === prev && cur === curFlag;
};

/** 确认成交单桥标识是否由prevFlag变化为curFlag */
export const checkBridgeFlagChange = ({ curData, oldData, prevFlag, curFlag }: CheckBridgeFlagChangeParams) => {
  return (
    checkBridgeFlagChangeByTradeInfo({
      curTrade: curData?.bid_trade_info,
      oldTrade: oldData?.bid_trade_info,
      prevFlag,
      curFlag
    }) ||
    checkBridgeFlagChangeByTradeInfo({
      curTrade: curData?.ofr_trade_info,
      oldTrade: oldData?.ofr_trade_info,
      prevFlag,
      curFlag
    })
  );
};
export const getWarningModalOptions = (modalOptionsType: ModalOptionsType, node: React.ReactNode | null = null) => {
  const modalProps = WARNING_MODAL_OPTIONS_MAP.get(modalOptionsType);
  const DEFAULT_MODAL_CONFIG = { mask: true, width: 360, zIndex: 2000 };

  if (!modalProps) {
    return {
      withModal: false,
      modalProps: undefined
    };
  }
  if (!node) {
    return {
      withModal: true,
      modalProps: { ...DEFAULT_MODAL_CONFIG, ...modalProps }
    };
  }

  return {
    withModal: true,
    modalProps: {
      ...DEFAULT_MODAL_CONFIG,
      ...modalProps,
      content: (
        <>
          {modalProps.content}
          {node}
        </>
      )
    }
  };
};

export function getBroker(trade_info: ReceiptDealTradeOp | ReceiptDealTrade | undefined) {
  if (trade_info && 'broker_id' in trade_info) {
    return [trade_info.broker_id, trade_info.broker_id_b, trade_info.broker_id_c, trade_info.broker_id_d];
  }
  if (trade_info && 'broker' in trade_info) {
    return [
      trade_info.broker?.user_id,
      trade_info.broker_b?.user_id,
      trade_info.broker_c?.user_id,
      trade_info.broker_d?.user_id
    ];
  }
  return [];
}

export function isAxiosResponse<T extends Record<string, unknown>>(obj: unknown): obj is AxiosResponse<T> {
  if (obj === null || typeof obj !== 'object') return false;
  return (
    'data' in obj &&
    typeof obj.data === 'object' &&
    'status' in obj &&
    'statusText' in obj &&
    'headers' in obj &&
    'config' in obj
  );
}
