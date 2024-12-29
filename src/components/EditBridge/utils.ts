import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BridgeInstInfo, DealOperationInfo, ReceiptDeal, ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import {
  BridgeChannel,
  DealOperationType,
  OperationSource,
  ReceiptDealStatus,
  Side,
  TradeDirection
} from '@fepkg/services/types/bds-enum';
import { InstitutionTiny, PayForInstFee, Trader } from '@fepkg/services/types/common';
import { ReceiptDealMulUpdateBridge } from '@fepkg/services/types/receipt-deal/mul-update-bridge';
import { ReceiptDealUpdateBridgeV2 } from '@fepkg/services/types/receipt-deal/update-bridge-v2';
import { ReceiptDealUpdateNonBridge } from '@fepkg/services/types/receipt-deal/update-non-bridge';
import { first, groupBy, isEqual, last, omit, pick, reverse, uniq, uniqBy } from 'lodash-es';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get-by-parent';
import { miscStorage } from '@/localdb/miscStorage';
import { getSettlementStrWithFlagExchange } from '@/pages/Deal/Bridge/utils';
import { formatTermWithYD } from '@/pages/Deal/Detail/utils';
import {
  BatchDefaultBridgeValueProps,
  BridgeFormStateParams,
  FormState,
  MulFormState,
  MulModalInitialState,
  NoneModalInitialState,
  RealTradeParams,
  RealTradeValueType,
  SendInstType,
  SingBridgeFormState,
  SingleModalInitialStateV2,
  Source
} from './types';

export const transformMulParams = (params: MulModalInitialState) => {
  return {
    ...params,
    defaultRealTradeValue: {
      ...params.defaultRealTradeValue,
      bidSendOrderInstList: !params.defaultRealTradeValue?.bidSendOrderInstList?.length
        ? [{}]
        : params.defaultRealTradeValue?.bidSendOrderInstList?.map(v => ({
            ...v,
            volume: (v.volume / 1000).toString()
          })),
      ofrSendOrderInstList: !params.defaultRealTradeValue?.ofrSendOrderInstList?.length
        ? [{}]
        : params.defaultRealTradeValue?.ofrSendOrderInstList?.map(v => ({ ...v, volume: (v.volume / 1000).toString() }))
    },
    defaultBridgeValue: params.defaultBridgeValue?.map((v, i) => ({
      ...v,
      channel: v.channel || BridgeChannel.Request,
      fee: v.fee === SERVER_NIL || v.fee === 0 ? undefined : v.fee
    }))
  };
};

export const transformSingleParamsV2 = (params: FormState) => {
  return {
    ...params,
    bidSendOrderInstList: !params.bidSendOrderInstList?.length
      ? [{}]
      : params.bidSendOrderInstList?.map(v => ({ ...v, volume: (v.volume / 1000).toString() })),
    ofrSendOrderInstList: !params.ofrSendOrderInstList?.length
      ? [{}]
      : params.ofrSendOrderInstList?.map(v => ({ ...v, volume: (v.volume / 1000).toString() })),
    bidSendPay: params.bidSendPay === SERVER_NIL || params.bidSendPay === 0 ? undefined : params.bidSendPay,
    ofrSendPay: params.ofrSendPay === SERVER_NIL || params.ofrSendPay === 0 ? undefined : params.ofrSendPay
  };
};

export const transformNoneParams = (productType: ProductType, params: NoneModalInitialState) => {
  let { sendMsg } = params;
  if (!params.flagBridgeInfoChanged) {
    if (params.direction === TradeDirection.TradeDirectionBid2Ofr) {
      sendMsg = params?.ofrTrader?.name_zh;
    }

    if (params.direction === TradeDirection.TradeDirectionOfr2Bid) {
      sendMsg = params?.bidTrader?.name_zh;
    }
  }
  return {
    ...params,
    sendOrderInst: !params.sendOrderInst?.length
      ? [{}]
      : params.sendOrderInst?.map(v => ({ ...v, volume: (v.volume / 1000).toString() })),
    cost: params.cost === SERVER_NIL || params.cost === 0 ? undefined : params.cost,
    channel: params.channel || BridgeChannel.Request,
    sendMsg
  };
};

export const transformBatchPrams = (
  params?: BatchDefaultBridgeValueProps
): Omit<ReceiptDealMulUpdateBridge.Request, 'current_bridge_inst_id'> => {
  const operation_info: DealOperationInfo = {
    operator: miscStorage.userInfo?.user_id ?? '',
    operation_type: DealOperationType.DOTModifyBridgeInfo,
    operation_source: OperationSource.OperationSourceReceiptDealBridge
  };
  if (!params) return { operation_info };
  return {
    ...pick(params, ['bridge_bid_channel', 'bridge_ofr_channel', 'bid_bridge_direction', 'ofr_bridge_direction']),
    operation_info
  };
};

