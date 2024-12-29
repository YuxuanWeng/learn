import { ForwardedRef, useImperativeHandle, useRef } from 'react';
import { QuoteComponentRef } from '../types';

export const useQuoteComponentRef = (ref: ForwardedRef<QuoteComponentRef>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      requestIdleCallback(() => {
        inputRef.current?.focus();
      });
    },
    select: () => {
      requestIdleCallback(() => {
        inputRef.current?.select();
      });
    },
    isFocusing: () => inputRef.current === document.activeElement
  }));

  return { inputRef };
};
