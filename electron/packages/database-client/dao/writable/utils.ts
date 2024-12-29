import { SERVER_NIL } from '@fepkg/common/constants';
import {
  BondDetailSync,
  DealInfoSync,
  FiccBondBasic,
  HolidaySync,
  InstSync,
  LiquidationSpeed,
  QuoteDraftDetailOrder,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  QuoteSync,
  TraderSync,
  UserSync
} from '@fepkg/services/types/common';
import {
  BondDetailDb,
  DealInfoDb,
  HolidayDb,
  InstDb,
  QuoteDb,
  QuoteDraftDetailDb,
  QuoteDraftDetailSyncDBExp,
  QuoteDraftMessageDb,
  TraderDb,
  UserDb
} from '../../types';

const boolean2tinyint = (value?: boolean): number => (value ? 1 : 0);
const enum2tinyint = (value?: number): number => value ?? 0;

export const getInstUpsertParams = (inst: Partial<InstSync>): InstDb => {
  return {
    inst_id: inst.inst_id ?? '',
    standard_code: inst.standard_code ?? '',
    inst_type: inst.inst_type ?? '',
    short_name_zh: inst.short_name_zh ?? '',
    full_name_zh: inst.full_name_zh ?? '',
    short_name_en: inst.short_name_en ?? '',
    full_name_en: inst.full_name_en ?? '',
    pinyin: inst.pinyin ?? '',
    pinyin_full: inst.pinyin_full ?? '',
    product_codes: JSON.stringify(inst.product_codes ?? []),
    product_short_name_set: JSON.stringify(inst.product_short_name_set ?? []),
    enable: enum2tinyint(inst.enable),
    sync_version: inst.sync_version ?? '',
    update_time: inst.update_time ?? '',
    district_id: inst.district_id ?? '',
    district_name: inst.district_name ?? '',
    inst_status: enum2tinyint(inst.inst_status),
    usage_status: enum2tinyint(inst.usage_status)
  };
};

export const getInstDeleteParams = (inst: Partial<InstSync>): Pick<InstDb, 'inst_id' | 'sync_version'> => {
  return {
    inst_id: inst.inst_id ?? '',
    sync_version: inst.sync_version ?? ''
  };
};

// 由于protobuf传输的原因，offset有可能为空值，此处补全liqSpeedList中的offset字段
const formatLiquidationSpeedList = (liqSpeedList: LiquidationSpeed[]): string => {
  for (const liqSpeed of liqSpeedList) {
    if (!Object.prototype.hasOwnProperty.call(liqSpeed, 'offset')) {
      liqSpeed.offset = 0;
    }
  }
  return JSON.stringify(liqSpeedList);
};

const formatLiquidationSpeed = (liqSpeed: LiquidationSpeed): string => {
  if (!Object.prototype.hasOwnProperty.call(liqSpeed, 'offset')) {
    liqSpeed.offset = 0;
  }
  return JSON.stringify(liqSpeed);
};

