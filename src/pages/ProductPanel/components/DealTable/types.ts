import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { TableMouseEvent } from '@fepkg/components/Table';
import { MarketDeal } from '@fepkg/services/types/common';

export type DealTableSideInfo = {
  /** CP 处展示的内容，包括 instName 与 traderName */
  cp: string;
  /** CP 处高亮样式 */
  cpHighlightCls: string;
};

export type DealTableColumn = {
  /** 原始接口数据 */
  original: MarketDeal;
  /** 「休几」的数量 */
  restDayNum: string;
  /** 是否上市 */
  listed: boolean;
  /** 周六/周日 */
  weekendDay: string;
  /** 浮动利率类型 */
  frType: string;
  /** 代码市场后缀 */
  bondCode: string;
  /** Vol 处展示的内容 */
  volume: string;
  /** Bid 方向需计算的相关信息 */
  bidInfo: DealTableSideInfo;
  /** Ofr 方向需计算的相关信息 */
  ofrInfo: DealTableSideInfo;
  /** 交易日 */
  tradedDate: string;
  /** 交割日 */
  deliveryDate: string;
  /** 成交日 */
  dealTime: string;
  /** 清算速度处展示的内容 */
  liquidationSpeedContent: string;
  /** 含权类型 */
  optionType: string;
  /** 上市日 */
  listedDate: string;
  /** 提前还本 */
  repaymentMethod: string;
  /** 久期 */
  valModifiedDuration: string;
  /** PVBP */
  pvbp: string;
  /** Operator Name */
  operatorName: string;
  /** 备注处展示的内容 */
  comment: string;
};

export type DealTableMouseEvent = TableMouseEvent<DealTableColumn, BondQuoteTableColumnKey>;
