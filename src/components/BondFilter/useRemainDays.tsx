import { useLayoutEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Select, SelectOption } from '@fepkg/components/Select';
import { IconCalculator, IconYD } from '@fepkg/icon-park-react';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { REMAIN_DAYS_CONFIG_MAP, getNCDRemainDaysConfig } from '@/components/Filter/constants/configs';
import RangeInput, { RangeInputValue } from '@/components/RangeInput';
import { useProductParams } from '@/layouts/Home/hooks';
import { FilterConfig } from '../Filter/types';
import { GeneralFilterProps, RemainDaysType } from './types';
import { getPlaceholder, getRemainDaysValues } from './utils';

const options: SelectOption<RemainDaysType>[] = [
  { label: '季度', value: RemainDaysType.Season },
  { label: '月份', value: RemainDaysType.Month },
  { label: '期限', value: RemainDaysType.Term }
];

const remainDaysOptionsCls = {
  [RemainDaysType.Season]: '!w-[68px] !px-0',
  [RemainDaysType.Month]: '!w-[38px] !px-0',
  [RemainDaysType.Term]: '!w-[50px] !px-0'
};

export const useRemainDays = ({ value, inputCls, isAdvanceGroup, onChange }: GeneralFilterProps) => {
  const { productType } = useProductParams();
  const isNCD = productType === ProductType.NCD;

  const remain_days_type = value?.remain_days_type ?? 'string';
  const remainDaysType = value?.remain_days_options_type ?? RemainDaysType.Season;

  /** 默认是否选中 */
  const defaultRemainDaysChecked = useMemo(() => {
    return (
      (isEqual(value?.remain_days_range, ['', '']) ||
        isEqual(value?.remain_days_range, [null, null]) ||
        !value ||
        !value.remain_days_range?.length) &&
      !value?.remain_days_list?.length
    );
  }, [value]);

  const [remainDaysCheckedAll, setRemainDaysCheckedAll] = useState(defaultRemainDaysChecked);

  /** 更新剩余日期输入框的内容 */
  const updateRemainDays = useMemoizedFn((v: RangeInputValue) => {
    const remain_days_range = v || (remain_days_type === 'date' ? [null, null] : ['', '']);
    const isEmpty = isEqual(v, [null, null]) || isEqual(v, ['', '']);
    const remain_days_list = !isEmpty ? [] : value?.remain_days_list;
    setRemainDaysCheckedAll(isEmpty);
    onChange?.({ ...value, remain_days_range, remain_days_list });
  });

  const clearRemainDaysList = useMemoizedFn(() => {
    onChange?.({
      ...value,
      remain_days_range: remain_days_type === 'date' ? [null, null] : ['', ''],
      remain_days_list: []
    });
  });

  useLayoutEffect(() => {
    /** 当选中分组后，同步选中态 */
    setRemainDaysCheckedAll(defaultRemainDaysChecked);
  }, [defaultRemainDaysChecked]);

  const filterConfig = isNCD ? getNCDRemainDaysConfig(remainDaysType) : REMAIN_DAYS_CONFIG_MAP[productType];

  const remainDayConfig: FilterConfig = {
    ...filterConfig,
    checkedAll: remainDaysCheckedAll,
    suffix: {
      key: 'remainDaysRange',
      render: (
        <RangeInput
          type={remain_days_type}
          inputRegExp={/^\d{0,5}((\.)?|(\.\d{0,4}))?[DYdy]?$/}
          key="remainDaysRangeInput"
          className={cx(inputCls ?? '!w-[240px] !h-7 flex-shrink-0')}
          size="sm"
          value={getRemainDaysValues<RangeInputValue>(value)}
          onChange={updateRemainDays}
          placeholder1={getPlaceholder(value)}
          placeholder2={getPlaceholder(value)}
          centerElement={remain_days_type === 'string' ? <IconYD /> : <IconCalculator />}
          onClickCenter={() => {
            const isEmpty = !!value?.remain_days_list?.length;
            setRemainDaysCheckedAll(!isEmpty);
            if (remain_days_type === 'date') {
              onChange?.({
                ...value,
                remain_days_range: ['', ''],
                remain_days_type: 'string'
              });
            }
            if (remain_days_type === 'string') {
              onChange?.({
                ...value,
                remain_days_range: [null, null],
                remain_days_type: 'date'
              });
            }
          }}
        />
      )
    }
  };

  if (isNCD) {
    remainDayConfig.prefix = {
      key: 'remainDaysOptionsType',
      render: (
        <Select
          label=""
          clearIcon={null}
          options={options}
          className={cx('rounded-r-none h-7', isAdvanceGroup ? 'min-w-[84px] w-[84px]' : 'min-w-[92px] w-[92px]')}
          defaultValue={RemainDaysType.Season}
          value={remainDaysType}
          onChange={type => {
            onChange?.({
              ...value,
              remain_days_options_type: type,
              remain_days_list: [],
              remain_days_range: ['', ''],
              remain_days_type: 'string'
            });
          }}
        />
      )
    };
  }

  if (isAdvanceGroup) {
    remainDayConfig.clearInnerPadding = true;
    remainDayConfig.indeterminateProps = { className: '!w-[40px]' };
    remainDayConfig.options = remainDayConfig.options.map(v => ({
      ...v,
      className: remainDaysOptionsCls[remainDaysType]
    }));
  }

  return { remainDayConfig, remainDaysCheckedAll, setRemainDaysCheckedAll, updateRemainDays, clearRemainDaysList };
};
