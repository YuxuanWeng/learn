import { useMemo } from 'react';
import cx from 'classnames';
import { PickByType } from '@fepkg/common/types';
import { Checkbox } from '@fepkg/components/Checkbox';
import { message } from '@fepkg/components/Message';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { RangeDouble } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { debounce, isEmpty } from 'lodash-es';
import RangeInput from '@/components/RangeInput';
import { useProductParams } from '@/layouts/Home/hooks';
import { GroupQuickFilterValue, OptionsKeys } from '../QuickFilter/types';

const basicCls = '!w-[240px] !h-6 ml-2 px-1 py-0 bg-gray-800 rounded-lg';

type ShouldBeCheckedValue = PickByType<GroupQuickFilterValue, boolean | undefined>;
type ShouldBeInputValue = PickByType<GroupQuickFilterValue, RangeDouble | number | undefined>;
type RangeFilterValue = PickByType<GroupQuickFilterValue, RangeDouble | undefined>;
type InputRange = { min?: string; max?: string };
type InputStringRange = [string, string];

type QuickFilterProps = {
  quickFilterValue: GroupQuickFilterValue;
  onChange?: (val: GroupQuickFilterValue) => void;
  disabled?: boolean;
};

export const MIN_CONSIDERATION = -999999;

const productCls = {
  [ProductType.NCD]: { height: 'h-7' },
  [ProductType.BCO]: { height: 'h-6' }
};

export const GroupQuicklyFilter = ({ quickFilterValue, onChange, disabled }: QuickFilterProps) => {
  const { productType } = useProductParams();

  const updateRangeValue = useMemoizedFn((key: keyof RangeFilterValue, val: InputStringRange) => {
    const [min, max] = val;
    const range: InputRange = {};
    if (min) range.min = min;
    if (max) range.max = max;
    const value = {
      ...quickFilterValue,
      [key]: !isEmpty(range) ? range : undefined
    };
    onChange?.(value);
  });

  const judgeRangeValueValid = useMemo(() => {
    return debounce(
      (action: keyof RangeFilterValue, v: InputStringRange) => {
        const [v0, v1] = v;
        if (v1 && v0 && Number(v1) < Number(v0)) {
          updateRangeValue(action, ['', '']);
          message.warning('结束值不能小于起始值！');
        }
      },
      500,
      { trailing: true }
    );
  }, [updateRangeValue]);

  const debounceInput = useMemoizedFn((action: keyof RangeFilterValue, val: InputStringRange) => {
    updateRangeValue(action, val);
    judgeRangeValueValid(action, val);
  });

  /** 切换相应字段的 checked value */
  const toggleCheckedValue = (
    key: keyof ShouldBeCheckedValue,
    isChecked: boolean,
    inputKey?: keyof ShouldBeInputValue
  ) => {
    const newQuickFilterValue = { ...quickFilterValue, [key]: isChecked };
    if (!isChecked && inputKey) newQuickFilterValue[inputKey] = undefined;
    onChange?.(newQuickFilterValue);
  };

  const filterOptions = useMemo(() => {
    if (productType === ProductType.NCD) {
      return new Set([OptionsKeys.NewListed, OptionsKeys.CouponRate, OptionsKeys.ValModifiedDuration]);
    }

    if (productType === ProductType.BCO) {
      return new Set([
        OptionsKeys.NewListed,
        OptionsKeys.CouponRate,
        OptionsKeys.ValModifiedDuration,
        OptionsKeys.IsMortgage,
        OptionsKeys.IsCrossMkt
      ]);
    }
    return new Set([]);
  }, [productType]);

  return (
    <div
      className={cx(
        productCls[productType].height,
        'flex items-center gap-3 select-none flex-shrink-0 bg-gray-700 rounded-lg px-3'
      )}
    >
      {filterOptions.has(OptionsKeys.NewListed) && (
        <Checkbox
          checked={quickFilterValue.new_listed}
          onChange={isChecked => toggleCheckedValue('new_listed', isChecked)}
          disabled={disabled}
        >
          新上市
        </Checkbox>
      )}

      {filterOptions.has(OptionsKeys.CouponRate) && (
        <>
          <Checkbox
            checked={quickFilterValue.is_coupon_rate}
            onChange={isChecked => {
              toggleCheckedValue('is_coupon_rate', isChecked, 'coupon_rate');
            }}
            disabled={disabled}
          >
            票面
          </Checkbox>
          {quickFilterValue.is_coupon_rate && (
            <RangeInput
              inputRegExp={/^\d{0,6}((\.)?|(\.\d{0,4}))?$/}
              className={basicCls}
              value={[
                quickFilterValue.coupon_rate?.min?.toString() || '',
                quickFilterValue.coupon_rate?.max?.toString() || ''
              ]}
              onChange={val => debounceInput('coupon_rate', val as InputStringRange)}
              placeholder1="数值"
              placeholder2="数值"
              centerElement="≤ 票面利率 ≤"
              size="sm"
            />
          )}
        </>
      )}

      {filterOptions.has(OptionsKeys.ValModifiedDuration) && (
        <>
          <Checkbox
            checked={quickFilterValue.is_duration}
            onChange={isChecked => {
              toggleCheckedValue('is_duration', isChecked, 'val_modified_duration');
            }}
            disabled={disabled}
          >
            久期
          </Checkbox>
          {quickFilterValue.is_duration && (
            <RangeInput
              inputRegExp={/^\d{0,6}((\.)?|(\.\d{0,4}))?$/}
              className={basicCls}
              value={[
                quickFilterValue.val_modified_duration?.min?.toString() || '',
                quickFilterValue.val_modified_duration?.max?.toString() || ''
              ]}
              onChange={val => debounceInput('val_modified_duration', val as InputStringRange)}
              placeholder1="数值"
              placeholder2="数值"
              centerElement="≤ 久期 ≤"
              size="sm"
            />
          )}
        </>
      )}

      {filterOptions.has(OptionsKeys.IsMortgage) && (
        <Checkbox
          checked={quickFilterValue.is_mortgage}
          onChange={isChecked => toggleCheckedValue('is_mortgage', isChecked)}
          disabled={disabled}
        >
          可质押
        </Checkbox>
      )}

      {filterOptions.has(OptionsKeys.IsCrossMkt) && (
        <Checkbox
          checked={quickFilterValue.is_cross_mkt}
          onChange={isChecked => toggleCheckedValue('is_cross_mkt', isChecked)}
          disabled={disabled}
        >
          跨市场
        </Checkbox>
      )}
    </div>
  );
};
