import { useEffect } from 'react';
import { Portal } from '@fepkg/components/Portal';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { FloatOption } from './FloatOption';
import { useInput } from './InputProvider';

export const FloatOptions = () => {
  const { floating, interactions, setActiveIndex } = useFloat();
  const { displayQuickSearch, searchValue, bondInfoList } = useInput();

  const visible = displayQuickSearch && searchValue && bondInfoList.length;

  // 默认选中第一条
  useEffect(() => {
    setActiveIndex(0);
  }, [bondInfoList, searchValue, setActiveIndex]);

  return (
    <Portal rootId="quick-search-options-container">
      <div
        {...interactions.getFloatingProps({ ref: floating.refs.setFloating })}
        className="ml-px py-2 border border-solid border-gray-500 bg-gray-600 border-b-0 rounded-t-lg w-[456px] overflow-y-overlay"
        style={{
          ...floating.floatingStyles,
          visibility: visible ? 'visible' : 'hidden',
          zIndex: 9999
        }}
        onMouseDown={evt => {
          // 防止点击options滚动条时触发搜索组件的onBlur事件, 与search/FloatOptions相同
          evt.preventDefault();
        }}
      >
        <div
          className="mx-2"
          style={{ maxHeight: 10 * 32 }}
        >
          {bondInfoList?.map((option, index) => {
            return (
              <FloatOption
                key={option.key_market}
                index={index}
                bond={option}
                keyword={searchValue}
              />
            );
          })}
        </div>
      </div>
    </Portal>
  );
};
