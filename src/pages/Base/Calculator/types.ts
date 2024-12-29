import { DateOffsetEnum } from '@fepkg/business/types/date';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { Side } from '@fepkg/services/types/enum';
import { Moment } from 'moment';
import { PriceImmerWrapper, PriceState } from '@/components/business/PriceGroup';

export enum PriceType {
  None = '',
  CleanPrice = 'clean_price',
  FullPrice = 'full_price',
  Yield = 'yield',
  Spread = 'spread',
  YieldToExecution = 'yield_to_execution'
}

export type PanelState = {
  /** 状态变量 */
  hasBenchmark: boolean;
  /** 计算器入参 */
  priceType: PriceType;
  benchmarkRate: string | null;
  settlementDate: Moment | null;
  offset: DateOffsetEnum;
  /** 报价量（volume） */
  notional?: string;
  /** 计算器出参 */
  result?: BaseDataMulCalculate.CalculateResult;
};

export type MulCalculateQueryParams = {
  disabled?: boolean;
  side: Side;
  codeMarket?: string;
  priceType: PriceType;
  priceInfo: PriceImmerWrapper<PriceState>;
  settlementDate?: string;
  benchmarkRate?: string;
  notional?: string;
  simple?: boolean;
  onError?: () => void;
};
