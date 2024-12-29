import { OptionTypeMap } from '@fepkg/business/constants/map';
import { OptionType } from '@fepkg/services/types/bds-enum';
import {
  BondDetailSync,
  DealInfoSync,
  FiccBondBasic,
  InstSync,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  QuoteSync,
  RestDayToWorkday,
  TraderSync,
  UserSync
} from '@fepkg/services/types/common';
import {
  BondDetailDb,
  DealInfoDb,
  InstDb,
  QuoteDb,
  QuoteDraftDetailDb,
  QuoteDraftDetailSyncDBExp,
  QuoteDraftMessageDb,
  TraderDb,
  UserDb
} from '../../types';

export const isNumber = (n?: string) => !Number.isNaN(Number(n));

export function getKeywordParams(keyword: string) {
  return { precise: `${keyword}%`, fuzzy: `%${keyword}%` };
}

export const formatInstDb2InstSync = (inst: InstDb): InstSync => {
  return {
    ...inst,
    product_codes: JSON.parse(inst.product_codes),
    product_short_name_set: JSON.parse(inst.product_short_name_set)
  };
};

export const formatQuoteDb2QuoteSync = (quote: QuoteDb): Required<QuoteSync> => {
  return {
    ...quote,
    flag_rebate: !!quote.flag_rebate,
    liquidation_speed_list: JSON.parse(quote.liquidation_speed_list),
    flag_urgent: !!quote.flag_urgent,
    flag_package: !!quote.flag_package,
    flag_oco: !!quote.flag_oco,
    flag_exchange: !!quote.flag_exchange,
    flag_stock_exchange: !!quote.flag_stock_exchange,
    is_exercise: !!quote.is_exercise,
    flag_intention: !!quote.flag_intention,
    flag_indivisible: !!quote.flag_indivisible,
    flag_stc: !!quote.flag_stc,
    flag_internal: !!quote.flag_internal,
    flag_request: !!quote.flag_request,
    flag_bilateral: !!quote.flag_bilateral,
    exercise_manual: !!quote.exercise_manual,
    deal_liquidation_speed_list: JSON.parse(quote.deal_liquidation_speed_list)
  };
};

export const formatTraderDb2TraderSync = (trader: TraderDb): Required<TraderSync> => {
  return {
    ...trader,
    qq: JSON.parse(trader.qq),
    product_codes: JSON.parse(trader.product_codes),
    tags: JSON.parse(trader.tags),
    broker_ids: JSON.parse(trader.broker_ids),
    white_list: JSON.parse(trader.white_list),
    product_marks: JSON.parse(trader.product_marks),
    default_broker_list: JSON.parse(trader.default_broker_list)
  };
};

export const formatUserDb2UserSync = (user: UserDb): UserSync => {
  return {
    ...user,
    product_codes: JSON.parse(user.product_codes)
  };
};

export const formatQuoteDraftDetailDb2QuoteDraftDetailSync = (
  detail: QuoteDraftDetailDb
): Required<QuoteDraftDetailSync & QuoteDraftDetailSyncDBExp> => {
  return {
    ...detail,
    flag_rebate: !!detail.flag_rebate,
    flag_package: !!detail.flag_package,
    flag_oco: !!detail.flag_oco,
    flag_exchange: !!detail.flag_exchange,
    flag_intention: !!detail.flag_intention,
    flag_indivisible: !!detail.flag_indivisible,
    flag_stock_exchange: !!detail.flag_stock_exchange,
    flag_bilateral: !!detail.flag_bilateral,
    flag_request: !!detail.flag_request,
    flag_urgent: !!detail.flag_urgent,
    flag_internal: !!detail.flag_internal,
    flag_recommend: !!detail.flag_recommend,
    liquidation_speed_list: JSON.parse(detail.liquidation_speed_list),
    is_exercise: !!detail.is_exercise,
    exercise_manual: !!detail.exercise_manual,
    flag_inverted: !!detail.flag_inverted
  };
};

export const formatQuoteDraftMessageDb2QuoteDraftMessageSync = (
  message: QuoteDraftMessageDb
): Required<QuoteDraftMessageSync> => {
  return {
    ...message,
    detail_order_list: JSON.parse(message.detail_order_list),
    text_list: JSON.parse(message.text_list)
  };
};

export const formatDealInfoDb2DealInfoSync = (dealInfo: DealInfoDb): Required<DealInfoSync> => {
  return {
    ...dealInfo,
    flag_bridge: !!dealInfo.flag_bridge,
    bid_settlement_type: dealInfo.bid_settlement_type ? JSON.parse(dealInfo.bid_settlement_type) : void 0,
    ofr_settlement_type: dealInfo.ofr_settlement_type ? JSON.parse(dealInfo.ofr_settlement_type) : void 0,
    flag_stock_exchange: !!dealInfo.flag_stock_exchange,
    flag_bid_modify_brokerage: !!dealInfo.flag_bid_modify_brokerage,
    flag_ofr_modify_brokerage: !!dealInfo.flag_ofr_modify_brokerage,
    flag_internal: !!dealInfo.flag_internal,
    bid_old_content: JSON.parse(dealInfo.bid_old_content),
    ofr_old_content: JSON.parse(dealInfo.ofr_old_content),
    exercise_manual: !!dealInfo.exercise_manual,
    flag_bid_bridge_hide_comment: !!dealInfo.flag_bid_bridge_hide_comment,
    flag_ofr_bridge_hide_comment: !!dealInfo.flag_ofr_bridge_hide_comment,
    flag_bid_pay_for_inst: !!dealInfo.flag_bid_pay_for_inst,
    flag_ofr_pay_for_inst: !!dealInfo.flag_ofr_pay_for_inst,
    flag_reverse_sync: !!dealInfo.flag_reverse_sync,
    flag_unrefer_quote: !!dealInfo.flag_unrefer_quote,
    flag_deal_has_changed: !!dealInfo.flag_deal_has_changed,
    bridge_list: dealInfo.bridge_list ? JSON.parse(dealInfo.bridge_list) : [],
    default_bridge_config: {},
    child_deal_list: []
  };
};

