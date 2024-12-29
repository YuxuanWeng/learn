import { ForwardRefExoticComponent, useId, useMemo, useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { useMemoizedFn } from 'ahooks';
import { CheckboxChangeEvent, CheckboxGroupProvider, CheckboxOption, CheckboxValue } from '../Checkbox';
import { Radio } from './Radio';
import { RadioButton } from './RadioButton';
import { RadioGroupProps, RadioProps } from './types';

export const RadioGroup = ({
  className,
  name,
  type = 'button',
  buttonType = 'ghost',
  ctrl,
  otherCancel,
  disabled,
  options,
  defaultValue,
  value,
  onChange,
  children,
  ...restProps
}: RadioGroupProps) => {
  const inputName = useId();

  const [innerValue, setInnerValue] = usePropsValue({
    defaultValue,
    value
  });

  const [registeredValues, setRegisteredValues] = useState(new Set<CheckboxValue>());

  const registerValue = useMemoizedFn((val?: CheckboxValue) => {
    if (val !== void 0) {
      setRegisteredValues(prev => {
        prev.add(val);
        return new Set(prev);
      });
    }
  });

  const unregisterValue = useMemoizedFn((val?: CheckboxValue) => {
    if (val !== void 0) {
      setRegisteredValues(prev => {
        prev.delete(val);
        return new Set(prev);
      });
    }
  });

  const nodes = useMemo(() => {
    if (options && options.length > 0) {
      let RadioRender = Radio;
      if (type === 'button') RadioRender = RadioButton as ForwardRefExoticComponent<RadioProps>;

      const btnProps = type === 'button' ? { buttonType } : {};

      return options.map((opt: string | number | CheckboxOption) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
          return (
            <RadioRender
              key={`radio-group-value-options-${opt.toString()}`}
              disabled={disabled}
              ctrl={ctrl}
              value={opt}
              {...btnProps}
            />
          );
        }
        return (
          <RadioRender
            key={`radio-group-value-options-${opt.value}`}
            className={cx('flex-1', opt?.className)}
            disabled={disabled || opt?.disabled}
            ctrl={ctrl}
            value={opt.value}
            onChange={opt?.onChange}
            {...btnProps}
          >
            {opt?.label}
          </RadioRender>
        );
      });
    }

    return children;
  }, [buttonType, children, ctrl, disabled, options, type]);

  const handleChange = useMemoizedFn((checked: boolean, val: CheckboxValue, evt: CheckboxChangeEvent) => {
    if (disabled) return;

    const nativeEvent = evt.nativeEvent as KeyboardEvent;

    let mergedValue = innerValue ?? [];

    /** 能通过按下 ctrl 或 command 键时切换 radio 状态 */
    const toggleByCtrl = ctrl && (nativeEvent?.metaKey || nativeEvent?.ctrlKey);

    if (checked) {
      if (toggleByCtrl) {
        mergedValue = [...mergedValue, val];
      } else {
        mergedValue = [val];
      }
    } else {
      mergedValue = mergedValue.filter(item => item !== val);
    }

    mergedValue = [...new Set(mergedValue)].filter(item => registeredValues.has(item));

    setInnerValue(mergedValue);
    onChange?.(mergedValue, evt);
  });

  const groupValue = useMemo(
    () => ({
      name: name ?? inputName,
      ctrl,
      otherCancel,
      defaultValue,
      value: innerValue,
      registerValue,
      unregisterValue,
      onChange: handleChange
    }),
    [name, ctrl, otherCancel, inputName, defaultValue, innerValue, registerValue, unregisterValue, handleChange]
  );

  return (
    <div
      className={cx('s-radio-group flex flex-shrink-0 items-center gap-1', className)}
      {...restProps}
    >
      <CheckboxGroupProvider value={groupValue}>{nodes}</CheckboxGroupProvider>
    </div>
  );
};
