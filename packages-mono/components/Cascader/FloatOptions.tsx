import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { SelectedItem } from '@fepkg/components/Select/SelectedItem';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useMemoizedFn } from 'ahooks';
import { CascadeList } from './FloatOption';
import { useCascader } from './SelectProvider';

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
    visible,
    dropdownCls,
    firstActive = false,
    destroyOnClose,
    inputValue,
    display,
    change,
    handleCheckAll,
    onOptionsVisibleChange
  } = useCascader();

  const handleOptionsVisibleChange = useMemoizedFn((val: boolean) => onOptionsVisibleChange?.(val));

  const [expendDepth, setExpendDepth] = useState(2);

  useEffect(() => {
    handleOptionsVisibleChange(visible);
  }, [visible, handleOptionsVisibleChange]);

  // 如果下拉框有选项，则默认设置 activeIndex 为第 0 条
  useLayoutEffect(() => {
    if (display.options?.length) {
      if (firstActive) setActiveIndex(0);
    }
  }, [display.options?.length, setActiveIndex, firstActive]);

  if (!visible && destroyOnClose) return null;

  let mergedDropdownCls = 's-select-dropdown';
  if (dropdownCls) mergedDropdownCls = `${mergedDropdownCls} ${dropdownCls}`;
  if (!visible) mergedDropdownCls = `${mergedDropdownCls} s-select-dropdown-hidden`;

  const hasOptions = display.options?.length;
  const hasSelected = !!display.selected.length;

  /** 当为 search 模式，并且有 inputValue 并且没有展示的选项时，展示空状态 */
  const showEmpty = !!(inputValue && !hasOptions);
  const showContainer = hasOptions || showEmpty || hasSelected;
  const showDivider = (hasOptions || showEmpty) && hasSelected;

  const allChecked = display.options?.every(o => o.checked);
  const allIndeterminate = !allChecked && display.options?.some(o => o.checked || o.indeterminate);

  return (
    <FloatingPortal id="search-options-container">
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
              width: expendDepth > 1 ? expendDepth * 200 : 'auto',
              visibility: visible && showContainer ? 'visible' : 'hidden'
            }}
            // 防止点击options滚动条时触发搜索组件的onBlur事件
            onMouseDown={evt => evt.preventDefault()}
          >
            {!!display.options?.length && (
              <div className="s-select-dropdown-options">
                <div className="pl-3 pb-2 border-b border-0 border-solid border-gray-500">
                  <Checkbox
                    className="s-cascader-checkbox"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    onMouseDown={() => {
                      return true;
                    }}
                    checked={allChecked}
                    indeterminate={allIndeterminate}
                    onChange={handleCheckAll}
                  >
                    全部
                  </Checkbox>
                </div>
                <div className="flex pt-1.5 max-h-[228px]">
                  <CascadeList
                    depth={1}
                    virtual
                    options={display.options}
                    expendDepth={expendDepth}
                    setExpendDepth={setExpendDepth}
                  />
                </div>
              </div>
            )}

            <EmptyPlaceholder showEmpty={showEmpty} />

            {showDivider && <div className="w-full h-px bg-gray-500" />}

            {!!display.selected.length && (
              <div className="s-select-dropdown-selected">
                <div className="text-sm py-2 px-3 text-gray-200">已选</div>

                <div className="s-select-dropdown-tags">
                  {display.selected.map(opt => {
                    return (
                      <SelectedItem
                        className="max-w-[183px]"
                        key={`${opt.value}`}
                        label={opt.label ?? ''}
                        handleClose={() => change(false, opt)}
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
