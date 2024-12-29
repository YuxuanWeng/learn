import { ReactNode } from 'react';
import { SafeValue } from '@fepkg/common/types';
import { CheckboxOption } from '@fepkg/components/Checkbox';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { GeneralFilterValue } from '@/components/BondFilter/types';

export type DefaultConfigItemValue = string | number | boolean;
export type RangeConfigItemValue = { min?: number; max?: number };

export type FilterConfigOption<T = DefaultConfigItemValue> = {
  label: string;
  value: SafeValue<T, DefaultConfigItemValue>;
  match?: T;
};

export type FilterConfigExpend = { key: string; render: ReactNode };

export type FilterConfig = {
  /** Filter key */
  key: string;
  /** Filter 标题 */
  title?: string;
  /** 是否展示 Filter 标题 */
  showTitle?: boolean;
  /** 是否选中了全部 */
  checkedAll?: boolean;
  /** 当前筛选项处于第几行 */
  row: { [key in ProductType]?: number };
  /** Filter config 选项列表 */
  options: FilterConfigOption[];
  /** Filter 前置选项扩展 */
  prefix?: FilterConfigExpend;
  /** Filter 后置选项扩展 */
  suffix?: FilterConfigExpend;
  /** 去除Button的内边距 */
  clearInnerPadding?: boolean;
  /** 首个 indeterminate 选项的设置 */
  indeterminateProps?: Partial<CheckboxOption> & { checked?: boolean };
};

export type FilterProps = {
  productType: ProductType;
  configs: FilterConfig[];
  value: GeneralFilterValue;
  onChange?: (data: { key: string; currentState: GeneralFilterValue; preState?: GeneralFilterValue }) => void;
  className?: string;
};
