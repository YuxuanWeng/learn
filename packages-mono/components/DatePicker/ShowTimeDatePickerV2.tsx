import { forwardRef } from 'react';
import cx from 'classnames';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import { usePropsValue } from '@fepkg/common/hooks';
import { globalModifierStatus } from '@fepkg/common/utils/hotkey';
import { CommonDatePicker } from './CommonPicker';
import { ShowTimeDatePickerProps } from './types';

const defaultPickerProps: DatePickerProps = {
  tabIndex: -1,
  className: 'flex-1',
  dropdownClassName: 'undraggable',
  showToday: true,
  inputReadOnly: true,
  placeholder: '请选择'
};

export const ShowTimeDatePickerV2 = forwardRef<HTMLDivElement, ShowTimeDatePickerProps>(
  (
    {
      className,
      prefix = '日期',
      size = 'sm',
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
      onContainerClick
    },
    ref
  ) => {
    const [date, setDate] = usePropsValue({
      defaultValue: null,
      value: pickerValue ?? null,
      onChange: val => onPickerChange?.(val, globalModifierStatus.commandKey || globalModifierStatus.ctrlKey)
    });

    const [open, setOpen] = usePropsValue({
      defaultValue: DatePicker.defaultProps?.open,
      value: pickerOpen,
      onChange: val => onPickerOpenChange?.(!!val)
    });

    return (
      <div
        ref={ref}
        className={cx('flex items-center rounded-lg', disabled && 'bg-gray-600', !disabled && 'bg-gray-800', className)}
        onClick={onContainerClick}
      >
        <CommonDatePicker
          showNow
          showTime
          {...defaultPickerProps}
          {...pickerProps}
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
          onOk={setDate}
        />
      </div>
    );
  }
);
