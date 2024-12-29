import { KeyboardEvent, MouseEvent, forwardRef } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { focusVisibleCls } from '../constants';
import { themeCls } from './constants';
import { SwitchChangeEvent, SwitchProps } from './types';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, disabled, defaultChecked, checked, onChange, onKeyDown, ...restProps }, ref) => {
    const [innerChecked, setInnerChecked] = usePropsValue({
      defaultValue: defaultChecked,
      value: checked
    });

    const toggle = (val: boolean, evt: SwitchChangeEvent) => {
      let mergedChecked = !!innerChecked;

      if (!disabled) {
        mergedChecked = val;
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, evt);
      }

      return mergedChecked;
    };

    const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
      toggle(!innerChecked, evt);
    };

    const handleKeyDown = (evt: KeyboardEvent<HTMLButtonElement>) => {
      let mergedChecked = !!innerChecked;

      if (evt.key === KeyboardKeys.Space) {
        evt.preventDefault();
        mergedChecked = toggle(!innerChecked, evt);
      }

      onKeyDown?.(mergedChecked, evt);
    };

    const containerThemeCls = disabled ? themeCls.container.disabled : themeCls.container.default;
    const indicatorThemeCls = disabled ? themeCls.indicator.disabled : themeCls.indicator.default;

    const containerCls = cx(
      's-switch group/switch relative inline-flex w-8 h-4 p-0 rounded-lg border-none select-none',
      focusVisibleCls,
      innerChecked ? ['checked', containerThemeCls.checked] : ['unchecked', containerThemeCls.unchecked],
      disabled && 'cursor-not-allowed',
      className
    );
    const indicatorCls = cx(
      'absolute top-1 bottom-1 w-3 h-2 rounded',
      innerChecked ? ['right-1', indicatorThemeCls.checked] : ['left-1', indicatorThemeCls.unchecked]
    );

    return (
      <button
        ref={ref}
        className={containerCls}
        aria-checked={innerChecked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...restProps}
        role="switch"
        type="button"
      >
        <span className={indicatorCls} />
      </button>
    );
  }
);
