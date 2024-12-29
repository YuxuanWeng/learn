import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { PriceImmerWrapper, PriceState } from './types';

/** 报价类型 */
export const BondQuoteTypes = [
  { key: BondQuoteType.Yield, value: BondQuoteType.Yield, label: '收益率' },
  { key: BondQuoteType.CleanPrice, value: BondQuoteType.CleanPrice, label: '净价' }
];

export const DefaultPriceGroup: PriceImmerWrapper<PriceState> = {
  [Side.SideBid]: { quote_type: BondQuoteType.Yield },
  [Side.SideOfr]: { quote_type: BondQuoteType.Yield },
  [Side.SideNone]: { quote_type: BondQuoteType.Yield }
};

export const PriceGroupYield = [
  'price',
  'flag_rebate',
  'return_point',
  'quote_type',
  'flag_intention',
  'yield',
  'clean_price',
  'full_price',
  'spread'
];
