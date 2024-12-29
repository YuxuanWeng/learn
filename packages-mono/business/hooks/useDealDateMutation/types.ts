import { ProductType } from '@fepkg/services/types/enum';
import { Moment } from 'moment';
import { DateOffsetEnum, DateOffsetValue } from '../../types/date';

export type DealDateMutationState = {
  /** 交易日（默认为今天，如果今天不是工作日，则为下一个工作日） */
  tradedDate: string;
  /** 交易日偏移值 */
  tradedDateOffset?: DateOffsetValue;
  /** 交割日（默认为 T+1） */
  deliveryDate: string;
  /** 交割日偏移值 */
  deliveryDateOffset?: DateOffsetValue;
};

export type UseDealDateMutationParams = {
  /** 产品类型 */
  productType: ProductType;
  /** 可选工作日范围，默认使用 useTradedDateRange(...DEAL_PANEL_TRADED_DATE_RANGE) */
  range?: string[];
  /** 可选工作日范围（Moment 类型），默认使用 useTradedDateRange(...DEAL_PANEL_TRADED_DATE_RANGE) */
  rangeMoment?: Moment[];
  /** 默认值，初始化时会用到 */
  defaultValue?: {
    /** 是否为未上市债券的日期选择 */
    unlisted?: boolean;
    /** 「今天」偏离按钮取值，默认使用今天的日期，未上市的债券使用上市日作为「今天」 */
    today?: string;
    /** 交易日 */
    tradedDate?: string;
    /** 交割日 */
    deliveryDate?: string;
  };
};

export type DealDateChangeParams = {
  /** 是否为未上市债券的日期选择 */
  unlisted?: boolean;
  /** 选择「今天」时的日期，默认为 Date.now() */
  today?: string;
  /** 可选工作日范围 */
  range: string[];
  /** 可选工作日范围（Moment 类型） */
  rangeMoment: Moment[];
  /** 改变时传入的原始状态 */
  state: DealDateMutationState;
  /** 日期 */
  date?: Moment | null;
  /** 偏离 */
  offset?: DateOffsetEnum;
};

/** 成交日期相关变更事件 */
export type DealDateMutateEvent = (params: {
  /** 变更类型 */
  type: 'traded-date' | 'delivery-date' | 'traded-date-offset' | 'delivery-date-offset';
  /** 日期 */
  date?: Moment | null;
  /** 偏离 */
  offset?: DateOffsetValue;
}) => DealDateMutationState;

export type ResetDealDateMutationParams = Partial<Omit<UseDealDateMutationParams, 'range' | 'rangeMoment'>>;
