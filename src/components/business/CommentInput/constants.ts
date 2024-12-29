import { CommentInputFlagOption } from './types';

export const defaultFlagOptions: CommentInputFlagOption[] = [
  { label: '交易所', value: 'flag_stock_exchange' },
  { label: '点双边', value: 'flag_bilateral' },
  { label: '请求报价', value: 'flag_request' },
  { label: '整量', value: 'flag_indivisible' }
];
