import { ProductType } from '@fepkg/services/types/bdm-enum';

export type UserDb = {
  user_id: string;
  name_cn: string;
  name_en: string;
  account: string;
  post: number;
  qq: string;
  qm_account: string;
  product_codes: string; // string[];
  pinyin: string;
  pinyin_full: string;
  email: string;
  phone: string;
  telephone: string;
  job_num: string;
  enable: number;
  sync_version: string;
  update_time: string;
  job_status: number;
  account_status: number;
};

export type TraderDb = {
  trader_id: string;
  name_zh: string;
  pinyin: string;
  pinyin_full: string;
  name_en: string;
  code: string;
  department: string;
  position: string;
  qq: string; // string[];
  product_codes: string; // string[];
  tags: string; // string[];
  inst_id: string;
  broker_ids: string;
  qm_account: string;
  white_list: string; // TraderWhiteList[]
  update_time: string;
  product_marks: string; // ProductMark[]
  default_broker_list: string; // TraderDefaultBroker[]
  enable: number;
  sync_version: string;
  job_status: number;
  usage_status: number;
};

export type InstDb = {
  inst_id: string;
  standard_code: string;
  inst_type: string;
  short_name_zh: string;
  full_name_zh: string;
  short_name_en: string;
  full_name_en: string;
  pinyin: string;
  pinyin_full: string;
  product_codes: string; // string[];
  product_short_name_set: string; //  ProductBizShortNameSet[];
  enable: number;
  sync_version: string;
  update_time: string;
  district_id: string;
  district_name: string;
  inst_status: number;
  usage_status: number;
};

export type InstTraderDb = {
  // inst
  inst_id: string;
  standard_code: string;
  inst_type: string;
  short_name_zh: string;
  full_name_zh: string;
  short_name_en: string;
  full_name_en: string;
  inst_pinyin: string;
  inst_pinyin_full: string;
  inst_product_codes: string;
  product_short_name_set: string;
  // trader
  trader_id: string;
  name_zh: string;
  trader_pinyin: string;
  trader_pinyin_full: string;
  name_en: string;
  code: string;
  department: string;
  position: string;
  qq: string;
  trader_product_codes: string;
  tags: string;
  broker_ids: string;
  qm_account: string;
  white_list: string;
  product_marks: string;
  default_broker_list: string;
};

export type QuoteDb = {
  quote_id: string;
  bond_key_market: string;
  update_time: string;
  create_time: string;
  product_type: number;
  volume: number;
  yield: number;
  clean_price: number;
  full_price: number;
  return_point: number;
  flag_rebate: number;
  side: number;
  quote_type: number;
  liquidation_speed_list: string; // LiquidationSpeed[]
  inst_id: string;
  trader_id: string;
  broker_id: string;
  operator: string;
  flag_urgent: number;
  flag_star: number;
  flag_package: number;
  flag_oco: number;
  flag_exchange: number;
  flag_stock_exchange: number;
  is_exercise: number;
  flag_intention: number;
  flag_indivisible: number;
  flag_stc: number;
  comment: string;
  sync_version: string;
  flag_internal: number;
  spread: number;
  quote_price: number;
  flag_request: number;
  flag_bilateral: number;
  enable: number;
  trader_tag: string;
  exercise_manual: number;
  deal_liquidation_speed_list: string;
};

export type LocalConfigDb = {
  table_title: string;
  table_config_str: string;
};

export type LocalConfigParam = {
  userProductType: ProductType[];
  version: number;
  userId: string;
};

export type HolidayDb = {
  holiday_id: string;
  enable: number;
  update_time: string;
  sync_version: string;
  holiday_date: string;
  country: string;
  market_type: string;
  holiday_name: string;
};

export type QuoteDraftDetailDb = {
  detail_id: string;
  message_id: string;
  corresponding_line: number;
  side: number;
  key_market: string;
  quote_type: number;
  price: number;
  volume: number;
  return_point: number;
  flag_rebate: number;
  flag_star: number;
  flag_package: number;
  flag_oco: number;
  flag_exchange: number;
  flag_intention: number;
  flag_indivisible: number;
  flag_stock_exchange: number;
  flag_bilateral: number;
  flag_request: number;
  flag_urgent: number;
  flag_internal: number;
  flag_recommend: number;
  liquidation_speed_list: string;
  comment: string;
  is_exercise: number;
  exercise_manual: number;
  status: number;
  creator: string;
  operator: string;
  sync_version: string;
  enable: number;
  create_time: string;
  update_time: string;
  product_type: number;
  flag_inverted: number;
  former_detail_id: string;
};