export const getQuoteUpsertParams = (quote: Partial<QuoteSync>): QuoteDb => {
  return {
    quote_id: quote.quote_id ?? '',
    bond_key_market: quote.bond_key_market ?? '',
    update_time: quote.update_time ?? '',
    create_time: quote.create_time ?? '',
    product_type: enum2tinyint(quote.product_type),
    volume: quote.volume ?? SERVER_NIL,
    yield: quote.yield ?? SERVER_NIL,
    clean_price: quote.clean_price ?? SERVER_NIL,
    full_price: quote.full_price ?? SERVER_NIL,
    return_point: quote.return_point ?? SERVER_NIL,
    flag_rebate: boolean2tinyint(quote.flag_rebate),
    side: quote.side ?? 0,
    quote_type: enum2tinyint(quote.quote_type),
    liquidation_speed_list: formatLiquidationSpeedList(quote.liquidation_speed_list ?? []),
    inst_id: quote.inst_id ?? '',
    trader_id: quote.trader_id ?? '',
    broker_id: quote.broker_id ?? '',
    operator: quote.operator ?? '',
    flag_urgent: boolean2tinyint(quote.flag_urgent),
    flag_star: quote.flag_star ?? 0,
    flag_package: boolean2tinyint(quote.flag_package),
    flag_oco: boolean2tinyint(quote.flag_oco),
    flag_exchange: boolean2tinyint(quote.flag_exchange),
    flag_stock_exchange: boolean2tinyint(quote.flag_stock_exchange),
    is_exercise: boolean2tinyint(quote.is_exercise),
    flag_intention: boolean2tinyint(quote.flag_intention),
    flag_indivisible: boolean2tinyint(quote.flag_indivisible),
    flag_stc: boolean2tinyint(quote.flag_stc),
    comment: quote.comment ?? '',
    sync_version: quote.sync_version ?? '',
    flag_internal: boolean2tinyint(quote.flag_internal),
    spread: quote.spread ?? SERVER_NIL,
    quote_price: quote.quote_price ?? SERVER_NIL,
    flag_request: boolean2tinyint(quote.flag_request),
    flag_bilateral: boolean2tinyint(quote.flag_bilateral),
    enable: enum2tinyint(quote.enable),
    trader_tag: quote.trader_tag ?? '',
    exercise_manual: boolean2tinyint(quote.exercise_manual),
    deal_liquidation_speed_list: formatLiquidationSpeedList(quote.deal_liquidation_speed_list ?? [])
  };
};

export const getQuoteDeleteParams = (quote: Partial<QuoteSync>): Pick<QuoteDb, 'quote_id' | 'sync_version'> => {
  return {
    quote_id: quote.quote_id ?? '',
    sync_version: quote.sync_version ?? ''
  };
};

export const getTraderUpsertParams = (trader: Partial<TraderSync>): TraderDb => {
  return {
    trader_id: trader.trader_id ?? '',
    name_zh: trader.name_zh ?? '',
    pinyin: trader.pinyin ?? '',
    pinyin_full: trader.pinyin_full ?? '',
    name_en: trader.name_en ?? '',
    code: trader.code ?? '',
    department: trader.department ?? '',
    position: trader.position ?? '',
    qq: JSON.stringify(trader.qq ?? []),
    product_codes: JSON.stringify(trader.product_codes ?? []),
    tags: JSON.stringify(trader.tags ?? []),
    inst_id: trader.inst_id ?? '',
    broker_ids: JSON.stringify(trader.broker_ids ?? []),
    qm_account: trader.qm_account ?? '',
    white_list: JSON.stringify(trader.white_list ?? []),
    update_time: trader.update_time ?? '',
    product_marks: JSON.stringify(trader.product_marks ?? []),
    default_broker_list: JSON.stringify(trader.default_broker_list ?? []),
    sync_version: trader.sync_version ?? '',
    enable: enum2tinyint(trader.enable),
    job_status: enum2tinyint(trader.job_status),
    usage_status: enum2tinyint(trader.usage_status)
  };
};

export const getTraderDeleteParams = (trader: Partial<TraderSync>): Pick<TraderDb, 'trader_id' | 'sync_version'> => {
  return {
    trader_id: trader.trader_id ?? '',
    sync_version: trader.sync_version ?? ''
  };
};

export const getUserUpsertParams = (user: Partial<UserSync>): UserDb => {
  return {
    user_id: user.user_id ?? '',
    name_cn: user.name_cn ?? '',
    name_en: user.name_en ?? '',
    account: user.account ?? '',
    post: enum2tinyint(user.post),
    qq: user.qq ?? '',
    qm_account: user.qm_account ?? '',
    product_codes: JSON.stringify(user.product_codes ?? []),
    pinyin: user.pinyin ?? '',
    pinyin_full: user.pinyin_full ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    telephone: user.telephone ?? '',
    job_num: user.job_num ?? '',
    enable: enum2tinyint(user.enable),
    sync_version: user.sync_version ?? '',
    update_time: user.update_time ?? '',
    job_status: enum2tinyint(user.job_status),
    account_status: enum2tinyint(user.account_status)
  };
};

export const getUserDeleteParams = (user: Partial<UserSync>): Pick<UserDb, 'user_id' | 'sync_version'> => {
  return {
    user_id: user.user_id ?? '',
    sync_version: user.sync_version ?? ''
  };
};

