import { forwardRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Input } from '@fepkg/components/Input';
import { DataInputType } from './constants';
import { useQuoteComponentRef } from './hooks/useQuoteComponentRef';
import { QuoteComponentProps, QuoteComponentRef } from './types';
import { replacePriceChiPeriod } from './utils';

const RETURN_POINT_REGEX = /^\d{0,3}((\.)?|(\.\d{0,4}))?$/;

export const ReturnPoint = forwardRef<QuoteComponentRef, QuoteComponentProps.ReturnPoint>(
  ({ side, value, onChange, onFPress, onKeyDown, ...restProps }, ref) => {
    const { inputRef } = useQuoteComponentRef(ref);

    return (
      <Input
        data-input-type={DataInputType}
        style={{ imeMode: 'disabled' }}
        onChange={val => {
          val = replacePriceChiPeriod(val);
          if (!RETURN_POINT_REGEX.test(val)) return;
          onChange?.(side, val);
        }}
        onKeyDown={(evt, composing) => {
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
