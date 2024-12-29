import { ChangeEvent, KeyboardEvent, forwardRef, useEffect, useId, useRef } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useCheckboxGroup } from './GroupProvider';
import { CheckboxChangeEvent, CheckboxProps } from './types';

export const BasicCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      wrapperRef,
      wrapperCls,
      containerCls,
      childrenCls,
      className,
      type,
      disabled,
      indicator,
      indeterminate,
      input = true,
      ctrl,
      otherCancel,
      skipGroup,
      defaultChecked = false,
      checked,
      value,
      onChange,
      onKeyDown,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      children,
      ...restProps
    },
    ref
  ) => {
    const group = useCheckboxGroup();

    const randomId = useId();
    const randomName = useId();

    restProps.id = restProps.id ?? randomId;
    restProps.name = restProps?.name ?? randomName;
    otherCancel = otherCancel ?? group?.otherCancel;

    const innerType = type === 'radio' && (ctrl ?? group?.ctrl) ? 'checkbox' : type;

    if (group) {
      if (value !== undefined && !skipGroup) {
        defaultChecked = !!group.defaultValue?.includes(value);
        checked = group.value?.includes(value);
      }

      restProps.name = group?.name ?? restProps.name;
    }

    const [innerChecked, setInnerChecked] = usePropsValue({
      defaultValue: defaultChecked,
      value: checked
    });

    const mergedOnChange = (newChecked: boolean, evt: CheckboxChangeEvent) => {
      onChange?.(newChecked, evt);
      if (!skipGroup) group?.onChange?.(newChecked, value ?? '', evt);
    };

    const toggle = (newChecked: boolean, evt: CheckboxChangeEvent) => {
      let mergedChecked = !!innerChecked;

      if (!disabled) {
        mergedChecked = newChecked;
        setInnerChecked(mergedChecked);
        mergedOnChange?.(mergedChecked, evt);
      }

      return mergedChecked;
    };

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      if (type === 'checkbox') {
        toggle(!innerChecked, evt);
      } else if (type === 'radio') {
        const nativeEvent = evt.nativeEvent as unknown as KeyboardEvent;

        if ((ctrl && (nativeEvent?.metaKey || nativeEvent?.ctrlKey)) || !innerChecked) {
          toggle(!innerChecked, evt);
        } else if (otherCancel && innerType === 'checkbox' && innerChecked) {
          // 如果实际为 checkbox，并且已选中，则点击时取消选中其他按钮
          toggle(innerChecked, evt);
        }
      }
    };

    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
      let mergedChecked = !!innerChecked;

      if (evt.key === KeyboardKeys.Space) {
        evt.preventDefault();
        if (type === 'checkbox') mergedChecked = toggle(!innerChecked, evt);
        else if (type === 'radio' && !innerChecked) mergedChecked = toggle(true, evt);
      }

      onKeyDown?.(mergedChecked, evt);
    };

    // --- 与 Checkbox 内 value 变动有关 start ---

    const prevValue = useRef(value);

    // 首次加载时，给 group 注册 value
    useEffect(() => {
      group?.registerValue(value);
    }, []);

    // Checkbox value 变更时，通知 group 变更注册 value
    useEffect(() => {
      if (value !== prevValue.current) {
        group?.unregisterValue(prevValue.current);
        group?.registerValue(value);
        prevValue.current = value;
      }
      return () => group?.unregisterValue(value);
    }, [value]);

    // --- 与 Checkbox 内 value 变动有关 end ---

    const clsPrefix = type === 'checkbox' ? 's-checkbox' : 's-radio';
    const clsGetterArgs = [disabled, innerChecked, indeterminate] as const;

    let indicatorNode = indicator?.(...clsGetterArgs);
    if (!indicatorNode) indicatorNode = null;

    return (
      <label
        ref={wrapperRef}
        htmlFor={restProps.id}
        className={cx(
          `${clsPrefix}-wrapper`,
          'group/checkbox relative inline-flex-center flex-shrink-0 select-none',
          innerChecked ? 'checked' : 'unchecked',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          wrapperCls?.(...clsGetterArgs),
          className
        )}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <input
          ref={ref}
          role={innerType}
          type={innerType}
          className={cx('peer/checkbox-input absolute w-0 h-0', input ? 'block' : 'hidden')}
          aria-checked={innerChecked || (indeterminate && 'mixed')}
          disabled={disabled}
          value={typeof value === 'boolean' ? `${value}` : value}
          checked={innerChecked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...restProps}
        />
        <span className={cx(`${clsPrefix}-container`, containerCls?.(...clsGetterArgs))}>{indicatorNode}</span>

        {children && (
          <span className={cx(`${clsPrefix}-inner`, childrenCls?.(...clsGetterArgs), 'text-sm truncate')}>
            {children}
          </span>
        )}
      </label>
    );
  }
);