export const getHolidayUpsertParams = (holiday: Partial<HolidaySync>): HolidayDb => {
  return {
    holiday_id: holiday.holiday_id ?? '',
    enable: enum2tinyint(holiday.enable),
    update_time: holiday.update_time ?? '',
    sync_version: holiday.sync_version ?? '',
    holiday_date: holiday.holiday_date ?? '',
    country: holiday.country ?? '',
    market_type: holiday.market_type ?? '',
    holiday_name: holiday.holiday_name ?? ''
  };
};

export const getHolidayDeleteParams = (
  holiday: Partial<HolidaySync>
): Pick<HolidayDb, 'holiday_id' | 'sync_version'> => {
  return {
    holiday_id: holiday.holiday_id ?? '',
    sync_version: holiday.sync_version ?? ''
  };
};

export const getQuoteDraftDetailUpsertParams = (
  quoteDraftDetail: Partial<QuoteDraftDetailSync & QuoteDraftDetailSyncDBExp>
): QuoteDraftDetailDb => {
  return {
    detail_id: quoteDraftDetail.detail_id ?? '',
    message_id: quoteDraftDetail.message_id ?? '',
    corresponding_line: quoteDraftDetail.corresponding_line ?? 0,
    side: quoteDraftDetail.side ?? 0,
    key_market: quoteDraftDetail.key_market ?? '',
    quote_type: enum2tinyint(quoteDraftDetail.quote_type),
    price: quoteDraftDetail.price ?? SERVER_NIL,
    volume: quoteDraftDetail.volume ?? SERVER_NIL,
    return_point: quoteDraftDetail.return_point ?? SERVER_NIL,
    flag_rebate: boolean2tinyint(quoteDraftDetail.flag_rebate),
    flag_star: quoteDraftDetail.flag_star ?? 0,
    flag_package: boolean2tinyint(quoteDraftDetail.flag_package),
    flag_oco: boolean2tinyint(quoteDraftDetail.flag_oco),
    flag_exchange: boolean2tinyint(quoteDraftDetail.flag_exchange),
    flag_intention: boolean2tinyint(quoteDraftDetail.flag_intention),
    flag_indivisible: boolean2tinyint(quoteDraftDetail.flag_indivisible),
    flag_stock_exchange: boolean2tinyint(quoteDraftDetail.flag_stock_exchange),
    flag_bilateral: boolean2tinyint(quoteDraftDetail.flag_bilateral),
    flag_request: boolean2tinyint(quoteDraftDetail.flag_request),
    flag_urgent: boolean2tinyint(quoteDraftDetail.flag_urgent),
    flag_internal: boolean2tinyint(quoteDraftDetail.flag_internal),
    flag_recommend: boolean2tinyint(quoteDraftDetail.flag_recommend),
    liquidation_speed_list: formatLiquidationSpeedList(quoteDraftDetail.liquidation_speed_list ?? []),
    comment: quoteDraftDetail.comment ?? '',
    is_exercise: boolean2tinyint(quoteDraftDetail.is_exercise),
    exercise_manual: boolean2tinyint(quoteDraftDetail.exercise_manual),
    status: enum2tinyint(quoteDraftDetail.status),
    creator: quoteDraftDetail.creator ?? '',
    operator: quoteDraftDetail.operator ?? '',
    sync_version: quoteDraftDetail.sync_version ?? '',
    enable: enum2tinyint(quoteDraftDetail.enable),
    create_time: quoteDraftDetail.create_time ?? '',
    update_time: quoteDraftDetail.update_time ?? '',
    product_type: enum2tinyint(quoteDraftDetail.product_type),
    flag_inverted: boolean2tinyint(quoteDraftDetail.flag_inverted),
    former_detail_id: quoteDraftDetail.former_detail_id ?? ''
  };
};

export const getQuoteDraftDetailDeleteParams = (
  quoteDraftDetail: Partial<QuoteDraftDetailSync>
): Pick<QuoteDraftDetailSync, 'detail_id' | 'sync_version'> => {
  return {
    detail_id: quoteDraftDetail.detail_id ?? '',
    sync_version: quoteDraftDetail.sync_version ?? ''
  };
};

