import { forwardRef } from 'react';
import cx from 'classnames';
import { BasicCheckbox } from '../Checkbox';
import { focusVisibleCls } from '../constants';
import { radioThemeCls as themeCls } from './constants';
import { RadioProps } from './types';

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ disabled, ...restProps }, ref) => {
  const wrapperThemeCls = disabled ? themeCls.wrapper.disabled : themeCls.wrapper.default;
  const containerThemeCls = disabled ? themeCls.container.disabled : themeCls.container.default;
  const indicatorThemeCls = disabled ? themeCls.indicator.disabled : themeCls.indicator.default;

  return (
    <BasicCheckbox
      ref={ref}
      type="radio"
      wrapperCls={(_, checked) =>
        cx(
          'gap-2',
          checked ? wrapperThemeCls.checked : wrapperThemeCls.unchecked,
          disabled ? '' : 'hover:text-primary-000'
        )
      }
      containerCls={(_, checked) =>
        cx(
          'flex-center w-3.5 h-3.5 border border-solid rounded-lg',
          focusVisibleCls,
          checked ? containerThemeCls.checked : containerThemeCls.unchecked,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer group-hover/checkbox:border-primary-000'
        )
      }
      indicator={(_, checked) => (
        <span className={cx('w-2 h-2 rounded-lg', checked ? indicatorThemeCls.checked : containerThemeCls.unchecked)} />
      )}
      disabled={disabled}
      {...restProps}
    />
  );
});
