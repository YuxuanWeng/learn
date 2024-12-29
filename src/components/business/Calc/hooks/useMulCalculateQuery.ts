import { useEffect } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { BondQuoteType, ExerciseType } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { mulCalculate } from '@/common/services/api/base-data/mul-calculate';
import { getPriceFiledWithQuoteType } from '@/common/utils/quote';
import { transFormExerciseToBoolean } from '../../ExerciseGroup/utils';
import { usePriceGroup } from '../../PriceGroup';
import { useCalcHead } from '../Head/CalcHeadProvider';

export const useMulCalculateQuery = (exercise: ExerciseType) => {
  const { settlementDate, bond, side, setCalcResult } = useCalcHead();
  const { priceInfo } = usePriceGroup();

  const isExercise = transFormExerciseToBoolean(exercise);

  let priceFiled = getPriceFiledWithQuoteType(priceInfo[side]?.quote_type || BondQuoteType.Yield);
  if (priceInfo[side]?.quote_type === BondQuoteType.Yield) {
    if (isExercise === true) priceFiled = 'yield_to_execution';
    else priceFiled = 'yield';
  }

  const getReturnPoint = () => {
    if (!priceInfo[side]?.return_point || priceInfo[side]?.return_point === `${SERVER_NIL}`) return undefined;
    return Number(priceInfo[side]?.return_point || '');
  };

  const queryFn = async () => {
    if (!settlementDate || !bond?.code_market) return [];

    const params: BaseDataMulCalculate.CalculateItem = {
      bond_id: bond.code_market,
      settlement_date: settlementDate,
      [priceFiled]: priceInfo[side]?.quote_price ? Number(priceInfo[side]?.quote_price || '') : undefined,
      return_point: getReturnPoint()
    };
    const { result_list } = await mulCalculate({ item_list: [params], simple_validation: true });
    return result_list;
  };

  const { data } = useQuery({
    queryKey: [APIs.baseData.mulCalculate, settlementDate, isExercise, bond, priceInfo] as const,
    queryFn,
    refetchOnWindowFocus: false,
    enabled: !!settlementDate && !!bond?.code_market,
    staleTime: 30 * 1000,
    cacheTime: 30 * 1000,
    keepPreviousData: true,
    onError: () => setCalcResult(undefined),
    select: d => {
      // 任何时间都去到期收益率作为展示
      const yieldVal = d?.[0]?.yield;
      return d?.[0] ? { ...d[0], yieldVal } : undefined;
    }
  });

  useEffect(() => {
    setCalcResult(data);
  }, [data, setCalcResult]);
};