// 由于protobuf传输的原因，offset有可能为空值，此处补全liqSpeedList中的offset字段
export const formatDetailOrderList = (detailOrderList: QuoteDraftDetailOrder[]): string => {
  for (const detailOrder of detailOrderList) {
    if (!Object.prototype.hasOwnProperty.call(detailOrder, 'corresponding_line')) {
      detailOrder.corresponding_line = 0;
    }
  }
  return JSON.stringify(detailOrderList);
};

export const getQuoteDraftMessageUpsertParams = (
  quoteDraftMessage: Partial<QuoteDraftMessageSync>
): QuoteDraftMessageDb => {
  return {
    message_id: quoteDraftMessage.message_id ?? '',
    create_time: quoteDraftMessage.create_time ?? '',
    update_time: quoteDraftMessage.update_time ?? '',
    inst_id: quoteDraftMessage.inst_id ?? '',
    trader_id: quoteDraftMessage.trader_id ?? '',
    broker_id: quoteDraftMessage.broker_id ?? '',
    text_list: JSON.stringify(quoteDraftMessage.text_list ?? []),
    img_url: quoteDraftMessage.img_url ?? '',
    creator: quoteDraftMessage.creator ?? '',
    operator: quoteDraftMessage.operator ?? '',
    trader_tag: quoteDraftMessage.trader_tag ?? '',
    sync_version: quoteDraftMessage.sync_version ?? '',
    enable: enum2tinyint(quoteDraftMessage.enable),
    product_type: enum2tinyint(quoteDraftMessage.product_type),
    detail_order_list: formatDetailOrderList(quoteDraftMessage.detail_order_list ?? []),
    modified_status: enum2tinyint(quoteDraftMessage.modified_status),
    source: enum2tinyint(quoteDraftMessage.source),
    status: enum2tinyint(quoteDraftMessage.status),
    img_name: quoteDraftMessage?.img_name ?? ''
  };
};

export const getQuoteDraftMessageDeleteParams = (
  quoteDraftDetail: Partial<QuoteDraftMessageSync>
): Pick<QuoteDraftMessageSync, 'message_id' | 'sync_version'> => {
  return {
    message_id: quoteDraftDetail.message_id ?? '',
    sync_version: quoteDraftDetail.sync_version ?? ''
  };
};

