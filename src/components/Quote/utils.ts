import { DealQuote, QuoteInsert } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { defaultFlagOptions } from '../business/CommentInput';
import { CommentInputFlagValue } from '../business/CommentInput/types';
import { CommentFlagKeys, CommentTagKeys, CommentTagStrOptions, QuotePriceType } from './types';

export const PingJiaFanYield = [
  'quote_type',
  'quote_price',
  'flag_rebate',
  'return_point',
  'yield',
  'clean_price',
  'full_price',
  'spread'
];

export const side2Uppercase = (quote: QuotePriceType | Partial<QuoteInsert> | DealQuote) => {
  if (quote.side === Side.SideBid) return 'BID';
  if (quote.side === Side.SideOfr) return 'OFR';
  return '--';
};

export const singleQuoteDialogDOMId = 'single-quote-dialog-body';
export const batchQuoteDialogDOMId = 'batch-quote-dialog-body';
export const settleQuoteDialogDOMId = 'settle-quote-dialog-body';

/** 获取按钮备注（交易所，点双边，请求报价，整量）对应的 label 字符串 */
export const getCommentFlagLabel = (flagValue?: CommentInputFlagValue) => {
  const keys: (typeof CommentFlagKeys)[number][] = [];
  for (const i in flagValue) {
    if (flagValue[i]) keys.push(i as (typeof CommentFlagKeys)[number]);
  }
  return keys.map(v => defaultFlagOptions.find(i => i.value === v)?.label).join('');
};

/** 获取标签（oco,打包）对应的 label 字符串 */
export const getCommentTagLabel = (flagValue?: { flag_oco?: boolean; flag_package?: boolean }) => {
  const keys: (typeof CommentTagKeys)[number][] = [];
  for (const i of CommentTagKeys) {
    if (flagValue?.[i]) keys.push(i);
  }
  return keys.map(v => CommentTagStrOptions.find(i => i.value === v)?.label).join('');
};

// TODO: 这里是一个补丁操作，后续从BondOper组件层面修复该问题
/** 请求出去滤掉不合法（意向价）的yield值 */
export const formatIntentionYield = (value?: number, flag_intention?: boolean) => {
  return ['BID', 'OFR', 'B', 'BI', 'O', 'OF'].includes(value?.toString() || '') && flag_intention ? undefined : value;
};
