import { useId, useMemo, useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { useMemoizedFn } from 'ahooks';
import { Checkbox } from './Checkbox';
import { CheckboxGroupProvider } from './GroupProvider';
import { CheckboxChangeEvent, CheckboxGroupProps, CheckboxOption, CheckboxValue } from './types';

export const CheckboxGroup = ({
  className,
  name,
  disabled,
  options,
  defaultValue,
  value,
  onChange,
  children,
  ...restProps
}: CheckboxGroupProps) => {
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
      return options.map((opt: string | number | CheckboxOption) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
          return (
            <Checkbox
              key={`checkbox-group-value-options-${opt.toString()}`}
              disabled={disabled}
              value={opt}
            />
          );
        }
        return (
          <Checkbox
            key={`checkbox-group-value-options-${opt.value}`}
            className={opt?.className}
            disabled={disabled || opt?.disabled}
            value={opt.value}
            onChange={opt?.onChange}
          >
            {opt?.label}
          </Checkbox>
        );
      });
    }

    return children;
  }, [options, children, disabled]);

  const handleChange = useMemoizedFn((checked: boolean, val: CheckboxValue, evt: CheckboxChangeEvent) => {
    if (disabled) return;

    let mergedValue = innerValue ?? [];

    if (checked) mergedValue = [...mergedValue, val];
    else mergedValue = mergedValue.filter(item => item !== val);

    mergedValue = [...new Set(mergedValue)].filter(item => registeredValues.has(item));

    setInnerValue(mergedValue);
    onChange?.(mergedValue, evt);
  });

  const groupValue = useMemo(
    () => ({
      name: name ?? inputName,
      defaultValue,
      value: innerValue,
      registerValue,
      unregisterValue,
      onChange: handleChange
    }),
    [name, inputName, defaultValue, innerValue, registerValue, unregisterValue, handleChange]
  );

  return (
    <div
      className={cx('flex items-center gap-3 py-2 px-2.5 bg-gray-800 rounded-sm', className)}
      {...restProps}
    >
      <CheckboxGroupProvider value={groupValue}>{nodes}</CheckboxGroupProvider>
    </div>
  );
};
