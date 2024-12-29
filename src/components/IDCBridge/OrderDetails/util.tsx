import { ReactNode } from 'react';
import { BridgeChannelMap } from '@fepkg/business/constants/map';
import { getInstName } from '@fepkg/business/utils/get-name';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { PayForInstWithFee } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import {
  BridgeInstInfo,
  ReceiptDeal,
  ReceiptDealDetail,
  ReceiptDealTrade,
  SendOrderInst
} from '@fepkg/services/types/bds-common';
import {
  BondQuoteType,
  BridgeChannel,
  LiquidationSpeedTag,
  Side,
  TradeDirection
} from '@fepkg/services/types/bds-enum';
import { first, last } from 'lodash-es';
import { formatPrice, getLGBType } from '@/common/utils/copy';
import { getFee } from '@/components/EditBridge/utils';
import { getRebateText, getSettlementStrWithFlagExchange } from '@/pages/Deal/Bridge/utils';

export const getReceiptBid = (receipt: ReceiptDealDetail) => {
  return (receipt.details ?? [])[0]?.bid_trade_info.broker?.name_cn ?? '';
};

export const getReceiptOfr = (receipt: ReceiptDealDetail) => {
  return last(receipt.details)?.ofr_trade_info.broker?.name_cn ?? '';
};

export const formatVolume = (volume: number) => {
  if (volume < 10000) return volume.toString();

  return `${volume / 10000}E`;
};

const formatPositiveNum = (num?: number) => {
  if (num != null && num > 0) return num.toString();

  return undefined;
};

const formatSendOrderInstList = (sendOrderInst: SendOrderInst[], productType?: ProductType) => {
  return sendOrderInst.map(i => `${getInstName({ inst: i.inst, productType })}${i.volume}`).join('+');
};

const getChannelText = (channel?: BridgeChannel) => {
  return BridgeChannelMap[channel ?? BridgeChannel.ChannelEnumNone];
};

export const getRelatedDetails = (details?: ReceiptDeal[], targetInstId?: string) =>
  details?.filter(
    d => d.bid_trade_info.inst?.inst_id === targetInstId || d.ofr_trade_info.inst?.inst_id === targetInstId
  ) ?? [];

type BridgeInfo = {
  sendMsg?: string;
  pay?: number;
  sendComment?: string;
  sendChannel?: BridgeChannel;
  isDirectionToCurrentBridge?: boolean;
  isTrueOpponent?: boolean;
  orderInstList?: SendOrderInst[];
  detail?: ReceiptDeal;
};

const getIsDirectionToCurrentBridge = (
  isTrueOpponent: boolean,
  direction: TradeDirection | undefined,
  isBid: boolean
) => {
  if (isTrueOpponent) {
    if (isBid) return direction === TradeDirection.TradeDirectionBid2Ofr;
    return direction === TradeDirection.TradeDirectionOfr2Bid;
  }

  const midDirection = direction;

  return isBid
    ? midDirection === TradeDirection.TradeDirectionBid2Ofr
    : midDirection === TradeDirection.TradeDirectionOfr2Bid;
};

