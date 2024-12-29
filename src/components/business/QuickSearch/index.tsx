import { useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { Input } from '@fepkg/components/Input';
import { FloatProvider, useFloat } from '@fepkg/components/Search/FloatProvider';
import { IconSearch } from '@fepkg/icon-park-react';
import { FloatOptions } from './FloatOptions';
import { InputProvider, useInput } from './InputProvider';
import { QuickSearchProps, SearchPropsProvider } from './SearchPropsProvider';
import { useHotkey } from './useHotkey';

const QuickSearchInner = () => {
  const { floating, interactions } = useFloat();
  const {
    inputValue,
    displayQuickSearch,
    inputRef,
    onChange,
    onKeyDown,
    onBlur,
    onFocus,
    onMouseUp,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate
  } = useInput();

  // 绑定快捷键
  const { searchRef } = useHotkey();

  const mergedRef = useMemo(() => mergeRefs([searchRef, inputRef]), [searchRef, inputRef]);

  return (
    <div
      className={cx(
        'fixed bottom-4 right-4 py-2 rounded-lg border border-solid border-gray-500 drop-shadow-dropdown bg-gray-600',
        displayQuickSearch ? 'flex items-end' : 'hidden'
      )}
    >
      <div
        className="flex-1"
        {...interactions.getReferenceProps({ ref: floating.refs.setReference })}
      >
        <FloatOptions />

        <Input
          ref={mergedRef}
          className="w-[438px] mx-2"
          placeholder=""
          suffixIcon={<IconSearch />}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onFocus={onFocus}
          onMouseUp={onMouseUp}
          onCompositionEnd={onCompositionEnd}
          onCompositionStart={onCompositionStart}
          onCompositionUpdate={onCompositionUpdate}
        />
      </div>
    </div>
  );
};

/**
 * 快捷搜索行为有
 * 1. 焦点在交易员处理页面的时候按下键盘，在右下角弹起快捷搜索的弹窗
 * 2. 焦点移除快捷搜索弹窗，弹窗消失

 * 3. 输入内容，触发快捷搜索
 * 4. 点击关闭按钮，清空输入框内容
 * 5. 输入空格，清空输入框内容
 * 6. 点击上下键选择债券
 * 7. 焦点在选中条目处敲回车，打开单券详情页面
 * 8. 点击回车，选中当前项并打开单券详情页面
 * 9. 点击选项，选中当前项并打开单券详情页面
 */

export const QuickSearch = (props: QuickSearchProps) => {
  return (
    <FloatProvider initialState={{ offset: 0, placement: 'top-end' }}>
      <SearchPropsProvider initialState={{ ...props }}>
        <InputProvider>
          <QuickSearchInner />
        </InputProvider>
      </SearchPropsProvider>
    </FloatProvider>
  );
};
