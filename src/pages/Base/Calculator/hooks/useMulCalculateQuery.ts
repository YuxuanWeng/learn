import { SERVER_NIL } from '@fepkg/common/constants';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { mulCalculate } from '@/common/services/api/base-data/mul-calculate';
import { MulCalculateQueryParams } from '@/pages/Base/Calculator/types';

export const getMulCalculateQueryKey = ({
  side,
  codeMarket,
  priceType,
  priceInfo,
  settlementDate,
  benchmarkRate,
  notional,
  simple = false
}: MulCalculateQueryParams) =>
  [
    APIs.baseData.mulCalculate,
    codeMarket,
    priceType,
    priceInfo[side],
    settlementDate,
    benchmarkRate,
    notional,
    simple
  ] as const;

export const getMulCalculateQueryFn: QueryFunction<
  BaseDataMulCalculate.CalculateResult[] | undefined,
  ReturnType<typeof getMulCalculateQueryKey>
> = async ({ queryKey, signal }) => {
  const [, codeMarket, priceType, priceState, settlementDate, benchmarkRate, notional, simple] = queryKey;

  if (!codeMarket || !settlementDate || !priceState?.quote_price) return undefined;

  const getReturnPoint = () => {
    if (!priceState?.return_point || priceState?.return_point === `${SERVER_NIL}`) return undefined;
    const returnPoint = Number(priceState?.return_point || '');

    if (returnPoint >= 0) return returnPoint;
    return undefined;
  };

  const item: BaseDataMulCalculate.CalculateItem = {
    bond_id: codeMarket,
    settlement_date: settlementDate,
    predict_rate: benchmarkRate ? Number(benchmarkRate) : undefined,
    notional: notional ? Number(notional) : undefined,
    return_point: getReturnPoint(),
    [priceType]: priceState?.quote_price ? Number(priceState?.quote_price || '') : undefined
  };

  const { result_list } = await mulCalculate({ item_list: [item], simple_validation: simple }, { signal });
  return result_list;
};

export const useMulCalculateQuery = (params: MulCalculateQueryParams) => {
  const { disabled = false, codeMarket, settlementDate, onError } = params;

  return useQuery({
    queryKey: getMulCalculateQueryKey(params),
    queryFn: getMulCalculateQueryFn,
    refetchOnWindowFocus: false,
    enabled: !!settlementDate && !!codeMarket && !disabled,
    staleTime: 30 * 1000,
    cacheTime: 30 * 1000,
    keepPreviousData: true,
    onError
  });
};
