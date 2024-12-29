import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { TableMouseEvent } from '@fepkg/components/Table';
import { QuoteLite } from '@fepkg/services/types/common';

export type BasicTableColumn = {
  /** 原始接口数据 */
  original: QuoteLite;
  /** 推荐样式 */
  recommendCls: string;
  /** 「休几」的数量 */
  restDayNum: string;
  /** 是否上市 */
  listed: boolean;
  /** 周六/周日 */
  weekendDay: string;
  /** 浮动利率类型 */
  frType: string;
  /** 债券代码（带市场后缀） */
  bondCode: string;
  /** Vol 处展示的内容 */
  volume: string;
  /** 备注处展示的内容 */
  comment: string;
  /** Broker Id */
  brokerId: string;
  /** Broker Name */
  brokerName: string;
  /** Time */
  updateTime: string;
  /** 机构 Name */
  instName: string;
  /** Trader Id */
  traderId: string;
  /** Trader Name */
  traderName: string;
  /** CP 处展示的内容，包括 instName 与 traderName,traderTag */
  cp: string;
  /** 全价处展示的内容 */
  fullPrice: string;
  /** 净价处展示的内容 */
  cleanPrice: string;
  /** 利差处展示的内容 */
  spread: string;
  /** 含权类型 */
  optionType: string;
  /** 上市日 */
  listedDate: string;
  /** 提前还本 */
  repaymentMethod: string;
  /** 久期 */
  valModifiedDuration: string;
  /** Operator Name */
  operatorName: string;
  /** 创建时间 */
  createTime: string;
  /** 质押率 */
  conversionRate: string;
  /** 到期日 */
  maturityDate: string;
  /** Refer Time */
  referTime: string;
  /** PVBP */
  pvbp: string;
};

export type BasicTableMouseEvent = TableMouseEvent<BasicTableColumn, BondQuoteTableColumnKey>;
