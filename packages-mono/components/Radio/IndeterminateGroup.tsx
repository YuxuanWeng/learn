import { useMemo } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { useMemoizedFn } from 'ahooks';
import { CheckboxChangeEvent, CheckboxValue } from '../Checkbox';
import { RadioGroup } from './Group';
import { RadioButton } from './RadioButton';
import { RadioButtonProps, RadioIndeterminateGroupProps } from './types';

export const INDETERMINATE_RADIO_DEFAULT_VALUE = 'indeterminate';

export const RadioIndeterminateGroup = ({
  label,
  indeterminateProps,
  buttonType = 'ghost',
  disabled,
  options,
  otherCancel,
  defaultValue,
  clearInnerPadding,
  value,
  onChange,
  onItemClick,
  children,
  ...restProps
}: RadioIndeterminateGroupProps) => {
  const { label: indeterminateLabel = '全部', checked, ...restIndeterminateProps } = indeterminateProps ?? {};
  const mergedIndeterminateProps: RadioButtonProps = {
    value: INDETERMINATE_RADIO_DEFAULT_VALUE,
    buttonType,
    disabled,
    indeterminate: true,
    clearInnerPadding,
    ctrl: false,
    skipGroup: true,
    ...restIndeterminateProps
  };

  const [innerValue, setInnerValue] = usePropsValue({
    defaultValue,
    value
  });

  const nodes = useMemo(() => {
    if (options && options.length > 0) {
      return options.map(opt => {
        const commonProps = { buttonType, ctrl: true };

        if (typeof opt === 'string' || typeof opt === 'number') {
          return (
            <RadioButton
              key={`radio-indeterminate-group-value-options-${opt.toString()}`}
              disabled={disabled}
              value={opt}
              {...commonProps}
            />
          );
        }
        return (
          <RadioButton
            key={`radio-indeterminate-group-value-options-${opt.value}`}
            className={opt?.className}
            clearInnerPadding={clearInnerPadding}
            disabled={disabled || opt?.disabled}
            value={opt.value}
            onChange={(val: boolean, evt: CheckboxChangeEvent) => {
              onItemClick?.(opt, val);
              opt?.onChange?.(val, evt);
            }}
            {...commonProps}
          >
            {opt?.label}
          </RadioButton>
        );
      });
    }
    return children;
  }, [options, children, buttonType, disabled, onItemClick]);

  const handleChange = useMemoizedFn((val: CheckboxValue[], evt: CheckboxChangeEvent) => {
    if (disabled) return;
    setInnerValue(val);
    onChange?.(val, !val.length, evt);
  });

  const getChecked = () => {
    if (checked !== undefined) return checked;
    return !innerValue?.length;
  };

  return (
    <RadioGroup
      type="button"
      buttonType={buttonType}
      ctrl
      otherCancel={otherCancel}
      defaultValue={defaultValue}
      value={innerValue}
      onChange={handleChange}
      {...restProps}
    >
      {label}

      <RadioButton
        defaultChecked={!defaultValue?.length}
        checked={getChecked()}
        onChange={(val, evt) => {
          onItemClick?.({ value: val, label: indeterminateLabel }, true);
          handleChange(val ? [] : innerValue ?? [], evt);
        }}
        {...mergedIndeterminateProps}
      >
        {indeterminateLabel}
      </RadioButton>
      {nodes}
    </RadioGroup>
  );
};
