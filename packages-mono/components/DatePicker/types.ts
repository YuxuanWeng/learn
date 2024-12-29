import { MouseEventHandler } from 'react';
import { DatePickerProps } from 'antd';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import { DateOffsetEnum, DateOffsetValue } from '@fepkg/business/types/date';
import { SizeProps } from '@fepkg/components/types';
import { Moment } from 'moment';

export type SettlementDateOffsetOption = { label: string; value: DateOffsetEnum };

export type SettlementDateOffsetProps = SizeProps & {
  /** 日期偏移组件模式 className */
  offsetClassName?: string;
  /** 是否禁用整体组件 */
  disabled?: boolean;
  /** 日期偏移组件模式 */
  offsetMode?: 'select' | 'radio-square' | 'radio-round';
  /** 日期偏移组件选项列表 */
  offsetOptions?: SettlementDateOffsetOption[];
  /** 日期偏移组件 value */
  offsetValue?: DateOffsetValue;
  /** 是否禁用日期偏移组件 */
  offsetDisabled?: boolean;
  /** 日期偏移组件 value 改变时的回调 */
  onOffsetChange?: (val: DateOffsetValue) => void;
};

export type SettlementDatePickerProps = SettlementDateOffsetProps & {
  /** container className */
  className?: string;
  /** dropdown className */
  dropdownCls?: string;
  /** 日期选择器输入框 prefix */
  prefix?: string;
  /** 是否允许清除日期选择器 */
  allowClear?: boolean;
  /** placeholder */
  placeholder?: string;
  /** 禁用选择的日期 */
  disabledDate?: (current: Moment) => boolean;
  /** 日期选择器输入框 ref */
  pickerRef?: DatePickRef<Moment>;
  /** 是否打开日期选择器 */
  pickerOpen?: boolean;
  /** 日期选择器 props */
  pickerProps?: DatePickerProps;
  /** 日期选择器 value */
  pickerValue?: string;
  /** 是否禁用日期选择器 */
  pickerDisabled?: boolean;
  /** 日期选择器 value 改变时的回调 */
  onPickerChange?: (val: Moment | null, isCtrlMode?: boolean) => void;
  /** 日期选择器 open 改变时的回调 */
  onPickerOpenChange?: (open: boolean) => void;
};

export type ShowTimeDatePickerProps = SizeProps & {
  /** container className */
  className?: string;
  /** 日期选择器输入框 prefix */
  prefix?: string;
  /** 是否允许清除日期选择器 */
  allowClear?: boolean;
  /** placeholder */
  placeholder?: string;
  /** 禁用选择的日期 */
  disabledDate?: (current: Moment) => boolean;
  /** 日期选择器输入框 ref */
  pickerRef?: DatePickRef<Moment>;
  /** 是否禁用整体组件 */
  disabled?: boolean;
  /** 是否打开日期选择器 */
  pickerOpen?: boolean;
  /** 日期选择器 props */
  pickerProps?: DatePickerProps;
  /** 日期选择器 value */
  pickerValue?: Moment;
  /** 是否禁用日期选择器 */
  pickerDisabled?: boolean;
  /** 日期选择器 value 改变时的回调 */
  onPickerChange?: (val: Moment | null, isCtrlMode?: boolean) => void;
  /** 日期选择器 open 改变时的回调 */
  onPickerOpenChange?: (open: boolean) => void;
  /** container 点击事件 */
  onContainerClick?: MouseEventHandler<HTMLDivElement>;
};
