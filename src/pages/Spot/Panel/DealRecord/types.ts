import { DealConfirmSnapshot, DealRecord } from '@fepkg/services/types/bds-common';

/** 成交记录背景颜色 */
export type RecordBgColor = 'bg-gray-700' | 'bg-gray-900' | 'bg-auxiliary-700';

export type TypeDealRecord = DealRecord & {
  isHistory: boolean;
  isDark?: boolean;
  canShowSum?: boolean;
};

/** 成交记录query结果 */
export type DealRecordQueryResult = {
  confirm_total?: number;
  deal_info_list?: TypeDealRecord[];
};
