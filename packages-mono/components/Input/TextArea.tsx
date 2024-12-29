import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import useResizeObserver from '@react-hook/resize-observer';
import { useMemoizedFn } from 'ahooks';
import { sizeClsMap } from './constants';
import { TextAreaProps } from './types';
import { useBasicInputCls } from './useCls';
import { useInput } from './useInput';
import { ComputedStyle, getElComputedStyle, getMaxLength, resize } from './utils';

// Chromium 的执行顺序 onCompositionStart onChange onCompositionEnd

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      className,
      textareaCls = '',
      label,
      labelWidth = 80,
      theme = 'dark',
      size = 'sm',
      padding = sizeClsMap[size].padding,
      rounded = true,
      error = false,
      autoSize = false,
      showWordLimit = false,
      disabled,
      defaultValue,
      value,
      clearByKeyboard,
      focusAfterClearing = true,
      composition,
      clearIcon = null,
      onChange,
      onKeyDown,
      onEnterPress,
      onCompositionStart,
      onCompositionUpdate,
      onCompositionEnd,
      onMouseEnter,
      onMouseLeave,
      onClearClick,
      ...restProps
    },
    ref
  ) => {
    const {
      inputId,
      inputRef,
      mergedRefs,
      displayValue,
      handleChange,
      handleClear,
      handleKeyDown,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd
    } = useInput<HTMLTextAreaElement>(
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
      },
      ref
    );

    const displayValueLength = displayValue?.length ?? 0;

    /** Resize start */
    /** 是否展示字数限制 */
    const [showLimit, setShowLimit] = useState(false);
    /** 字数最大限制 */
    const maxLength = getMaxLength(restProps?.maxLength);

    /** 能否自适应高度 */
    const resizable = typeof autoSize === 'object' || !!autoSize;
    /** 自适应高度行数限制 */
    const resizeLimit = useMemo(
      () => ({
        minRows: typeof autoSize === 'object' ? Math.max(autoSize?.minRows ?? 1, 1) : 1,
        maxRows: typeof autoSize === 'object' ? autoSize?.maxRows : restProps?.rows
      }),
      [autoSize, restProps?.rows]
    );

    const computedStyleCache = useRef<ComputedStyle>();

    const handleResize = useMemoizedFn(() => {
      const el = inputRef.current;
      if (el) {
        if (!computedStyleCache.current) computedStyleCache.current = getElComputedStyle(el);
        if (resizable) {
          const newHeight = resize(el, computedStyleCache.current, resizeLimit.minRows, resizeLimit?.maxRows);

          if (showWordLimit) {
            // 如果有多行，需要展示字数限制
            if (newHeight > computedStyleCache.current.rowHeight) setShowLimit(true);
            else setShowLimit(false);
          }
        }
      }
    });

    useResizeObserver(inputRef, handleResize);

    // 初始化时对组件高度进行调整
    useLayoutEffect(() => {
      handleResize();
    }, [displayValue, handleResize]);
    /** Resize end */

    /** Style start */
    const { themeCls, sizeCls, labelCls, containerPadding, textareaPadding } = useBasicInputCls({
      theme,
      size,
      padding,
      hasClearIcon: !!clearIcon
    });

    const containerCls = cx(
      's-textarea-container group/textarea relative inline-flex w-full',
      rounded && 'rounded-lg',
      themeCls.background,
      themeCls.border,
      // 需要预留 limit 显示高度
      showLimit && '!pb-5',
      className
    );

    const inputCls = cx(
      's-textarea peer/textarea flex-1 w-full p-0',
      // select-none会禁用placeholder的选中效果，不影响正常输入的选中
      'select-none',
      'resize-none overflow-y-auto',
      sizeCls.text,
      themeCls.input,
      textareaCls
    );

    const clearIconCls = clearIcon
      ? cx(
          's-textarea-clear-icon',
          'absolute top-2 leading-0 cursor-pointer',
          'right-2 w-4 h-4',
          themeCls.clearIcon,
          'hidden group-hover/textarea:peer-valid/textarea:block peer-focus/textarea:peer-valid/textarea:block'
        )
      : '';

    const limitCls =
      'select-none s-textarea-limit absolute right-3 bottom-0.5 flex items-center gap-0.5 text-xs text-gray-300';
    /** Style end */

    return (
      <label
        aria-disabled={disabled}
        aria-invalid={error}
        htmlFor={inputId}
        className={containerCls}
        style={{ padding: containerPadding, paddingRight: 0 }}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.focus();
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label && (
          <span
            className={labelCls}
            style={{ width: labelWidth }}
          >
            {label}
          </span>
        )}

        <textarea
          {...restProps}
          id={inputId}
          ref={mergedRefs}
          className={inputCls}
          style={{ paddingRight: textareaPadding, ...restProps.style }}
          autoComplete="off"
          aria-autocomplete="none"
          spellCheck={false}
          disabled={disabled}
          // 目的是让 input 完全成为受控组件
          value={displayValue ?? ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          rows={resizeLimit?.maxRows}
          maxLength={maxLength?.input}
        />

        {!disabled && clearIcon && displayValue && (
          <span
            aria-invalid={error}
            className={clearIconCls}
            onMouseDown={evt => evt.preventDefault()}
            onClick={evt => {
              // 阻止冒泡和默认行为的动作应该在触发回调事件之前执行
              if (!focusAfterClearing) {
                // 阻止clearIcon点击后，事件冒泡到label重新将焦点聚焦到input的行为
                evt.preventDefault();
                evt.stopPropagation();
              }
              if (disabled) return;
              handleClear(evt);
              onClearClick?.(evt);
            }}
          >
            {clearIcon}
          </span>
        )}

        {showLimit && (
          <span className={limitCls}>
            <span className={displayValueLength > maxLength.display ? 'text-danger-100' : ''}>
              {displayValueLength}
            </span>
            <span>/</span>
            <span>{maxLength.display}</span>
          </span>
        )}
      </label>
    );
  }
);
