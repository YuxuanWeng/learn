import { ReactNode } from 'react';
import { DealOperationLogV2 } from '@fepkg/services/types/common';

export type DealOperationLogTableRowData = {
  /** 行数据唯一标识 */
  id: string;
  /** 聚合后的原始数据 */
  original: DealOperationLogV2 & { updated: DealOperationLogUpdatedInfo };
  /** 可展开行数据 */
  children?: DealOperationLogTableRowData[];
};

export enum DealOperationLogTableColumnKey {
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
  Updates = 'updates'
}

export type DealOperationLogUpdatedInfo = {
  /** 变更类型文案 */
  label?: string;
  /** 变更信息（有些变更内容不需要展示变更前后快照） */
  messageRender?: () => ReactNode;
  /** 变更前快照 */
  renderBefore?: () => ReactNode;
  /** 变更后快照 */
  renderAfter?: () => ReactNode;
};
