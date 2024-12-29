import { getDefaultExerciseType } from '@fepkg/business/utils/bond';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import {
  BondQuoteType,
  Direction,
  ExerciseType,
  ReceiptDealTradeInstBrokerageComment,
  Side
} from '@fepkg/services/types/bds-enum';
import { DealParsing } from '@fepkg/services/types/parsing/deal-info';
import type { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { liqSpeedListAddMoments } from '@/common/utils/liq-speed';
import { formatPrice } from '@/components/IDCBoard/utils';
import { miscStorage } from '@/localdb/miscStorage';
import { noExerciseSettlementProductTypeSet } from '../../ReceiptDealForm/constants';

export type ReceiptDealMulAddErrorInfo = Omit<ReceiptDealMulAdd.Response, 'base_response'>;

export const getCPOfrContent = (dealParsing: DealParsing) => {
  let str = dealParsing.ofr_inst?.short_name_zh ?? '';
  if (dealParsing.ofr_trader?.name_zh) {
    str += `(${dealParsing.ofr_trader.name_zh})`;
  }
  return str;
};

export const getCPBidContent = (dealParsing: DealParsing) => {
  let str = dealParsing.bid_inst?.short_name_zh ?? '';
  if (dealParsing.bid_trader?.name_zh) {
    str += `(${dealParsing.bid_trader.name_zh})`;
  }
  return str;
};

export const getFirstErrorItem = (
  dealList: ReceiptDealMulAdd.CreateReceiptDeal[],
  errorInfo: ReceiptDealMulAddErrorInfo
) => {
  const { illegal_broker_list, illegal_trader_list, illegal_inst_list, illegal_line_id_list } = errorInfo;

  return dealList.findIndex(i => {
    const { line_id, bid_trade_info, ofr_trade_info } = i;
    const { broker_id: bidBroker, trader_id: bidTrader, inst_id: bidInst } = bid_trade_info || {};
    const { broker_id: ofrBroker, trader_id: ofrTrader, inst_id: ofrInst } = ofr_trade_info || {};

    return (
      (line_id && illegal_line_id_list?.includes(line_id)) ||
      (bidBroker && illegal_broker_list?.includes(bidBroker)) ||
      (bidTrader && illegal_trader_list?.includes(bidTrader)) ||
      (bidInst && illegal_inst_list?.includes(bidInst)) ||
      (ofrBroker && illegal_broker_list?.includes(ofrBroker)) ||
      (ofrTrader && illegal_trader_list?.includes(ofrTrader)) ||
      (ofrInst && illegal_inst_list?.includes(ofrInst))
    );
  });
};

export const formatReceiptDealFromParsing = async (
  parsingResult: DealParsing[],
  productType: ProductType,
  sendMarket?: boolean
): Promise<ReceiptDealMulAdd.CreateReceiptDeal[]> => {
  const user_id = miscStorage.userInfo?.user_id;
  const result: ReceiptDealMulAdd.CreateReceiptDeal[] = [];

  for await (const value of parsingResult) {
    const {
      bond_basic,
      price_type,
      volume,
      bid_inst,
      bid_broker,
      bid_trader,
      ofr_inst,
      ofr_trader,
      return_point,
      liquidation_speed_list
    } = value;
    const liqSpeedWithMoments = await liqSpeedListAddMoments(liquidation_speed_list ?? []);

    const tradedDate = liqSpeedWithMoments?.[0]?.tradedDate?.valueOf().toString();
    const deliveryDate = liqSpeedWithMoments?.[0]?.deliveryDate?.valueOf().toString();

    const bondKeyMarket = bond_basic?.key_market ?? '';
    const priceType = price_type ?? BondQuoteType.CleanPrice;
    const isExercise = noExerciseSettlementProductTypeSet.has(productType)
      ? getDefaultExerciseType(productType, priceType)
      : ExerciseType.ExerciseTypeNone;

    const bidTradeInfo: ReceiptDealTradeOp = {
      flag_bridge: false,
      flag_nc: false,
      inst_id: bid_inst?.inst_id,
      city: bid_inst?.district_name,
      broker_id: bid_broker?.broker_id,
      broker_percent: 100,
      trader_id: bid_trader?.trader_id,
      trader_tag: bid_trader?.trader_tag,
      inst_brokerage_comment: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage,
      traded_date: tradedDate,
      delivery_date: deliveryDate
    };

    const ofrTradeInfo: ReceiptDealTradeOp = {
      flag_bridge: false,
      flag_nc: false,
      inst_id: ofr_inst?.inst_id,
      city: ofr_inst?.district_name,
      broker_id: user_id,
      broker_percent: 100,
      trader_id: ofr_trader?.trader_id,
      trader_tag: ofr_trader?.trader_tag,
      inst_brokerage_comment: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage,
      traded_date: tradedDate,
      delivery_date: deliveryDate
    };

    result.push({
      line_id: value.line_id,
      volume,
      return_point,
      flag_rebate: !!return_point,
      price: Number(formatPrice(value.price ?? 0)),
      direction: Direction.DirectionTrd,
      bond_key_market: bondKeyMarket,
      price_type: priceType,
      bid_trade_info: bidTradeInfo,
      ofr_trade_info: ofrTradeInfo,
      flag_send_market: sendMarket,
      deal_time: Date.now().toString(),
      is_exercise: isExercise,
      diff_settlement_type: Side.SideBid
    });
  }

  return result;
};
