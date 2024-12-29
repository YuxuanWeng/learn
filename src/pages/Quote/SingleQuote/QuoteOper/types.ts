import { QuoteInsert } from '@fepkg/services/types/common';
import { QUOTE_FLAG_OPTIONS } from '../constants';
import { QuoteActionMode } from '../types';

export type QuoteFlagValue = Pick<QuoteInsert, (typeof QUOTE_FLAG_OPTIONS)[number]['value']>;

export type QuoteFlag = {
  value?: QuoteFlagValue;
  mode?: QuoteActionMode;
};

export type QuoteFlags = {
  flag_intention?: boolean;
  flag_star?: number;
  flag_exchange?: boolean;
  flag_oco?: boolean;
  flag_package?: boolean;
};

/** 债券估值类型 */
export enum BondValuation {
  Zhai,
  Zheng
}

/** 债券估值对应的字段 */
export enum YieldEnum {
  ExeZhai = 'val_yield_exe',
  MatZhai = 'val_yield_mat',
  ExeZheng = 'csi_yield_exe',
  MatZheng = 'csi_yield_mat'
}
