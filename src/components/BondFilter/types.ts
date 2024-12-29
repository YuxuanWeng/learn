import { SelectOption } from '@fepkg/components/Select';
import { BondIssueInfo, GeneralFilter, TableRelatedFilter } from '@fepkg/services/types/common';
import { RangeInputValue } from '@/components/RangeInput';
import { QuickFilterValue } from './QuickFilter/types';

export type FormatCheckboxValue<T, K extends keyof T> = Omit<T, K> & { [key in K]?: boolean[] };

/** NCD(二级)剩余期限类型 */
export enum RemainDaysType {
  Term, // 期限
  Month, // 月份
  Season // 季度
}

export type GeneralFilterValue = FormatCheckboxValue<
  GeneralFilter,
  | 'has_option'
  | 'is_platform_bond'
  | 'maturity_is_holiday'
  | 'inst_is_listed'
  | 'with_warranty'
  | 'is_abs'
  | 'is_municipal'
> & {
  remain_days_range?: RangeInputValue;
  issuer_rating_val?: string;
  rating_type?: 'rangeLevel' | 'fixLevel';
  remain_days_type?: 'string' | 'date';
  remain_days_options_type?: RemainDaysType;
};

export type BondIssueInfoFilterValue = BondIssueInfo & {
  issuer_list?: SelectOption<string>[];
  warranter_list?: SelectOption<string>[];
};

/** 报价筛选项 */
export type QuoteFilterValue = TableRelatedFilter & {
  is_my_flag?: boolean;
  // 市场成交表和作废区表中的时间筛选仅在当前系统生命周期内生效，故额外存一个值
  time_soft_lifecycleId?: string;
  // 市场成交表的日期类型仅在当前系统生命周期内生效，且与日期本身互不影响
  date_type_soft_lifecycleId?: string;
};

export type TableQuoteFilterProps = {
  /** value */
  value?: QuoteFilterValue;
  /** value 改变时的回调 */
  onChange?: (val: QuoteFilterValue) => void;
};

export type GeneralFilterProps = {
  inputCls?: string;
  /** value */
  value?: GeneralFilterValue;
  /** 是否是高级分组中的选项 */
  isAdvanceGroup?: boolean;
  /** value 改变时的回调 */
  onChange?: (val: GeneralFilterValue) => void;
};

export type GeneralFilterInstance = {
  reset: () => void;
};

export type BondQuoteTableFilterSetting = {
  quickFilter?: QuickFilterValue;
  generalFilter?: GeneralFilterValue;
  bondIssueInfoFilter?: BondIssueInfoFilterValue;
  extraKeyMarketList?: string[];
  selectedFilterGroupId?: string;
};

export type BondFilterInstance = {
  /** 重置面板至默认状态(针对快捷筛选 和 一般筛选) */
  resetFilter?: (val: { quickFilter?: QuickFilterValue; generalFilter?: GeneralFilterValue }) => void;
  /** 清空面板至空状态(针对快捷筛选 和 一般筛选) */
  clearFilter?: () => void;
  /** 外界重置智能/自定义排序筛选 */
  resetQuickFilterSorting?: () => void;
};
