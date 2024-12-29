import { QuickFilter } from '@fepkg/services/types/common';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';

export const BondQuickFilterKeys = [
  'intelligence_sorting',
  'yield',
  'offset',
  'unquoted',
  'consideration',
  'trader_id_list',
  'is_yield',
  'is_offset',
  'is_consideration'
] as const;

export type QuickFilterValue = QuickFilter & { custom_sorting?: boolean };
export type GroupQuickFilterValue = Pick<
  QuickFilter,
  | 'new_listed'
  | 'is_coupon_rate'
  | 'is_duration'
  | 'coupon_rate'
  | 'val_modified_duration'
  | 'is_mortgage'
  | 'is_cross_mkt'
>;

export enum OptionsKeys {
  /** 自定义排序 */
  CustomSorting,
  /** 智能排序 */
  IntelligenceSorting,
  /** 收益率 */
  Yield,
  /** 票面利率 */
  CouponRate,
  /** 新上市 */
  NewListed,
  /** 偏移 */
  Offset,
  /** 久期 */
  ValModifiedDuration,
  /** 可质押 */
  IsMortgage,
  /** 跨市场 */
  IsCrossMkt,
  /** 未报价 */
  Unquoted,
  /** 对价 */
  Consideration
}

export const DefaultOptionKeys = new Set([
  OptionsKeys.IntelligenceSorting,
  OptionsKeys.Yield,
  OptionsKeys.NewListed,
  OptionsKeys.ValModifiedDuration,
  OptionsKeys.IsMortgage,
  OptionsKeys.IsCrossMkt
]);

export type QuickFilterProps = {
  /** value */
  quickFilterValue: QuickFilterValue;
  /** 是否禁用 */
  disabled?: boolean;
  /** 当前展示的表格的类型 */
  activeTableKey?: ProductPanelTableKey;
  /** optionKeys */
  optionKeys?: Set<OptionsKeys>;
  /** value 改变时的回调 */
  onChange?: (val: QuickFilterValue) => void;
  /** 点击自定义排序的回调 */
  onCustomSort?: () => void;
};
