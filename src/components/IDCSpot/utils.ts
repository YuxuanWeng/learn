import { DealQuote, LiquidationSpeed } from '@fepkg/services/types/common';
import { DealType, LiquidationSpeedTag, Side } from '@fepkg/services/types/enum';
import { WindowName } from 'app/types/window-v2';
import { isEqual, isNumber, pick } from 'lodash-es';
import {
  isDefaultOrToday1Tomorrow0Liquidation,
  isFRALiquidation,
  liquidationDateToTag
} from '@packages/utils/liq-speed';
import BitOper from '@/common/utils/bit';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { isNumberNil } from '@/common/utils/quote';
import { getReadableYield } from '@/common/utils/quote-price';
import { AllPriceTypeProps, IQuoteDialogOption } from '../Quote/types';
import {
  ComparableIDCSpotQuote,
  ComparableSpotDate,
  ComparableSpotPricing,
  SpotAppointModalProps,
  SpotDate,
  SpotModalProps
} from './types';

export const dashedLine = ['border-dashed', 'border-transparent', 'border-b', 'border-b-gray-600'];

/**
 * 转换类型以复用显示价格逻辑
 */
export const getBondQuoteSyncLikePriceFromSpotPricing = (
  dealType: DealType,
  spot: ComparableSpotPricing
): ComparableIDCSpotQuote => ({
  ...pick(spot, ...AllPriceTypeProps, 'return_point'),
  quote_price: spot.price,
  side: dealType === DealType.TKN ? Side.SideOfr : Side.SideBid,
  quote_type: spot.price_type,
  flag_rebate: !isNumberNil(spot.return_point)
});

type IsValidSpotFn = (
  quote: DealQuote,
  options?: {
    includeDate?: SpotDate;
    scattered?: boolean;
    internalTwoStars?: boolean;
  }
) => boolean;

/**
 * 计算器正常时，净价相同则同一档位；计算器异常时，仅同一报价类型的报价可以通过对应的价格判断，不同报价类型之间无法判断
 * @see electron/packages/data-process-core/data-client/service/utils.ts
 */
export const isSameQuote = <T extends ComparableIDCSpotQuote>(a?: T, b?: T) => {
  if (a && b) {
    const cleanPriceCompareValid = isNumber(a.clean_price) && isNumber(b.clean_price) && a.clean_price > 0;
    if (cleanPriceCompareValid) {
      return a.clean_price?.toFixed(4) === b.clean_price?.toFixed(4);
    }
    const yA = getReadableYield<T>(a);
    const yB = getReadableYield<T>(b);
    return yA !== '--' && yA === yB;
  }
  return false;
};

export const isValidSpot: IsValidSpotFn = (quote, options) => {
  options = {
    includeDate: SpotDate.NonFRA,
    ...options
  };
  const { includeDate } = options;
  let isValid = true;
  const hasLiqArr = Array.isArray(quote?.deal_liquidation_speed_list);
  if (hasLiqArr) {
    const arr = liquidationDateToTag(quote.deal_liquidation_speed_list as LiquidationSpeed[]);
    switch (includeDate) {
      case SpotDate.Plus0:
        isValid = arr?.some(liq => liq.tag === LiquidationSpeedTag.Today && liq.offset === 0);
        break;
      case BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0):
        isValid = arr?.some(isDefaultOrToday1Tomorrow0Liquidation);
        break;
      case SpotDate.FRA:
        break;
      default:
        isValid = arr?.some(liq => !isFRALiquidation(liq));
        break;
    }
  }
  if (includeDate === SpotDate.FRA) isValid = true;
  return isValid;
};

export const getUpdatedOrAddedQuoteIds = (oldList: DealQuote[], newList: DealQuote[]) => {
  return newList.reduce(
    (acc, item) => {
      const sameOne = oldList.find(old => old.quote_id === item.quote_id);
      if (!sameOne || sameOne.update_time !== item.update_time) {
        acc.push(item.quote_id);
      }
      return acc;
    },
    [] as DealQuote['quote_id'][]
  );
};

export const isSpotDateAllIncluded = (targetSpotProp?: ComparableSpotDate, allSpotProp?: ComparableSpotDate) => {
  // 如果是远期，则需判断每个结算方式条件在完整的单条数据中都被包含(理论上只会有一条)
  if (targetSpotProp?.spotDate === SpotDate.FRA) {
    return targetSpotProp.optimal?.deal_liquidation_speed_list?.every(
      liqA => allSpotProp?.optimal?.deal_liquidation_speed_list?.some(liqB => isEqual(liqA, liqB))
    );
  }
  return targetSpotProp?.spotDate === allSpotProp?.spotDate;
};

export const isSameSpotDate = (spotPropsA?: ComparableSpotDate, spotPropsB?: ComparableSpotDate) => {
  if (spotPropsA?.spotDate === SpotDate.FRA) {
    return isEqual(spotPropsA?.optimal?.deal_liquidation_speed_list, spotPropsB?.optimal?.deal_liquidation_speed_list);
  }
  return spotPropsA?.spotDate === spotPropsB?.spotDate;
};

export function calcTotalVolume(list?: Pick<DealQuote, 'volume'>[]): number {
  const total =
    list?.reduce((acc, quote) => {
      acc += quote.volume;
      return acc;
    }, 0) || 0;
  return total;
}

export const getSpotIdPrefix = (option?: ComparableSpotDate) =>
  option?.spotDate === SpotDate.FRA
    ? formatLiquidationSpeedListToString(option.optimal?.deal_liquidation_speed_list || [], 'MM/DD')
    : option?.spotDate || '';

/**
 * 获取点价窗口id
 */
export const getSpotId = (option?: SpotModalProps) => {
  if (!option) return '';
  return `${WindowName.IdcSpot}_${option.bond.key_market}_${option.dealType}_${getSpotIdPrefix(option)}`.replace(
    /_$/,
    ''
  );
};

export interface ISpotAppointProps extends IQuoteDialogOption, SpotAppointModalProps {}
/**
 * 获取指定模式点价窗口id
 */
export const getSpotAppointKey = (option?: ISpotAppointProps) => {
  if (!option) return '';
  return `${WindowName.IdcAppointSpot}_${option.quote?.quote_id}_${option.dealType}_${option.openTimestamp}`.replace(
    /_$/,
    ''
  );
};

export const calcSpotDialogHeight = (quoteListCount: number) => {
  return 274 + 32 * Math.min(quoteListCount, 10);
};