/** 获取单条编辑交易真实对手方的机构和交易员信息 */
export const getSingleRealityTrade = (details?: ReceiptDeal[]) => {
  if (!details?.length || details?.length < 2) return {};
  return { [Side.SideBid]: details[0].bid_trade_info, [Side.SideOfr]: details?.at(-1)?.ofr_trade_info };
};

const getExceptRepeat = <T>(data: (T | undefined)[], fn?: (origin?: T) => string | undefined) => {
  let res: T | undefined | null;
  // 全部为空
  if (data.every(v => !!v === false)) res = null;
  // 存在空
  else if (data.some(v => !!v === false)) res = undefined;
  // 全部不为空 && 去重后存在不一样的数据
  else if (uniqBy(data, fn).length !== 1) res = undefined;
  // 全等
  else [res] = data;
  return res;
};

/** 获取比批量编辑与桥相连的机构和交易员信息 */
export const getBatchParams = (receiptDealDetails?: ReceiptDealDetail[], bridgeInstId?: string) => {
  const bidInstList: (InstitutionTiny | undefined)[] = [];
  const ofrInstList: (InstitutionTiny | undefined)[] = [];

  const bidTraders: (Trader | undefined)[] = [];
  const ofrTraders: (Trader | undefined)[] = [];

  const bidBridgeDirections: TradeDirection[] = [];
  const ofrBridgeDirections: TradeDirection[] = [];
  let bidBridgeDirectionDisabled = false;
  let ofrBridgeDirectionDisabled = false;

  const bidDirectConnectionDealIds: { dealId: string; flagPayForInst: boolean }[] = [];
  const ofrDirectConnectionDealIds: { dealId: string; flagPayForInst: boolean }[] = [];

  receiptDealDetails?.forEach(v => {
    const sortDetails = [...(v.details ?? [])].sort((a, b) => (b.bridge_index ?? 0) - (a.bridge_index ?? 0));

    bidInstList.push(v.parent_deal.bid_trade_info.inst);
    ofrInstList.push(v.parent_deal.ofr_trade_info.inst);

    bidTraders.push(v.parent_deal.bid_trade_info.trader);
    ofrTraders.push(v.parent_deal.ofr_trade_info.trader);

    /** 找到当前桥相连的两个指向 */
    // 找到第一个bid方的机构是桥机构的成交单对应的方向，则为最终的ofr侧指向
    const ofr = sortDetails?.find(d => d.bid_trade_info.inst?.inst_id === bridgeInstId);
    const ofrDirection = ofr?.bridge_direction;
    // 找到第一个ofr方的机构是桥机构的成交单对应的方向，则为最终的bid侧指向
    const bid = sortDetails?.find(d => d.ofr_trade_info.inst?.inst_id === bridgeInstId);
    const bidDirection = bid?.bridge_direction;

    // 找到当前桥是否与ofr交易方直连
    const isOfrDirectConnection = sortDetails?.findIndex(d => d.bid_trade_info.inst?.inst_id === bridgeInstId) === 0;
    // 找到当前桥是否与bid交易方直连
    const isBidDirectConnection =
      sortDetails?.findIndex(d => d.ofr_trade_info.inst?.inst_id === bridgeInstId) === sortDetails.length - 1;

    if (isOfrDirectConnection) {
      ofrDirectConnectionDealIds.push({
        dealId: ofr?.receipt_deal_id ?? '',
        flagPayForInst: !!ofr?.bid_trade_info.flag_pay_for_inst
      });
    }
    if (isBidDirectConnection) {
      bidDirectConnectionDealIds.push({
        dealId: bid?.receipt_deal_id ?? '',
        flagPayForInst: !!bid?.ofr_trade_info.flag_pay_for_inst
      });
    }

    if (!bid) bidBridgeDirectionDisabled = true;
    if (!ofr) ofrBridgeDirectionDisabled = true;

    if (bidDirection) bidBridgeDirections.push(bidDirection);
    if (ofrDirection) ofrBridgeDirections.push(ofrDirection);
  });

  const bidInst = getExceptRepeat<InstitutionTiny>(bidInstList, data => data?.inst_id);
  const ofrInst = getExceptRepeat<InstitutionTiny>(ofrInstList, data => data?.inst_id);

  const bidTrader = getExceptRepeat<Trader>(bidTraders, data => (data?.trader_id ?? '') + (data?.tags?.[0] ?? ''));
  const ofrTrader = getExceptRepeat<Trader>(ofrTraders, data => (data?.trader_id ?? '') + (data?.tags?.[0] ?? ''));

  const bidBridgeDirection = uniq(bidBridgeDirections).length === 1 ? bidBridgeDirections[0] : undefined;
  const ofrBridgeDirection = uniq(ofrBridgeDirections).length === 1 ? ofrBridgeDirections[0] : undefined;

  return {
    bidDirectConnectionDealIds,
    ofrDirectConnectionDealIds,
    [Side.SideBid]: {
      inst: bidInst,
      trader: bidTrader,
      bridgeDirection: bidBridgeDirection,
      bidBridgeDirectionDisabled
    },
    [Side.SideOfr]: {
      inst: ofrInst,
      trader: ofrTrader,
      bridgeDirection: ofrBridgeDirection,
      ofrBridgeDirectionDisabled
    }
  };
};

