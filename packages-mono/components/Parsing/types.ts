import { MouseEvent, ReactNode, Ref } from 'react';
import { ButtonProps } from '../Button/types';
import { TextAreaProps } from '../Input';

export type ParsingButtonProps = Omit<ButtonProps, 'onClick'> & {
  /** Button ref */
  ref?: Ref<HTMLButtonElement>;
  /** 按钮文案 */
  label?: string;
};

export type ParsingController = 'primary' | 'secondary';

export type ParsingProps = Omit<
  TextAreaProps,
  'label' | 'labelWidth' | 'disabled' | 'background' | 'theme' | 'border'
> & {
  /** Container className */
  containerCls?: string;
  /** controller className */
  controllerCls?: string;
  /** 是否识别错误 */
  error?: boolean;
  /** 识别错误提示文本 */
  errorText?: string;
  /** 识别操作栏按钮，按数组顺序依次展示，
   * Vertical 默认为：['secondary', 'primary']，Horizontal 默认为：[primary', 'secondary']，
   * 最大长度为 2 */
  controllers?: ParsingController[];
  /** 识别操作栏的额外元素，某些特定的 UI 会使用 */
  controllersExtra?: { [key in ParsingController]?: ReactNode };
  /** 识别中的 loading 态 */
  loading?: boolean;
  /** 主要按钮 props */
  primaryBtnProps?: ParsingButtonProps;
  /** 辅助按钮 props */
  secondaryBtnProps?: ParsingButtonProps;
  /** 点击主要按钮时的回调 */
  onPrimaryClick?: (val: string, evt: MouseEvent<HTMLElement>) => void;
  /** 点击辅助按钮时的回调 */
  onSecondaryClick?: (val: string, evt: MouseEvent<HTMLElement>) => void;
};
