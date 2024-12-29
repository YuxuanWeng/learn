import { useEffect, useLayoutEffect } from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useMemoizedFn } from 'ahooks';
import { FloatOption } from './FloatOption';
import { useFloat } from './FloatProvider';
import { useSearch } from './SearchProvider';

export const FloatOptions = () => {
  const { open, setActiveIndex, floating, interactions } = useFloat();
  const {
    dropdownCls,
    floatingId = 'search-options-container',
    floatingRoot,
    visible,
    firstActive = true,
    destroyOnClose,
    options,
    onLoadMore,
    onOptionsVisibleChange
  } = useSearch();

  const handleContainerWheel = () => {
    if (floating.refs.floating.current) {
      const { clientHeight, scrollHeight, scrollTop } = floating.refs.floating.current;
      if (clientHeight + scrollTop >= scrollHeight) {
        onLoadMore?.();
      }
    }
  };

  const handleOptionsVisibleChange = useMemoizedFn((val: boolean) => onOptionsVisibleChange?.(val));

  useEffect(() => {
    handleOptionsVisibleChange(visible);
  }, [visible, handleOptionsVisibleChange]);

  // 如果下拉框有选项，则默认设置 activeIndex 为第 0 条
  useLayoutEffect(() => {
    if (options?.length) {
      if (visible && firstActive) setActiveIndex(0);
    }
  }, [visible, options, setActiveIndex, firstActive]);

  if (!visible && destroyOnClose) return null;

  let mergedDropdownCls = 's-search-dropdown';
  if (dropdownCls) mergedDropdownCls = `${mergedDropdownCls} ${dropdownCls}`;
  if (!visible) mergedDropdownCls = `${mergedDropdownCls} s-search-dropdown-hidden`;

  return (
    <FloatingPortal
      id={floatingId}
      root={floatingRoot}
    >
      {open && (
        <FloatingFocusManager
          context={floating.context}
          initialFocus={-1}
          visuallyHiddenDismiss
        >
          <div
            {...interactions.getFloatingProps({ ref: floating.refs.setFloating })}
            className={mergedDropdownCls}
            style={{
              ...floating.floatingStyles,
              visibility: visible ? 'visible' : 'hidden'
            }}
            // 防止点击options滚动条时触发搜索组件的onBlur事件
            onMouseDown={evt => evt.preventDefault()}
            onWheel={handleContainerWheel}
          >
            {options?.map((opt, index) => {
              const key = `${opt.value}_${index}`;
              return (
                <FloatOption
                  key={key}
                  index={index}
                  option={opt}
                />
              );
            })}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