export const getRequestPay = (curr?: number | string, prev?: number) => {
  if (curr === prev) return undefined;
  if (!curr && prev === SERVER_NIL) return undefined;
  if (curr === '0') return SERVER_NIL;
  return curr ? Number(curr) : SERVER_NIL;
};

/** 判断是否需要重置桥信息 */
export const isNeedResetBridge = (selectedItems: ReceiptDealDetail[]) => {
  // TODO: 这里加一个log，因为经常出现该重置的时候不重置的问题，一般都是服务端返回的数据问题。
  console.log(
    'src/components/EditBridge/utils.ts: selectedItems-details: ',
    selectedItems.map(v => v.details)
  );
  return selectedItems.some(v => {
    // 去掉最后一项后，判断剩余每一项的ofr方向的计费人姓名
    const details = v.details?.slice(0, -1);
    return details?.some(d => !d.ofr_biller_name);
  });
};

export const showResetModal = (onOk?: () => Promise<void>) => {
  ModalUtils.warning({
    title: '是否继续编辑？',
    content: '当前成交所含桥有新增更新，将重置桥信息，确认编辑？',
    onOk
  });
};

export const getReceiptDealSettlement = (details: ReceiptDeal[], flag_stock_exchange?: boolean) => {
  let settlementStr = '';
  let settlementTypes = reverse(
    details.map(item =>
      getSettlementStrWithFlagExchange(
        item.liquidation_speed_list?.at(0) ?? getSettlement(item.traded_date, item.delivery_date),
        item.traded_date,
        flag_stock_exchange
      )
    ) || []
  );
  // 如果交割都一致就只展示一个交割，否则就都展示
  if (uniq(settlementTypes).length === 1) {
    settlementTypes = uniq(settlementTypes);
  }
  // 交割方式
  settlementStr = settlementTypes.join('/');
  if (flag_stock_exchange) settlementStr += '交易所';
  return settlementStr;
};

const getBridgeComment = (details?: ReceiptDeal[]) => {
  if (!details?.length) return void 0;
  // 删掉第一单，去后面每个bid方向的桥备注
  const deals = details.slice(1);
  return deals.map(v => v.bridge_comment);
};

/** 构造无桥编辑参数 */
export const transReceiptDealDetailToNoneModalState = (
  receiptDealDetail: ReceiptDealDetail,
  source: Source
): NoneModalInitialState => {
  const parentDeal = receiptDealDetail.parent_deal;
  const detailDeal = first(receiptDealDetail.details);

  const settlement = getReceiptDealSettlement(detailDeal ? [detailDeal] : [], detailDeal?.flag_stock_exchange);

  return {
    receiptDealId: detailDeal?.receipt_deal_id ?? '',
    parentDealId: parentDeal.parent_deal_id || '',
    volume: parentDeal.volume,
    ofrInst: detailDeal?.ofr_trade_info.inst,
    ofrTrader: detailDeal?.ofr_trade_info.trader,
    ofrTraderTag: detailDeal?.ofr_trade_info.trader_tag,
    ofrIsPaid: parentDeal.ofr_trade_info?.flag_pay_for_inst,
    bidInst: detailDeal?.bid_trade_info.inst,
    bidTrader: detailDeal?.bid_trade_info.trader,
    bidTraderTag: detailDeal?.bid_trade_info.trader_tag,
    bidIsPaid: parentDeal.bid_trade_info?.flag_pay_for_inst,
    dealTime: detailDeal?.deal_time,
    direction: detailDeal?.bridge_direction,
    sendMsg: detailDeal?.send_msg,
    channel: detailDeal?.channel,
    cost: detailDeal?.fee,
    firstMaturityDate: receiptDealDetail.parent_deal.bond_basic_info.first_maturity_date,
    settlement,
    sendMsgComment: detailDeal?.send_msg_comment,
    hideComment: detailDeal?.hide_comment,
    sendOrderInst: detailDeal?.send_order_inst_list,
    flagBridgeInfoChanged: detailDeal?.flag_bridge_info_changed,
    source
  };
};