export const getDealInfoUpsertParams = (dealInfo: Partial<DealInfoSync>): DealInfoDb => {
  return {
    deal_id: dealInfo.deal_id ?? '',
    internal_code: dealInfo.internal_code ?? '',
    create_time: dealInfo.create_time ?? '',
    update_time: dealInfo.update_time ?? '',
    confirm_time: dealInfo.confirm_time ?? '',
    deal_type: enum2tinyint(dealInfo.deal_type),
    source: enum2tinyint(dealInfo.source),
    flag_bridge: boolean2tinyint(dealInfo.flag_bridge),
    send_order_msg: dealInfo.send_order_msg ?? '',
    bid_send_order_msg: dealInfo.bid_send_order_msg ?? '',
    ofr_send_order_msg: dealInfo.ofr_send_order_msg ?? '',
    bond_key_market: dealInfo.bond_key_market ?? '',
    confirm_volume: dealInfo.confirm_volume ?? 0,
    price_type: enum2tinyint(dealInfo.price_type),
    price: dealInfo.price ?? -1,
    yield: dealInfo.yield ?? -1,
    clean_price: dealInfo.clean_price ?? -1,
    full_price: dealInfo.full_price ?? -1,
    return_point: dealInfo.return_point ?? -1,
    bid_settlement_type: dealInfo.bid_settlement_type ? formatLiquidationSpeed(dealInfo.bid_settlement_type) : '',
    bid_traded_date: dealInfo.bid_traded_date ?? '',
    bid_delivery_date: dealInfo.bid_delivery_date ?? '',
    ofr_settlement_type: dealInfo.ofr_settlement_type ? formatLiquidationSpeed(dealInfo.ofr_settlement_type) : '',
    ofr_traded_date: dealInfo.ofr_traded_date ?? '',
    ofr_delivery_date: dealInfo.ofr_delivery_date ?? '',
    flag_stock_exchange: boolean2tinyint(dealInfo.flag_stock_exchange),
    exercise_type: enum2tinyint(dealInfo.exercise_type),
    deal_status: enum2tinyint(dealInfo.deal_status),
    bid_inst_id: dealInfo.bid_inst_id ?? '',
    bid_trader_id: dealInfo.bid_trader_id ?? '',
    bid_broker_id: dealInfo.bid_broker_id ?? '',
    flag_bid_modify_brokerage: boolean2tinyint(dealInfo.flag_bid_modify_brokerage),
    bid_confirm_status: enum2tinyint(dealInfo.bid_confirm_status),
    ofr_inst_id: dealInfo.ofr_inst_id ?? '',
    ofr_trader_id: dealInfo.ofr_trader_id ?? '',
    ofr_broker_id: dealInfo.ofr_broker_id ?? '',
    flag_ofr_modify_brokerage: boolean2tinyint(dealInfo.flag_ofr_modify_brokerage),
    ofr_confirm_status: enum2tinyint(dealInfo.ofr_confirm_status),
    spot_pricing_record_id: dealInfo.spot_pricing_record_id ?? '',
    flag_internal: boolean2tinyint(dealInfo.flag_internal),
    operator: dealInfo.operator ?? '',
    listed_market: dealInfo.listed_market ?? '',
    bid_bridge_record_id: dealInfo.bid_bridge_record_id ?? '',
    ofr_bridge_record_id: dealInfo.ofr_bridge_record_id ?? '',
    im_msg_text: dealInfo.im_msg_text ?? '',
    im_msg_send_status: enum2tinyint(dealInfo.im_msg_send_status),
    im_msg_record_id: dealInfo.im_msg_record_id ?? '',
    quote_id: dealInfo.quote_id ?? '',
    spot_pricing_volume: dealInfo.spot_pricing_volume ?? 0,
    remain_volume: dealInfo.remain_volume ?? 0,
    bid_old_content: JSON.stringify(dealInfo.bid_old_content ?? {}),
    ofr_old_content: JSON.stringify(dealInfo.ofr_old_content ?? {}),
    bid_deal_read_status: enum2tinyint(dealInfo.bid_deal_read_status),
    ofr_deal_read_status: enum2tinyint(dealInfo.ofr_deal_read_status),
    exercise_manual: boolean2tinyint(dealInfo.exercise_manual),
    flag_bid_bridge_hide_comment: boolean2tinyint(dealInfo.flag_bid_bridge_hide_comment),
    flag_ofr_bridge_hide_comment: boolean2tinyint(dealInfo.flag_ofr_bridge_hide_comment),
    bid_bridge_send_order_comment: dealInfo.bid_bridge_send_order_comment ?? '',
    ofr_bridge_send_order_comment: dealInfo.ofr_bridge_send_order_comment ?? '',
    enable: enum2tinyint(dealInfo.enable),
    sync_version: dealInfo.sync_version ?? '',
    bid_modify_brokerage_reason: dealInfo.bid_modify_brokerage_reason ?? '',
    ofr_modify_brokerage_reason: dealInfo.ofr_modify_brokerage_reason ?? '',
    hand_over_status: enum2tinyint(dealInfo.hand_over_status),
    bid_brokerage_comment: enum2tinyint(dealInfo.bid_brokerage_comment),
    ofr_brokerage_comment: enum2tinyint(dealInfo.ofr_brokerage_comment),
    bid_trader_tag: dealInfo.bid_trader_tag ?? '',
    ofr_trader_tag: dealInfo.ofr_trader_tag ?? '',
    bid_broker_id_b: dealInfo.bid_broker_id_b ?? '',
    bid_broker_id_c: dealInfo.bid_broker_id_c ?? '',
    bid_broker_id_d: dealInfo.bid_broker_id_d ?? '',
    ofr_broker_id_b: dealInfo.ofr_broker_id_b ?? '',
    ofr_broker_id_c: dealInfo.ofr_broker_id_c ?? '',
    ofr_broker_id_d: dealInfo.ofr_broker_id_d ?? '',
    flag_reverse_sync: boolean2tinyint(dealInfo.flag_reverse_sync),
    flag_unrefer_quote: boolean2tinyint(dealInfo.flag_unrefer_quote),
    flag_deal_has_changed: boolean2tinyint(dealInfo.flag_deal_has_changed),
    bid_add_bridge_operator_id: dealInfo.bid_add_bridge_operator_id ?? '',
    ofr_add_bridge_operator_id: dealInfo.ofr_add_bridge_operator_id ?? '',
    flag_bid_pay_for_inst: boolean2tinyint(dealInfo.flag_bid_pay_for_inst),
    flag_ofr_pay_for_inst: boolean2tinyint(dealInfo.flag_ofr_pay_for_inst),
    bridge_list: dealInfo.bridge_list ? JSON.stringify(dealInfo.bridge_list) : '',
    product_type: enum2tinyint(dealInfo.product_type)
  };
};

