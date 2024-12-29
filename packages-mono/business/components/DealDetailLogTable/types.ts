import { DealDetailLogChild, DealDetailOperationLog } from '@fepkg/services/types/common';
import { DealDetailUpdateType } from '@fepkg/services/types/enum';

export enum DealDetailLogTableColumnKey {
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

export type DealDetailUpdatedBadgeType = 'purple-bridge' | 'orange-bridge';

export type DealDetailUpdatedInfo = {
  /** 变更类型 */
  type?: DealDetailUpdateType;
  /** 变更类型文案 */
  label?: string;
  /** 变更前快照 */
  before?: string;
  /** 变更后快照 */
  after?: string;
};

export type DealDetailLogTableRowData = {
  /** 行数据唯一标识 */
  id: string;
  /** 聚合后的原始数据 */
  original: DealDetailOperationLog;
  /** 有具体内容的行的变更详情 */
  updated?: DealDetailUpdatedInfo;
  /** 标题行的条目数量 */
  subAmount?: number;
  /** 二级展开对应的成交单 */
  subRowDeal?: DealDetailLogChild;
  /** 桥备注的cp标注 */
  bridgeCommentTag?: string;
  /** 可展开行数据 */
  children?: DealDetailLogTableRowData[];
};
