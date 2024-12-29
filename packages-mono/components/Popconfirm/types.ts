import { MouseEventHandler, PropsWithChildren, ReactNode, Ref } from 'react';
import { ButtonProps } from '@fepkg/components/Button';
import { PopoverOptions } from '@fepkg/components/Popover/types';

type PopconfirmButtonProps = ButtonProps & {
  /** Button ref */
  ref?: Ref<HTMLButtonElement>;
  /** 按钮文案 */
  label?: string;
};

export type PopconfirmProps = PropsWithChildren<
  PopoverOptions & {
    /** Popconfirm 类型，默认为 warning */
    type?: 'success' | 'warning' | 'danger';
    /** Icon，默认为相应类型内置 icon */
    icon?: ReactNode;
    /** 确认按钮 props */
    confirmBtnProps?: PopconfirmButtonProps;
    /** 取消按钮 props */
    cancelBtnProps?: PopconfirmButtonProps;
    /** 点击确认按钮时的回调 */
    onConfirm?: MouseEventHandler<HTMLButtonElement>;
    /** 点击取消按钮时的回调 */
    onCancel?: MouseEventHandler<HTMLButtonElement>;
    /** 内容的ref */
    contentRef?: Ref<HTMLDivElement>;
  }
>;