export const getDealInfoDeleteParams = (
  dealInfo: Partial<DealInfoSync>
): Pick<DealInfoSync, 'deal_id' | 'sync_version'> => {
  return {
    deal_id: dealInfo.deal_id ?? '',
    sync_version: dealInfo.sync_version ?? ''
  };
};

/** 仅供数据抽样比较时防止默认值不一致时使用 */
export const formatBondDetailDefaultValue = (bond: Partial<FiccBondBasic>): FiccBondBasic => {
  return {
    key_market: bond.key_market ?? '',
    code_market: bond.code_market ?? '',
    bond_code: bond.bond_code ?? '',
    bond_key: bond.bond_key ?? '',
    listed_market: bond.listed_market ?? '',
    listed_date: bond.listed_date ?? '',
    delisted_date: bond.delisted_date ?? '',
    short_name: bond.short_name ?? '',
    bond_category: enum2tinyint(bond.bond_category),
    fr_type: enum2tinyint(bond.fr_type),
    perp_type: enum2tinyint(bond.perp_type),
    has_option: bond.has_option ?? false,
    interest_start_date: bond.interest_start_date ?? '',
    maturity_date: bond.maturity_date ?? '',
    maturity_is_holiday: bond.maturity_is_holiday,
    next_coupon_date: bond.next_coupon_date ?? '',
    option_date: bond.option_date ?? '',
    coupon_rate_current: bond.coupon_rate_current ?? -1,
    issue_rate: bond.issue_rate ?? -1,
    issue_amount: bond.issue_amount ?? -1,
    redemption_no: bond.redemption_no ?? -1,
    implied_rating: bond.implied_rating ?? '',
    issuer_rating: bond.issuer_rating ?? '',
    is_cross_mkt: bond.is_cross_mkt ?? false,
    mkt_type: enum2tinyint(bond.mkt_type),
    time_to_maturity: bond.time_to_maturity ?? '',
    conversion_rate: bond.conversion_rate ?? -1,
    fund_objective_category: bond.fund_objective_category ?? '',
    fund_objective_sub_category: bond.fund_objective_sub_category ?? '',
    rating: bond.rating ?? '',
    display_code: bond.display_code ?? '',
    product_type: bond.product_type ?? 0,
    option_type: bond.option_type,
    with_warranty: bond.with_warranty ?? false,
    is_fixed_rate: bond.is_fixed_rate ?? false,
    val_yield_exe: bond.val_yield_exe ?? -1,
    val_yield_mat: bond.val_yield_mat ?? -1,
    val_clean_price_exe: bond.val_clean_price_exe ?? -1,
    val_clean_price_mat: bond.val_clean_price_mat ?? -1,
    val_modified_duration: bond.val_modified_duration ?? -1,
    val_basis_point_value: bond.val_basis_point_value ?? -1,
    csi_yield_exe: bond.csi_yield_exe ?? -1,
    csi_yield_mat: bond.csi_yield_mat ?? -1,
    csi_clean_price_exe: bond.csi_clean_price_exe ?? -1,
    csi_clean_price_mat: bond.csi_clean_price_mat ?? -1,
    csi_full_price_exe: bond.csi_full_price_exe ?? -1,
    csi_full_price_mat: bond.csi_full_price_mat ?? -1,
    repayment_method: bond.repayment_method ?? 0,
    issuer_code: bond.issuer_code ?? ''
  };
};

