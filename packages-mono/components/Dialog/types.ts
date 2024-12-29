import { CSSProperties, HTMLAttributes, HTMLProps, PropsWithChildren, Ref } from 'react';
import { ButtonProps } from '../Button';
import { Size } from '../types';

export type DialogHeaderBackground =
  | 'bg-gray-800'
  | 'bg-orange-500'
  | 'bg-secondary-500'
  | 'bg-danger-300'
  | 'bg-trd-300'
  | 'bg-primary-300';
export type DialogBodyBackground = 'bg-gray-700' | 'bg-gray-200' | 'bg-white' | 'bg-auxiliary-700';
export type DialogFooterBackground =
  | 'bg-gray-800'
  | 'bg-gray-700'
  | 'bg-white'
  | 'bg-auxiliary-700'
  | 'bg-auxiliary-600';

export type DialogHeaderProps = HTMLProps<HTMLDivElement> & {
  /** 子标题 */
  subtitle?: string;
  /** children className */
  childrenCls?: string;
};

export type DialogBodyProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    /** Body 大小（默认为 md） */
    size?: Size;
    /** Body background（默认为 gray-700） */
    background?: DialogBodyBackground;
  }
>;

export type FooterButtonProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  /** Button ref */
  ref?: Ref<HTMLButtonElement>;
  /** 按钮文案 */
  label?: string;
  /** 按钮类型 */
  type?: ButtonProps['type'];
  /** 按钮大小 */
  size?: ButtonProps['size'];
  /** 是否正在加载 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** Icon */
  icon?: ButtonProps['icon'];
};

export type DialogFooterProps = PropsWithChildren<{
  /** Footer className */
  className?: string;
  /** Footer style */
  style?: CSSProperties;
  /** Footer 大小（默认为 md） */
  size?: Size;
  /** Body background（默认为 gray-800） */
  background?: DialogFooterBackground;
  /** 内容是否居中 */
  centered?: boolean;
  /** 是否展示默认确认按钮与取消按钮（默认为 true） */
  showBtn?: boolean;
  /** 确认按钮与取消按钮位置是否镜像 */
  btnMirrored?: boolean;
  /** 确认按钮 props */
  confirmBtnProps?: FooterButtonProps;
  /** 取消按钮 props */
  cancelBtnProps?: FooterButtonProps;
  /** 点击确认按钮时的回调 */
  onConfirm?: () => void;
  /** 点击取消按钮时的回调 */
  onCancel?: () => void;
}>;

export type DialogFooterItemProps = PropsWithChildren<{
  /** className */
  className?: string;
  /** 文案内容 */
  label?: string;
}>;
