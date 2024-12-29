import { ForwardedRef, useImperativeHandle } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { FilterKey } from '@/components/Filter/constants/configs';
import { resetRemainDaysRange } from '@/pages/ProductPanel/utils';
import { GeneralFilterInstance, GeneralFilterProps, GeneralFilterValue } from './types';
import { useRemainDays } from './useRemainDays';

export const useFilter = (
  { value, inputCls, isAdvanceGroup, onChange }: GeneralFilterProps,
  ref: ForwardedRef<GeneralFilterInstance>
) => {
  const { remainDayConfig, setRemainDaysCheckedAll, clearRemainDaysList } = useRemainDays({
    value,
    inputCls,
    isAdvanceGroup,
    onChange
  });

  useImperativeHandle(ref, () => ({
    reset: () => setRemainDaysCheckedAll(true)
  }));

  /** 筛选条件发生变化的回调 */
  const onFilterChange = useMemoizedFn(
    (val: { key: string; currentState: GeneralFilterValue }, productType: ProductType) => {
      let productTypeFilter = {};

      if (productType === ProductType.BCO) {
        productTypeFilter = { rating_type: value?.rating_type, issuer_rating_val: value?.issuer_rating_val };
      }

      const generalFilter = {
        ...val.currentState,
        // 如果剩余日期选中了，则清空剩余日期范围输入框中的内容
        remain_days_range: val.currentState.remain_days_list?.length
          ? resetRemainDaysRange(value?.remain_days_type || 'string')
          : (() => {
              const isEmpty =
                isEqual(value?.remain_days_range, [null, null]) || isEqual(value?.remain_days_range, ['', '']);
              setRemainDaysCheckedAll(isEmpty);
              return value?.remain_days_range;
            })(),
        remain_days_type: value?.remain_days_type,
        ...productTypeFilter
      };

      // 如果剩余日期选中了，则清空剩余日期范围输入框中的内容
      if (val.key === FilterKey.RemainDaysList && !val.currentState.remain_days_list?.length) {
        setRemainDaysCheckedAll(true);
        clearRemainDaysList();
        return;
      }

      onChange?.(generalFilter as GeneralFilterValue);
    }
  );

  return { remainDayConfig, onFilterChange };
};