const getBridgeInfo = (deal: ReceiptDealDetail, side: Side, currentBridgeInst: BridgeInstInfo) => {
  const relatedDetails = getRelatedDetails(deal.details, currentBridgeInst.contact_inst.inst_id);

  if (relatedDetails.length !== 2) return {};

  const ofrDeatil = relatedDetails[1];
  const bidDetail = relatedDetails[0];

  const isBidTrueOpponent = bidDetail.receipt_deal_id === first(deal.details ?? [])?.receipt_deal_id;
  const isOfrTrueOpponent = ofrDeatil.receipt_deal_id === last(deal.details ?? [])?.receipt_deal_id;

  // 真实对手方<=>桥之间和桥与桥之间的direction表义不同
  // 真实对手方：1:交易机构 -> 桥机构 2:桥机构 -> 交易机构
  // 桥与桥：1:ofr -> bid 2:bid -> ofr

  const bidInfo: BridgeInfo = {
    sendMsg: bidDetail?.send_msg,
    pay: bidDetail?.fee,
    sendComment: bidDetail?.send_msg_comment,
    sendChannel: bidDetail?.channel,
    isDirectionToCurrentBridge: getIsDirectionToCurrentBridge(isBidTrueOpponent, bidDetail.bridge_direction, true),
    orderInstList: bidDetail?.send_order_inst_list,
    isTrueOpponent: isBidTrueOpponent,
    detail: bidDetail
  };

  const ofrInfo: BridgeInfo = {
    sendMsg: ofrDeatil?.send_msg,
    pay: ofrDeatil?.fee,
    sendComment: ofrDeatil?.send_msg_comment,
    sendChannel: ofrDeatil?.channel,
    isDirectionToCurrentBridge: getIsDirectionToCurrentBridge(isOfrTrueOpponent, ofrDeatil.bridge_direction, false),
    orderInstList: ofrDeatil?.send_order_inst_list,
    isTrueOpponent: isOfrTrueOpponent,
    detail: ofrDeatil
  };

  return side === Side.SideBid ? bidInfo : ofrInfo;
};

const getSendTextArray = (
  productType: ProductType,
  bridgeInfo: BridgeInfo,
  tradeInfo: ReceiptDealTrade,
  fullInstList: BridgeInstInfo[],
  currentBridgeInst: BridgeInstInfo
) => {
  const getSend = () => {
    if (!bridgeInfo.isDirectionToCurrentBridge) {
      const traderText = tradeInfo?.trader?.name_zh;

      const defaultSend = bridgeInfo.isTrueOpponent
        ? traderText
        : fullInstList.find(i => i.contact_inst.inst_id === tradeInfo.inst?.inst_id)?.send_msg ?? '';

      if (defaultSend === bridgeInfo.sendMsg) {
        if (!bridgeInfo.isTrueOpponent) return getChannelText(bridgeInfo.sendChannel);

        return [getChannelText(bridgeInfo.sendChannel), getInstName({ inst: tradeInfo.inst, productType }), traderText]
          .filter(i => i != null && i !== '')
          .join(' ');
      }

      return bridgeInfo.sendMsg;
    }

    if (currentBridgeInst.send_msg === bridgeInfo.sendMsg) {
      return getChannelText(bridgeInfo.sendChannel);
    }
    return bridgeInfo.sendMsg;
  };

  const payText = formatPositiveNum(bridgeInfo.pay);
  return [
    getSend(),
    payText == null || payText === '' ? payText : `${payText}厘`,
    formatSendOrderInstList(bridgeInfo.orderInstList ?? [], productType),
    bridgeInfo.sendComment
  ].filter(i => i != null && i !== '');
};

const getInstText = (
  productType: ProductType,
  bridgeInfo: BridgeInfo,
  tradeInfo: ReceiptDealTrade,
  fullInstList: BridgeInstInfo[],
  currentBridgeInst: BridgeInstInfo
) => {
  const suffixArray = getSendTextArray(productType, bridgeInfo, tradeInfo, fullInstList, currentBridgeInst);

  const suffixText = suffixArray.length === 0 ? '' : `(${suffixArray.join('，')})`;

  return {
    instText: tradeInfo.inst == null ? '机构待定' : getInstName({ inst: tradeInfo.inst, productType }),
    suffixText
  };
};

export const getBridgeLiqSpeed = (deal: ReceiptDealDetail, currentBridgeInst: BridgeInstInfo) => {
  let liqSpeedList =
    deal.details
      ?.filter(
        d =>
          d.ofr_trade_info.inst?.inst_id === currentBridgeInst.contact_inst.inst_id ||
          d.bid_trade_info.inst?.inst_id === currentBridgeInst.contact_inst.inst_id
      )
      .map(d => {
        // tag为明天的换成t+n形式
        const isTomorrow = d.liquidation_speed_list?.at(0)?.tag === LiquidationSpeedTag.Tomorrow;
        const liqSpeed = isTomorrow
          ? getSettlement(d.traded_date, d.delivery_date, false, true)
          : d.liquidation_speed_list?.at(0);
        const raw = getSettlementStrWithFlagExchange(
          liqSpeed ?? getSettlement(d.traded_date, d.delivery_date, false, true),
          d.traded_date,
          deal.parent_deal.flag_stock_exchange
        );
        return `${raw}${deal.parent_deal.flag_stock_exchange ? '交易所' : ''}`;
      }) ?? [];

  if (liqSpeedList[0] === liqSpeedList[1]) {
    liqSpeedList = [liqSpeedList[0]];
  }

  return [...liqSpeedList].reverse();
};

