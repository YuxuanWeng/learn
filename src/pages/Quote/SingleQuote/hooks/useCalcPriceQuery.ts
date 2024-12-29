import { createQuery } from 'react-query-kit';
import { formatDate } from '@fepkg/common/utils/date';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { FiccBondBasic, LiquidationSpeed } from '@fepkg/services/types/common';
import { BondQuoteType, LiquidationSpeedTag, ProductType, Side } from '@fepkg/services/types/enum';
import { context } from '@opentelemetry/api';
import moment from 'moment';
import { mulCalculate } from '@/common/services/api/base-data/mul-calculate';
import { liqSpeedListAddMoments } from '@/common/utils/liq-speed';
import { logger } from '@/common/utils/logger';
import { QuoteOperImmerType, QuoteParamsType } from '../QuoteOper/QuoteOperProvider';
import { has, hasPrice } from '../utils';

export type SideCalcResult = BaseDataMulCalculate.CalculateResult | undefined;

export type CalcPriceQueryVar = {
  bond?: FiccBondBasic;
  bidIndex?: number;
  ofrIndex?: number;
  quoteParams: QuoteOperImmerType<QuoteParamsType>;
  bidIsValid: boolean;
  ofrIsValid: boolean;
};

export type DblSideCalcPriceMap = { [key in Side.SideBid | Side.SideOfr]?: BaseDataMulCalculate.CalculateResult };
/** External & Internal price */
export type EIPriceMap = { [key in 'external' | 'internal']?: DblSideCalcPriceMap };
export type CalcPriceMap = { [key: string]: EIPriceMap };

export type CalcItem = {
  side: Side.SideBid | Side.SideOfr;
  calcParams: BaseDataMulCalculate.CalculateItem;
  quoteParams: QuoteOperImmerType<QuoteParamsType>;
};

const transform2CalcParams = async (bond?: FiccBondBasic, quote?: QuoteParamsType) => {
  if (!has(bond)) return void 0;

  const params: BaseDataMulCalculate.CalculateItem = {
    bond_id: bond.code_market,
    settlement_date: ''
  };

  // 意向价，不需要检查倒挂
  if (quote?.flag_intention) return void 0;

  const modifiedPrice = Number.isNaN(Number(quote?.quote_price)) ? void 0 : Number(quote?.quote_price);

  if (quote?.quote_type === BondQuoteType.Yield) {
    // 是否含权还需要加上行权日是否在当天之后
    const isAfterOptionDay = moment(formatDate(bond?.option_date)).isAfter(Date.now(), 'day');

    if (bond.has_option && isAfterOptionDay) {
      // 如果含权债是否含权没赋值，就根据债券台子选择默认值
      if (quote?.is_exercise === undefined) quote.is_exercise = bond.product_type === ProductType.BCO;
    }

    // 如果含权，使用行权收益率计算
    if (bond.has_option && isAfterOptionDay && quote?.is_exercise) {
      params.yield_to_execution = quote?.yield ?? modifiedPrice;
    }
    // 否则使用到期收益率计算
    else params.yield = quote?.yield ?? modifiedPrice;

    // 如果有返点
    if (quote?.flag_rebate) params.return_point = quote?.return_point;
  } else if (quote?.quote_type === BondQuoteType.CleanPrice) {
    params.clean_price = quote?.clean_price ?? modifiedPrice;
  }

  // 如果这些都没有价格，直接返回 void 0
  if (
    !(
      hasPrice(params?.yield) ||
      hasPrice(params?.yield_to_execution) ||
      hasPrice(params?.clean_price) ||
      hasPrice(modifiedPrice)
    )
  ) {
    return void 0;
  }

  const liqSpeedList: LiquidationSpeed[] = [];

  switch (bond.product_type) {
    case ProductType.BCO:
      // 信用计算器默认使用「明天+0」
      liqSpeedList.push({ tag: LiquidationSpeedTag.Tomorrow, offset: 0 });
      break;

    case ProductType.BNC:
      // 利率计算器默认使用「+1」
      liqSpeedList.push({ tag: LiquidationSpeedTag.Today, offset: 1 });
      break;

    // 存单默认使用「+0」
    case ProductType.NCD:
      liqSpeedList.push({ tag: LiquidationSpeedTag.Today, offset: 0 });
      break;

    default:
      break;
  }

  const [target] = await liqSpeedListAddMoments(liqSpeedList);
  params.settlement_date = formatDate(target.deliveryDate);

  return params;
};

/** 根据入参获取 CalcPriceMap 的 key */
export const getEiPriceMapKey = (params: QuoteOperImmerType<QuoteParamsType> & { codeMarket?: string }) => {
  const { codeMarket } = params ?? {};
  // 2.13 支持同交易员多报价，在协同报价处可以报多个 codeMarket 相同的债券，这个时候需要用序列化后报价参数也作为计算缓存的 key
  return `CalcPriceMapKey_${codeMarket}_${JSON.stringify(params)}`;
};

export const useCalcPriceQuery = createQuery<CalcPriceMap, CalcPriceQueryVar[]>({
  primaryKey: APIs.baseData.mulCalculate,
  queryFn: async ({ signal, queryKey: [, vars] }) => {
    const map: CalcPriceMap = {};
    const calcList: CalcItem[] = [];
    const ctx = context.active();

    logger.ctxInfo(ctx, `[useCalcPriceQuery] start cal, vars=${JSON.stringify(vars)}`);

    try {
      await Promise.all(
        vars.map(async ({ bond, quoteParams, bidIsValid, ofrIsValid }) => {
          const bidQuote = quoteParams[Side.SideBid];
          const ofrQuote = quoteParams[Side.SideOfr];

          const [bidCalParams, ofrCalParams] = await Promise.all([
            bidIsValid ? transform2CalcParams(bond, bidQuote) : void 0,
            ofrIsValid ? transform2CalcParams(bond, ofrQuote) : void 0
          ]);

          if (bidIsValid && bidCalParams) calcList.push({ side: Side.SideBid, calcParams: bidCalParams, quoteParams });
          if (ofrIsValid && ofrCalParams) calcList.push({ side: Side.SideOfr, calcParams: ofrCalParams, quoteParams });
        })
      );

      if (!calcList.length) {
        logger.ctxInfo(ctx, `[useCalcPriceQuery] cal empty list = ${JSON.stringify(map)}`);
        return map;
      }

      const { result_list = [] } = await mulCalculate(
        { item_list: calcList.map(i => i.calcParams), simple_validation: true },
        { signal, hideErrorMessage: true, traceCtx: ctx }
      );

      for (const [idx, res] of result_list.entries()) {
        const { side, quoteParams } = calcList[idx];
        const { flag_internal } = quoteParams?.[side] ?? {};

        const key = getEiPriceMapKey({ codeMarket: res.bond_id, ...quoteParams });
        const eiPriceMap: EIPriceMap = { ...map[key] };

        if (flag_internal) eiPriceMap.internal = { ...eiPriceMap?.internal, [side]: res };
        else eiPriceMap.external = { ...eiPriceMap?.external, [side]: res };

        map[key] = eiPriceMap;
      }

      logger.ctxInfo(ctx, `[useCalcPriceQuery] cal result = ${JSON.stringify(map)}`);
    } catch (err) {
      logger.ctxError(ctx, `[useCalcPriceQuery] failed cal, err=${err}`);
    }

    return map;
  },
  notifyOnChangeProps: ['data'],
  enabled: (_, vars) => !!vars.length,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: 30 * 1000
});
