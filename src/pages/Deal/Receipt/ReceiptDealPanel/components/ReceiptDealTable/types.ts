import { GroupRowData, TableMouseEvent } from '@fepkg/components/Table';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { ReceiptDealSearchV2 } from '@fepkg/services/types/receipt-deal/search-v2';
import { ReceiptDealTableColumnKey } from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export type ReceiptDealParentRowData = GroupRowData & {
  type: 'parent';
  bridgeCode?: string;
  original: ReceiptDealSearchV2.ParentChildDeal;
  children?: ReceiptDealRowData[];
};

export type ReceiptDealChildRowData = GroupRowData & {
  type: 'child';
  original: ReceiptDeal;
  /** 序列号 */
  seqNum: string;
  /** 「休几」的数量 */
  restDayNum?: string;
  /** 是否上市 */
  listed?: boolean;
  /** 浮动利率类型 */
  frType?: string;
  /** 周六/周日 */
  weekendDay?: string;
  /** Vol */
  volume: string;
  /** Bid方向是我的成交单 */
  isBidMine: boolean;
  /** Ofr方向是我的成交单 */
  isOfrMine: boolean;
  /** Bid方向Broker展示内容 */
  bidBrokerContent: string;
  /** Ofr方向Broker展示内容 */
  ofrBrokerContent: string;
  /** 更新时间 */
  updateTime: string;
  /** 交易日 */
  tradedDate: string;
  /** 交割日 */
  deliveryDate: string;
  /** 成交日 */
  dealTime: string;
  /** 清算速度 */
  liquidationSpeedContent: string;
  /** 含权类型 */
  optionType: string;
  /** 上市日 */
  listedDate: string;
  /** 提前还本 */
  repaymentMethod: string;
  /** PVBP */
  pvbp: string;
  /** 操作人 */
  operatorName: string;
  /** 到期日 */
  maturityDate: string;
  /** 是否支持编辑 */
  editable: boolean;
  /** 是否禁用，此处仅改变样式 */
  disabledStyle?: boolean;
  /** 是否是我的催单 */
  isMyUrge: boolean;
};

export type ReceiptDealRowData = {
  id: string;
  /** Bid方向CP展示内容 */
  cpBidContent: string;
  /** Ofr方向CP展示内容 */
  cpOfrContent: string;
} & (ReceiptDealParentRowData | ReceiptDealChildRowData);

export type ReceiptDealTableMouseEvent = TableMouseEvent<ReceiptDealRowData, ReceiptDealTableColumnKey>;

export enum ReceiptDealTrace {
  /** 侧边栏 TRD 按钮 */
  SidebarTrd = 'receipt-deal-trigger-sidebar-trd',
  /** 侧边栏 Join 按钮 */
  SidebarJoin = 'receipt-deal-trigger-sidebar-join',
  /** 侧边栏 Edit 按钮 */
  SidebarEdit = 'receipt-deal-trigger-sidebar-edit',
  // /** 侧边栏剩余快捷操作 */
  // SidebarShortcut = 'market-deal-trigger-sidebar-shortcut',
  /** 成交单表格双击按钮 */
  TableDblClick = 'receipt-deal-trigger-table-dbl-click',
  /** 成交单表格右键菜单Join */
  TableCtxMenuJoin = 'receipt-deal-trigger-table-menu-join',
  /** 成交单表格右键菜单Edit */
  TableCtxMenuEdit = 'receipt-deal-trigger-table-menu-edit'
}
