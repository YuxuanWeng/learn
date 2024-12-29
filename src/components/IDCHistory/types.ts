import { ReactElement } from 'react';

export type ReceiverState = { name?: string; qq?: string; isAddBridgeUser?: boolean; userId?: string };

/** 右键菜单 */
export type RecordContextMenuItem<T = ''> = {
  label: string;
  key: string | number;
  value?: T;
  type?: 'copy' | 'merge' | 'urge';
  disabled?: boolean;
  subContextMenuItem?: RecordContextMenuItem<T>[];
  selectId?: string;
};

/** 经纪人类型 */
export type BrokerInfo = {
  broker_name: string; // 经纪人姓名
  inst_name: string; // 机构名称
};

/** 成交记录高亮 */
export type HighlightType = {
  id: string;
  searchedCode: string; // 当前搜索到内码
  highlightIdx: number; // 当前高亮的index
};

export enum BuySold {
  /** 我不是买方也不是卖方 */
  None,
  /** 我是买方 */
  Buy,
  /** 我是卖方 */
  Sold,
  /** 我是买方还是卖方 */
  All
}

/** 成交记录右键菜单枚举 */
export enum DealRecordContextEnum {
  /** 发送 */
  Send,
  /** 点价方发送 */
  SpotSend,
  /** 被点价方发送 */
  BeSpotSend,
  /** 删除 */
  Delete,
  /** 点价方复制 */
  SpotCopy,
  /** 被点价方复制 */
  BeSpotCopy,
  /** 克隆 */
  Clone,
  /** 点价方克隆 */
  SpotClone,
  /** 被点价方克隆 */
  BeSpotClone,
  /** 点价方催单 */
  SpotReminder,
  /** 被点价方催单 */
  BeSpotReminder,
  /** 双方催单 */
  BothReminder
}
