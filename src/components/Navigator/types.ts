import { HTMLAttributes, ReactNode } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { BadgeStatusProps } from '@fepkg/components/Badge/type';
import { AccessCode } from '@fepkg/services/access-code';
import { SortablePosition } from '@/types/sortable';

export enum NavigatorItemId {
  /** 行情 */
  Market = 'market',
  /** 计算器 */
  Calculator = 'calculator',
  /** 行情追踪 */
  QuoteReminder = 'quote-reminder',
  /** 协同报价 */
  CoordinatedQuotation = 'coordinated-quotation',
  /** iQuote */
  IQuote = 'i-quote',
  /** 点价 */
  BNCTrade = 'bnc-trade',
  /** 明细 */
  TransactionDetails = 'transaction-details',
  /** 过桥 */
  Bridge = 'bridge',
  /** CRM */
  CRM = 'crm',
  /** 设置 */
  Setting = 'setting',
  /** 成交单 */
  ReceiptDeal = 'receipt-deal',
  /** DTM */
  ReceiptDealApproval = 'receipt-deal-approval',
  /** 更多 */
  More = 'more'
}

export enum NavigatorSortableContainerId {
  /** 可见区域 */
  Visible = 'navigator-sortable-container-visible',
  /** 隐藏区域 */
  Invisible = 'navigator-sortable-container-invisible',
  /** 固定区域 */
  Fixed = 'navigator-sortable-container-fixed'
}

export type NavigatorSortableData = {
  /** 当前数据所在 container Id */
  containerId?: NavigatorSortableContainerId;
  /** 当前数据索引 */
  index?: number;
};

export type NavigatorMenuItem = {
  /** Id */
  id: NavigatorItemId;
  /** 文案内容 */
  label?: string;
  /** 是否选中 */
  checked?: boolean;
  /** 右上角有红点 */
  badge?: boolean;
  /** 是否被固定在更多内 */
  fixed?: boolean;
};

export type NavigatorItemInfo = {
  /** 文案内容 */
  label: string;
  /** Icon */
  icon: ReactNode;
  /** 权限代码 */
  accessCode: AccessCode;
  /** 是否支持拖拽 */
  sortable?: boolean;
  /** 是否支持右键菜单 */
  contextMenu?: boolean;
};

export type NavigatorItemProps = HTMLAttributes<HTMLDivElement> &
  Omit<NavigatorMenuItem, 'key'> & {
    /** 是否为拖拽层 */
    overlay?: boolean;
    /** 是否拖拽中 */
    dragging?: boolean;
    /** 是否能够拖拽 */
    sortable?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 拖拽时的排序的位置 */
    position?: SortablePosition;
    /** 是否横向排布 */
    horizontal?: boolean;
  };

export type NavigatorContextMenuState = {
  /** 点击右键菜单的目标项 id */
  targetId?: NavigatorItemId;
  /** ContextMenu 是否打开 */
  open: boolean;
  /** ContextMenu 位置 */
  position: PopoverPosition;
};

export enum NavigatorContextMenuItemId {
  /** 打开成交单独立窗口 */
  ReceiptDealDialog = 'receipt-deal-dialog'
}
