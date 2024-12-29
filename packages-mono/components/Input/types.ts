import {
  ChangeEvent,
  CompositionEvent,
  HTMLProps,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  ReactNode
} from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Size, ThemeProps } from '../types';

export type InputChangeEvent<T = HTMLInputElement> =
  | ChangeEvent<T>
  | KeyboardEvent<T>
  | CompositionEvent<T>
  | MouseEvent<HTMLSpanElement>;

type BasicOmitPropsKey =
  | 'ref'
  | 'label'
  | 'size'
  | 'background'
  | 'value'
  | 'onChange'
  | 'onKeyDown'
  | 'onMouseEnter'
  | 'onMouseLeave';
export type BasicInputProps<T = HTMLInputElement> = Omit<HTMLProps<T>, BasicOmitPropsKey> &
  ThemeProps & {
    /** Input label */
    label?: ReactNode;
    /** Input label 宽度，默认为 72，设计稿常用配置为 64 | 72 | 96 */
    labelWidth?: number;
    /** Input 根据设计稿内置的各种尺寸大小，默认为 md */
    size?: Size;
    /** 内边距，默认为 size 相关的内边距，如不为 undefined，则会覆盖 size 内置的相关内边距 */
    padding?: number | number[];
    /** 是否为圆角，默认为 false */
    rounded?: boolean;
    /** 是否为 error 状态，如为 error 状态，优先使用内置的相关样式 */
    error?: boolean;
    /** 默认 input value */
    defaultValue?: string;
    /** Input value */
    value?: string | null;
    /** 通过某个按键清除内容，默认为 null，如为 null，则不允许 */
    clearByKeyboard?: Omit<KeyboardKeys, KeyboardKeys.Enter> | null;
    /** 清除后是否需要聚焦，默认为 true */
    focusAfterClearing?: boolean;
    /** 是否支持 composition，可用于减少中文输入时触发的额外非必要的 onChange 回调 */
    composition?: boolean;
    /** Suffix Icon */
    suffixIcon?: ReactNode;
    /** 清除按钮 Icon */
    clearIcon?: ReactNode;
    /** Input 内容改变时的回调 */
    onChange?: (val: string, evt: InputChangeEvent<T>) => void;
    /** Input 键盘按下时的回调 */
    onKeyDown?: (evt: KeyboardEvent<T>, composing: boolean) => void;
    /** 按下回车时的回调 */
    onEnterPress?: (val: string, evt: KeyboardEvent<T>, composing: boolean) => void;
    /** 鼠标进入 label 时的回调 */
    onMouseEnter?: MouseEventHandler<HTMLLabelElement>;
    /** 鼠标离开 label 时的回调 */
    onMouseLeave?: MouseEventHandler<HTMLLabelElement>;
    /** 点击 suffixIcon 时的回调 */
    onSuffixClick?: MouseEventHandler<HTMLElement>;
    /** 点击 clearIcon 时的回调 */
    onClearClick?: MouseEventHandler<HTMLElement>;
  };

export type InputProps = BasicInputProps<HTMLInputElement>;

export type TextAreaProps = Omit<BasicInputProps<HTMLTextAreaElement>, 'maxLength' | 'suffixIcon' | 'onSuffixClick'> & {
  /** Textarea className */
  textareaCls?: string;
  /** 是否自适应高度，默认为 false，如传入对象，则使用对象属性作为最小/最大行数 */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** 输入框最大输入的长度；设置 errorOnly 为 true 后，超过 maxLength 会展示 error 状态，并不限制用户输入 */
  maxLength?: number | { length: number; errorOnly?: boolean };
  /** 是否在输入框高度为多行时配合 maxLength，显示字数统计，默认为 false */
  showWordLimit?: boolean;
};
