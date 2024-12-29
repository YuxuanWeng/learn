import { DealQuote, FiccBondBasic, LiquidationSpeed } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { find, isEqual, uniq } from 'lodash-es';
import { QuoteOptimalListMap } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { SpotDate, SpotModalProps } from '@/components/IDCSpot/types';
import { isValidSpot } from '@/components/IDCSpot/utils';
import { IGrid } from '../types';
import { sortOptimal } from '../utils';

export const getList = (
  dealType: DealType,
  deal_liquidation_speed_list?: LiquidationSpeed[],
  data?: QuoteOptimalListMap,
  spotDate?: SpotDate
) => {
  let result: DealQuote[] | undefined = void 0;

  const isFra = spotDate === SpotDate.FRA;
  const theFraUniqLiq = deal_liquidation_speed_list?.[0];
  const isFraMode = !!data && isFra && !!theFraUniqLiq;

  if (dealType === DealType.GVN) result = data?.bidOptimalQuoteList;
  if (dealType === DealType.TKN) result = data?.ofrOptimalQuoteList;
  if (isFraMode) {
    const transFraList = (list?: DealQuote[]) =>
      list
        ?.filter(item => item.deal_liquidation_speed_list?.some(liq => isEqual(liq, theFraUniqLiq) === true))
        .map(item => ({
          ...item,
          liquidation_speed_list: deal_liquidation_speed_list?.slice()
        }));
    result = transFraList(result);
    if (!result?.length) {
      if (dealType === DealType.GVN) {
        result = data?.bidSubOptimalQuoteList;
      } else if (dealType === DealType.TKN) {
        result = data?.ofrSubOptimalQuoteList;
      } else {
        result = undefined;
      }
    }
    result = transFraList(result);
  }
  result = result?.filter(item =>
    isValidSpot(item, {
      includeDate: spotDate
    })
  );
  return result;
};

const getPricingLiqs = (deal_liquidation_speed_list?: LiquidationSpeed[], spotDate?: SpotDate) => {
  let pricingLiquidations: LiquidationSpeed[] | undefined = void 0;
  if (spotDate === SpotDate.FRA && deal_liquidation_speed_list?.length) {
    pricingLiquidations = deal_liquidation_speed_list;
  }
  return pricingLiquidations;
};

export const getOptimal = (
  dealType: DealType,
  deal_liquidation_speed_list?: LiquidationSpeed[],
  data?: QuoteOptimalListMap,
  spotDate?: SpotDate
) => {
  const list = getList(dealType, deal_liquidation_speed_list, data, spotDate);
  const pricingLiquidations = getPricingLiqs(deal_liquidation_speed_list, spotDate);
  const optQuote: DealQuote | undefined = list?.sort(sortOptimal)?.[0];
  if (optQuote && pricingLiquidations?.length) {
    const mergeList = (optQuote.deal_liquidation_speed_list || [])
      .filter(liq => !!find(pricingLiquidations, liq))
      .concat(pricingLiquidations);
    optQuote.deal_liquidation_speed_list = uniq(mergeList);
  }
  return optQuote;
};

export const getPricingProps = (
  dealType: DealType,
  bond?: FiccBondBasic,
  deal_liquidation_speed_list?: LiquidationSpeed[],
  data?: QuoteOptimalListMap,
  spotDate?: SpotDate
): SpotModalProps | undefined => {
  if (!bond || !dealType) return undefined;
  const list = getList(dealType, deal_liquidation_speed_list, data, spotDate);
  const optimal = getOptimal(dealType, deal_liquidation_speed_list, data, spotDate);
  if (!list?.length || !optimal) return undefined;
  return {
    dealType,
    bond,
    quoteList: list,
    spotDate,
    optimal
  };
};

/**
 * @param dealType GVN/TKN
 * @param bond 当前债券数据
 * @param deal_liquidation_speed_list 详细的结算方式
 * @param data 本地化接口传来的原始数据
 * @param spotDate 结算方式枚举 例如:FRA
 * */
export const getSpotModalProps = (
  dealType: DealType,
  bond?: FiccBondBasic,
  deal_liquidation_speed_list?: LiquidationSpeed[],
  data?: QuoteOptimalListMap,
  spotDate?: SpotDate
): SpotModalProps | undefined => {
  const optimal = getOptimal(dealType, deal_liquidation_speed_list, data, spotDate);
  if (!optimal) return void 0;
  return getPricingProps(dealType, bond, deal_liquidation_speed_list, data, spotDate);
};

const isEmptyGrid = (grid: IGrid) => {
  const q = grid.quote ? { ...grid.quote, side: -1 } : null;
  return isEqual(q, { quote: { side: -1 } });
};

export const getSummaryQuote = (gridLst: IGrid[]) =>
  gridLst
    .filter(grid => !isEmptyGrid(grid))
    .map(grid => grid.quote)
    .filter(Boolean)
    .sort(sortOptimal)[0] || {
    side: gridLst[0]?.quote?.side
  };
