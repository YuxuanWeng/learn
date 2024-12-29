import { Broker } from '@fepkg/services/types/common';

export type QuoteState = {
  /** 价格 */
  quotePrice?: number;
  /** 报价量 */
  quoteVolume?: number;
  /** 是否返点 */
  flagRebate?: boolean;
  /** 交易所 */
  flagStockExchange?: boolean;
  /** 整量 */
  flagIndivisible?: boolean;
  /** 紧急 */
  flagUrgent?: boolean;
  /** 1-单星 2-双星 */
  flagStar?: number;
  /** oco */
  flagOco?: boolean;
  /** 交换 */
  flagExchange?: boolean;
  /** 打包 */
  flagPackage?: boolean;
  /** 返点值 */
  returnPoint?: number;
  /** 行权/到期 */
  isExercise: boolean;
  /** 是否手动行权 */
  isExerciseManual: boolean;
  /** CP */
  cp: string;
  /** 是否为内部报价 */
  flagInternal: boolean;
  /** Broker */
  broker?: Broker;
  /** 结算方式字符串 */
  liqSpeed?: string;
};

export type FlagsProps = Pick<
  QuoteState,
  'flagStockExchange' | 'flagIndivisible' | 'flagUrgent' | 'flagStar' | 'flagOco' | 'flagExchange' | 'flagPackage'
> & { className?: string };