/** 构造单桥编辑参数 */
export const transReceiptDealDetailToSingleModalState = (
  receiptDealDetail: ReceiptDealDetail,
  source: Source
): SingleModalInitialStateV2 => {
  const parentDeal = receiptDealDetail.parent_deal;
  const firstBridgeDeal = first(receiptDealDetail.details);
  const lastBridgeDeal = last(receiptDealDetail.details);

  const bidSettlement = getReceiptDealSettlement(
    firstBridgeDeal ? [firstBridgeDeal] : [],
    firstBridgeDeal?.flag_stock_exchange
  );
  const ofrSettlement = getReceiptDealSettlement(
    lastBridgeDeal ? [lastBridgeDeal] : [],
    lastBridgeDeal?.flag_stock_exchange
  );

  const bidPart = {
    bidReceiptDealId: firstBridgeDeal?.receipt_deal_id ?? '',
    bidInst: firstBridgeDeal?.bid_trade_info.inst,
    bidTrader: firstBridgeDeal?.bid_trade_info.trader,
    bidTraderTag: firstBridgeDeal?.bid_trade_info.trader_tag,
    bidBridgeInst: firstBridgeDeal?.ofr_trade_info.inst,
    bidBridgeTrader: firstBridgeDeal?.ofr_trade_info.trader,
    bidBridgeTraderTag: firstBridgeDeal?.ofr_trade_info.trader_tag,
    bidIsPaid: parentDeal?.bid_trade_info?.flag_pay_for_inst,
    bidDealTime: firstBridgeDeal?.deal_time,
    bidDirection: firstBridgeDeal?.bridge_direction,
    bidSettlement,
    bidChannel: firstBridgeDeal?.channel,
    bidSendMsg: firstBridgeDeal?.send_msg,
    bidSendMsgComment: firstBridgeDeal?.send_msg_comment,
    bidHideComment: firstBridgeDeal?.hide_comment,
    bidSendOrderInstList: firstBridgeDeal?.send_order_inst_list,
    bidBillerId: firstBridgeDeal?.ofr_biller_id,
    bidBillerName: firstBridgeDeal?.ofr_biller_name,
    bidBillerTag: firstBridgeDeal?.ofr_biller_tag,
    bidContact: firstBridgeDeal?.ofr_contact,
    bidContactTag: firstBridgeDeal?.ofr_trade_info?.trader_tag,
    bidContactName: firstBridgeDeal?.ofr_trade_info?.trader?.name_zh,
    bidSendPay: firstBridgeDeal?.fee
  };
  const ofrPart = {
    ofrReceiptDealId: lastBridgeDeal?.receipt_deal_id ?? '',
    ofrInst: lastBridgeDeal?.ofr_trade_info.inst,
    ofrTrader: lastBridgeDeal?.ofr_trade_info.trader,
    ofrTraderTag: lastBridgeDeal?.ofr_trade_info.trader_tag,
    ofrBridgeInst: lastBridgeDeal?.bid_trade_info.inst,
    ofrBridgeTrader: lastBridgeDeal?.bid_trade_info.trader,
    ofrBridgeTraderTag: lastBridgeDeal?.bid_trade_info.trader_tag,
    ofrIsPaid: parentDeal?.ofr_trade_info?.flag_pay_for_inst,
    ofrDealTime: lastBridgeDeal?.deal_time,
    ofrDirection: lastBridgeDeal?.bridge_direction,
    ofrSettlement,
    ofrChannel: lastBridgeDeal?.channel,
    ofrSendMsg: lastBridgeDeal?.send_msg,
    ofrSendMsgComment: lastBridgeDeal?.send_msg_comment,
    ofrHideComment: lastBridgeDeal?.hide_comment,
    ofrSendOrderInstList: lastBridgeDeal?.send_order_inst_list,
    ofrBillerId: lastBridgeDeal?.bid_biller_id,
    ofrBillerName: lastBridgeDeal?.bid_biller_name,
    ofrBillerTag: lastBridgeDeal?.bid_biller_tag,
    ofrContact: lastBridgeDeal?.bid_contact,
    ofrContactTag: lastBridgeDeal?.bid_trade_info?.trader_tag,
    ofrContactName: lastBridgeDeal?.bid_trade_info?.trader?.name_zh,
    ofrSendPay: lastBridgeDeal?.fee
  };

  return {
    parentDealId: receiptDealDetail.parent_deal?.parent_deal_id || '',
    defaultValue: {
      ...bidPart,
      ...ofrPart,
      bridgeComment: getBridgeComment(receiptDealDetail.details)?.[0]
    },
    source,
    volume: receiptDealDetail.parent_deal.volume,
    firstMaturityDate: receiptDealDetail.parent_deal.bond_basic_info.first_maturity_date
  };
};

