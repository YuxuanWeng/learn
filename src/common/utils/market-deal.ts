import { getDefaultDeliveryDate, getNextTradedDate, withToday } from '@fepkg/business/hooks/useDealDateMutation';
import { formatNumber2ServerNil } from '@fepkg/business/utils/price';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { FiccBondBasic, LiquidationSpeed, MarketDeal, MarketDealCreate, QuoteLite } from '@fepkg/services/types/common';
import {
  LiquidationSpeedTag,
  MarketDealLastActionType,
  OperationSource,
  ProductType,
  Side
} from '@fepkg/services/types/enum';
import moment from 'moment';
import { getCommentFlagLabel, getCommentTagLabel } from '@/components/Quote/utils';
import { miscStorage } from '@/localdb/miscStorage';
import { side2Direction } from '@/pages/Deal/Market/MarketDealForm/utils';
import { calcTradeAndDeliDays, formatLiquidationSpeedListToString } from './liq-speed';

/** 获取交易日与交割日信息 */
const getDates = async (tradeDateRange: string[], quote?: QuoteLite) => {
  let traded_date: string;
  let delivery_date: string;
  let liquidation_speed: LiquidationSpeed;

  let listedDate = quote?.bond_basic_info?.listed_date;
  if (listedDate) {
    const listedTime = moment(normalizeTimestamp(listedDate));
    if (!listedTime.isAfter(moment().startOf('day'))) {
      listedDate = void 0;
    }
  }

  if (
    quote?.liquidation_speed_list?.length === 1 &&
    quote.liquidation_speed_list[0]?.tag &&
    quote.liquidation_speed_list[0].tag !== LiquidationSpeedTag.Default
  ) {
    // 清算方式仅一条且不为默认
    [liquidation_speed] = quote.liquidation_speed_list;
    const { tradedDate, deliveryDate } = await calcTradeAndDeliDays(
      liquidation_speed?.tag ?? LiquidationSpeedTag.Today,
      liquidation_speed.offset,
      listedDate
    );
    traded_date = formatDate(tradedDate);
    delivery_date = formatDate(deliveryDate);
  } else if (quote?.liquidation_speed_list?.length === 1 && quote.liquidation_speed_list[0]?.date) {
    // 清算速度为T+N
    [liquidation_speed] = quote.liquidation_speed_list;
    traded_date = formatDate(liquidation_speed.date);
    if (liquidation_speed.offset === 0) {
      delivery_date = traded_date;
    } else {
      delivery_date = getNextTradedDate(traded_date);
    }
  } else {
    // 若选中的报价无清算方式或有多种清算方式，则以各产品的默认交割方式进行计算；
    traded_date = getNextTradedDate(listedDate, listedDate ? true : withToday(miscStorage.productType));
    delivery_date = getDefaultDeliveryDate(traded_date, miscStorage.productType);

    switch (miscStorage.productType) {
      case ProductType.BCO:
        // 信用债默认明天+0
        liquidation_speed = { tag: LiquidationSpeedTag.Tomorrow, offset: 0 };
        break;
      case ProductType.NCD:
        // 存单二级默认今天+0
        liquidation_speed = { tag: LiquidationSpeedTag.Today, offset: 0 };
        break;
      default:
        // 利率债默认+1
        liquidation_speed = { tag: LiquidationSpeedTag.Today, offset: 1 };
        break;
    }
  }
  return { traded_date, delivery_date, liquidation_speed_list: [liquidation_speed] };
};

function getQuoteComment(quote?: QuoteLite) {
  const liqSpeed = formatLiquidationSpeedListToString(quote?.liquidation_speed_list ?? [], 'MM.DD');
  const commentFlagLabel = getCommentFlagLabel(quote);
  const delivery = [liqSpeed, commentFlagLabel].filter(s => !!s).join(';');
  const tagComment = getCommentTagLabel(quote);
  const comment = [delivery, quote?.comment, tagComment].filter(s => !!s).join(' ');
  return comment;
}

