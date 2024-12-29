import { BondOptimalQuote, FiccBondBasic } from '@fepkg/services/types/common';

const bondLitePlaceholder: FiccBondBasic = {
  bond_category: 0,
  bond_code: '',
  cbc_rating: '',
  code_market: '',
  conversion_rate: 0,
  coupon_rate_current: 0,
  csi_clean_price_exe: 0,
  csi_clean_price_mat: 0,
  csi_full_price_exe: 0,
  csi_full_price_mat: 0,
  csi_yield_exe: 0,
  csi_yield_mat: 0,
  delisted_date: '',
  fr_type: 0,
  fund_objective_category: '',
  fund_objective_sub_category: '',
  has_option: false,
  implied_rating: '',
  interest_start_date: '',
  is_cross_mkt: false,
  is_fixed_rate: false,
  issue_amount: 0,
  issuer_rating: '',
  listed_date: '',
  listed_market: '',
  maturity_date: '',
  maturity_is_holiday: false,
  mkt_type: 0,
  next_coupon_date: '',
  option_type: '0',
  perp_type: 0,
  product_type: 0,
  rating: '',
  redemption_no: 0,
  repayment_method: 0,
  short_name: '',
  time_to_maturity: '',
  val_clean_price_exe: 0,
  val_clean_price_mat: 0,
  val_modified_duration: 0,
  val_yield_exe: 0,
  val_yield_mat: 0,
  key_market: '',
  with_warranty: false,
  val_basis_point_value: 0,
  option_date: '',
  display_code: '',
  bond_key: '',
  issuer_code: ''
};

// 用于expandTable中的标题行，不改变原结构，填充默认数据进行占位
export const quotePlaceholder: BondOptimalQuote = {
  bond_basic_info: bondLitePlaceholder,
  flag_deal_price_bid: false,
  flag_deal_price_ofr: false,
  n_bid: 0,
  n_ofr: 0,
  offset_bid: 0,
  offset_ofr: 0,
  optimal_quote_id_bid: '',
  optimal_quote_id_ofr: '',
  price_ext_bid: 0,
  price_ext_ofr: 0,
  price_int_bid: 0,
  price_int_ofr: 0,
  quote_id_ext_bid: '',
  quote_id_ext_ofr: '',
  quote_id_int_bid: '',
  quote_id_int_ofr: ''
};
