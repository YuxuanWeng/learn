import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import type { CompositionEventHandler, FormEventHandler, KeyboardEventHandler } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondSearchType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useEventListener } from 'usehooks-ts';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { useSearchProps } from './SearchPropsProvider';

const InputContainer = createContainer(() => {
  const { onSelect, productType } = useSearchProps();
  const { activeIndex, setOpen, setActiveIndex } = useFloat();

  const inputRef = useRef<HTMLInputElement>(null);

  const [displayQuickSearch, setDisplayQuickSearch] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState(inputValue);

  const composing = useRef(false);
  const selecting = useRef(false);

  const { data } = useFuzzySearchQuery<BaseDataBondSearch.Response, BaseDataBondSearch.Request>({
    api: APIs.baseData.bondSearch,
    keyword: searchValue,
    searchParams: {
      product_type: productType,
      search_type: BondSearchType.SearchDealProcess,
      offset: '0',
      count: '20'
    },
    queryOptions: { notifyOnChangeProps: ['data'] }
  });
  const bondInfoList = data?.bond_basic_list ?? [];

  const handleClear = () => {
    setInputValue('');
    inputRef.current?.focus();
    setOpen(prev => {
      if (prev) return false;
      return prev;
    });
  };

  const onChange = (val: string) => {
    setInputValue(val);

    if (val) setOpen(true);
    else handleClear();
  };

  // 选中债券后的操作，触发回调
  const handleSelect = (val?: FiccBondBasic) => {
    onSelect?.(val);
    setDisplayQuickSearch(false);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = evt => {
    if (evt.key === KeyboardKeys.Enter) {
      if (activeIndex != null && bondInfoList?.[activeIndex]) {
        handleSelect(bondInfoList[activeIndex]);
      } else if (bondInfoList[0]) handleSelect(bondInfoList[0]);
    }

    if (evt.key === KeyboardKeys.ArrowLeft || evt.key === KeyboardKeys.ArrowRight) {
      setActiveIndex(null);
    }

    // 输入空格，会清除当前输入框内容，但使用中文输入法检索中文时输入空格则不会
    // 这里没有这步逻辑，先注释起来
    // if (evt.code === 'Space') {
    //   if (!isComposition.current) {
    //     evt.preventDefault();
    //     handleClear();
    //   }
    // }
  };

  const onFocus: FormEventHandler<HTMLInputElement> = evt => {
    evt.preventDefault();
    if (searchValue) {
      selecting.current = true;
      inputRef.current?.select();
    }
  };

  const onBlur = () => {
    selecting.current = false;
    // 避免handleSelect方法还未触发就关闭
    setTimeout(() => {
      setDisplayQuickSearch(false);
    }, 200);
  };

  const onMouseUp: MouseEventHandler<HTMLInputElement> = evt => {
    // 为了不让鼠标抬起的时候取消选中（浏览器的默认行为）
    if (selecting.current) {
      evt.preventDefault();
      selecting.current = false;
    }
  };

  const onCompositionStart = () => {
    composing.current = true;
  };

  const onCompositionUpdate = () => {
    // 目标用户应该没有面向韩国，所以这里不做处理韩语输入处理
    composing.current = true;
  };

  const onCompositionEnd: CompositionEventHandler<HTMLInputElement> = evt => {
    if (composing.current) {
      composing.current = false;
      // 我们目前一定用的 Chromium 内核，所以直接 setSearchValue 一次即可
      setSearchValue(evt.currentTarget.value);
    }
  };

  useEventListener('keydown', evt => {
    // 当输入框有数据时，即使光标不在搜索框中，也是支持情况内容的
    if (searchValue && evt.key === KeyboardKeys.Escape) {
      if (!composing.current) {
        evt.preventDefault();
        handleClear();
      }
    }
  });

  // Sync search value
  useEffect(() => {
    if (!composing.current) {
      setSearchValue(prev => {
        if (prev !== inputValue) return inputValue;
        return prev;
      });
    }
  }, [inputValue]);

  // 当前是展示快捷搜素的状态，input需要聚焦
  useEffect(() => {
    if (displayQuickSearch) {
      inputRef.current?.focus();
      // 快捷搜索框没展示时，清空输入框内容
    } else setInputValue('');
  }, [displayQuickSearch]);

  return {
    inputRef,
    searchValue,
    displayQuickSearch,
    inputValue,
    setInputValue,
    setDisplayQuickSearch,
    setSearchValue,
    bondInfoList,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    onMouseUp,

    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,

    handleSelect,
    handleClear
  };
});

export const InputProvider = InputContainer.Provider;
export const useInput = InputContainer.useContainer;
