import { memo, useEffect, useLayoutEffect } from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useMemoizedFn } from 'ahooks';
import { Placeholder } from '../Placeholder';
import { useFloat } from '../Search/FloatProvider';
import { FloatOption } from './FloatOption';
import { useSelect } from './SelectProvider';
import { SelectedItem } from './SelectedItem';

// 这里使用 memo 是因为防止 img 标签内加载图片闪烁，后续优化 Placeholder 之后或可把 memo 干掉
const EmptyPlaceholder = memo(({ showEmpty }: { showEmpty: boolean }) => {
  return (
    <div className={`h-[186px] ${showEmpty ? 'flex-center' : 'hidden'}`}>
      <Placeholder
        type="no-search-result"
        size="xs"
      />
    </div>
  );
});

export const FloatOptions = () => {
  const { open, setActiveIndex, floating, interactions } = useFloat();
  const {
    search,
    multiple,
    tags,
    visible,
    dropdownCls,
    floatingId = 'search-options-container',
    floatingRoot,
    firstActive = false,
    destroyOnClose,
    inputValue,
    display,
    change,
    onLoadMore,
    onOptionsVisibleChange
  } = useSelect();

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
    if (display.options?.length) {
      if (visible && firstActive) setActiveIndex(0);
    }
  }, [visible, display.options, setActiveIndex, firstActive]);

  if (!visible && destroyOnClose) return null;

  let mergedDropdownCls = 's-select-dropdown';
  if (dropdownCls) mergedDropdownCls = `${mergedDropdownCls} ${dropdownCls}`;
  if (multiple) mergedDropdownCls = `${mergedDropdownCls} s-select-dropdown-multiple`;
  if (!visible) mergedDropdownCls = `${mergedDropdownCls} s-select-dropdown-hidden`;

  const hasOptions = display.options?.length;
  const hasSelected = multiple && tags && !!display.selected.length;

  /** 当为 search 模式，并且有 inputValue 并且没有展示的选项时，展示空状态 */
  const showEmpty = !!(search && inputValue && !hasOptions);
  const showContainer = hasOptions || showEmpty || hasSelected;
  const showDivider = (hasOptions || showEmpty) && hasSelected;

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
              visibility: visible && showContainer ? 'visible' : 'hidden'
            }}
            // 防止点击options滚动条时触发搜索组件的onBlur事件
            onMouseDown={evt => evt.preventDefault()}
          >
            {!!display.options?.length && (
              <div
                className="s-select-dropdown-options"
                onWheel={handleContainerWheel}
              >
                {display.options?.map((opt, index) => {
                  return (
                    <FloatOption
                      key={`${opt.value}`}
                      index={index}
                      option={opt}
                    />
                  );
                })}
              </div>
            )}

            <EmptyPlaceholder showEmpty={showEmpty} />

            {showDivider && <div className="w-full h-px bg-gray-500" />}

            {multiple && tags && !!display.selected.length && (
              <div className="s-select-dropdown-selected">
                <div className="text-sm py-2 px-3 text-gray-200">已选</div>

                <div className="s-select-dropdown-tags">
                  {display.selected.map(opt => {
                    return (
                      <SelectedItem
                        key={`${opt.value}`}
                        label={opt.label}
                        handleClose={() => change(opt)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
