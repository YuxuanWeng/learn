import { forwardRef } from 'react';
import cx from 'classnames';
import { BasicCheckbox } from '../Checkbox';
import { radioBtnThemeClsMap } from './constants';
import { RadioButtonProps } from './types';

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ buttonType = 'ghost', disabled, clearInnerPadding, ...restProps }, ref) => {
    const themeCls = radioBtnThemeClsMap[buttonType];
    const wrapper = disabled ? themeCls.disabled : themeCls.default;

    let hoverCls = 'hover:text-primary-000';
    if (buttonType === 'secondary') hoverCls = 'hover:text-secondary-000';
    else if (buttonType === 'orange') hoverCls = 'hover:text-orange-000';

    return (
      <BasicCheckbox
        tabIndex={-1}
        ref={ref}
        type="radio"
        wrapperCls={(_, checked) =>
          cx(
            'relative def:h-full py-0.5 border border-solid rounded-lg',
            checked ? wrapper.checked : wrapper.unchecked,
            disabled ? '' : hoverCls,
            clearInnerPadding ? '' : ' px-[9px]'
          )
        }
        disabled={disabled}
        {...restProps}
      />
    );
  }
);