/** 构造多桥编辑参数 */
export const transReceiptDealDetailToMulModalState = (
  receiptDealDetail: ReceiptDealDetail,
  source: Source,
  currentBridgeTraderId?: string
): MulModalInitialState => {
  const { details } = receiptDealDetail;
  if (!details?.length) return { parentDealId: receiptDealDetail.parent_deal.parent_deal_id ?? '' };

  const firstBridgeDeal = first(details);
  const lastBridgeDeal = last(details);
  const parentDeal = receiptDealDetail.parent_deal;

  const defaultBridgeValue: MulFormState[] = [...details]
    .sort((a, b) => (b.bridge_index ?? 0) - (a.bridge_index ?? 0))
    .map(v => {
      return {
        receiptDealId: v.receipt_deal_id,

        /** bid信息 */
        bidBridgeInst: v.bid_trade_info.inst,
        bidBridgeTrader: v.bid_trade_info.trader,
        bidBridgeTraderTag: v.bid_trade_info.trader_tag,
        bidBillerName: v.bid_biller_name,
        bidBillerTag: v.bid_biller_tag,
        bidContact: v.bid_contact,
        bidContactTag: v.bid_trade_info.trader_tag,
        bidContactName: v.bid_trade_info.trader?.name_zh,

        /** ofr信息 */
        ofrBridgeInst: v.ofr_trade_info.inst,
        ofrBridgeTrader: v.ofr_trade_info.trader,
        ofrBridgeTraderTag: v.ofr_trade_info.trader_tag,
        ofrBillerName: v.ofr_biller_name,
        ofrBillerTag: v.ofr_biller_tag,
        ofrContact: v.ofr_contact,
        ofrContactTag: v.ofr_trade_info.trader_tag,
        ofrContactName: v.ofr_trade_info.trader?.name_zh,
        direction: v.bridge_direction,
        settlement: getReceiptDealSettlement([v], v.flag_stock_exchange),
        channel: v.channel,
        sendMsg: v.send_msg,
        sendMsgComment: v.send_msg_comment,
        fee: v.fee,

        bridgeComment: v.bridge_comment
      };
    });

  const defaultRealTradeValue: RealTradeValueType = {
    bidInst: firstBridgeDeal?.bid_trade_info.inst,
    bidTrader: firstBridgeDeal?.bid_trade_info.trader,
    bidTraderTag: firstBridgeDeal?.bid_trade_info.trader_tag,
    bidHideComment: firstBridgeDeal?.hide_comment,
    bidSendOrderInstList: firstBridgeDeal?.send_order_inst_list,
    bidDealTime: firstBridgeDeal?.deal_time,
    flagBidPayForInst: parentDeal?.bid_trade_info?.flag_pay_for_inst,
    ofrInst: lastBridgeDeal?.ofr_trade_info.inst,
    ofrTrader: lastBridgeDeal?.ofr_trade_info.trader,
    ofrTraderTag: lastBridgeDeal?.ofr_trade_info.trader_tag,
    ofrHideComment: lastBridgeDeal?.hide_comment,
    ofrSendOrderInstList: lastBridgeDeal?.send_order_inst_list,
    ofrDealTime: lastBridgeDeal?.deal_time,
    flagOfrPayForInst: parentDeal?.ofr_trade_info?.flag_pay_for_inst
  };

  return {
    parentDealId: receiptDealDetail.parent_deal.parent_deal_id ?? '',
    volume: receiptDealDetail.parent_deal.volume,
    currentBridgeTraderId,
    source,
    firstMaturityDate: receiptDealDetail.parent_deal.bond_basic_info.first_maturity_date,
    defaultBridgeValue,
    defaultRealTradeValue
  };
};

export const getNoneBridgeSubmitDiffParams = (
  defaultValue: NoneModalInitialState,
  submitParams: ReceiptDealUpdateNonBridge.Request
) => {
  const { parent_deal_id, operation_info } = submitParams;

  const prev = omit(defaultValue, ['parentDealId', 'sendOrderInst']);
  const next = omit(submitParams, ['parent_deal_id', 'operation_info', 'send_order_inst_info_list']);
  const diff: Omit<
    ReceiptDealUpdateNonBridge.Request,
    'parent_deal_id' | 'operation_info' | 'send_order_inst_info_list'
  > = {};

  if (next.send_msg !== prev.sendMsg) diff.send_msg = next.send_msg;
  if (next.channel !== prev.channel) diff.channel = next.channel;
  if (next.fee !== prev.cost) diff.fee = next.fee;
  if (next.send_msg_comment !== prev.sendMsgComment) diff.send_msg_comment = next.send_msg_comment;
  if (next.hide_comment !== prev.hideComment) diff.hide_comment = next.hide_comment;
  if (next.direction !== prev.direction) diff.direction = next.direction;

  const res: ReceiptDealUpdateNonBridge.Request = {
    parent_deal_id,
    ...diff,
    operation_info: {
      operator: operation_info?.operator,
      operation_type: operation_info?.operation_type,
      operation_source: operation_info?.operation_source
    }
  };
  if (!isEqual(defaultValue.sendOrderInst, submitParams.send_order_inst_info_list)) {
    res.send_order_inst_info_list = submitParams.send_order_inst_info_list;
  }

  return res;
};

