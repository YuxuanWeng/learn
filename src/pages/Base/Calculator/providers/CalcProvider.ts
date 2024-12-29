import { useEffect, useRef, useState } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { hasOption } from '@fepkg/business/utils/bond';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { CheckboxValue } from '@fepkg/components/Checkbox';
import { SearchOption } from '@fepkg/components/Search';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import moment, { Moment } from 'moment';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useBenchmarkRateQuery } from '@/common/services/hooks/useBenchmarkRateQuery';
import { trackSpecialSlow } from '@/common/utils/logger/special';
import { getExerciseValue } from '@/components/business/ExerciseGroup/utils';
import { HandleChangeCategory, HandleChangeValType, usePriceGroup } from '@/components/business/PriceGroup';
import { useProductParams } from '@/layouts/Home/hooks';
import { PriceTypeMapBondQuoteType, defaultPrice } from '@/pages/Base/Calculator/common';
import { getDefaultOffset, isPriceTypeInvalid } from '@/pages/Base/Calculator/utils';
import useUnit from '@/pages/Quote/SingleQuote/hooks/useUnit';
import { PanelState, PriceType } from '../types';

type InitialState = {
  /** 报价方向 */
  side: Side;
  /** 默认是否行权 */
  isExercise?: boolean;
  /** 是否手动操作行权 */
  exerciseManual?: boolean;
};

