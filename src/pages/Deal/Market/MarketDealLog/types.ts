import { MarketDealOperationLog } from '@fepkg/services/types/common';
import { DealTableColumn } from '../../../ProductPanel/components/DealTable/types';

export type DealLogContext = {
  marketDealId?: string;
  /** 窗口打开时间戳 */
  timestamp?: number;
};

export type DealLogColumn = Pick<
  DealTableColumn,
  | 'restDayNum'
  | 'bondCode'
  | 'listed'
  | 'frType'
  | 'weekendDay'
  | 'volume'
  | 'dealTime'
  | 'bidInfo'
  | 'ofrInfo'
  | 'optionType'
  | 'listedDate'
  | 'repaymentMethod'
  | 'valModifiedDuration'
  | 'comment'
> & {
  /** 原始接口数据 */
  original: MarketDealOperationLog;
  operationSource: string;
  dealStatus: string;
};