export const getBondDetailUpsertParams = (bond: Partial<BondDetailSync>): BondDetailDb => {
  return {
    ficc_id: bond.ficc_id ?? '',
    enable: enum2tinyint(bond.enable),
    sync_version: bond.sync_version ?? '',
    key_market: bond.key_market ?? '',
    code_market: bond.code_market ?? '',
    bond_code: bond.bond_code ?? '',
    bond_key: bond.bond_key ?? '',
    listed_market: bond.listed_market ?? '',
    listed_date: bond.listed_date ?? '',
    delisted_date: bond.delisted_date ?? '',
    full_name: bond.full_name ?? '',
    short_name: bond.short_name ?? '',
    pinyin: bond.pinyin ?? '',
    pinyin_full: bond.pinyin_full ?? '',
    bond_category: enum2tinyint(bond.bond_category),
    fr_type: enum2tinyint(bond.fr_type),
    perp_type: enum2tinyint(bond.perp_type),
    has_option: boolean2tinyint(bond.has_option),
    interest_start_date: bond.interest_start_date ?? '',
    maturity_date: bond.maturity_date ?? '',
    maturity_is_holiday: boolean2tinyint(bond.maturity_is_holiday),
    next_coupon_date: bond.next_coupon_date ?? '',
    option_date: bond.option_date ?? '',
    coupon_rate_current: bond.coupon_rate_current ?? -1,
    issue_rate: bond.issue_rate ?? -1,
    issue_amount: bond.issue_amount ?? -1,
    redemption_no: bond.redemption_no ?? -1,
    implied_rating: bond.implied_rating ?? '',
    issuer_rating: bond.issuer_rating ?? '',
    is_cross_mkt: boolean2tinyint(bond.is_cross_mkt),
    mkt_type: enum2tinyint(bond.mkt_type),
    time_to_maturity: bond.time_to_maturity ?? '',
    conversion_rate: bond.conversion_rate ?? -1,
    fund_objective_category: bond.fund_objective_category ?? '',
    fund_objective_sub_category: bond.fund_objective_sub_category ?? '',
    rating: bond.rating ?? '',
    issuer_code: bond.issuer_code ?? '',
    display_code: bond.display_code ?? '',
    product_type: enum2tinyint(bond.product_type),
    option_type: enum2tinyint(bond.option_type),
    with_warranty: boolean2tinyint(bond.with_warranty),
    is_fixed_rate: boolean2tinyint(bond.is_fixed_rate),
    val_yield_exercise: bond.val_yield_exercise ?? -1,
    val_yield_maturity: bond.val_yield_maturity ?? -1,
    val_clean_price_exercise: bond.val_clean_price_exercise ?? -1,
    val_clean_price_maturity: bond.val_clean_price_maturity ?? -1,
    val_modified_duration: bond.val_modified_duration ?? -1,
    val_convexity: bond.val_convexity ?? -1,
    val_basis_point_value: bond.val_basis_point_value ?? -1,
    csi_yield_exercise: bond.csi_yield_exercise ?? -1,
    csi_yield_maturity: bond.csi_yield_maturity ?? -1,
    csi_clean_price_exercise: bond.csi_clean_price_exercise ?? -1,
    csi_clean_price_maturity: bond.csi_clean_price_maturity ?? -1,
    csi_full_price_exercise: bond.csi_full_price_exercise ?? -1,
    csi_full_price_maturity: bond.csi_full_price_maturity ?? -1,
    repayment_method: bond.repayment_method ?? 0,
    first_maturity_date: bond.first_maturity_date ?? '',
    call_str: bond.call_str ?? '',
    put_str: bond.put_str ?? ''
  };
};

export const getBondDetailDeleteParams = (
  bond: Partial<BondDetailSync>
): Pick<BondDetailSync, 'ficc_id' | 'sync_version'> => {
  return {
    ficc_id: bond.ficc_id ?? '',
    sync_version: bond.sync_version ?? ''
  };
};
