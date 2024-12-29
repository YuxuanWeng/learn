import { useLayoutEffect, useState } from 'react';
import { hasOption } from '@fepkg/business/utils/bond';
import { fixFloatDecimal, number2Percent } from '@fepkg/common/utils';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { fetchBondBenchMarkRate } from '@/common/services/api/base-data/bond-benchmark-rate-get';
import { isNumberNil } from '@/common/utils/quote';

type InitialState = {
  /** 报价方向 */
  side: Side;
  /** 债券信息 */
  bond?: FiccBondBasic;
  /** 默认备注内容 */
  comment?: string;
  /** 默认是否行权 */
  isExercise?: boolean;
  /** 是否手动操作行权 */
  exerciseManual?: boolean;
};

const CalcHeadContainer = createContainer((initialState?: InitialState) => {
  const bond = initialState?.bond;
  const isHasOptionBond = hasOption(bond);

  const [calcResult, setCalcResult] = useState<
    (BaseDataMulCalculate.CalculateResult & { yieldVal?: number }) | undefined
  >();
  const [bench, setBench] = useState<string | undefined>();

  const [settlementDate, setSettlementDate] = useState<string | undefined>();

  /** 查询债券基准利率 */
  useLayoutEffect(() => {
    if (!bond?.key_market) return;
    (async () => {
      const res = await fetchBondBenchMarkRate({ key_market: bond.key_market });
      if (!res.benchmark_rate?.value) return;
      setBench(res.benchmark_rate.value.toFixed(4));
    })();
  }, [bond?.key_market]);

  const getBondPriceOptions = useMemoizedFn(() => {
    // 选中行权，则展示到期收益率，选中到期，则展示行权收益率
    let yieldPrice: string | number | undefined = calcResult?.yieldVal;

    if (yieldPrice) yieldPrice = number2Percent(+yieldPrice * 0.01, 4);
    let cleanPrice: number | undefined = calcResult?.clean_price;
    if (isNumberNil(cleanPrice)) cleanPrice = void 0;
    else if (cleanPrice) cleanPrice = fixFloatDecimal(cleanPrice, 4);

    return [
      { label: '结算日', value: settlementDate, className: '!h-6' },
      { label: '基准利率', value: bench, className: 'ml-7 !h-6' },
      { label: '收益率', value: yieldPrice, className: '!h-6' },
      { label: '净价', value: cleanPrice, className: 'ml-7 !h-6' }
    ];
  });

  return {
    isHasOptionBond,
    getBondPriceOptions,
    settlementDate,
    bond,
    side: initialState?.side || Side.SideBid,
    setCalcResult,
    setSettlementDate
  };
});

export const CalcHeadProvider = CalcHeadContainer.Provider;
export const useCalcHead = CalcHeadContainer.useContainer;
