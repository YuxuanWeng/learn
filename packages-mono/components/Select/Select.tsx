import { FocusEvent, ForwardedRef, KeyboardEvent, MouseEvent, forwardRef } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { IconCloseCircleFilled, IconDown } from '@fepkg/icon-park-react';
import { useInput } from '../Input/useInput';
import { FloatProvider, useFloat } from '../Search/FloatProvider';
import { FloatOptions } from './FloatOptions';
import { SelectProvider, useSelect } from './SelectProvider';
import { SelectProps, SelectValue } from './types';
import './select.less';

const Inner = forwardRef<HTMLInputElement>((_, ref) => {
  const { open, setOpen, activeIndex, floating, interactions } = useFloat();
  const {
    imperativeRef,
    className,
    dropdownCls,
    floatingId,
    floatingRoot,
    floatFlip,
    floatShift,
    showOptions,
    firstActive,
    destroyOnClose,
    changeByTab = true,
    multiple = false,
    search = false,
    tags,
    error = false,
    disabled,
    optionRender,
    onOptionsVisibleChange,
    onLoadMore,

    visible,
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

    ...inputProps
  } = useSelect();

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
  };

  const handleInputClick = (evt: MouseEvent<HTMLInputElement>) => {
    if (disabled) {
      evt.preventDefault();
      return;
    }

    // search 模式点击时一直打开下拉框，非 search 模式点击时需交替打开与关闭下拉框
    if (search) setOpen(true);
    else setOpen(prev => !prev);

    inputProps?.onClick?.(evt);
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if ((changeByTab && evt.key === KeyboardKeys.Tab && !evt.shiftKey) || evt.key === KeyboardKeys.Enter) {
      if (visible && activeIndex != null) {
        const opt = display.options[activeIndex];

        if (opt) {
          requestAnimationFrame(() => {
            if (!opt?.disabled) change(opt);
            if (!multiple) setOpen(false);
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
    } else if (evt.key === KeyboardKeys.Space) {
      // 如果不是 search 模式，需要使用空格展开收起下拉框
      if (!search) {
        evt.preventDefault();
        requestAnimationFrame(() => setOpen(prev => !prev));
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

  const inputCls = cx('s-select-input', search && 's-select-search', inputDisplayValue && 's-select-searching');

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
        {multiple && !!display.selected.length && <span className="s-select-tags">{display.selected.length}</span>}

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
          readOnly={!search}
          disabled={disabled}
          placeholder={!display.value ? inputProps?.placeholder : undefined}
          // 目的是让 input 完全成为受控组件
          value={inputDisplayValue ?? ''}
          onChange={evt => {
            handleInputChange(evt);
            if (search && !open) setOpen(true);
          }}
          onClick={handleInputClick}
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

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    { strategy, limitWidth = true, updateByOpen, ancestorScroll, floatFlip = true, floatShift = true, ...restProps },
    ref
  ) => {
    return (
      <FloatProvider initialState={{ limitWidth, strategy, updateByOpen, ancestorScroll, floatFlip, floatShift }}>
        <SelectProvider {...restProps}>
          <Inner ref={ref} />
        </SelectProvider>
      </FloatProvider>
    );
  }
) as <T extends SelectValue = SelectValue>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof Inner>;