export async function transform2MarketDealCreate(
  quote: QuoteLite,
  tradeDateRange: string[],
  isSyncReceiptDeal?: boolean,
  operator_id?: string
): Promise<MarketDealCreate> {
  const { traded_date, delivery_date, liquidation_speed_list } = await getDates(tradeDateRange, quote);
  const params = {
    key_market: quote.bond_key_market,
    quote_id: quote.quote_id,
    deal_time: moment().valueOf().toString(),
    traded_date,
    delivery_date,
    direction: side2Direction(quote?.side),
    price: quote.quote_price,
    price_type: quote.quote_type,
    return_point: quote.return_point,
    volume: quote.volume < 0 ? 0 : quote.volume,
    is_exercise: quote.is_exercise,
    flag_rebate: quote.flag_rebate,
    flag_internal: quote.flag_internal,
    source: OperationSource.OperationSourceBdsIdb,
    product_type: quote.product_type,
    comment: getQuoteComment(quote),
    liquidation_speed_list,
    comment_flag_bridge: false,
    comment_flag_pay_for: false,
    bid_institution_id: quote.side === Side.SideBid ? quote.inst_id : undefined,
    bid_trader_id: quote.side === Side.SideBid ? quote.trader_id : undefined,
    bid_broker_id: quote.side === Side.SideBid ? quote.broker_id : operator_id,
    bid_broker_percent: 100,
    bid_trader_tag: quote.side === Side.SideBid ? quote.trader_info?.trader_tag : undefined,
    ofr_institution_id: quote.side === Side.SideOfr ? quote.inst_id : undefined,
    ofr_trader_id: quote.side === Side.SideOfr ? quote.trader_id : undefined,
    ofr_broker_id: quote.side === Side.SideOfr ? quote.broker_id : operator_id,
    ofr_broker_percent: 100,
    ofr_trader_tag: quote.side === Side.SideOfr ? quote.trader_info?.trader_tag : undefined,
    last_action_type: MarketDealLastActionType.GvnTkn,
    exercise_manual: quote?.exercise_manual,
    is_sync_receipt_deal: isSyncReceiptDeal
  };

  formatNumber2ServerNil(params);

  return params;
}

export const transform2MarketDeal = async (
  tradeDateRange: string[],
  bond?: FiccBondBasic,
  quote?: QuoteLite
): Promise<Partial<MarketDeal>> => {
  const { traded_date, delivery_date, liquidation_speed_list } = await getDates(tradeDateRange, quote);

  const params = {
    key_market: bond?.key_market,
    bond_basic_info: bond,
    traded_date,
    delivery_date,
    direction: side2Direction(quote?.side),
    price: quote?.quote_price,
    price_type: quote?.quote_type,
    return_point: quote?.return_point,
    volume: !!quote?.volume && quote.volume < 0 ? 0 : quote?.volume,
    is_exercise: quote?.is_exercise,
    flag_rebate: quote?.flag_rebate,
    flag_internal: quote?.flag_internal,
    source: OperationSource.OperationSourceBdsIdb,
    product_type: quote?.product_type,
    comment: getQuoteComment(quote),
    liquidation_speed_list,
    bid_institution_id: quote?.side === Side.SideBid ? quote.inst_id : undefined,
    bid_institution_name: quote?.side === Side.SideBid ? quote.inst_info?.short_name_zh : undefined,
    bid_trader_id: quote?.side === Side.SideBid ? quote.trader_id : undefined,
    bid_trader_name: quote?.side === Side.SideBid ? quote.trader_info?.name_zh : undefined,
    bid_trader_tag: quote?.side === Side.SideBid ? quote?.trader_info?.trader_tag : undefined,
    bid_broker_id: quote?.side === Side.SideBid ? quote?.broker_id : undefined,
    bid_broker_name: quote?.side === Side.SideBid ? quote?.broker_info?.name_zh : undefined,
    ofr_institution_id: quote?.side === Side.SideOfr ? quote.inst_id : undefined,
    ofr_institution_name: quote?.side === Side.SideOfr ? quote.inst_info?.short_name_zh : undefined,
    ofr_trader_id: quote?.side === Side.SideOfr ? quote.trader_id : undefined,
    ofr_trader_name: quote?.side === Side.SideOfr ? quote.trader_info?.name_zh : undefined,
    ofr_trader_tag: quote?.side === Side.SideOfr ? quote?.trader_info?.trader_tag : undefined,
    ofr_broker_id: quote?.side === Side.SideOfr ? quote?.broker_id : undefined,
    ofr_broker_name: quote?.side === Side.SideOfr ? quote?.broker_info?.name_zh : undefined,
    last_action_type: MarketDealLastActionType.Others,
    exercise_manual: quote?.exercise_manual
  };

  formatNumber2ServerNil(params);

  return params;
};
