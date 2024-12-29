import { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { PickByType } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { IconEdit } from '@fepkg/icon-park-react';
import { RangeDouble } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { debounce, intersection, isEmpty } from 'lodash-es';
import RangeInput from '@/components/RangeInput';
import { DefaultOptionKeys, OptionsKeys, QuickFilterProps, QuickFilterValue } from './types';

const basicCls = '!w-[240px] !h-6 ml-2 px-1 py-0 bg-gray-800 rounded-lg';

type ShouldBeCheckedValue = PickByType<QuickFilterValue, boolean | undefined>;
type ShouldBeInputValue = PickByType<QuickFilterValue, RangeDouble | number | undefined>;

type RangeFilterValue = PickByType<QuickFilterValue, RangeDouble | undefined>;

export type InputRange = {
  min?: string;
  max?: string;
};

export type InputStringRange = [string, string];

export const MIN_CONSIDERATION = -999999;

export const QuickFilter = ({
  quickFilterValue,
  onChange,
  disabled,
  onCustomSort,
  optionKeys = DefaultOptionKeys
}: QuickFilterProps) => {
  const [inputCount, setInputCount] = useState(0);

  const [bpValue, setBpValue] = useState<string>();

  useEffect(() => {
    const { is_consideration, is_duration, is_offset, is_yield } = quickFilterValue;
    const count = [is_consideration, is_duration, is_offset, is_yield].filter(v => !!v).length;
    setInputCount(count);
    if (!is_consideration) setBpValue(undefined);
  }, [quickFilterValue]);

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

  const changeBp = (val: string) => {
    if (val === '-') val = MIN_CONSIDERATION.toString();
    let consideration: number | undefined;
    if (val === '') consideration = undefined;
    else if (val === '0') consideration = 0;
    else consideration = Number(val);
    onChange?.({ ...quickFilterValue, consideration });
  };

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

  const firstKeys = [OptionsKeys.Offset, OptionsKeys.Yield, OptionsKeys.Consideration];

  const secondKeys = [
    OptionsKeys.NewListed,
    OptionsKeys.ValModifiedDuration,
    OptionsKeys.IsMortgage,
    OptionsKeys.IsCrossMkt
  ];

  const hasSecondSection = intersection(secondKeys, [...optionKeys]).length !== 0;
  const hasFirstSection = intersection(firstKeys, [...optionKeys]).length !== 0;

  return (
    <div
      id="HomeTabFilter"
      className="flex justify-between items-center"
    >
      <section className="flex items-center gap-3 select-none flex-shrink-0">
        {optionKeys.has(OptionsKeys.CustomSorting) && (
          <div className="flex gap-2 bg-gray-700 h-7 pl-3 pr-px items-center rounded-lg">
            <Checkbox
              checked={quickFilterValue.custom_sorting}
              onChange={isChecked => toggleCheckedValue('custom_sorting', isChecked)}
              disabled={disabled}
            >
              自定义排序
            </Checkbox>
            <Button.Icon
              className="rounded-l-none bg-gray-700"
              icon={<IconEdit />}
              onClick={onCustomSort}
            />
          </div>
        )}

        {optionKeys.has(OptionsKeys.IntelligenceSorting) && (
          <div className="flex gap-3 bg-gray-700 h-7 px-3 items-center rounded-lg">
            <Checkbox
              checked={quickFilterValue.intelligence_sorting}
              onChange={isChecked => toggleCheckedValue('intelligence_sorting', isChecked)}
              disabled={disabled}
            >
              智能排序
            </Checkbox>
          </div>
        )}

        <div className={cx('flex gap-3 bg-gray-700 h-7 items-center rounded-lg', hasFirstSection ? 'px-3' : 'w-0')}>
          {optionKeys.has(OptionsKeys.Offset) && (
            <>
              <Checkbox
                checked={quickFilterValue?.is_offset}
                onChange={isChecked => {
                  toggleCheckedValue('is_offset', isChecked, 'offset');
                }}
                disabled={disabled}
              >
                偏移
              </Checkbox>
              {quickFilterValue?.is_offset && (
                <RangeInput
                  className={basicCls}
                  value={[
                    quickFilterValue?.offset?.min?.toString() || '',
                    quickFilterValue?.offset?.max?.toString() || ''
                  ]}
                  inputCount={inputCount}
                  inputRegExp={/^(-)?\d{0,3}((\.)?|(\.\d{0,4}))?$/}
                  onChange={val => debounceInput('offset', val as InputStringRange)}
                  placeholder1="数值"
                  placeholder2="数值"
                  centerElement="≤ 偏移 ≤"
                  size="sm"
                />
              )}
            </>
          )}

          {optionKeys.has(OptionsKeys.CouponRate) && (
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
                  inputCount={inputCount}
                  onChange={val => debounceInput('coupon_rate', val as InputStringRange)}
                  placeholder1="数值"
                  placeholder2="数值"
                  centerElement="≤ 票面利率 ≤"
                  size="sm"
                />
              )}
            </>
          )}

          {optionKeys.has(OptionsKeys.Yield) && (
            <>
              <Checkbox
                checked={quickFilterValue?.is_yield}
                onChange={isChecked => {
                  toggleCheckedValue('is_yield', isChecked, 'yield');
                }}
                disabled={disabled}
              >
                收益率
              </Checkbox>
              {quickFilterValue.is_yield && (
                <RangeInput
                  inputRegExp={/^\d{0,2}((\.)?|(\.\d{0,4}))?$/}
                  className={basicCls}
                  inputCount={inputCount}
                  value={[quickFilterValue.yield?.min?.toString() || '', quickFilterValue.yield?.max?.toString() || '']}
                  onChange={val => debounceInput('yield', val as InputStringRange)}
                  placeholder1="数值"
                  placeholder2="数值"
                  centerElement="≤ 收益率 ≤"
                  size="sm"
                />
              )}
            </>
          )}

          {optionKeys.has(OptionsKeys.Consideration) && (
            <>
              <Checkbox
                checked={quickFilterValue.is_consideration}
                onChange={isChecked => {
                  toggleCheckedValue('is_consideration', isChecked, 'consideration');
                }}
                disabled={disabled}
              >
                对价
              </Checkbox>
              {quickFilterValue.is_consideration && (
                <Input
                  key="subjectRatingQueryInput"
                  className="w-[120px] h-6 ml-2 bg-gray-800"
                  placeholder="输入bp差"
                  size="sm"
                  rounded
                  value={bpValue}
                  onChange={val => {
                    const reg = /^(-)?\d{0,4}((\.)?|(\.\d{0,4}))?$/;
                    if (!reg.test(val)) return;
                    setBpValue(val);
                    changeBp(val);
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className={cx('flex gap-3 bg-gray-700 h-7 items-center rounded-lg', hasSecondSection ? 'px-3' : 'w-0')}>
          {optionKeys.has(OptionsKeys.NewListed) && (
            <Checkbox
              checked={quickFilterValue.new_listed}
              onChange={isChecked => toggleCheckedValue('new_listed', isChecked)}
              disabled={disabled}
            >
              新上市
            </Checkbox>
          )}

          {optionKeys.has(OptionsKeys.ValModifiedDuration) && (
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
                  inputCount={inputCount}
                  onChange={val => debounceInput('val_modified_duration', val as InputStringRange)}
                  placeholder1="数值"
                  placeholder2="数值"
                  centerElement="≤ 久期 ≤"
                  size="sm"
                />
              )}
            </>
          )}

          {optionKeys.has(OptionsKeys.IsMortgage) && (
            <Checkbox
              checked={quickFilterValue.is_mortgage}
              onChange={isChecked => toggleCheckedValue('is_mortgage', isChecked)}
              disabled={disabled}
            >
              可质押
            </Checkbox>
          )}

          {optionKeys.has(OptionsKeys.IsCrossMkt) && (
            <Checkbox
              checked={quickFilterValue.is_cross_mkt}
              onChange={isChecked => toggleCheckedValue('is_cross_mkt', isChecked)}
              disabled={disabled}
            >
              跨市场
            </Checkbox>
          )}
        </div>
      </section>
    </div>
  );
};