/** 将发单机构转换为服务端类型 */
export const transformSendOrderInst = (data: SendInstType[]) => {
  return data
    ?.filter(v => !!v.inst?.inst_id || !!v.volume)
    .map(v => ({
      inst_id: v.inst?.inst_id ?? '',
      volume: (v.volume ? Number(v.volume) : 0) * 1000
    }));
};

export const getSingleBridgeSubmitDiffParams = (
  prev: SingleModalInitialStateV2,
  next: SingBridgeFormState
): ReceiptDealUpdateBridgeV2.UpdateBridgeInfo[] => {
  const { defaultValue } = prev;
  const bid: ReceiptDealUpdateBridgeV2.UpdateBridgeInfo = { receipt_deal_id: defaultValue.bidReceiptDealId };
  const ofr: ReceiptDealUpdateBridgeV2.UpdateBridgeInfo = { receipt_deal_id: defaultValue.ofrReceiptDealId };

  if (defaultValue.bidDirection !== next.bidDirection) bid.bridge_direction = next.bidDirection;
  if (defaultValue.ofrDirection !== next.ofrDirection) ofr.bridge_direction = next.ofrDirection;

  if (defaultValue.bidSendMsg !== next.bidSendMsg) bid.send_msg = next.bidSendMsg;
  if (defaultValue.ofrSendMsg !== next.ofrSendMsg) ofr.send_msg = next.ofrSendMsg;

  if (defaultValue.bidChannel !== next.bidChannel) bid.bridge_channel = next.bidChannel;
  if (defaultValue.ofrChannel !== next.ofrChannel) ofr.bridge_channel = next.ofrChannel;

  const bidSendPay = getRequestPay(next.bidSendPay ? Number(next.bidSendPay) : void 0, defaultValue?.bidSendPay);
  const ofrSendPay = getRequestPay(next.ofrSendPay ? Number(next.ofrSendPay) : void 0, defaultValue?.ofrSendPay);

  if (defaultValue.bidSendPay !== bidSendPay) bid.fee = bidSendPay;
  if (defaultValue.ofrSendPay !== ofrSendPay) ofr.fee = ofrSendPay;

  if (defaultValue.bidSendMsgComment !== next.bidSendMsgComment) bid.send_order_comment = next.bidSendMsgComment;
  if (defaultValue.ofrSendMsgComment !== next.ofrSendMsgComment) ofr.send_order_comment = next.ofrSendMsgComment;

  if (defaultValue.bidHideComment !== next.bidHideComment) bid.flag_hide_comment = next.bidHideComment;
  if (defaultValue.ofrHideComment !== next.ofrHideComment) ofr.flag_hide_comment = next.ofrHideComment;

  if (!isEqual(defaultValue.bidSendOrderInstList, next.bidSendOrderInstList)) {
    bid.send_order_inst_list = transformSendOrderInst(next.bidSendOrderInstList);
  }

  if (!isEqual(defaultValue.ofrSendOrderInstList, next.ofrSendOrderInstList)) {
    ofr.send_order_inst_list = transformSendOrderInst(next.ofrSendOrderInstList);
  }

  if (defaultValue.bridgeComment !== next.bridgeComment) ofr.bridge_comment = next.bridgeComment;

  return [bid, ofr];
};

export const getBatchBridgeSubmitDiffParams = (
  submitParams: ReceiptDealMulUpdateBridge.Request
): ReceiptDealMulUpdateBridge.Request => {
  const omitKeys = ['current_bridge_inst_id', 'parent_deal_ids', 'operation_info'];

  const { parent_deal_ids, current_bridge_inst_id, operation_info } = submitParams;

  const next = omit(submitParams, omitKeys);

  const diff: Omit<
    ReceiptDealMulUpdateBridge.Request,
    'current_bridge_inst_id' | 'parent_deal_ids' | 'operation_info'
  > = {};

  if (next.bid_bridge_channel) diff.bid_bridge_channel = next.bid_bridge_channel;
  if (next.ofr_bridge_channel) diff.ofr_bridge_channel = next.ofr_bridge_channel;

  if (next.bid_send_msg) diff.bid_send_msg = next.bid_send_msg;
  if (next.ofr_send_msg) diff.ofr_send_msg = next.ofr_send_msg;

  if (next.bid_bridge_pay !== undefined) diff.bid_bridge_pay = next.bid_bridge_pay;
  if (next.ofr_bridge_pay !== undefined) diff.ofr_bridge_pay = next.ofr_bridge_pay;

  if (next.bid_send_msg_comment) diff.bid_send_msg_comment = next.bid_send_msg_comment;
  if (next.ofr_send_msg_comment) diff.ofr_send_msg_comment = next.ofr_send_msg_comment;

  diff.bid_bridge_direction = next.bid_bridge_direction;
  diff.ofr_bridge_direction = next.ofr_bridge_direction;

  const res: ReceiptDealMulUpdateBridge.Request = {
    current_bridge_inst_id,
    parent_deal_ids,
    operation_info,
    ...diff
  };

  return res;
};

