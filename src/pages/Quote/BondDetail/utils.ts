import { OptionTypeStringMap, RepaymentMethodMap } from '@fepkg/business/constants/map';
import { SERVER_NIL, SPACE_TEXT } from '@fepkg/common/constants';
import { SafeValue } from '@fepkg/common/types';
import { parseJSON } from '@fepkg/common/utils';
import { formatDate } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { fetchInstInfo } from '@fepkg/services/api/base-data/inst-info-search';
import { BondBenchmarkRate, FiccBondBasic, FiccBondDetail, QuoteLite } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import moment from 'moment';
import { couponTypeMap } from '@/common/utils/bond';
import { ReadOnlyOption } from '@/components/ReadOnly/types';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { LatestBondInfo, RangeValue, TypeBaseInfo, TypeBondCalendar, TypeDisplayItem, TypeRateInfo } from './type';

export const PAGE_SIZE = 50;

/** 付/计息频率 */
export const FrequencyMap = {
  N: '无',
  A: '年度',
  S: '半年度',
  Q: '季度',
  M: '月度',
  '360D': '360D',
  '180D': '180D',
  '90D': '90D'
};

export interface ISingleBondDetailDialogOption {
  onSuccess?: (...args: any[]) => void;
  onCancel?: (...args: any[]) => void;
  data?: QuoteLite;
  bond_info?: FiccBondBasic;
  tableKey?: ProductPanelTableKey;
}

export const DEFAULT_SINGLE_QUOTE_DETAIL_WIDTH = 1200;
export const DEFAULT_SINGLE_QUOTE_DETAIL_HEIGHT = 720;

export const getSingleBondDetailDialogConfig = (productType: ProductType, option: ISingleBondDetailDialogOption) => {
  const quoteId = option.data?.bond_basic_info?.code_market || Date.now();
  return {
    name: `${WindowName.SingleBond}${quoteId}`,
    custom: {
      route: CommonRoute.BondDetail,
      routePathParams: [productType.toString()],
      context: {
        data: option.data,
        bond_info: option.bond_info,
        tab: option.tableKey
      },
      isTop: false
    },
    options: {
      width: DEFAULT_SINGLE_QUOTE_DETAIL_WIDTH,
      height: DEFAULT_SINGLE_QUOTE_DETAIL_HEIGHT,
      resizable: true,
      minHeight: 720,
      minWidth: 1200
    },
    numberLimit: 6
  };
};

export const config = {
  source: 'http',
  interval: 1500
};

export const isUsedHttpSource = config?.source === 'http';
export const isUsedDbSource = config?.source === 'db';

/** data stale 时间 */
export const staleTime = isUsedHttpSource ? config?.interval : Infinity;
/** 重新请求间隔 */
export const refetchInterval = isUsedHttpSource ? config?.interval : false;

export type UseDataQueryConfig<TResultData, TSelectData = TResultData> = {
  /** 数据源，db 为从本地数据库获取数据，http 为从 http 轮询获取数据，默认为 http */
  source?: 'db' | 'http';
  /** http 轮询间隔时间，单位为毫秒，仅在 source 为 http 时生效，默认为 500 */
  interval?: number;
  /** 自定义返回的数据结构 */
  select?: (data: TResultData) => SafeValue<TSelectData, TResultData>;
} & RequestConfig; /** http 请求配置项，仅在 source 为 http 时生效 */

export const isEmpty = (val: any, filledStr = '--') => {
  if ((typeof val === 'string' && (val === '' || val === '[]' || val === 'undefined')) || val === undefined) {
    return filledStr;
  }
  return String(val) ?? filledStr;
};

export const numberFixed = (val: number, toFixed: number, unit?: string) => {
  if (typeof val === 'number' && val > 0) {
    return unit ? val.toFixed(toFixed) + unit : val.toFixed(toFixed);
  }
  return '--';
};

export const dateConvert = (val?: string, format = 'YYYY-MM-DD') => {
  if (val === undefined) return '--';
  const num = parseInt(val, 10);
  if (Number.isInteger(num) && num > 0) {
    return formatDate(val, format);
  }
  return '--';
};

/**
 * 评级展示的相关逻辑 如果一个字段有值，则展示一个字段，如果两个字段有值，则两个字段拼接，如果两个都有值且相同的话只展示一个
 * @param issuer_rating 主体评级
 * @param rating  债项评级
 */
const ratingConvert = (issuer_rating: string, rating: string) => {
  if (!issuer_rating) {
    return rating;
  }
  if (!rating) {
    return issuer_rating;
  }
  return issuer_rating === rating ? rating : `${issuer_rating}/${rating}`;
};

/**
 * 产品报价中票面利率展示的相关逻辑 票面利率
 * 1.票面利率>0 则展示票面利率
 * 2.票面利率为空或者0，且发行收益值不为空，则展示发行收益
 * 3.票面利率为0，发行收益为空，则展示票面利率(0.0000%)
 * 4.两者都为空，则展示为空   这种貌似不存在，数据库字段默认值是0
 * @param coupon_rate_current 票面利率
 * @param issue_rate 发行收益
 */