export type QuoteDraftMessageDb = {
  message_id: string;
  create_time: string;
  update_time: string;
  inst_id: string;
  trader_id: string;
  broker_id: string;
  text_list: string;
  img_url: string;
  creator: string;
  operator: string;
  trader_tag: string;
  sync_version: string;
  enable: number;
  product_type: number;
  detail_order_list: string;
  modified_status: number;
  source: number;
  status: number;
  img_name: string;
};

export type QuoteDraftDetailSyncDBExp = {
  former_detail_id?: string;
};

export type DealInfoDb = {
  deal_id: string;
  internal_code: string;
  create_time: string;
  update_time: string;
  confirm_time: string;
  deal_type: number;
  source: number;
  flag_bridge: number;
  send_order_msg: string;
  bid_send_order_msg: string;
  ofr_send_order_msg: string;
  bond_key_market: string;
  confirm_volume: number;
  price_type: number;
  price: number;
  yield: number;
  clean_price: number;
  full_price: number;
  return_point: number;
  bid_settlement_type: string;
  bid_traded_date: string;
  bid_delivery_date: string;
  ofr_settlement_type: string;
  ofr_traded_date: string;
  ofr_delivery_date: string;
  flag_stock_exchange: number;
  exercise_type: number;
  deal_status: number;
  bid_inst_id: string;
  bid_trader_id: string;
  bid_broker_id: string;
  flag_bid_modify_brokerage: number;
  bid_confirm_status: number;
  ofr_inst_id: string;
  ofr_trader_id: string;
  ofr_broker_id: string;
  flag_ofr_modify_brokerage: number;
  ofr_confirm_status: number;
  spot_pricing_record_id: string;
  flag_internal: number;
  operator: string;
  listed_market: string;
  bid_bridge_record_id: string;
  ofr_bridge_record_id: string;
  im_msg_text: string;
  im_msg_send_status: number;
  im_msg_record_id: string;
  quote_id: string;
  spot_pricing_volume: number;
  bid_old_content: string;
  ofr_old_content: string;
  bid_deal_read_status: number;
  ofr_deal_read_status: number;
  exercise_manual: number;
  flag_bid_bridge_hide_comment: number;
  flag_ofr_bridge_hide_comment: number;
  bid_bridge_send_order_comment: string;
  ofr_bridge_send_order_comment: string;
  enable: number;
  sync_version: string;
  bid_modify_brokerage_reason: string;
  ofr_modify_brokerage_reason: string;
  hand_over_status: number;
  bid_brokerage_comment: number;
  ofr_brokerage_comment: number;
  bid_trader_tag: string;
  ofr_trader_tag: string;
  bid_broker_id_b: string;
  bid_broker_id_c: string;
  bid_broker_id_d: string;
  ofr_broker_id_b: string;
  ofr_broker_id_c: string;
  ofr_broker_id_d: string;
  flag_reverse_sync: number;
  flag_unrefer_quote: number;
  remain_volume: number;
  flag_deal_has_changed: number;
  bid_add_bridge_operator_id: string;
  ofr_add_bridge_operator_id: string;
  flag_bid_pay_for_inst: number;
  flag_ofr_pay_for_inst: number;
  bridge_list: string;
  product_type: number;
};

export type BondDetailDb = {
  ficc_id: string;
  enable: number;
  sync_version: string;
  key_market: string;
  code_market: string;
  bond_code: string;
  bond_key: string;
  listed_market: string;
  listed_date: string;
  delisted_date: string;
  full_name: string;
  short_name: string;
  pinyin: string;
  pinyin_full: string;
  bond_category: number;
  fr_type: number;
  perp_type: number;
  has_option: number;
  interest_start_date: string;
  maturity_date: string;
  maturity_is_holiday: number;
  next_coupon_date: string;
  option_date: string;
  coupon_rate_current: number;
  issue_rate: number;
  issue_amount: number;
  redemption_no: number;
  implied_rating: string;
  issuer_rating: string;
  is_cross_mkt: number;
  mkt_type: number;
  time_to_maturity: string;
  conversion_rate: number;
  fund_objective_category: string;
  fund_objective_sub_category: string;
  rating: string;
  issuer_code: string;
  display_code: string;
  product_type: number;
  option_type: number;
  with_warranty: number;
  is_fixed_rate: number;
  val_yield_exercise: number;
  val_yield_maturity: number;
  val_clean_price_exercise: number;
  val_clean_price_maturity: number;
  val_modified_duration: number;
  val_convexity: number;
  val_basis_point_value: number;
  csi_yield_exercise: number;
  csi_yield_maturity: number;
  csi_clean_price_exercise: number;
  csi_clean_price_maturity: number;
  csi_full_price_exercise: number;
  csi_full_price_maturity: number;
  repayment_method: number;
  first_maturity_date: string;
  call_str: string;
  put_str: string;
};
