import { numberLimitedRegexp } from '@fepkg/common/utils';
import { BondQuoteType } from '@fepkg/services/types/enum';
import { PriceState } from '@/components/business/PriceGroup';
import { PriceType } from '@/pages/Base/Calculator/types';

/** 默认价格信息 */
export const defaultPrice: PriceState = {
  quote_price: undefined,
  quote_type: BondQuoteType.Yield,
  return_point: undefined,
  flag_rebate: false,
  flag_intention: false
};
/** 默认面板信息 */

export const BenchmarkRE = numberLimitedRegexp(3, 4);
export const NotionalRE = numberLimitedRegexp(7, 2);

export const PriceTypeMapBondQuoteType = {
  [PriceType.None]: BondQuoteType.TypeNone,
  [PriceType.Yield]: BondQuoteType.Yield,
  [PriceType.CleanPrice]: BondQuoteType.CleanPrice,
  [PriceType.FullPrice]: BondQuoteType.FullPrice,
  [PriceType.Spread]: BondQuoteType.Spread,
  [PriceType.YieldToExecution]: BondQuoteType.Yield
};
