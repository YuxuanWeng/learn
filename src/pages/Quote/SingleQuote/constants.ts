import { BondQuoteType, Side } from '@fepkg/services/types/enum';

/** 报价面板底部复选框选项 */
export const QUOTE_FLAG_OPTIONS = [
  { label: '内部报价', value: 'flag_internal' },
  { label: '紧急', value: 'flag_urgent' },
  { label: '推荐', value: 'flag_recommend' },
  { label: '续量', value: 'flag_sustained_volume' }
] as const;

/** 报价Flag涉及到的字段 */
export const QuoteFlagsYield = ['flag_intention', 'flag_star', 'flag_exchange', 'flag_package', 'flag_oco'];

/** 报价price部分涉及到的字段 */
export const QuotePriceYield = [
  'flag_rebate',
  'return_point',
  'quote_type',
  'yield',
  'clean_price',
  'full_price',
  'spread'
];

/** 报价备注计算涉及到的字段 */
export const QuoteCalcYield = [
  'comment',
  'liquidation_speed_list',
  'is_exercise',
  'exercise_manual',
  'traded_date',
  'settlement_date',
  'delivery_date',
  'flag_stock_exchange',
  'flag_bilateral',
  'flag_request',
  'flag_indivisible'
];

/** 报价面板底部flags涉及字段 */
export const QuoteFooterFlagsYield = ['flag_internal', 'flag_recommend', 'flag_urgent'];

/** 报价price部分的默认值 */
export const DefaultPrice = {
  [Side.SideBid]: { quote_type: BondQuoteType.Yield },
  [Side.SideOfr]: { quote_type: BondQuoteType.Yield }
};

/** 意向价Icon显示对应的map */
export const IntentionIconMap = { [Side.SideBid]: 'BID', [Side.SideOfr]: 'OFR' };

/** 意向价文字显示对应的map */
export const IntentionMap = { [Side.SideBid]: ['BID', 'BI', 'B'], [Side.SideOfr]: ['OFR', 'OF', 'O'] };

export const IntentionField = ['BID', 'BI', 'B', 'OFR', 'OF', 'O'];

/** 债证默认选中状态 */
export const default_valuation_status = { [Side.SideBid]: false, [Side.SideOfr]: false };

export const LOGGER_TRACE_FIELD = 'single-quote-traceId';
export const LOGGER_FLOW_NAME = 'single-quote-flow';

export const LOGGER_SUBMIT_CHECK = 'single-quote-submit-check';
export const LOGGER_EXCHANGE_SIDE = 'single-quote-exchange-side';