const getDiffBridgeInfo = (prev: MulFormState, next: BridgeFormStateParams) => {
  const diff: Omit<ReceiptDealUpdateBridgeV2.UpdateBridgeInfo, 'receipt_deal_id'> = {};
  if (prev.direction !== next.direction) diff.bridge_direction = next.direction;
  if (prev.sendMsg !== next.sendMsg) diff.send_msg = next.sendMsg;
  if (prev.channel !== next.channel) diff.bridge_channel = next.channel;

  const fee = getRequestPay(next.fee ? Number(next.fee) : void 0, prev.fee);

  if (prev.fee !== fee) diff.fee = fee;
  if (prev.sendMsgComment !== next.sendMsgComment) diff.send_order_comment = next.sendMsgComment;
  if (prev.bridgeComment !== next.bridgeComment) diff.bridge_comment = next.bridgeComment;
  return diff;
};

export const getMulBridgeSubmitDiffParams = (
  prev: MulModalInitialState,
  next: {
    realTradeValue: RealTradeParams;
    bridgeValue: BridgeFormStateParams[];
  }
): ReceiptDealUpdateBridgeV2.UpdateBridgeInfo[] => {
  const diff: ReceiptDealUpdateBridgeV2.UpdateBridgeInfo[] = [];

  prev.defaultBridgeValue?.forEach((v, i) => {
    const itemDiff: ReceiptDealUpdateBridgeV2.UpdateBridgeInfo = { receipt_deal_id: v.receiptDealId };
    const itemBridgeDiff = getDiffBridgeInfo(v, next.bridgeValue[i]);

    if (i === 0) {
      if (!isEqual(prev.defaultRealTradeValue?.ofrSendOrderInstList, next.realTradeValue.ofrSendOrderInstList)) {
        itemDiff.send_order_inst_list = transformSendOrderInst(next.realTradeValue.ofrSendOrderInstList);
      }
      if (prev.defaultRealTradeValue?.ofrHideComment !== next.realTradeValue.ofrHideComment) {
        itemDiff.flag_hide_comment = next.realTradeValue.ofrHideComment;
      }
    }

    if (i === next.bridgeValue.length - 1) {
      if (!isEqual(prev.defaultRealTradeValue?.bidSendOrderInstList, next.realTradeValue.bidSendOrderInstList)) {
        itemDiff.send_order_inst_list = transformSendOrderInst(next.realTradeValue.bidSendOrderInstList);
      }
      if (prev.defaultRealTradeValue?.bidHideComment !== next.realTradeValue.bidHideComment) {
        itemDiff.flag_hide_comment = next.realTradeValue.bidHideComment;
      }
    }

    diff.push({ ...itemDiff, ...itemBridgeDiff });
  });

  return diff;
};

export const getFee = (feeList?: PayForInstFee[], firstMaturityDate?: string, dealTime?: string) => {
  /** first_maturity_date - deal_time 后看匹配到哪个fee_list区间，则取对应的fee字段 */
  if (!feeList?.length || !firstMaturityDate || !dealTime) return void 0;
  const offset = Number(firstMaturityDate) - Number(dealTime);
  if (offset < 0) return void 0;
  for (const v of feeList) {
    const prev = formatTermWithYD(v.start) * 86400000;
    const next = formatTermWithYD(v.end) * 86400000;
    if (offset >= prev && offset < next) return v.fee;
  }
  return void 0;
};

/** 返回所有的traderId对应的桥备注 */
export const getBridgeInstSendMsg = (bridges: BridgeInstInfo[], currentDeal?: ReceiptDealDetail) => {
  const details = (currentDeal?.details ?? []).slice(0, -1);

  return details.map(detail => {
    const dealBridgeTraderId = detail.ofr_trade_info.trader?.trader_id;
    const bridgeInfo = bridges.find(bridge => bridge.contact_trader.trader_id === dealBridgeTraderId);
    if (!dealBridgeTraderId || !bridgeInfo) return void 0;
    return { traderId: dealBridgeTraderId, sendMsg: bridgeInfo.send_msg };
  });
};

