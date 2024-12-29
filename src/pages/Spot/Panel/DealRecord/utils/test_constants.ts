import { DealRecord, FiccBondBasic, InstitutionTiny, TraderLite, User } from '@fepkg/services/types/common';
import { DealReadStatus, RepaymentMethod } from '@fepkg/services/types/enum';

export const mine = {
  user_id: '197874876529476352',
  name_cn: '大林'
} as User;
export const other = {
  user_id: '77131558158704641',
  name_cn: '许兆毅'
} as User;
export const myIds = [mine.user_id, '1234', '5678'];

/** 非含权债，地方债 */
export const baseBond: FiccBondBasic = {
  product_type: 6,
  code_market: '192380.SZ',
  has_option: false,
  time_to_maturity: '13.4Y',
  bond_code: '192380',
  short_name: '贵州2143',
  issuer_rating: '',
  option_type: 'NON',
  listed_market: 'SZE',
  bond_category: 11,
  val_modified_duration: 10.6856,
  perp_type: 3,
  fr_type: 0,
  issue_amount: 581341,
  cbc_rating: '',
  maturity_date: '2107008000000',
  coupon_rate_current: 3.5,
  maturity_is_holiday: false,
  next_coupon_date: '1696694400000',
  is_cross_mkt: true,
  mkt_type: 2,
  rest_day_to_workday: {
    days_cib: 0,
    days_sse: 0,
    days_sze: 0
  },
  is_fixed_rate: true,
  fund_objective_category: '市政基建专项',
  fund_objective_sub_category: '基础设施类专项',
  implied_rating: '',
  interest_start_date: '1633622400000',
  issue_rate: 3.5,
  key_market: 'G0003282021LGBLLB43SZE',
  display_code: '192380.SZ',
  with_warranty: false,
  bond_key: '',
  repayment_method: RepaymentMethod.RepayInAdvance,
  issuer_code: ''
};

/** 有机构业务简称的机构 */
export const baseInst = {
  inst_id: '77136171335262208',
  short_name_zh: '九江银行'
} as InstitutionTiny;

export const baseTrader = {
  trader_id: '186441152948599040',
  name_zh: '沈浪',
  trader_tag: 'L'
} as TraderLite;

/** 收益率无返点，非错交割，非远期，双方经纪人都是自己，双方机构交易员不是同一个 */
export const baseDeal: DealRecord = {
  deal_id: '352338141602088704',
  internal_code: '12',
  deal_type: 1,
  source: 2,
  flag_bridge: false,
  create_time: '1652140800000',
  send_order_msg: '发给信息',
  bid_send_order_msg: 'bid发给信息',
  ofr_send_order_msg: 'ofr发给信息',
  bond_info: baseBond,
  confirm_volume: 1000,
  price_type: 3,
  price: 1,
  yield: 1.000001,
  clean_price: 131.2598,
  full_price: 131.633773,
  return_point: -1,
  bid_traded_date: '1684080000000',
  bid_delivery_date: '1684166400000',
  ofr_traded_date: '1684080000000',
  ofr_delivery_date: '1684166400000',
  flag_exchange: false,
  exercise_type: 2,
  deal_status: 2,
  spot_pricinger: {
    inst: baseInst,
    trader: baseTrader,
    broker: mine
  },
  spot_pricingee: {
    inst: { ...baseInst, short_name_zh: '上海银行', biz_short_name_list: void 0 },
    trader: { ...baseTrader, name_zh: 'quick_trader1', trader_tag: '' },
    broker: mine
  },
  spot_pricing_volume: 1000,
  exercise_manual: true,
  update_time: '',
  bid_deal_read_status: DealReadStatus.DealReadStatusNone,
  ofr_deal_read_status: DealReadStatus.DealReadStatusNone,
  bid_bridge_record_id: ''
} as DealRecord;

export const today = '2023-05-15';
export const tomorrow = '2023-05-16';
export const farDate = '2023-05-22';
export const theDayAfterFarDate = '2023-05-23';
