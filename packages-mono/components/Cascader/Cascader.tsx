import { FocusEvent, ForwardedRef, KeyboardEvent, MouseEvent, forwardRef } from 'react';
import cx from 'classnames';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useInput } from '@fepkg/components/Input/useInput';
import { FloatProvider, useFloat } from '@fepkg/components/Search/FloatProvider';
import '@fepkg/components/Select/select.less';
import { IconCloseCircleFilled, IconDown } from '@fepkg/icon-park-react';
import { FloatOptions } from './FloatOptions';
import { CascaderProvider, useCascader } from './SelectProvider';
import { CascaderV2Props } from './types';

// import './select.less';

const Inner = forwardRef<HTMLInputElement>((_, ref) => {
  const { open, setOpen, activeIndex, floating, interactions } = useFloat();
  const {
    imperativeRef,
    className,
    dropdownCls,
    showOptions,
    firstActive,
    destroyOnClose,
    changeByTab = true,
    error = false,
    disabled,
    optionRender,
    onOptionsVisibleChange,
    onLoadMore,

    visible,
    placeholder = '不限',
    display,
    inputValue,
    setInputValue,
    innerValue,
    setInnerValue,
    change,
    clear,

    id,
    label,
    labelWidth = 72,
    theme,
    size = 'md',
    clearByKeyboard,
    focusAfterClearing = true,
    composition = true,
    suffixIcon = <IconDown />,
    clearIcon = <IconCloseCircleFilled />,
    onKeyDown,
    onEnterPress,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    onMouseEnter,
    onMouseLeave,
    onSuffixClick,
    onClearClick,

    // 需要在这个位置把该方法引出，否则其将会随着inputProps传入input而导致报错
    handleCheckAll,

    ...inputProps
  } = useCascader();

  const {
    inputId,
    inputRef,
    mergedRefs,
    displayValue: inputDisplayValue,
    handleChange: handleInputChange,
    handleClear: handleInputClear,
    handleKeyDown: handleInputKeyDown,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd
  } = useInput<HTMLInputElement>(
    {
      id,
      disabled,
      defaultValue: undefined,
      value: inputValue,
      clearByKeyboard,
      focusAfterClearing,
      composition,
      onChange: setInputValue,
      onKeyDown,
      onEnterPress,
      onCompositionStart,
      onCompositionUpdate,
      onCompositionEnd
    },
    ref
  );

  const handleInputBlur = (evt: FocusEvent<HTMLInputElement>) => {
    // 如果没有 relatedTarget，说明是因为点击了外部导致的失焦，此时需要清空 input value
    // if (!evt.relatedTarget) setInputValue('');
    setInputValue('');

    inputProps?.onBlur?.(evt);
    // 如果焦点从当前input切换到另一个input，就关闭当前下拉框
    requestAnimationFrame(() => {
      const isInput = isTextInputElement(evt.relatedTarget);
      if (isInput && evt.target.role !== 'checkbox') setOpen(false);
    });
  };

  // 首次聚焦到input需要打开下拉框
  const handleFocus = (evt: FocusEvent<HTMLInputElement>) => {
    if (disabled) {
      evt.preventDefault();
      return;
    }
    setOpen(true);
    inputProps?.onFocus?.(evt);
  };

  const handleInputClick = (evt: MouseEvent<HTMLInputElement>) => {
    if (disabled) {
      evt.preventDefault();
      return;
    }

    setOpen(true);

    inputProps?.onClick?.(evt);
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === KeyboardKeys.Enter) {
      if (visible && activeIndex != null) {
        const opt = display.options[activeIndex];

        if (opt) {
          requestAnimationFrame(() => {
            // if (!opt?.disabled) change(opt);
          });
        }
      }
    } else if (evt.key === KeyboardKeys.Escape) {
      if (visible) {
        evt.stopPropagation();
        requestAnimationFrame(() => {
          setOpen(false);
        });
      }
    }

    handleInputKeyDown(evt);
  };

  const handleClear = (evt: MouseEvent<HTMLSpanElement>) => {
    if (disabled) return;

    evt.preventDefault();
    evt.stopPropagation();

    // 清空按钮会清空所有内容
    clear();
    handleInputClear(evt);
    onClearClick?.(evt);
  };

  const containerCls = cx(
    `s-select s-select-dark s-select-${size}`,
    !display.value && 's-select-none',
    (display.value || inputDisplayValue) && 's-select-with-value',
    display.options.length && 's-select-with-options',
    clearIcon && !disabled && 's-select-with-clear',
    visible && 's-select-open',
    disabled && 's-select-disabled',
    className
  );

  const inputCls = cx('s-select-input', 's-select-search', inputDisplayValue && 's-select-searching');

  return (
    <label
      aria-invalid={error}
      aria-disabled={disabled}
      {...interactions.getReferenceProps({
        ref: floating.refs.setReference,
        htmlFor: inputId,
        className: containerCls,
        // 这里阻止默认事件为了防止 input 失焦时清空 input 内容
        onMouseDown: evt => evt.preventDefault(),
        onClick: evt => {
          if (disabled) {
            evt.preventDefault();
            return;
          }

          inputRef.current?.focus();
        },
        onMouseEnter,
        onMouseLeave
      })}
    >
      {label && (
        <span
          className="s-select-label"
          style={{ width: labelWidth }}
        >
          {label}
        </span>
      )}

      <div className="s-select-selector">
        {!!display.selected.length && <span className="s-select-tags">{display.selected.length}</span>}

        {!inputDisplayValue && <span className="s-select-display">{display.value}</span>}

        <input
          {...inputProps}
          aria-invalid={error}
          aria-autocomplete="none"
          autoComplete="off"
          ref={mergedRefs}
          id={inputId}
          className={inputCls}
          spellCheck={false}
          disabled={disabled}
          placeholder={!display.value ? placeholder : undefined}
          // 目的是让 input 完全成为受控组件
          value={inputDisplayValue ?? ''}
          onChange={evt => {
            handleInputChange(evt);
            if (!open) setOpen(true);
          }}
          onClick={handleInputClick}
          onFocus={handleFocus}
          onBlur={handleInputBlur}
          onMouseDown={evt => {
            // 这里阻止冒泡是因为防止冒泡到 label 标签导致无法选择 input 内容
            evt.stopPropagation();
            inputProps?.onMouseDown?.(evt);
          }}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>

      {suffixIcon && (
        <span
          className="s-select-suffix-icon"
          onMouseDown={evt => evt.preventDefault()}
          onClick={evt => {
            if (disabled) return;
            onSuffixClick?.(evt);
          }}
        >
          {suffixIcon}
        </span>
      )}

      {!disabled && clearIcon && (
        <span
          aria-invalid={error}
          className="s-select-clear-icon"
          onMouseDown={evt => evt.preventDefault()}
          onClick={handleClear}
        >
          {clearIcon}
        </span>
      )}

      <FloatOptions />
    </label>
  );
});

export const Cascader = forwardRef<HTMLInputElement, CascaderV2Props>(
  ({ strategy, updateByOpen, ancestorScroll, floatFlip = true, floatShift = true, ...restProps }, ref) => {
    return (
      <FloatProvider
        initialState={{ limitWidth: false, strategy, updateByOpen, ancestorScroll, floatFlip, floatShift }}
      >
        <CascaderProvider {...restProps}>
          <Inner ref={ref} />
        </CascaderProvider>
      </FloatProvider>
    );
  }
) as (props: CascaderV2Props & { ref?: ForwardedRef<HTMLInputElement> }) => ReturnType<typeof Inner>;
