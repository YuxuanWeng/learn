import { forwardRef } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { numberLimitedRegexp } from '@fepkg/common/utils';
import { Input, InputChangeEvent, InputProps } from '@fepkg/components/Input';
import { isNil } from 'lodash-es';

export type InputNumberProps = InputProps & {
  /** 整数位数 */
  integerNum?: number;
  /** 小数位数 */
  pointNum?: number;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
};

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ max = 9999, min = 0, value, onChange, pointNum = 0, integerNum = 4, ...restProps }, ref) => {
    const prevValue = usePrevious(value);

    const handleChange = (val: string, evt: InputChangeEvent) => {
      const regex = numberLimitedRegexp(integerNum, pointNum, { allowBlankInteger: true });
      if (!regex.test(val)) {
        if (!isNil(prevValue) && regex.test(prevValue)) {
          onChange?.(prevValue, evt);
          return;
        }
        onChange?.('', evt);
        return;
      }
      if (val === '') {
        onChange?.('', evt);
        return;
      }
      if (val.includes('.')) {
        onChange?.(val, evt);
        return;
      }
      let num = Number(val);
      if (num > max) {
        num = max;
      } else if (num < min) {
        num = min;
      }
      onChange?.(String(num), evt);
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        {...restProps}
      />
    );
  }
);
