import { TableMouseEvent } from '@fepkg/components/Table';
import { ReceiptDeal, ReceiptDealApproval } from '@fepkg/services/types/bds-common';
import { Side } from '@fepkg/services/types/enum';
import { ReceiptDealApprovalSearch } from '@fepkg/services/types/receipt-deal/approval-search';
import { ReceiptDealApprovalSearchHistory } from '@fepkg/services/types/receipt-deal/approval-search-history';

export enum ApprovalListType {
  Approval = 'approval',
  History = 'history',
  Deal = 'deal'
}

export enum ApprovalStatus {
  /** 待我审核 */
  ToBeExaminedByMyself = 1,
  /** 已处理 */
  HasExamined = 2
}

export enum HistoryApprovalStatus {
  InCompleted = 1,
  Completed = 2
}

export enum FlagUrgentStatus {
  Urgent = 1,
  NonUrgent = 2
}

export enum FlagNCStatus {
  True = 1,
  False = 2
}

export enum ApprovalType {
  Normal = 1,
  Advanced = 2
}

export enum BridgeType {
  Bridge = 1,
  NonBridge = 2
}

export enum HistoryPassType {
  True = 1,
  False = 2
}

export type ApprovalListRelatedFilter = Omit<
  ReceiptDealApprovalSearchHistory.Request & { completed?: boolean } & ReceiptDealApprovalSearch.Request,
  'offset' | 'count'
>;

export type ApprovalListInputFilter = {
  receipt_deal_order_no?: string | null;
  bridge_code?: string | null;
  trader_id?: string;
  trader_side?: Side;
  inst_id?: string;
  inst_is_bridge_inst?: boolean;
  inst_side?: Side;
  bond_key?: string;
  deal_price?: string | null;
  volume?: string | null;
  inst_user_input?: string;
  trader_user_input?: string;
};

export enum ApprovalTableColumnKey {
  /** 扩展器 */
  Expander = 'expander',
  /** 扩展父元素、选择框 */
  Parent = 'parent',
  /** 状态 */
  Status = 'status',
  /** 订单号 */
  OrderNo = 'order-no',
  /** 债券 */
  BondCode = 'bond-code',
  /** 成交价 */
  Price = 'price',
  /** 券面总额 */
  Volume = 'volume',
  /** 买入方 */
  CpBid = 'cp-bid',
  /** 卖出方 */
  CpOfr = 'cp-ofr',
  /** 备注 */
  Comment = 'comment',
  /** 高级审核标签 */
  Tags = 'tags',
  /** 交易日 */
  DealTime = 'deal-time',
  /** 过桥码 */
  BridgeCode = 'bridge-code',
  /** 买入方经纪人 */
  BidBroker = 'bid-broker',
  /** 卖出方经纪人 */
  OfrBroker = 'ofr-broker',
  /** 卖出方经纪人 */
  Print = 'print',
  /** 操作 */
  Action = 'action',
  /** 空白列 */
  Blank = 'blank'
}

export type ApprovalTableParentRowData = {
  type: 'parent';
  original: ReceiptDealApproval;
  children?: ApprovalTableRowData[];
};

export type ApprovalTableChildRowData = {
  type: 'child';
  original: ReceiptDeal;
  comment: string[];
  advancedApprovalTags?: { label: string; content: string[] }[];
  tradedDate: string;
  bidBrokerContent: string;
  ofrBrokerContent: string;
  approval?: 'myself' | 'others' | 'approval';
  amount: string;
  isTradeDayToday: boolean;
};

export type ApprovalTableRowData = {
  id: string;
  cpBidContent: string;
  cpOfrContent: string;
} & (ApprovalTableParentRowData | ApprovalTableChildRowData);

export type ApprovalTableMouseEvent = TableMouseEvent<ApprovalTableRowData, ApprovalTableColumnKey>;
