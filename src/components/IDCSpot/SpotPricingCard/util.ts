import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { formatDate } from '@fepkg/common/utils/date';
import { BondDeal, DealQuote, SpotPricingQuote, SpotPricingRecord } from '@fepkg/services/types/common';
import {
  BondDealStatus,
  BondQuoteType,
  DealType,
  LiquidationSpeedTag,
  ReceiverSide,
  Side
} from '@fepkg/services/types/enum';
import moment from 'moment';
import { SpotPricingDisplayRecord } from '@/pages/Spot/SpotPricingHint/types';
import { SpotPricingCardMessageStatus, SpotPricingCardStatus } from './types';

// 获取卡片内单条点价消息的状态
// 详见 SpotPricingCardMessageStatus
export const getCardMessageStatus = (message?: BondDeal) => {
  if (message == null) return SpotPricingCardMessageStatus.NoVolumn;

  const spotterStatus = message.spot_pricinger?.confirm_status;
  const quoterStatus = message.spot_pricingee?.confirm_status;
  const contractStatus = message.deal_status;

  if (contractStatus === BondDealStatus.DealConfirming && spotterStatus === BondDealStatus.DealConfirmed) {
    if (quoterStatus === BondDealStatus.DealAsking) return SpotPricingCardMessageStatus.QuoterAsking;
    return SpotPricingCardMessageStatus.ConfirmToBe;
  }

  if (contractStatus === BondDealStatus.DealConfirmed) {
    return SpotPricingCardMessageStatus.QuoterConfirmed;
  }

  if (contractStatus === BondDealStatus.DealRefuse) {
    if (quoterStatus === BondDealStatus.DealRefuse) {
      return SpotPricingCardMessageStatus.QuoterRefused;
    }

    return SpotPricingCardMessageStatus.SpotterRefused;
  }

  if (contractStatus === BondDealStatus.DealPartConfirmed) {
    return SpotPricingCardMessageStatus.SpotterConfirmed;
  }

  if (spotterStatus === BondDealStatus.DealAsking) return SpotPricingCardMessageStatus.SpotterAsking;

  return SpotPricingCardMessageStatus.QuoterPartialConfirmed;
};

// 获取卡片整体状态，用于决定卡片颜色
export const getCardStatus = (record?: SpotPricingDisplayRecord) => {
  if (record?.deal_list == null || record.deal_list?.length == 0) return SpotPricingCardStatus.NoVolumn;

  if (
    record.deal_list?.every(m =>
      [SpotPricingCardMessageStatus.ConfirmToBe, SpotPricingCardMessageStatus.QuoterAsking].includes(
        getCardMessageStatus(m)
      )
    )
  ) {
    return SpotPricingCardStatus.ConfirmToBe;
  }

  if (
    record.deal_list?.every(m => {
      const status = getCardMessageStatus(m);
      return [SpotPricingCardMessageStatus.QuoterRefused, SpotPricingCardMessageStatus.SpotterRefused].includes(status);
    })
  ) {
    return SpotPricingCardStatus.Refused;
  }

  if (record.deal_list?.every(m => getCardMessageStatus(m) === SpotPricingCardMessageStatus.QuoterConfirmed)) {
    return SpotPricingCardStatus.Confirmed;
  }

  if (
    record.deal_list?.every(m => {
      const status = getCardMessageStatus(m);

      return [SpotPricingCardMessageStatus.QuoterPartialConfirmed, SpotPricingCardMessageStatus.SpotterAsking].includes(
        status
      );
    })
  )
    return SpotPricingCardStatus.SpotterConfirmToBe;

  return SpotPricingCardStatus.PartialFinished;
};

// 获取卡片背景颜色
export const getBGTypeClasses = (status: SpotPricingCardStatus, isSingleMessage = false) => {
  const className = {
    [SpotPricingCardStatus.Confirmed]: 'bg-primary-700',
    [SpotPricingCardStatus.Refused]: 'bg-danger-700',
    [SpotPricingCardStatus.NoVolumn]: 'bg-gray-700'
  }[status];

  if (className != null) return className;

  if (status === SpotPricingCardStatus.PartialFinished && isSingleMessage) return 'bg-trd-700';

  return 'bg-auxiliary-700';
};

export const getLiquidationBySpotPricing = (deal?: BondDeal) => {
  const settlement = deal?.bid_settlement_type?.[0];
  if (settlement) {
    if (settlement.date == null) return settlement;
    const today = moment().startOf('day').valueOf();
    const tomorrow = moment(getNextTradedDate(today)).valueOf();

    const theDayAfterTomorrow = moment(Number(tomorrow)).add(1, 'day').valueOf();

    const tradedDate = Number(settlement.date);

    if (tradedDate >= today && tradedDate < tomorrow)
      return { tag: LiquidationSpeedTag.Today, offset: settlement.offset };
    if (tradedDate >= tomorrow && tradedDate < theDayAfterTomorrow)
      return { tag: LiquidationSpeedTag.Tomorrow, offset: settlement.offset };

    return settlement;
  }
  if (deal?.bid_traded_date == null || deal?.bid_delivery_date == null) return undefined;
  return getSettlement(deal.bid_traded_date, deal.bid_delivery_date);
};

