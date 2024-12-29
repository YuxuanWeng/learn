import type { BridgeInstInfo, InstitutionTiny } from '@fepkg/services/types/common';
import { BondQuoteType, BridgeChannel, ExerciseType, SettlementLabel, Side } from '@fepkg/services/types/enum';

export enum DateType {
  RecordDay = 1,
  TradeDay = 2
}

export type DateParams = { type: DateType; value: string };

export type BridgeFormData = {
  /** 桥id */
  bridge_inst_id: string;
  /** 联系人id */
  contact_id: string;
  contact_inst_id: string;
  contact_tag?: string;
  /** 计费人id */
  biller_id: string;
  biller_inst_id: string;
  biller_tag?: string;
  /** 发给 */
  send_msg?: string;
  /**  渠道 */
  channel?: BridgeChannel;
  /**  备注 */
  comment?: string;
  /** 联系方式 */
  contact?: string;
};

/** 桥编辑模式   */
export enum EditBridgeMode {
  Single /** 单条编辑 */,
  Batch /** 批量编辑 */
}

/** 桥编辑类型   */
export enum EditBridgeType {
  One /** 单桥 */,
  Mul /** 多桥 */,
  None /** 无桥 */
}

export type SendOrderInfo = {
  send_order_inst?: InstitutionTiny;
  volume?: number;
};

export type TypeBridge = { bridge: BridgeInstInfo; isSticky?: boolean };
export type TypeBridgeId = { bridge_inst_id: string; isSticky?: boolean };

/** 编辑标签弹窗类型 */
export enum ArrowAreaEnum {
  Bridge,
  BridgeRecord,
  Other
}

export enum ContextMenuEnum {
  UpdateBridge,
  UpdateBridgeRecord,
  DeleteBridgeRecord,
  ChangeBridge,
  NoBrokerCopy,
  NoInternalCodeCopy,
  OperateLog
}

/** 计算价格的传参 */
export type TypePrice = {
  exercise_type?: ExerciseType; // 0：默认，1.行权；2.到期
  exercise_manual?: boolean; // 是否手动操作行权到期
  price?: number; // 成交价
  price_type?: BondQuoteType; // 成交价格种类
  return_point?: number; // 返点数值; 比如返0.12
};

export type BridgeDialogContext = {
  /** 桥机构id */
  bridgeInstId?: string;
};

export type BridgeReceiptDealListFilter = {
  dateParams: DateParams;
  intelligenceSorting?: boolean;
  myBridge?: boolean;
  internalCode?: string;
  bondKeyMarket?: string;
  price?: string;
};
