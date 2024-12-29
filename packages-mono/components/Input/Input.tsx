import { forwardRef } from 'react';
import cx from 'classnames';
import { IconCloseCircleFilled } from '@fepkg/icon-park-react';
import { iconCls, sizeClsMap } from './constants';
import { InputProps } from './types';
import { useBasicInputCls } from './useCls';
import { useInput } from './useInput';

// Chromium 的执行顺序 onCompositionStart onChange onCompositionEnd

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      className,
      label,
      labelWidth = 72,
      theme = 'dark',
      size = 'sm',
      padding = sizeClsMap[size].padding,
      rounded = true,
      error = false,
      disabled,
      defaultValue,
      value,
      clearByKeyboard,
      focusAfterClearing = true,
      composition,
      suffixIcon = null,
      clearIcon = <IconCloseCircleFilled />,
      onChange,
      onKeyDown,
      onEnterPress,
      onCompositionStart,
      onCompositionUpdate,
      onCompositionEnd,
      onMouseEnter,
      onMouseLeave,
      onSuffixClick,
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
    } = useInput<HTMLInputElement>(
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

    /** Style start */

    const { themeCls, sizeCls, labelCls, containerPadding } = useBasicInputCls({ theme, size, padding });

    const containerCls = cx(
      's-input-container group/input relative inline-flex items-center def:w-full cursor-text',
      rounded && 'rounded-lg',
      themeCls.background,
      themeCls.border,
      className
    );

    const inputCls = cx(
      's-input peer/input flex-1 w-full h-auto p-0',
      // select-none会禁用placeholder的选中效果，不影响正常输入的选中
      'select-none',
      (suffixIcon || clearIcon) && sizeCls.input,
      sizeCls.text,
      themeCls.input
    );

    const suffixIconCls = suffixIcon
      ? cx(
          's-input-suffix-icon peer-disabled/input:cursor-not-allowed',
          iconCls,
          onSuffixClick ? themeCls.suffixIcon : 'text-gray-200',
          clearIcon &&
            displayValue &&
            'group-hover/input:peer-valid/input:hidden group-hover/input:peer-valid/input:hidden peer-focus/input:peer-valid/input:hidden',
          sizeCls.icon
        )
      : '';

    const clearIconIconCls = clearIcon
      ? cx(
          's-input-clear-icon',
          iconCls,
          themeCls.clearIcon,
          'hidden group-hover/input:peer-valid/input:block peer-focus/input:peer-valid/input:block',
          sizeCls.icon
        )
      : '';

    /** Style end */

    return (
      <label
        aria-disabled={disabled}
        aria-invalid={error}
        htmlFor={inputId}
        className={containerCls}
        style={{ padding: containerPadding }}
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

        <input
          {...restProps}
          aria-autocomplete="none"
          aria-invalid={error}
          autoComplete="off"
          id={inputId}
          ref={mergedRefs}
          className={inputCls}
          spellCheck={false}
          disabled={disabled}
          // 目的是让 input 完全成为受控组件
          value={displayValue ?? ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
        />

        {suffixIcon && (
          <span
            className={suffixIconCls}
            onMouseDown={evt => evt.preventDefault()}
            onClick={evt => {
              if (disabled) return;
              onSuffixClick?.(evt);
            }}
          >
            {suffixIcon}
          </span>
        )}

        {!disabled && clearIcon && displayValue && (
          <span
            aria-invalid={error}
            className={clearIconIconCls}
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
      </label>
    );
  }
);