export const formatBondDetailDb2BondDetailSync = (bond: Partial<BondDetailDb>): Partial<BondDetailSync> => {
  return {
    ...bond,
    has_option: !!bond.has_option,
    maturity_is_holiday: !!bond.maturity_is_holiday,
    is_cross_mkt: !!bond.is_cross_mkt,
    with_warranty: !!bond.with_warranty,
    is_fixed_rate: !!bond.is_fixed_rate
  };
};

// FIXME: 有部分字段后端暂未提供，待修复
// const bondTimeToMaturityFrom = (bond: BondDetailDb | undefined) => {
//   const { interest_start_date, maturity_date, option_date, first_maturity_date } = bond ?? {};
//   if (!bond || !interest_start_date || !maturity_date) return bond;
//   let startDate = moment().startOf('day');
//   if (!moment(maturity_date).isAfter(startDate)) return bond;
//   const exerciseDateSet = new Set<string>();
//   if (moment(interest_start_date).isAfter(startDate)) {
//     startDate = moment(interest_start_date);
//   }
//   if (option_date && moment(option_date).isAfter(startDate)) {
//     // 第一段行权日是否有效
//     exerciseDateSet.add(moment(option_date).format());
//   }
//   if (moment(maturity_date).isAfter(startDate)) {
//     exerciseDateSet.add(moment(maturity_date).format());
//   }
//
//   //   if param.PutStr != nil { // 回售日
//   //     putDates := str2ExerciseDateStrs(*param.PutStr)
//   //     exerciseDateStrs = util.MergeTwoOrderedList(exerciseDateStrs, putDates)
//   //  }
//   //  if param.CallStr != nil { // 赎回日
//   //     callDates := str2ExerciseDateStrs(*param.CallStr)
//   //     exerciseDateStrs = util.MergeTwoOrderedList(exerciseDateStrs, callDates)
//   //  }

//   for (const curExerciseDate of exerciseDateSet) {
//     if (moment(curExerciseDate).valueOf() - startDate.valueOf() <= 0) {
//       continue;
//     }
//     // year, month, day := yearsBetweenTwoDates(startDatePtr, endDatePtr), monthsBetweenTwoDates(startDatePtr, endDatePtr), endDatePtr.Sub(*startDatePtr).Hours()/dayHours
//     // res.Years = append(res.Years, year)
//     // res.Months = append(res.Months, month)
//     // res.Days = append(res.Days, int32(day))
//     if (first_maturity_date === '0') {
//       bond.first_maturity_date = curExerciseDate;
//       // i.time_to_maturity = formatTime2Maturity(year, day, true);
//     } else {
//       // i.time_to_maturity = fmt.Sprintf("%s+%s", res.TimeToMaturity, formatTime2Maturity(year, day, false))
//     }
//     startDate = moment(curExerciseDate);

//     console.log(curExerciseDate);
//   }
//   if (exerciseDateSet.size > 0 && bond.option_type === OptionType.ETS) {
//     // i.time_to_maturity = fmt.Sprintf("%s+N", res.TimeToMaturity)
//   }

//   return bond;
// };

export const formatBondDetailDb2BondLite = (
  bond: BondDetailDb,
  rest_day_to_workday?: RestDayToWorkday
): FiccBondBasic => {
  // bond = bondTimeToMaturityFrom(bond);

  const {
    option_type,
    has_option,
    maturity_is_holiday,
    is_cross_mkt,
    with_warranty,
    is_fixed_rate,
    val_clean_price_exercise,
    val_yield_exercise,
    csi_clean_price_exercise,
    csi_full_price_exercise,
    csi_yield_exercise,
    val_clean_price_maturity,
    val_yield_maturity,
    csi_clean_price_maturity,
    csi_full_price_maturity,
    csi_yield_maturity,
    ...otherProps
  } = bond;
  return {
    ...otherProps,
    option_type: OptionTypeMap[option_type as OptionType],
    has_option: !!has_option,
    maturity_is_holiday: !!maturity_is_holiday,
    is_cross_mkt: !!is_cross_mkt,
    with_warranty: !!with_warranty,
    is_fixed_rate: !!is_fixed_rate,
    val_clean_price_exe: val_clean_price_exercise,
    val_yield_exe: val_yield_exercise,
    csi_clean_price_exe: csi_clean_price_exercise,
    csi_full_price_exe: csi_full_price_exercise,
    csi_yield_exe: csi_yield_exercise,
    val_clean_price_mat: val_clean_price_maturity,
    val_yield_mat: val_yield_maturity,
    csi_clean_price_mat: csi_clean_price_maturity,
    csi_full_price_mat: csi_full_price_maturity,
    csi_yield_mat: csi_yield_maturity,
    cbc_rating: '',
    rest_day_to_workday
  };
};
