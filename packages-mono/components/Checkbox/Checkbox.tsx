import { forwardRef } from 'react';
import cx from 'classnames';
import { focusVisibleCls } from '../constants';
import { BasicCheckbox } from './Basic';
import { IndicatorInner } from './Indicator';
import { themeCls } from './constants';
import { CheckboxProps } from './types';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ disabled, ...restProps }, ref) => {
  const containerThemeCls = disabled ? themeCls.container.disabled : themeCls.container.default;
  const indicatorThemeCls = disabled ? themeCls.indicator.disabled : themeCls.indicator.default;

  return (
    <BasicCheckbox
      ref={ref}
      type="checkbox"
      wrapperCls={(_, checked, indeterminate) =>
        cx(
          'gap-2 h-6',
          checked
            ? containerThemeCls.checked
            : [indeterminate ? containerThemeCls.indeterminate : containerThemeCls.unchecked],
          disabled ? '' : 'hover:text-primary-000'
        )
      }
      containerCls={(_, checked, indeterminate) =>
        cx(
          'flex-center w-3.5 h-3.5 rounded border border-solid',
          focusVisibleCls,
          checked
            ? indicatorThemeCls.checked
            : [indeterminate ? indicatorThemeCls.indeterminate : indicatorThemeCls.unchecked],
          disabled ? 'cursor-not-allowed' : 'group-hover/checkbox:border-auxiliary-200'
        )
      }
      indicator={(_, checked, indeterminate) => (
        <IndicatorInner
          checked={checked}
          indeterminate={indeterminate}
        />
      )}
      disabled={disabled}
      {...restProps}
    />
  );
});
