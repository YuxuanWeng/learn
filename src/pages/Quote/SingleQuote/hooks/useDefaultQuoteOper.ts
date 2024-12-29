import { QuoteLite } from '@fepkg/services/types/common';
import { pick } from 'lodash-es';
import { QuoteCalcYield, QuoteFlagsYield } from '../constants';
import { QuoteActionMode } from '../types';

export const useDefaultQuoteOper = (initialState?: Partial<QuoteLite>, mode = QuoteActionMode.ADD) => {
  if (!initialState || !initialState.quote_type || !initialState.side) {
    // 如果报价信息中不存在 quote_type 或 side, 则认为是不合法的报价数据
    return { defaultQuoteFlags: {}, defaultPricePart: {}, defaultVolume: {}, defaultCalc: {} };
  }

  const { side } = initialState;

  const defaultQuoteFlags = { [side]: pick(initialState, QuoteFlagsYield) };

  const defaultVolume = { [side]: initialState.volume || void 0 };

  const defaultCalc = { [side]: pick(initialState, QuoteCalcYield) };

  /** 报价类型为join时，局部继承 */
  if (mode === QuoteActionMode.JOIN) {
    return {
      defaultQuoteFlags: { [side]: { flag_intention: initialState.flag_intention } },
      defaultVolume,
      defaultCalc: {
        [side]: {
          is_exercise: defaultCalc[side].is_exercise,
          exercise_manual: defaultCalc[side].exercise_manual
        }
      }
    };
  }

  return { defaultQuoteFlags, defaultVolume, defaultCalc };
};
