import { ChangeEvent, CompositionEvent, ForwardedRef, KeyboardEvent, useId, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { usePropsValue } from '@fepkg/common/hooks';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { BasicInputProps, InputChangeEvent } from './types';

export const useInput = <T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(
  {
    id,
    disabled,
    defaultValue,
    value,
    clearByKeyboard,
    focusAfterClearing,
    composition,
    onChange,
    onKeyDown,
    onEnterPress,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd
  }: BasicInputProps<T>,
  ref: ForwardedRef<T>
) => {
  const randomId = useId();
  const inputId = id ?? randomId;
  const inputRef = useRef<T>(null);
  const mergedRefs = useMemo(() => mergeRefs([ref, inputRef]), [ref]);

  const composing = useRef(false);

  const [innerValue, setInnerValue] = usePropsValue({
    defaultValue,
    value
  });
  /** 仅在 composing 的状态下启动 */
  const [composingValue, setComposingValue] = useState(innerValue);

  const displayValue = composing.current ? composingValue : innerValue;

  const change = (val: string, evt: InputChangeEvent<T>, clear?: boolean) => {
    if (disabled) return;

    setInnerValue(val);
    if (composition && composing.current) setComposingValue(val);

    if (clear) {
      // 克隆一个新的 target 给事件处理函数
      const currentTarget = inputRef.current?.cloneNode(true) as T;

      currentTarget.value = '';
      onChange?.(
        val,
        Object.create(evt, { target: { value: currentTarget }, currentTarget: { value: currentTarget } })
      );
      return;
    }

    if (!composing.current) {
      onChange?.(val, evt);
    }
  };

  const handleChange = (evt: ChangeEvent<T>) => {
    const val = evt.currentTarget.value;
    change(val, evt);
  };

  const handleClear = (evt: InputChangeEvent<T>) => {
    evt.stopPropagation();
    change('', evt, true);
    if (focusAfterClearing) inputRef.current?.focus();
  };

  const handleKeyDown = (evt: KeyboardEvent<T>) => {
    if (disabled) return;

    // 如果正在输入的话，阻止事件冒泡
    if (composition && composing.current) evt.stopPropagation();

    if (evt.key === KeyboardKeys.Enter) {
      const val = evt.currentTarget.value;
      onEnterPress?.(val, evt, composing.current);
    } else if (clearByKeyboard && evt.key === clearByKeyboard) {
      // 能通过某个按键清除内容
      evt.preventDefault();

      handleClear(evt);
    }

    onKeyDown?.(evt, composing.current);
  };

  const handleCompositionStart = (evt: CompositionEvent<T>) => {
    if (composition) composing.current = true;
    onCompositionStart?.(evt);
  };

  const handleCompositionUpdate = (evt: CompositionEvent<T>) => {
    if (composition) composing.current = true;
    onCompositionUpdate?.(evt);
  };

  const handleCompositionEnd = (evt: CompositionEvent<T>) => {
    if (composition && composing.current) {
      composing.current = false;

      // 我们目前一定用的 Chromium 内核，所以直接 change 一次即可
      const val = evt.currentTarget.value;
      change(val, evt);
    }
    onCompositionEnd?.(evt);
  };

  return {
    inputId,
    inputRef,
    mergedRefs,
    composing,
    composingValue,
    innerValue,
    displayValue,
    handleChange,
    handleClear,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd
  };
};
