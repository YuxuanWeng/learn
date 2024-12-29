import { TableSorterOrder } from '@fepkg/components/Table';
import { RangeTime } from '@fepkg/services/types/bds-common';
import { DealDateType, QuoteSortedField } from '@fepkg/services/types/enum';
import moment from 'moment';
import { CustomSortFieldOptions } from '@/components/BondFilter/CustomSorting/types';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import {
  BondIssueInfoFilterValue,
  GeneralFilterValue,
  QuoteFilterValue,
  RemainDaysType
} from '@/components/BondFilter/types';

export const DEFAULT_QUICK_FILTER_VALUE: QuickFilterValue = {
  intelligence_sorting: false,
  custom_sorting: false,
  coupon_rate: undefined,
  yield: undefined,
  new_listed: false,
  offset: undefined,
  val_modified_duration: undefined,
  unquoted: false, // 无报价
  is_mortgage: false,
  is_cross_mkt: false,
  consideration: undefined,
  trader_id_list: undefined,
  is_yield: false, // 是否勾选收益率
  is_offset: false, // 是否勾选偏移
  is_duration: false, // 是否勾选久期
  is_consideration: false, // 是否勾选对价
  is_coupon_rate: false // 是否勾选票面
};

export const DEFAULT_CUSTOM_SORTING_VALUE: CustomSortFieldOptions = [
  { sortedField: QuoteSortedField.FieldFirstMaturityDate, order: TableSorterOrder.ASC },
  { sortedField: QuoteSortedField.FieldIssuerRatingVal, order: TableSorterOrder.DESC }
];

export const DEFAULT_QUOTE_FILTER_VALUE: QuoteFilterValue = {
  is_vip: false, // vip
  is_lead: false, // 主承
  is_my_flag: false, // 我的报价checkbox
  broker_id_list: [], // 我的报价brokerList
  flag_urgent: false, // 紧急报价
  flag_recommend: false, // 推荐

  ofr_volume: '' as unknown as number, // ofr 量
  side: undefined, // bid/ofr
  is_exercise: undefined, // 行权/到期

  ref_type_list: undefined,
  date_range: undefined,
  flag_internal: undefined, // 内部
  nothing_done: undefined, // N.D
  is_scattered: false, // 散量
  liquidation_speed_list: [],

  date_type: DealDateType.DealTime
};

export const DEFAULT_TIME_RANGE_VALUE: RangeTime = {
  start_time: moment().startOf('day').valueOf().toString(),
  end_time: moment().endOf('day').valueOf().toString()
};

export const DEFAULT_MARKET_DEAL_FILTER_VALUE: QuoteFilterValue = {
  ...DEFAULT_QUOTE_FILTER_VALUE,
  date_range: DEFAULT_TIME_RANGE_VALUE
};

export const DEFAULT_REFERRED_QUOTE_FILTER_VALUE = DEFAULT_MARKET_DEAL_FILTER_VALUE;

// 债券发行信息
export const DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE: BondIssueInfoFilterValue = {
  sw_sector_list: [],
  sw_subsector_list: [],
  province_list: [],
  city_list: [],
  year_list: [],
  issuer_id_list: [],
  warranter_id_list: [],
  issuer_list: [],
  warranter_list: []
};

export const DEFAULT_GENERAL_FILTER_VALUE: GeneralFilterValue = {
  area_level_list: [], // 发行人行政级别
  bond_category_list: [], // 债券类型
  bond_sector_list: [], // 债券发行方法
  bond_short_name_list: [],
  cbc_rating_list: [], // 中债资信评级
  collection_method_list: [], // 募集方式
  fr_type_list: [], // 计息基准
  has_option: [],
  implied_rating_list: [],
  inst_is_listed: [],
  is_municipal: [],
  bond_nature_list: [],
  institution_subtype_list: [], // 主体类型
  is_platform_bond: [],
  issuer_rating_list: [], // 主体评级
  issuer_rating_val: '', // 搜索隐含评级
  listed_market_list: [], // 流通场所类型
  maturity_is_holiday: [],
  mkt_type_list: [], // 市场
  perp_type_list: [], // 永续债类型
  rating_type: 'rangeLevel', // 隐含评级类型
  remain_days_list: [], // 剩余期限
  remain_days_range: ['', ''], // 剩余期限输入框内容
  remain_days_type: 'string', // 剩余期限输入框类型
  remain_days_options_type: RemainDaysType.Term, // 剩余期限选项类型
  ncd_subtype_list: [], // 银行债细分
  with_warranty: []
};
