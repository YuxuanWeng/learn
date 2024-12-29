import { ReceiptDealOperationLog } from '@fepkg/services/types/common';
import { ReceiptDealUpdateType } from '@fepkg/services/types/enum';

export enum ReceiptDealLogTableColumnKey {
  /** 扩展器 */
  Expander = 'expander',
  /** 操作人 */
  Operator = 'operator',
  /** 操作类型 */
  Type = 'type',
  /** 操作源 */
  Source = 'source',
  /** 操作时间 */
  Time = 'time',
  /** 变更内容 */
  Updates = 'updates',
  /** 备注 */
  Comment = 'comment'
}

export type ReceiptDealUpdatedBadgeType = 'purple-bridge' | 'orange-bridge' | 'danger-payfor';

export type ReceiptDealUpdatedSnapshot = {
  /** 徽标类型 */
  badgeType?: ReceiptDealUpdatedBadgeType;
  /** 快照变更值 */
  value: string;
};

export type ReceiptDealUpdatedInfo = {
  /** 变更类型 */
  type: ReceiptDealUpdateType;
  /** 变更类型文案 */
  label?: string;
  /** 变更信息（有些变更内容不需要展示变更前后快照） */
  message?: string;
  /** 变更前快照 */
  before?: ReceiptDealUpdatedSnapshot;
  /** 变更后快照 */
  after?: ReceiptDealUpdatedSnapshot;
  /** 备注 */
  comment?: string;
  /** 是否隐藏 */
  hidden?: boolean;
};

export type ReceiptDealLogTableRowData = {
  /** 行数据唯一标识 */
  id: string;
  /** 聚合后的原始数据 */
  original: ReceiptDealOperationLog & { updated?: ReceiptDealUpdatedInfo };
  /** 可展开行数据 */
  children?: ReceiptDealLogTableRowData[];
};
