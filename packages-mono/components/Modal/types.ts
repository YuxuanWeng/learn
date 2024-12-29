import { KeyboardEvent, ReactNode } from 'react';
import { ModalProps as AntModalProps } from 'antd';
import { DialogFooterProps } from '@fepkg/components/Dialog';

const AntModalOmitKeys = [
  'onOk',
  'onCancel',
  'footer',
  'okText',
  'okType',
  'cancelText',
  'okButtonProps',
  'cancelButtonProps',
  'confirmLoading'
] as const;

type ModalBackground = 'gray-700' | 'white';

export type ModalProps = Omit<AntModalProps, (typeof AntModalOmitKeys)[number]> &
  Pick<DialogFooterProps, 'onConfirm' | 'onCancel'> & {
    /** 是否锁定当前窗口 */
    lock?: boolean;
    /** 是否允许拖拽改变位置 */
    draggable?: boolean;
    /** Title className */
    titleCls?: string;
    /** Modal background */
    background?: `bg-${ModalBackground}`;
    /** 自定义 Footer，如果填入 null 则不展示默认 Footer */
    footer?: ReactNode | null;
    /** Footer props */
    footerProps?: Omit<DialogFooterProps, 'onConfirm' | 'onCancel'>;
    /** Footer children */
    footerChildren?: ReactNode;
    /** 是否允许回车触发提交 */
    confirmByEnter?: boolean;
    /** Modal 键盘按下时的回调 */
    onKeyDown?: (evt: KeyboardEvent<HTMLElement>) => void;
  };