export const getBridgeComment = (details?: ReceiptDeal[], targetInstId?: string, endWithWrap = false) => {
  const relatedDetails = getRelatedDetails(details, targetInstId);

  const bridgeComment = relatedDetails[1]?.bridge_comment;

  if (endWithWrap && bridgeComment !== '' && bridgeComment != null) return `${bridgeComment}\n`;

  return bridgeComment;
};

export const getReceiptDealText = ({
  deal,
  curInstId,
  currentBridgeInst,
  fullInstList,
  includesRating = false,
  isCopy = false
}: {
  deal: ReceiptDealDetail;
  curInstId: string | undefined;
  currentBridgeInst: BridgeInstInfo | undefined;
  fullInstList: BridgeInstInfo[];
  includesRating?: boolean;
  isCopy?: boolean;
}): {
  text: string;
  render: ReactNode;
} => {
  if (curInstId == null || currentBridgeInst == null) return { render: '', text: '' };

  const bond = deal.parent_deal.bond_basic_info;

  const rebateText = getRebateText(deal.parent_deal);

  const bridgeComment = getBridgeComment(deal.details, curInstId);

  const liqSpeedList = getBridgeLiqSpeed(deal, currentBridgeInst);

  const liqSpeedText = liqSpeedList.join('/');

  const ofrBridgeInfo = getBridgeInfo(deal, Side.SideOfr, currentBridgeInst);
  const bidBridgeInfo = getBridgeInfo(deal, Side.SideBid, currentBridgeInst);

  const ofrText = getInstText(
    bond.product_type,
    ofrBridgeInfo,
    deal.parent_deal.ofr_trade_info,
    fullInstList,
    currentBridgeInst
  );
  const bidText = getInstText(
    bond.product_type,
    bidBridgeInfo,
    deal.parent_deal.bid_trade_info,
    fullInstList,
    currentBridgeInst
  );

  const textArr = [
    bond.time_to_maturity,
    bond.display_code,
    `${bond.short_name} ${getLGBType(bond)}`,
    includesRating && bond.issuer_rating,
    `${formatPrice(deal.parent_deal.price, 4)}${rebateText}${
      deal.parent_deal.price_type === BondQuoteType.CleanPrice ? '净价' : ''
    }`,
    formatVolume(deal.parent_deal.volume ?? 0),
    liqSpeedText,
    !isCopy && ofrBridgeInfo.isTrueOpponent ? (
      <span
        key="ofr"
        className="text-secondary-100"
      >
        {ofrText.instText}{' '}
      </span>
    ) : (
      ofrText.instText
    ),
    ofrText.suffixText,
    '出给',
    !isCopy && bidBridgeInfo.isTrueOpponent ? (
      <span
        key="bid"
        className="text-orange-100"
      >
        {bidText.instText}{' '}
      </span>
    ) : (
      bidText.instText
    ),
    bidText.suffixText,
    bridgeComment == null || bridgeComment === '' ? undefined : `(${bridgeComment})`
  ].filter(Boolean);

  const text = textArr.filter(i => i != null && i !== '').join(' ');
  const render = textArr
    .reduce((result, i) => {
      if (typeof last(result) === 'string') {
        if (typeof i === 'string') {
          return [...result.slice(0, -1), [last(result), i].join(' ')];
        }
        return [...result.slice(0, -1), `${last(result)} `, i];
      }
      return [...result, i];
    }, [] as ReactNode[])
    .map((i, index) => (typeof i === 'string' ? <span key={index}>{i}</span> : i));

  return { render, text };
};

