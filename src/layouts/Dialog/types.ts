import { Dispatch, KeyboardEvent, PropsWithChildren, ReactNode } from 'react';
import { DialogHeaderBackground } from '@fepkg/components/Dialog/types';
import { useDialogHandler } from './hooks/useDialogHandler';

export type DialogLayoutController = 'min' | 'max' | 'close';

export type DialogLayoutHeaderProps = PropsWithChildren<{
  /** Header className */
  className?: string;
  /** 是否能够被拖拽 */
  draggable?: boolean;
  /** 是否支持键盘 esc 关闭 */
  keyboard?: boolean | (() => boolean);
  /** Header background（默认为 gray-800） */
  background?: DialogHeaderBackground;
  /** Dialog 右上角操作栏按钮，按数组顺序依次展示，默认为：['min', 'close']，最大长度为 3 */
  controllers?: DialogLayoutController[];
  /** Dialog 右上角额外的操作按钮 */
  extraControllers?: ReactNode;
  /** 关闭时的回调 */
  onCancel?: () => void;
}>;

/**
 * 子路由的上下文对象，通过传递，实现：
 * 在母子路由数据共享、子路由中修改上级路由的数据
 */
export type DialogLayoutContext = {
  setContext: Dispatch<any>;

  setActionOnKeyDown: (action: (evt: KeyboardEvent<HTMLDivElement>) => void) => void;

  confirm: ReturnType<typeof useDialogHandler>['handleDialogConfirm'];
  cancel: ReturnType<typeof useDialogHandler>['handleDialogCancel'];
};