/** 单条编辑校验 */
export const checkBridgeUpdate = (
  bidSendOrderInstList?: SendInstType[],
  ofrSendOrderInstList?: SendInstType[],
  volume?: number,
  errorLength?: number
) => {
  const error = {
    [Side.SideBid]: new Array(errorLength ?? 10).fill(1).map(_ => [false, false]),
    [Side.SideOfr]: new Array(errorLength ?? 10).fill(1).map(_ => [false, false])
  };

  if (volume === undefined) return true;

  const bidValidList = bidSendOrderInstList?.filter(
    v => !!v.inst?.inst_id || (v.volume !== undefined && v.volume !== '')
  );

  const ofrValidList = ofrSendOrderInstList?.filter(
    v => !!v.inst?.inst_id || (v.volume !== undefined && v.volume !== '')
  );

  // 检查bid总数是否等于成交单总量
  let bidCountError = false;
  const bidCount = bidValidList?.reduce((acc, cur) => acc + Number(cur.volume ?? 0) * 1000, 0);
  if (bidValidList?.length && bidCount !== volume) {
    const currError = error[Side.SideBid].map((v, i) => [v[0], bidValidList?.[i]?.volume !== undefined]);
    error[Side.SideBid] = currError;
    bidCountError = true;
  }

  // 检查ofr总数是否等于成交单总量
  let ofrCountError = false;
  const ofrCount = ofrValidList?.reduce((acc, cur) => acc + Number(cur.volume ?? 0) * 1000, 0);
  if (ofrValidList?.length && ofrCount !== volume) {
    const currError = error[Side.SideOfr].map((v, i) => [v[0], ofrValidList?.[i]?.volume !== undefined]);
    error[Side.SideOfr] = currError;
    ofrCountError = true;
  }

  // 检查bid是否有空值
  let bidInstError = false;
  let bidVolumeError = false;
  bidValidList?.forEach((v, i) => {
    if (!v.inst?.inst_id) {
      error[Side.SideBid][i][0] = true;
      bidInstError = true;
    }
    if (v.volume === undefined) {
      error[Side.SideBid][i][1] = true;
      bidVolumeError = true;
    }
  });

  // 检查ofr是否有空值
  let ofrInstError = false;
  let ofrVolumeError = false;
  ofrValidList?.forEach((v, i) => {
    if (!v.inst?.inst_id) {
      error[Side.SideOfr][i][0] = true;
      ofrInstError = true;
    }
    if (v.volume === undefined) {
      error[Side.SideOfr][i][1] = true;
      ofrVolumeError = true;
    }
  });

  const isPass = !(bidCountError || ofrCountError || bidInstError || ofrInstError || bidVolumeError || ofrVolumeError);
  if (!isPass) {
    const errorMsg: string[] = [];
    if (bidCountError || ofrCountError) errorMsg.push('发单量合计与成交量不一致！');
    else if (bidVolumeError || ofrVolumeError) errorMsg.push('发单量不可为空！');
    if (bidInstError || ofrInstError) errorMsg.push('发单机构不可为空！');
    message.error(errorMsg.join(' '));
    return error;
  }
  return isPass;
};

const CONFIRM_DEAL_STATUS = new Set([
  ReceiptDealStatus.ReceiptDealToBeSubmitted, // 处理中
  ReceiptDealStatus.ReceiptDealSubmitApproval, // 送审中
  ReceiptDealStatus.ReceiptDealToBeExamined, // 待审核
  ReceiptDealStatus.ReceiptDealNoPass, // 未通过
  ReceiptDealStatus.ReceiptDealPass // 通过
]);

/** 提示 */
export const checkReceiptDealStatus = async (parentDealIds: string[], checkReceiptDealIds: string[]) => {
  const receiptDeals = await fetchReceiptDealByParent({ parent_deal_ids: parentDealIds });
  const receiptDealStatus =
    receiptDeals.receipt_deal_info?.map(v => ({
      receipt_deal_id: v.receipt_deal_id,
      receipt_deal_status: v.receipt_deal_status
    })) ?? [];
  const receiptDealStatusGroupById = groupBy(receiptDealStatus, 'receipt_deal_id');
  return new Promise(resolve => {
    const pass = checkReceiptDealIds.every(
      v => !CONFIRM_DEAL_STATUS.has(receiptDealStatusGroupById[v][0].receipt_deal_status)
    );

    if (pass) {
      resolve(true);
      return;
    }
    ModalUtils.warning({
      title: '确认修改？',
      content: '提交修改将重置成交单状态，是否继续？',
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
      autoFocusButton: null,
      mask: false,
      maskClosable: true,
      wrapClassName: 'idc-stc-refer-confirm',
      zIndex: 2000,
      bodyStyle: {
        textAlign: 'center',
        borderRadius: 2
      }
    });
  });
};
