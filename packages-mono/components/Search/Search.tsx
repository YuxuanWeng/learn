import { ForwardedRef, KeyboardEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useMemoizedFn } from 'ahooks';
import { Input } from '../Input';
import { FloatOptions } from './FloatOptions';
import { FloatProvider, useFloat } from './FloatProvider';
import { SearchProvider, useSearch } from './SearchProvider';
import { SearchProps } from './types';
import { getActiveOption } from './utils';
import './search.less';

const Inner = forwardRef<HTMLInputElement>((_, ref) => {
  const { setOpen, activeIndex, floating, interactions } = useFloat();
  const {
    imperativeRef,
    dropdownCls,
    containerCls,
    floatingId,
    floatingRoot,
    floatFlip,
    floatShift,
    showOptions,
    firstActive,
    destroyOnClose,
    changeByTab = true,
    defaultSelectOnEnterDown = true,
    options,
    optionRender,
    inputValueRender,
    defaultValue,
    value,
    onChange,
    onInputChange,
    onOptionsVisibleChange,
    onLoadMore,

    visible,
    displayValue,
    composition = true,
    inputValue,
    setInputValue,
    innerValue,
    setInnerValue,
    change,
    displayValueChangedByInput,
    autoClear = true,
    ...inputProps
  } = useSearch();

  /** 提前准备好将要选中的选项 */
  const activeOption = getActiveOption(activeIndex, options, innerValue, defaultSelectOnEnterDown);

  const composing = useRef(false);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setOpen(!!val.trim());

    // 如果有选中的选项，清空 Search 内容
    if (innerValue) setInnerValue(null);

    displayValueChangedByInput.current = true;
  };

  const handleInputKeyDown = useMemoizedFn((evt: KeyboardEvent<HTMLInputElement>) => {
    if ((changeByTab && evt.key === KeyboardKeys.Tab && !evt.shiftKey) || evt.key === KeyboardKeys.Enter) {
      if (visible) {
        if (composition && composing.current) {
          evt.stopPropagation();
          return;
        }

        if (activeOption) {
          requestAnimationFrame(() => {
            change(activeOption);
            setOpen(false);
          });
        } else {
          setOpen(false);
        }
      }
    }

    inputProps?.onKeyDown?.(evt, composing.current);
  });

  useImperativeHandle(imperativeRef, () => ({
    toggleOpen: setOpen,
    clearInput: () => handleInputChange('')
  }));

  return (
    <div
      {...interactions.getReferenceProps({
        ref: floating.refs.setReference,
        className: cx('s-search s-search-dark', containerCls)
      })}
    >
      <Input
        ref={ref}
        composition={composition}
        autoComplete="off"
        aria-autocomplete="none"
        {...inputProps}
        value={displayValue}
        onChange={handleInputChange}
        onClick={evt => {
          if (!inputProps?.disabled) setOpen(true);
          inputProps?.onClick?.(evt);
        }}
        onBlur={evt => {
          // setOpen(prev => {
          //   if (prev) return false;
          //   return prev;
          // });
          // 失去焦点则清空搜索
          if (autoClear && !innerValue) {
            handleInputChange('');
          }
          inputProps?.onBlur?.(evt);
        }}
        onKeyDown={handleInputKeyDown}
        onCompositionStart={evt => {
          if (composition) composing.current = true;
          inputProps?.onCompositionStart?.(evt);
        }}
        onCompositionUpdate={evt => {
          if (composition) composing.current = true;
          inputProps?.onCompositionUpdate?.(evt);
        }}
        onCompositionEnd={evt => {
          if (composition && composing.current) {
            composing.current = false;
            // 我们目前一定用的 Chromium 内核，所以直接 change 一次即可
            const val = evt.currentTarget.value;
            handleInputChange(val);
          }
          inputProps?.onCompositionEnd?.(evt);
        }}
      />

      <FloatOptions />
    </div>
  );
});

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      strategy,
      limitWidth,
      updateByOpen,
      ancestorScroll,
      floatFlip = true,
      floatShift = true,
      placement,
      ...restProps
    },
    ref
  ) => {
    return (
      <FloatProvider
        initialState={{ strategy, updateByOpen, limitWidth, ancestorScroll, floatFlip, floatShift, placement }}
      >
        <SearchProvider {...restProps}>
          <Inner ref={ref} />
        </SearchProvider>
      </FloatProvider>
    );
  }
) as <T = unknown>(props: SearchProps<T> & { ref?: ForwardedRef<HTMLInputElement> }) => ReturnType<typeof Inner>;
