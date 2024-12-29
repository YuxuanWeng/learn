import { forwardRef, useRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Input } from '@fepkg/components/Input';
import { getIsIntention } from '../PriceGroup/utils';
import { DataInputType } from './constants';
import { useQuoteComponentRef } from './hooks/useQuoteComponentRef';
import { QuoteComponentProps, QuoteComponentRef } from './types';
import { PRICE_REGEX, replacePriceChiPeriod } from './utils';

export const Price = forwardRef<QuoteComponentRef, QuoteComponentProps.Price>(
  ({ label, side, value, onChange, onFPress, onKeyDown, size, intention, ...restProps }, ref) => {
    const { inputRef } = useQuoteComponentRef(ref);

    /** 此处加锁，目的是为了避免input在windows中文输入法下， onKeyDown事件会导致onChange的调用次数异常 */
    const lock = useRef(false);

    return (
      <Input
        data-input-type={DataInputType}
        size={size}
        style={{ imeMode: 'disabled' }}
        label={label}
        onChange={val => {
          if (lock.current) {
            lock.current = false;
            return;
          }

          // 判断是否为意向价
          const isIntention = getIsIntention(val, intention);
          if (intention && isIntention) {
            let returnVal = val;
            if (val === 'b') returnVal = 'B';
            if (val === 'o') returnVal = 'O';
            onChange?.(side, returnVal, isIntention);
            return;
          }

          val = replacePriceChiPeriod(val);
          if (!PRICE_REGEX.test(val)) return;

          onChange?.(side, val);
        }}
        onKeyDown={(evt, composing) => {
          if (evt.code === KeyboardKeys.CodeKeyF && evt.key === KeyboardKeys.Process) lock.current = true;
          if (evt.code === KeyboardKeys.CodeKeyF) {
            evt.preventDefault();
            onFPress?.();
          }
          onKeyDown?.(evt, composing);
        }}
        value={value ?? ''}
        {...restProps}
        ref={inputRef}
      />
    );
  }
);
