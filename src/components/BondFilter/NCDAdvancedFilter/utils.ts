import { NcdSubtypeMap, RatingMap } from '@fepkg/business/constants/map';
import { formatDate } from '@fepkg/common/utils/date';
import { CascaderOption } from '@fepkg/components/Cascader';
import { SelectOption } from '@fepkg/components/Select';
import { RangeDouble } from '@fepkg/services/types/bds-common';
import { FRType, NcdSubtype, Rating } from '@fepkg/services/types/bds-enum';
import { flatten } from 'lodash-es';
import { RangeInputValue } from '@/components/RangeInput';
import { DetailProps } from './type';

const booleanConvert = (val?: boolean) => (val ? '是' : undefined);

// 固息映射 不能使用 map通用映射，需要和筛选保持一致
export const FRTypeFullMap = {
  [FRType.FRTypeNone]: '',
  [FRType.Shibor]: 'Shibor',
  [FRType.LPR]: 'LPR',
  [FRType.FRD]: '固息'
};

const getRange = (flag?: boolean, range?: RangeDouble) => {
  let val = booleanConvert(flag);
  if (range) {
    val += `(${range.min}~${range.max})`;
  }
  return val;
};

const getRemainDays = (remain_days_list?: string[], remain_days_range?: RangeInputValue, remain_days_type?: string) => {
  if (remain_days_list?.length) {
    return remain_days_list.join('、');
  }
  if (remain_days_range?.filter(Boolean).length) {
    const [start, end] = remain_days_range;
    if (remain_days_type === 'date') {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    return `${start} - ${end}`;
  }
  return void 0;
};

const getRatings = (rating_list?: Rating[]) => {
  return rating_list
    ?.map(val => RatingMap[val])
    .filter(Boolean)
    .join('、');
};

const getFrTypes = (fr_type_list?: FRType[]) => {
  return fr_type_list
    ?.map(val => FRTypeFullMap[val])
    .filter(Boolean)
    .join('、');
};

const getWarranterList = (warranter_list?: { label: string; value: string }[]) => {
  return warranter_list
    ?.filter(Boolean)
    .map(val => val.label)
    .join('、');
};

const getMaturityIsHoliday = (maturity_is_holiday: boolean | boolean[] | undefined) => {
  if (typeof maturity_is_holiday === 'boolean') {
    return maturity_is_holiday ? '节假日' : '工作日';
  }
  if (Array.isArray(maturity_is_holiday)) {
    return maturity_is_holiday.map(val => (val ? '节假日' : '工作日')).join('、');
  }
  return void 0;
};

const getNcdSubTypeList = (ncd_subtype_list?: NcdSubtype[]) => {
  return ncd_subtype_list
    ?.map(val => NcdSubtypeMap[val])
    .filter(Boolean)
    .join('、');
};

const getIssuerList = (issuerIdList?: string[], issuerList?: CascaderOption[], ncd_subtype_list?: NcdSubtype[]) => {
  const ncdSubTypeList = ncd_subtype_list?.map(v => NcdSubtypeMap[v]);
  const validIssuerList = flatten(
    issuerList?.filter(v => ncdSubTypeList?.includes(v.label ?? '')).map(v => v.children)
  );
  // 整个分组全选的数据
  const fullGroupSelectedList = flatten(
    issuerList?.filter(v => issuerIdList?.includes(v.value as string)).map(v => v.children)
  ).map(v => v?.label);
  // 非整个分组全选的数据
  const notFullSelectedList = validIssuerList
    .filter(v => issuerIdList?.includes(v?.value as string))
    .map(v => v?.label);
  return [...fullGroupSelectedList, ...notFullSelectedList].filter(Boolean).join('、');
};

const getProvinceList = (valueList?: string[], optionList?: SelectOption<string>[]) => {
  if (!valueList) {
    return void 0;
  }
  return optionList
    ?.filter(val => valueList.includes(val.value) && !!val.label)
    .map(val => val.label)
    .join('、');
};

export const getDetailData = (props: DetailProps) => {
  const { issuerOptions, provinceOptions, quickFilter, generalFilter, bondIssueInfoFilter } = props;
  /** 是否新上市 */
  const isNewListed = booleanConvert(quickFilter?.new_listed);
  /**  是否票面 */
  const isCouponRate = getRange(quickFilter?.is_coupon_rate, quickFilter?.coupon_rate);
  /**  是否久期 */
  const isDuration = getRange(quickFilter?.is_duration, quickFilter?.val_modified_duration);
  /** 银行类型  */
  const ncdSubTypeList = getNcdSubTypeList(generalFilter?.ncd_subtype_list);
  /** 剩余期限  */
  const remainDays = getRemainDays(
    generalFilter?.remain_days_list as string[] | undefined,
    generalFilter?.remain_days_range,
    generalFilter?.remain_days_type
  );
  /** 主体评级 */
  const issuerRatings = getRatings(generalFilter?.issuer_rating_list);
  /**  中债资信 */
  const cbcRatings = getRatings(generalFilter?.cbc_rating_list);
  /** 计息基准 */
  const frTypes = getFrTypes(generalFilter?.fr_type_list);
  /** 到期日类型 */
  const maturityIsHoliday = getMaturityIsHoliday(generalFilter?.maturity_is_holiday);
  /** 地区 */
  const provinceList = getProvinceList(bondIssueInfoFilter?.province_list, provinceOptions);
  /** 年份 */
  const yearList = bondIssueInfoFilter?.year_list?.filter(Boolean).join('、');
  /** 发行人 */
  const issuerList = getIssuerList(
    bondIssueInfoFilter?.issuer_id_list,
    issuerOptions?.nodes,
    generalFilter?.ncd_subtype_list
  );
  /** 担保人 */
  const warranterList = getWarranterList(bondIssueInfoFilter?.warranter_list as { label: string; value: string }[]);

  const list: [string, string][] = [];
  if (isNewListed) {
    list.push(['是否新上市', isNewListed]);
  }
  if (isCouponRate) {
    list.push(['是否票面', isCouponRate]);
  }
  if (isDuration) {
    list.push(['是否久期', isDuration]);
  }
  if (ncdSubTypeList) {
    list.push(['银行类型', ncdSubTypeList]);
  }
  if (remainDays) {
    list.push(['剩余期限', remainDays]);
  }
  if (issuerRatings) {
    list.push(['主体评级', issuerRatings]);
  }
  if (cbcRatings) {
    list.push(['中债资信', cbcRatings]);
  }
  if (frTypes) {
    list.push(['计息基准', frTypes]);
  }
  if (maturityIsHoliday) {
    list.push(['到期日类型', maturityIsHoliday]);
  }
  if (provinceList) {
    list.push(['地区', provinceList]);
  }
  if (yearList) {
    list.push(['年份', yearList]);
  }
  if (issuerList) {
    list.push(['发行人', issuerList]);
  }
  if (warranterList) {
    list.push(['担保人', warranterList]);
  }
  return list;
};
