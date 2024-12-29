import { ChangeEvent, HTMLProps, KeyboardEvent, MouseEventHandler, PropsWithChildren, ReactNode, Ref } from 'react';

export type CheckboxChangeEvent = ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>;

export type CheckboxValue = string | number | boolean;

export type CheckboxClsGetter = (disabled?: boolean, checked?: boolean, indeterminate?: boolean) => string;

export type CheckboxProps = Omit<
  HTMLProps<HTMLInputElement>,
  | 'ref'
  | 'type'
  | 'size'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'onKeyDown'
  | 'onMouseDown'
  | 'onMouseEnter'
  | 'onMouseLeave'
> &
  PropsWithChildren<{
    /** Checkbox input type */
    type?: 'checkbox' | 'radio';
    /** Checkbox wrapper ref */
    wrapperRef?: Ref<HTMLLabelElement>;
    /** Checkbox wrapper className */
    wrapperCls?: CheckboxClsGetter;
    /** Checkbox container className */
    containerCls?: CheckboxClsGetter;
    /** 传入 Children 唯一时外层默认 span 标签的 className */
    childrenCls?: CheckboxClsGetter;
    /** Checkbox indicator */
    indicator?: (...args: Parameters<CheckboxClsGetter>) => ReactNode;
    /** 是否为不确定状态 */
    indeterminate?: boolean;
    /** 是否需要内置 input 功能，默认为 true，某些时候并不需要内置 <input />，只需要样式，可以使用 false */
    input?: boolean;
    /** 是否能通过按下 ctrl 或 command 键时切换 checkbox 状态 */
    ctrl?: boolean;
    /** 点击时是否取消选中其他选项 */
    otherCancel?: boolean;
    /** 是否跳过 Group 控制选中 */
    skipGroup?: boolean;
    /** 默认是否选中 */
    defaultChecked?: boolean;
    /** 是否选中 */
    checked?: boolean;
    /** Checkbox input value */
    value?: CheckboxValue;
    /** 切换选中时的回调 */
    onChange?: (val: boolean, evt: CheckboxChangeEvent) => void;
    /** 按下键盘时的回调 */
    onKeyDown?: (val: boolean, evt: KeyboardEvent<HTMLInputElement>) => void;
    /** 鼠标按下 label 时的回调 */
    onMouseDown?: MouseEventHandler<HTMLLabelElement>;
    /** 鼠标进入 label 时的回调 */
    onMouseEnter?: MouseEventHandler<HTMLLabelElement>;
    /** 鼠标离开 label 时的回调 */
    onMouseLeave?: MouseEventHandler<HTMLLabelElement>;
  }>;

export type CheckboxOption = {
  /** Checkbox className */
  className?: string;
  /** Checkbox children */
  label: ReactNode;
  /** 是否为禁用状态 */
  disabled?: boolean;
  /** Checkbox input value */
  value: CheckboxValue;
  /** 切换选中时的回调 */
  onChange?: (val: boolean, evt: CheckboxChangeEvent) => void;
};
export type CheckboxOptions = string[] | number[] | CheckboxOption[];

export type CheckboxGroupProps = Omit<HTMLProps<HTMLDivElement>, 'size' | 'defaultValue' | 'value' | 'onChange'> &
  PropsWithChildren<{
    /** Group 内所需渲染的 checkbox 列表，如不为 undefined，则优先使用其遍历生成 group 内的 checkbox */
    options?: CheckboxOptions;
    /** Group 内默认所有 checkbox input value */
    defaultValue?: CheckboxValue[];
    /** Group 内所有 checkbox input value */
    value?: CheckboxValue[];
    /** 切换选中时的回调 */
    onChange?: (val: CheckboxValue[], evt: CheckboxChangeEvent) => void;
  }>;
