import { forwardRef } from 'react';
import cx from 'classnames';
import { DatePicker, DatePickerProps } from 'antd';
import { DateOffset } from '@fepkg/business/constants/date';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { usePropsValue } from '@fepkg/common/hooks';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { globalModifierStatus } from '@fepkg/common/utils/hotkey';
import { RadioGroup, RadioGroupProps } from '@fepkg/components/Radio';
import moment from 'moment';
import { Combination } from '../Combination';
import { Select } from '../Select';
import { CommonDatePicker } from './CommonPicker';
import { SettlementDateOffsetProps, SettlementDatePickerProps } from './types';

const SettlementDateOffset = ({
  size = 'md',
  disabled,
  offsetMode = 'select',
  offsetOptions = DateOffset,
  offsetValue,
  onOffsetChange,
  offsetClassName
}: SettlementDateOffsetProps) => {
  const radioGroupProps: RadioGroupProps = {
    type: 'button',
    options: offsetOptions ?? [],
    disabled,
    value: offsetValue !== undefined ? [offsetValue] : [],
    onChange: val => {
      onOffsetChange?.(val[0] as DateOffsetEnum.PLUS_0 | DateOffsetEnum.PLUS_1);
    }
  };

  switch (offsetMode) {
    case 'radio-square':
      return (
        <RadioGroup
          className={cx(
            'w-25 !gap-0.5 ml-1 border border-transparent border-solid rounded-lg [&_.s-radio-wrapper]:w-9',
            disabled ? 'bg-gray-600' : 'bg-gray-800',
            size === 'md' && '[&_.s-radio-wrapper]:h-[30px]',
            size === 'sm' && '[&_.s-radio-wrapper]:h-[26px]',
            size === 'xs' && '[&_.s-radio-wrapper]:h-[22px]',
            offsetClassName
          )}
          {...radioGroupProps}
        />
      );
    case 'radio-round':
      return (
        <RadioGroup
          className={cx(
            'flex w-[164px]',
            '!gap-1 bg-gray-600 rounded-lg',
            size === 'md' && 'ml-12 [&_.s-radio-wrapper]:h-[30px]',
            size === 'sm' && 'ml-12 [&_.s-radio-wrapper]:h-[26px]',
            size === 'xs' && 'ml-[39px] [&_.s-radio-wrapper]:h-[22px]',
            offsetClassName
          )}
          {...radioGroupProps}
        />
      );
    default:
      return null;
  }
};

const defaultPickerProps: DatePickerProps = {
  tabIndex: -1,
  className: 'flex-1',
  dropdownClassName: 'undraggable',
  showToday: true,
  inputReadOnly: true,
  placeholder: '请选择'
};

export const SettlementDatePicker = forwardRef<HTMLDivElement, SettlementDatePickerProps>(
  (
    {
      className,
      dropdownCls,
      prefix = '日期',
      size = 'md',
      allowClear = true,
      placeholder,
      disabled,
      disabledDate,
      pickerRef,
      pickerOpen,
      pickerProps,
      pickerValue,
      pickerDisabled,
      onPickerOpenChange,
      onPickerChange,
      offsetDisabled,
      offsetMode,
      ...resetOffsetProps
    },
    ref
  ) => {
    const [date, setDate] = usePropsValue({
      defaultValue: null,
      value: pickerValue ? moment(normalizeTimestamp(pickerValue)) : null,
      onChange: val => onPickerChange?.(val, globalModifierStatus.commandKey || globalModifierStatus.ctrlKey)
    });

    const [open, setOpen] = usePropsValue({
      defaultValue: DatePicker.defaultProps?.open,
      value: pickerOpen,
      onChange: val => onPickerOpenChange?.(!!val)
    });

    const prefixNode = (
      <CommonDatePicker
        {...defaultPickerProps}
        {...pickerProps}
        dropdownClassName={dropdownCls}
        prefix={prefix}
        className={cx('!px-3', defaultPickerProps.className, pickerProps?.className)}
        size={size}
        placeholder={placeholder}
        disabled={disabled || pickerDisabled}
        allowClear={allowClear}
        ref={pickerRef}
        disabledDate={disabledDate}
        value={date}
        open={open}
        onOpenChange={setOpen}
        onChange={setDate}
      />
    );

    // 目前selectMode只有计算器处使用，需要用combination包裹
    if (offsetMode === 'select') {
      return (
        <Combination
          disabled={disabled}
          prefixNode={prefixNode}
          containerCls={className}
          suffixNode={
            <Select
              tabIndex={-1}
              size={size}
              clearIcon={null}
              disabled={disabled}
              options={resetOffsetProps.offsetOptions ?? DateOffset}
              value={resetOffsetProps.offsetValue}
              onChange={(val: DateOffsetEnum) => {
                resetOffsetProps.onOffsetChange?.(val);
              }}
              className={resetOffsetProps.offsetClassName}
            />
          }
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cx('flex items-center rounded-lg', className)}
      >
        {prefixNode}
        <SettlementDateOffset
          size={size}
          disabled={disabled || offsetDisabled}
          offsetMode={offsetMode}
          {...resetOffsetProps}
        />
      </div>
    );
  }
);
