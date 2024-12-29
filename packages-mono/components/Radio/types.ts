import { ReactNode } from 'react';
import { CheckboxChangeEvent, CheckboxGroupProps, CheckboxOption, CheckboxProps, CheckboxValue } from '../Checkbox';

export type RadioProps = Omit<CheckboxProps, 'indeterminate'>;

export type RadioButtonType = 'ghost' | 'orange' | 'secondary';
export type RadioButtonProps = RadioProps & {
  /** RadioButton 类型，默认为 ghost */
  buttonType?: RadioButtonType;
  /** 是否为不确定状态 */
  indeterminate?: boolean;
  /** 是否去掉内部padding */
  clearInnerPadding?: boolean;
};

export type RadioType = 'radio' | 'button';

export type RadioGroupProps = CheckboxGroupProps & {
  /** Group 内 radio 类型，默认为 tag */
  type?: RadioType;
  /** RadioTag 类型，默认为 ghost */
  buttonType?: RadioButtonType;
  /** 是否能通过按下 ctrl 或 command 键时切换 radio 状态 */
  ctrl?: boolean;
  /** 是否能点击时是否取消选中其他选项 */
  otherCancel?: boolean;
};

export type RadioIndeterminateGroupProps = Omit<RadioGroupProps, 'label' | 'type' | 'onChange'> & {
  /** Group label */
  label?: ReactNode;
  /** 首个 indeterminate 选项的设置 */
  indeterminateProps?: Partial<CheckboxOption> & { checked?: boolean };
  /** 是否去除Button按钮的内边距 */
  clearInnerPadding?: boolean;
  /** 切换选中时的回调 */
  onChange?: (val: CheckboxValue[], indeterminate: boolean, evt: CheckboxChangeEvent) => void;
  /** 点击某个选项的回调，只返回当前点击的选项 isSelect：true(选中)；false(反选) */
  onItemClick?: (val: CheckboxOption, isSelect: boolean) => void;
};