export const couponRateCurrentConvert = (coupon_rate_current: number, issue_rate?: number) => {
  if (coupon_rate_current > 0) {
    return numberFixed(coupon_rate_current, 4, '%');
  }
  if (issue_rate && issue_rate > 0) {
    return numberFixed(issue_rate, 4, '%');
  }
  if (coupon_rate_current === 0 && issue_rate === SERVER_NIL) {
    return '0.0000%';
  }
  return '--';
};

/**
 * 如果当天的的时间戳则转成YYYY-MM-DD格式
 * 如果是其他时间则转成YYYY-MM-DD hh:mm:ss
 * @param date
 */
export const dateFormat = (date: string) => {
  const num = Number(date);
  const m = moment(num);
  if (Number.isInteger(num)) {
    return moment().isSame(m, 'day') ? m.format('HH:mm:ss') : m.format('MM-DD HH:mm:ss');
  }
  return '';
};

export const getDateRangeFormat = (range?: RangeValue) => {
  if (Array.isArray(range) && range[0] && range[1]) {
    return { start_time: moment(range[0]).unix().toString(), end_time: moment(range[1]).unix().toString() };
  }
  return undefined;
};

/** 转成时间戳 */
export const getDateRange = (range?: RangeValue) => {
  if (Array.isArray(range) && range[0] && range[1]) {
    return {
      start_time: moment(moment(range[0]).format('YYYY-MM-DD')).format('x'),
      end_time: moment(moment(range[1]).add(1, 'day').format('YYYY-MM-DD')).format('x')
    };
  }
  return undefined;
};

export const defaultBaseInfo: TypeBaseInfo = {
  full_name: '',
  issuer_rating_current: '',
  rating_current: '',
  selective_name: '',
  option_type: '',
  underwriter_code: '',
  issue_amount: '',
  underwriter_group: '',
  maturity_term: '',
  warrant_method: '',
  time_to_maturity: '',
  warranter: '',
  repayment_method: ''
};

export const getBaseInfo = (bond_appendix_info: FiccBondDetail) => {
  return {
    full_name: isEmpty(bond_appendix_info.full_name),
    issuer_rating_current: isEmpty(bond_appendix_info.issuer_rating),
    rating_current: isEmpty(bond_appendix_info.rating),
    selective_name: isEmpty(bond_appendix_info.selective_name),
    // option_type: optionTypeMap.get(bond_appendix_info?.option_type ?? ''),
    option_type: OptionTypeStringMap[bond_appendix_info?.option_type ?? ''],
    underwriter_code: isEmpty(bond_appendix_info.underwriter_code),
    issue_amount: `${numberFixed((bond_appendix_info.issue_amount ?? 0) / 10000, 4, '亿元')}`,
    underwriter_group: isEmpty(bond_appendix_info.underwriter_group),
    maturity_term: numberFixed(bond_appendix_info.maturity_term ?? 0, 4, bond_appendix_info.term_unit),
    warrant_method: isEmpty(bond_appendix_info?.warrant_method),
    time_to_maturity: isEmpty(bond_appendix_info.time_to_maturity),
    warranter: isEmpty(bond_appendix_info.warranter),
    repayment_method: isEmpty(RepaymentMethodMap[bond_appendix_info.repayment_method])
  };
};

export const defaultRateInfo = {
  coupon_type: '',
  coupon_rate_current: '',
  name: '',
  value: '',
  issue_rate: '',
  issue_price: '',
  coupon_frequency: '',
  compound_frequency: ''
};

export const getRateInfo: (bond_appendix_info: FiccBondDetail, benchmarkRate?: BondBenchmarkRate) => TypeRateInfo = (
  bond_appendix_info: FiccBondDetail,
  benchmarkRate?: BondBenchmarkRate
) => {
  return {
    coupon_type: isEmpty(couponTypeMap[bond_appendix_info.coupon_type ?? '']),
    coupon_rate_current: `${numberFixed(bond_appendix_info.coupon_rate_current ?? 0, 4, '%')}`,
    issue_rate: `${numberFixed(bond_appendix_info.issue_rate || 0, 4, '%')}`,
    issue_price: `${numberFixed(bond_appendix_info.issue_price ?? 0, 4, '元')}`,
    coupon_frequency: isEmpty(FrequencyMap[bond_appendix_info.coupon_frequency ?? '']),
    compound_frequency: isEmpty(FrequencyMap[bond_appendix_info.compound_frequency ?? '']),
    name: isEmpty(benchmarkRate?.name),
    value: benchmarkRate?.value ? numberFixed(benchmarkRate.value, 4, '%') : '--'
  };
};

export const defaultBondCalendar = {
  issue_start_date: '',
  maturity_date: '',
  interest_start_date: '',
  next_coupon_date: '',
  listed_date: '',
  delisted_date: '',
  option_date: ''
};