export const CalcContainer = createContainer((initialState?: InitialState) => {
  const { bondSearchState, updateBondSearchState } = useBondSearch();
  const { getPriceRef, priceInfo, updatePriceInfo, handleInnerChange } = usePriceGroup();
  const { unit, updateUnit } = useUnit();
  const { productType } = useProductParams();

  const bond = bondSearchState.selected?.original;
  const keyMarket = bond?.key_market;
  const side = initialState?.side ?? Side.SideNone;

  const [isExercise, setIsExercise] = useState(() =>
    getExerciseValue(hasOption(bond), initialState?.isExercise, initialState?.exerciseManual)
  ); // 是否行权
  const [settlePickerOpen, setSettlePickerOpen] = useState(false);
  const [offsetLoading, setOffsetLoading] = useState(false);
  const settleRef = useRef<{ focus: () => void; blur: () => void } | null>(null);

  const [panelState, updatePanelState] = useImmer<PanelState>(() => ({
    hasBenchmark: false,
    benchmarkRate: null,
    priceType: PriceType.Yield,
    settlementDate: null,
    offset: getDefaultOffset(productType),
    benchmarkDate: null,
    notional: undefined
  }));

  const benchRateQuery = useBenchmarkRateQuery({
    key_market: keyMarket ?? ''
  });

  // 债券变更后刷新 benchmark_rate
  useEffect(() => {
    updatePanelState(draft => {
      draft.hasBenchmark = !!benchRateQuery.data?.benchmark_rate;
      draft.benchmarkRate = benchRateQuery.data?.benchmark_rate ?? null;
    });
  }, [benchRateQuery.data?.benchmark_rate, updatePanelState]);

  const setCalcResult = (result?: BaseDataMulCalculate.CalculateResult) => {
    updatePanelState(draft => {
      draft.result = result;
    });
  };

  const onPriceTypeChange = (val: CheckboxValue[]) => {
    updatePanelState(draft => {
      draft.priceType = val[side] as PriceType;
    });
    updatePriceInfo(side, { ...priceInfo[side], quote_type: PriceTypeMapBondQuoteType[val[side] as PriceType] });
  };

  const onPriceChange = (val: HandleChangeValType) => {
    if (
      val.category === HandleChangeCategory.F &&
      ![PriceType.Yield, PriceType.YieldToExecution].includes(panelState.priceType)
    ) {
      updatePanelState(draft => {
        draft.priceType = PriceType.Yield;
      });
    }
    if (val.category === HandleChangeCategory.Price) {
      handleInnerChange({ ...val, ignoreThreshold: true });
    } else {
      handleInnerChange(val);
    }
  };

  const handleSettlementChange = async (day: Moment | null, needUpdateOffset = true) => {
    updatePanelState(draft => {
      draft.settlementDate = day;
    });
    if (!needUpdateOffset) return;
    try {
      let offset = DateOffsetEnum.OTHER;
      const today = Date.now();
      setOffsetLoading(true);
      const plus0 = getNextTradedDate(today, true);
      const plus1 = getNextTradedDate(today);
      if (formatDate(day) === plus0) {
        offset = DateOffsetEnum.PLUS_0;
      } else if (formatDate(day) === plus1) {
        offset = DateOffsetEnum.PLUS_1;
      }
      updatePanelState(draft => {
        draft.offset = offset;
      });
    } catch (err) {
      trackSpecialSlow('on-settlement-change-error', err);
    } finally {
      setOffsetLoading(false);
    }
  };

  const disabledSettleDate: RangePickerProps['disabledDate'] = useMemoizedFn((curr: Moment) => {
    if (!bond) return false;
    const [day1, day2] = [bond.interest_start_date, bond.maturity_date].filter(Boolean).map(normalizeTimestamp);
    return curr.isBefore(day1) || curr.isSameOrAfter(day2);
  });

  const handleDateOffsetChange = useMemoizedFn(
    async (v: DateOffsetEnum, needUpdateDate = true, selectedBond?: FiccBondBasic) => {
      updatePanelState(draft => {
        draft.offset = v;
      });
      if (!needUpdateDate) return;
      const tmpBond = selectedBond || bond;

      const today = moment();
      let startDate: Moment | undefined;
      // 未上市债券从上市日起算
      if (tmpBond?.listed_date) {
        const listedTime = moment(normalizeTimestamp(tmpBond?.listed_date));
        if (listedTime.isAfter(today)) {
          startDate = listedTime;
        }
      }
      let settlement = startDate ?? today;
      switch (v) {
        case DateOffsetEnum.OTHER:
          setSettlePickerOpen(true);
          if (settleRef?.current) {
            settleRef.current.focus?.();
          }
          break;
        case DateOffsetEnum.PLUS_0:
          try {
            setOffsetLoading(true);
            settlement = moment(getNextTradedDate(settlement, true));
          } catch (err) {
            trackSpecialSlow('on-date-offset-change-error', err);
          } finally {
            setOffsetLoading(false);
          }
          break;
        case DateOffsetEnum.PLUS_1:
          try {
            setOffsetLoading(true);
            settlement = moment(getNextTradedDate(settlement));
          } catch (err) {
            trackSpecialSlow('on-date-offset-change-error', err);
          } finally {
            setOffsetLoading(false);
          }
          break;
        default:
          break;
      }
      updatePanelState(draft => {
        draft.settlementDate = settlement;
      });
    }
  );

  const onBondClear = () => {
    updateBondSearchState(draft => {
      draft.keyword = '';
      draft.selected = null;
    });
    updatePanelState(draft => {
      draft.benchmarkRate = null;
      draft.settlementDate = null;
      draft.offset = DateOffsetEnum.PLUS_1;
      draft.notional = undefined;
      draft.result = undefined;
    });
    updatePriceInfo(side, defaultPrice);
    setSettlePickerOpen(false);
  };

  const onBondChange = (opt: SearchOption<FiccBondBasic> | null | undefined) => {
    if (!opt) {
      onBondClear();
      return;
    }
    updateBondSearchState(draft => {
      draft.selected = opt;
    });
    handleDateOffsetChange(panelState.offset, true, opt.original);
    if (isPriceTypeInvalid(panelState.priceType, !!priceInfo[0]?.flag_rebate, opt.original)) {
      updatePanelState(draft => {
        draft.priceType = PriceType.Yield;
      });
    }
    getPriceRef(side).priceRef.current?.focus?.();
  };

  return {
    bond,
    side,
    panelState,
    updatePanelState,
    setCalcResult,
    unit,
    updateUnit,
    priceInfo,
    benchRateQuery,
    isExercise,
    settleRef,
    setIsExercise,
    onPriceTypeChange,
    onPriceChange,
    onBondChange,
    offsetLoading,
    settlePickerOpen,
    setSettlePickerOpen,
    handleSettlementChange,
    disabledSettleDate,
    handleDateOffsetChange
  };
});

export const CalcProvider = CalcContainer.Provider;
export const useCalcState = CalcContainer.useContainer;
