import { useMemo } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Side } from '@fepkg/services/types/enum';
import { useImmer } from 'use-immer';
import type { QuoteOperImmerType } from '../QuoteOper/QuoteOperProvider';
import { YieldEnum } from '../QuoteOper/types';
import { default_valuation_status } from '../constants';
import { exchangeFn } from '../utils';

/** 计算债/证估值 */
const useValuation = () => {
  const { bondSearchState } = useBondSearch();

  const bond = bondSearchState.selected?.original;

  const [checkedZhai, setZhaiChecked] = useImmer<QuoteOperImmerType<boolean>>(default_valuation_status);
  const [checkedZheng, setZhengChecked] = useImmer<QuoteOperImmerType<boolean>>(default_valuation_status);

  /** 获取当前债券的中债估值 */
  const zhaiValue = useMemo(() => {
    const zhaiYield = hasOption(bond) ? YieldEnum.ExeZhai : YieldEnum.MatZhai;
    const value = bond?.[zhaiYield] === SERVER_NIL ? undefined : bond?.[zhaiYield];
    return value;
  }, [bond]);

  /** 获取当前债券的中证估值 */
  const zhengValue = useMemo(() => {
    const zhengYield = hasOption(bond) ? YieldEnum.ExeZheng : YieldEnum.MatZheng;
    const value = bond?.[zhengYield] === SERVER_NIL ? undefined : bond?.[zhengYield];
    return value;
  }, [bond]);

  /** 更新债的选中态 */
  const updateZhaiStatus = (side: Side, val: boolean) => {
    setZhaiChecked(draft => {
      draft[side] = val;
    });
    if (val) {
      setZhengChecked(draft => {
        draft[side] = false;
      });
    }
  };

  /** 更新证的选中态 */
  const updateZhengStatus = (side: Side, val: boolean) => {
    setZhengChecked(draft => {
      draft[side] = val;
    });
    if (val) {
      setZhaiChecked(draft => {
        draft[side] = false;
      });
    }
  };

  /** 取消债/证单方向的选中态 */
  const clearChecked = (side: Side) => {
    setZhengChecked(draft => {
      draft[side] = false;
    });
    setZhaiChecked(draft => {
      draft[side] = false;
    });
  };

  /** 清除双边状态 */
  const clear = () => {
    clearChecked(Side.SideBid);
    clearChecked(Side.SideOfr);
  };

  /** 交换选中态 */
  const exchange = () => {
    setZhaiChecked(exchangeFn);
    setZhengChecked(exchangeFn);
  };

  return {
    zhaiValue,
    zhengValue,
    checkedZhai,
    checkedZheng,
    clear,
    updateZhaiStatus,
    updateZhengStatus,
    exchange,
    clearChecked
  };
};

export default useValuation;