export const getReceiptBridgeList = (details: ReceiptDealDetail[]) => {
  return details.map(d => {
    // details若为双桥则有三项，[A->B, B->C, C->D]，固定为bid->ofr的顺序
    // 因此若第一项的ofr方为当前机构，则当前为bid桥，C为ofr桥
    // 反之，则第三项的bid方一定为当前机构，则当前为ofr桥，B为bid桥
    if (d.details?.length === 3) {
      return {
        ...d.parent_deal,
        bid_trade_info: d.details[0].ofr_trade_info,
        ofr_trade_info: d.details[1].ofr_trade_info
      };
    }

    return d.parent_deal;
  });
};

export const getNeedHighlightEdit = (
  deal: ReceiptDealDetail,
  bridgeInst?: BridgeInstInfo,
  feeList: PayForInstWithFee[] = [],
  bridgeInstList: BridgeInstInfo[] = []
) => {
  if (bridgeInst == null) return false;

  const bondInfo = deal.parent_deal.bond_basic_info;

  const insts = [deal.parent_deal.bid_trade_info.inst?.inst_id, deal.parent_deal.ofr_trade_info.inst?.inst_id];

  const getDefaultFee = (instID: string | undefined) => {
    const target = feeList.find(f => f.inst_id === instID);

    return getFee(target?.fee_list, bondInfo.first_maturity_date, deal.parent_deal.deal_time);
  };

  const defaultFees = insts.map(getDefaultFee);

  const bidInfo = getBridgeInfo(deal, Side.SideBid, bridgeInst);
  const ofrInfo = getBridgeInfo(deal, Side.SideOfr, bridgeInst);

  // 不含真实对手方则没有默认费用
  const bidDefaultFee = !bidInfo.isTrueOpponent ? 0 : defaultFees[0];
  const ofrDefaultFee = !ofrInfo.isTrueOpponent ? 0 : defaultFees[1];

  const isFeeDefault =
    (bidDefaultFee === bidInfo.pay || ((bidDefaultFee ?? 0) <= 0 && (bidInfo.pay ?? 0) <= 0)) &&
    (ofrDefaultFee === ofrInfo.pay || ((ofrDefaultFee ?? 0) <= 0 && (ofrInfo.pay ?? 0) <= 0));

  const getDetaultChannel = (inst?: BridgeInstInfo) => {
    if (inst == null) return undefined;

    // const isXintang = window.appConfig.channel.includes('xintang')
    // 暂时视为始终是信唐
    const isXintang = true;

    if (isXintang) return inst.channel;

    return {
      SH: BridgeChannel.ChannelFixedIncome,
      SZ: BridgeChannel.Bulk,
      IB: inst.channel
    }[bondInfo.code_market.slice(-2)];
  };

  // 子成交单默认渠道取bid方过桥机构的配置，bid方不是桥则取ofr方
  const ofrDefaultChannel = getDetaultChannel(bridgeInst);
  const bidDefaultChannel = bidInfo.isTrueOpponent
    ? getDetaultChannel(bridgeInst)
    : getDetaultChannel(
        bridgeInstList.find(i => i.contact_inst.inst_id === bidInfo.detail?.bid_trade_info.inst?.inst_id)
      );

  const isChannelDefault =
    ofrDefaultChannel != null &&
    ofrInfo.sendChannel === ofrDefaultChannel &&
    bidDefaultChannel != null &&
    bidInfo.sendChannel === bidDefaultChannel;

  const hasCommentOrInst =
    (bidInfo.sendComment != null && bidInfo.sendComment !== '') ||
    (ofrInfo.sendComment != null && ofrInfo.sendComment !== '') ||
    (bidInfo.orderInstList ?? []).length !== 0 ||
    (ofrInfo.orderInstList ?? []).length !== 0;

  return !isChannelDefault || hasCommentOrInst || !isFeeDefault;
};
