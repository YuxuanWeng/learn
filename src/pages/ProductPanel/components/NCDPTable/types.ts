import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { TableMouseEvent } from '@fepkg/components/Table';
import { NCDPInfo } from '@fepkg/services/types/common';
import { NCDPOperationType } from '@fepkg/services/types/enum';

export type NCDPTableColumn = {
  /** 原始接口数据 */
  original: NCDPInfo & { log_id?: string };
  /** 评级 */
  rating: string;
  /** 发行日期 */
  issuerDate: string;
  /** 期限 */
  maturityDate: string;
  /** 最后更新 */
  updateTime?: string;
  /** 操作类型 */
  operationType?: NCDPOperationType;
  /** 操作时间  create_time和update_time 精度不一样 */
  createTime?: string;
};

export type NCDPTableMouseEvent = TableMouseEvent<NCDPTableColumn, BondQuoteTableColumnKey>;

export type IssueMaturityCache = {
  tomorrow: string;
  tomorrowPlus1: string;
  oneM: { date: string; isTradeDate: boolean };
  threeM: { date: string; isTradeDate: boolean };
  sixM: { date: string; isTradeDate: boolean };
  nineM: { date: string; isTradeDate: boolean };
  oneY: { date: string; isTradeDate: boolean };
};