export const getBondCalendar: (bond_appendix_info: FiccBondDetail) => TypeBondCalendar = (
  bond_appendix_info: FiccBondDetail
) => {
  return {
    issue_start_date: dateConvert(bond_appendix_info.issue_start_date),
    maturity_date: dateConvert(bond_appendix_info.maturity_date),
    interest_start_date: dateConvert(bond_appendix_info.interest_start_date),
    next_coupon_date: dateConvert(bond_appendix_info.next_coupon_date),
    listed_date: dateConvert(bond_appendix_info.listed_date),
    delisted_date: dateConvert(bond_appendix_info.delisted_date),
    option_date: dateConvert(bond_appendix_info.option_date)
  };
};

export const defaultDisplayItem = {
  short_name: '',
  bond_code: '',
  time_to_maturity: '',
  rating_current: '',
  selective_name: '',
  issue_amount: '',
  coupon_rate_current: '',
  publisher: '',
  warrant_method: '',
  coupon_type: '',
  conversion_rate: '',
  rating_inst_code: '',
  maturity_date: ''
};

export const getDisplayItem: (data: LatestBondInfo) => TypeDisplayItem = (data: LatestBondInfo) => {
  const { bondDetailInfo, benchmarkRate, publisher } = data;
  const couponType = isEmpty(couponTypeMap[bondDetailInfo?.coupon_type ?? '']);
  return {
    short_name: isEmpty(bondDetailInfo.short_name),
    bond_code: bondDetailInfo.display_code,
    time_to_maturity: isEmpty(bondDetailInfo.time_to_maturity),
    rating_current: ratingConvert(bondDetailInfo.issuer_rating ?? '', bondDetailInfo.rating ?? ''),
    selective_name: isEmpty(bondDetailInfo.selective_name),
    issue_amount: `${numberFixed((bondDetailInfo.issue_amount ?? 0) / 10000, 2, '亿')}`,
    coupon_rate_current: isEmpty(
      couponRateCurrentConvert(bondDetailInfo.coupon_rate_current ?? 0, bondDetailInfo.issue_rate)
    ),
    warrant_method: isEmpty(bondDetailInfo.warrant_method),
    coupon_type: couponType === '浮动利率' ? isEmpty(benchmarkRate?.name) : couponType,
    conversion_rate: numberFixed(bondDetailInfo.conversion_rate ?? 0, 4),
    rating_inst_code: bondDetailInfo.rating_inst_code ?? '',
    maturity_date: dateConvert(bondDetailInfo.maturity_date ?? ''),
    publisher: publisher[1]
  };
};

/**
 * 获取主承销商等字段的描述信息
 */
export const getConvertBaseData = async (bond_appendix_info: FiccBondDetail): Promise<FiccBondDetail> => {
  let { underwriter_code, warranter, rating_inst_code } = bond_appendix_info;
  let { underwriter_group, warrant_note } = bond_appendix_info;
  const underwriterCode = underwriter_code === '' ? [] : underwriter_code?.split('|');
  const underwriterGroup = (underwriter_group === '' ? [] : (parseJSON(underwriter_group ?? '') as string[])).filter(
    item => underwriterCode?.includes(item)
  );
  const bondWarranter = warranter === '' ? [] : [warranter]; // 担保人
  const warranterNote = warrant_note === '' ? [] : [warrant_note];
  const ratingInstCode = rating_inst_code === '' ? [] : [rating_inst_code];
  const inst_code_list = [
    ...(underwriterCode ?? []),
    ...underwriterGroup,
    ...bondWarranter,
    ...warranterNote,
    ...ratingInstCode
  ].filter(Boolean);
  const { inst_info_list } = await fetchInstInfo({ inst_code_list, keyword: '', offset: 0, count: 100 });
  const map = new Map<string, string>();
  if (inst_info_list) {
    inst_info_list.forEach(item => {
      map.set(item.inst_code, item.full_name_zh);
    });
  }
  underwriter_code = underwriterCode?.map(item => map.get(item)).join(' ') ?? '--';
  underwriter_group = underwriterGroup.map(item => map.get(item)).join(' ') ?? '--';
  warrant_note =
    warranterNote
      .filter(Boolean)
      .map(item => map.get(item))
      .join(' ') ?? '--';
  rating_inst_code = ratingInstCode
    .filter(Boolean)
    .map(item => map.get(item))
    .join(' ');
  warranter =
    bondWarranter
      .filter(Boolean)
      .map(item => map.get(item))
      .join(',') ?? '--';
  // return [
  // { ...bond_info },
  return {
    ...bond_appendix_info,
    underwriter_code,
    rating_inst_code,
    warranter,
    underwriter_group,
    warrant_note
  };
  // ];
};

export const getCopyContext = (items: ReadOnlyOption[], col: number) => {
  let j = 0;
  const rows: string[] = [];
  for (const item of items) {
    if (!item.className) {
      if (j === 0) {
        rows.push(`${item.label}${SPACE_TEXT.repeat(8)}${item.value}`);
        j++;
      } else {
        rows[rows.length - 1] = rows[rows.length - 1].concat(
          `${SPACE_TEXT.repeat(8)}${item.label}${SPACE_TEXT.repeat(8)}${item.value}`
        );
        if (j === col - 1) {
          j = 0;
        }
      }
    } else {
      rows.push(`${item.label}${SPACE_TEXT.repeat(8)}${item.value}`);
      j = 0;
    }
  }
  return rows.join('\n');
};
