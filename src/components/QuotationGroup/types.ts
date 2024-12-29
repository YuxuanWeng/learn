import { MouseEvent } from 'react';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { ClickEvent } from '@szhsin/react-menu';
import { GroupManageItem } from '@/pages/ProductPanel/providers/MainGroupProvider/types';

export enum ContextMenuItemType {
  copy,
  share,
  delete
}

export type OptionsProps = {
  /** options列表 */
  data?: GroupManageItem[];
  /** 当前选中的option的value */
  activeKey?: string;
  /** 是否启用拖拽 */
  enableSort?: boolean;
  /** 当前正在hover的option的value */
  currentHoverOption?: string;
  /** 需要隐藏open按钮的id列表 */
  hiddenOpenIconIds?: string[];
  /** 当前的面板是否处于仅剩一个可打开台子的状态（多台子情况下合并算） */
  isLastOpened?: boolean;
  /** 选中某个option */
  onChecked?: (value: string) => void;
  /** 打开新的窗口的回调 */
  onOpen?: (value: string) => void;
  /** 处理拖拽相关的事件 */
  onDrop?: (resource: string, target?: string) => void;
  /** 当hover到的option发生变化时候的回调 */
  onHoverOptionChange?: (val?: string) => void;
  /** 右键option事件 */
  onContextMenu?: (evt: MouseEvent<HTMLDivElement>, data?: GroupManageItem) => void;
  /** 右键菜单的点击事件 */
  onContextMenuClick?: (evt: ClickEvent, type: ContextMenuItemType, val?: string) => void;
};

export type QuotationGroupProps = {
  /** 组件标题 */
  title: string;
  /** 组件是否展示 */
  visible?: boolean;
  /** 是否为悬浮模式的看板 */
  floatingMode?: boolean;
  /** 额外的样式 */
  className?: string;
  /** 当前选中的分组 */
  activeKey?: string;
  /** 分组列表 */
  options?: GroupManageItem[];
  /** 需要隐藏open按钮的id列表 */
  hiddenOpenIconIds?: string[];
  /** 添加分组的事件回调函数 */
  onAddClick?: (productType: ProductType) => void;
  /** 展示/隐藏 分组的事件回调函数 */
  onExtendClick?: () => void;
  /** 点击选项的事件回调函数 */
  onChecked?: (value: string) => void;
  /** 点击选项右侧Icon事件回调函数 */
  onOpen?: (value: string) => void;
  /** 处理拖拽相关的事件 */
  onDrop?: (dragValue: string, dropValue?: string) => void;
  /** 右键菜单的点击事件 */
  onContextMenuClick?: (evt: ClickEvent, type: ContextMenuItemType, val?: string, productType?: ProductType) => void;
  /** 分组配置是否已达上限 */
  isGroupReachLimit?: (p: ProductType) => boolean;
};