// 组合每条点价内的点价方报价结构体
export const getSpotQuote = (card: SpotPricingRecord, message: BondDeal) => {
  const side = card.deal_type === DealType.GVN ? Side.SideBid : Side.SideOfr;
  const trader_info = {
    name_zh: card.spot_pricing_trader_info?.name_zh
  };

  const quote = card.spot_pricing_quote_list?.find(q => q.quote_id === message.quote_id);

  const liq = getLiquidationBySpotPricing(message);

  if (quote == null) {
    const { return_point } = message;
    const flag_rebate = return_point != null && return_point > 0;

    return {
      side,
      quote_price: card.spot_pricing_price,
      yield: card.spot_pricing_price,
      quote_type: BondQuoteType.Yield,
      flag_rebate,
      return_point,
      trader_info,
      volume: message?.spot_pricing_volume ?? card.spot_pricing_volume,
      liquidation_speed_list: liq ? [liq] : card.sp_liquidation_speed_list
    } as DealQuote;
  }

  const { flag_rebate, quote_type, return_point } = quote;

  return {
    side,
    quote_price: message.price,
    yield: message.price,
    clean_price: message.price,
    full_price: message.price,
    flag_rebate,
    return_point,
    quote_type,
    trader_info,
    volume: message?.spot_pricing_volume ?? card.spot_pricing_volume,
    liquidation_speed_list: liq ? [liq] : card.sp_liquidation_speed_list
  } as DealQuote;
};

// 组合被点价方报价结构体
export const getMessgeQuote = (card: SpotPricingDisplayRecord, quote: SpotPricingQuote, message: BondDeal) => {
  const spotPricingRecord = card.spot_pricing_record!;
  const side = spotPricingRecord.deal_type === DealType.GVN ? Side.SideBid : Side.SideOfr;
  const { price } = message;
  const trader_info = {
    name_zh: spotPricingRecord.spot_pricing_trader_info?.name_zh
  };

  const {
    flag_urgent,
    flag_request,
    flag_bilateral,
    flag_rebate,
    spread,
    quote_type,
    return_point,
    flag_indivisible,
    is_exercise,
    flag_exchange,
    flag_oco,
    flag_package,
    flag_star,
    flag_stock_exchange,
    flag_internal,
    exercise_manual
  } = quote;

  const result = {
    side,
    clean_price: price,
    quote_price: price,
    flag_rebate,
    return_point,
    quote_type,
    trader_info,
    volume: quote.quote_volume,
    liquidation_speed_list: quote.quote_liquidation_speed_list,
    full_price: price,
    spread,
    flag_urgent,
    flag_request,
    flag_bilateral,
    yield: price,
    flag_indivisible,
    is_exercise,
    flag_exchange,
    flag_oco,
    flag_package,
    flag_star,
    flag_stock_exchange,
    flag_internal,
    exercise_manual,
    comment: `${quote?.flag_bilateral ? '点双边' : ''}${quote?.flag_request ? '请求报价' : ''}${quote?.comment ?? ''}`
  } as DealQuote;

  return result;
};

// 卡片内的单条点价是否需要显示确认/拒绝按钮
export const getShowButtons = (messageStatus: SpotPricingCardMessageStatus, isSpotSelf: boolean) => {
  if (isSpotSelf) {
    return (
      messageStatus === SpotPricingCardMessageStatus.QuoterPartialConfirmed ||
      messageStatus === SpotPricingCardMessageStatus.SpotterAsking
    );
  }

  return (
    messageStatus === SpotPricingCardMessageStatus.ConfirmToBe ||
    messageStatus === SpotPricingCardMessageStatus.QuoterAsking
  );
};

// 卡片内是否是不显示的
// 若是，则不渲染，并在设为已读后自动关闭
export const getIsInvisible = (card: SpotPricingDisplayRecord, forceVisible = false) =>
  card.spot_pricing_record == null ||
  (card.deal_list?.every(d => {
    const status = getCardMessageStatus(d);

    const quote = card.spot_pricing_record?.spot_pricing_quote_list?.find(q => q.quote_id === d.quote_id);

    if (quote == null) return false;

    // 紧急报价即使是已确认也需要显示
    return (
      (status === SpotPricingCardMessageStatus.QuoterPartialConfirmed && !forceVisible) ||
      status === SpotPricingCardMessageStatus.SpotterConfirmed ||
      (status === SpotPricingCardMessageStatus.QuoterConfirmed &&
        !(quote.flag_urgent && card.receiverSide === ReceiverSide.SpotPricinger))
    );
  }) &&
    card.deal_list &&
    card.deal_list.length !== 0);
