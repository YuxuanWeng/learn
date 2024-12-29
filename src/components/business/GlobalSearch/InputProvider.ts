import { MouseEventHandler, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ClipboardEventHandler, CompositionEventHandler, FormEventHandler, KeyboardEventHandler } from 'react';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { SearchOption } from '@fepkg/components/Search';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { handleUndoKeyDown, useUndo } from '@fepkg/components/Search/useUndo';
import { RequestResponse } from '@fepkg/request/types';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { InputFilter } from '@fepkg/services/types/common';
import { useQueryClient } from '@tanstack/react-query';
import { createContainer } from 'unstated-next';
import { useEventListener } from 'usehooks-ts';
import { useParsingNormalQuery } from '@/common/services/hooks/useParsingNormalQuery';
import { useSearchProps } from '@/components/business/GlobalSearch/SearchPropsProvider';
import { GlobalSearchOption, GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { useFuzzySearchQuery } from '@/components/business/GlobalSearch/useFuzzySearchQuery';
import { flagRegex, getBondKeyList, spiltRegex, transform2InputValue } from '@/components/business/GlobalSearch/utils';

type IOnSearchParams = {
  val: InputFilter;
  opt?: SearchOption<GlobalSearchOption> | null;
};

/**
 * 用户输入有以下行为：
 * 1. 输入小写英文字母，会转化为大写字母
 * 2. 输入空格，会清除当前输入框内容，但使用中文输入法检索中文时输入空格则不会
 * 3. 输入合法内容
 *  3.1 若输入框内不含特殊标识符号（「CJ:」, 「TJ:」, 「BJ:」)，在输入框内容改变时进行模糊搜索
 *  3.2 若输入框内含特殊标识符号（「CJ:」, 「TJ:」, 「BJ:」)，关闭模糊搜索
 * 4. 粘贴内容，若内容长度大于 25 个字符，关闭模糊搜索
 *  4.1 若输入框内有内容，需为其添加分隔符（「\n」, 「\t」 等，需与后端同步）后改变输入框内容，
 *  4.2 若输入框内无内容，直接改变输入框内容
 * 5. 使用回车
 *  5.1 若下拉框选项的 activeIndex 不为 null，使用回车，
 *      则表示使用「选中下拉框选项的匹配条件」进行搜索报价列表，同时应用相应规则将选项回填至输入框内容
 *  5.2 若下拉框选项的 activeIndex 为 null，使用回车，
 *      如「输入框内容」内不包含相应分隔符（「\n」, 「\t」 等，需与后端同步），表示使用「输入框内容」调用券码识别接口，使用其结果进行搜索报价列表
 *      反之表示使用「输入框内容」进行搜索报价列表
 *  5.3 若下拉框内数据只有 1 条，则默认设置 activeIndex 为该内容的 index
 *  5.4 若下拉框内数据没有债券内容，但有其他选项时，则默认设置 activeIndex 为第一条内容的 index
 */

// Chromium 的执行顺序 onCompositionStart onChange onCompositionEnd

const InputContainer = createContainer(() => {
  const queryClient = useQueryClient();
  const { floating, activeIndex, setOpen, setActiveIndex } = useFloat();
  const { productType, value, onSearch: handleSearch, onClear } = useSearchProps();

  const inputRef = useRef<HTMLInputElement>(null);

  const prevSearchParams = useRef<IOnSearchParams | null>(null);
  const onSearch = (val: InputFilter, opt?: SearchOption<GlobalSearchOption> | null) => {
    prevSearchParams.current = { val, opt };
    handleSearch?.(val, opt);
  };

  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState(inputValue);

  const composing = useRef(false);
  const selecting = useRef(false);

  const { setUndoStack, undoIndex, setUndoIndex, intoStack, undo, redo } = useUndo(inputValue, setInputValue);

  const enabledParsing = !flagRegex.test(searchValue) && spiltRegex.test(searchValue) && Boolean(searchValue);

  const { data: fuzzySearchData } = useFuzzySearchQuery(searchValue);

  const { queryKey: parsingQueryKey } = useParsingNormalQuery({
    productType,
    keyword: searchValue,
    queryOptions: { enabled: enabledParsing }
  });

  const handleChange = (opt: SearchOption<GlobalSearchOption>) => {
    const text = transform2InputValue(opt);
    setInputValue(text);

    setActiveIndex(null);
    setOpen(false);
    floating.refs.domReference.current?.focus();

    const { original } = opt;
    const searchParams: InputFilter = { user_input: text };

    switch (original.search_option_type) {
      // 当用户在下拉列表选择某一条债券时，需要把这个债券对应的跨市场债券报价也搜出来
      case GlobalSearchOptionType.BOND: {
        // 使用bond_key可以搜出该债券及对应的跨市场债券
        searchParams.bond_key_list = [original.bond_key];
        break;
      }
      case GlobalSearchOptionType.INST: {
        searchParams.inst_id_list = [original.inst_id];
        break;
      }
      case GlobalSearchOptionType.TRADER: {
        searchParams.trader_id_list = [original.trader_id];
        break;
      }
      case GlobalSearchOptionType.BROKER: {
        searchParams.broker_id_list = [original.user_id];
        break;
      }
      default:
        break;
    }

    onSearch?.(searchParams, opt);
  };

  const handleClear = () => {
    setInputValue('');
    inputRef.current?.focus();
    setOpen(prev => {
      if (prev) return false;
      return prev;
    });
    requestIdleCallback(() => {
      onClear?.();
    });
  };

  const handleInputChange = (val: string) => {
    prevSearchParams.current = null;
    setInputValue(val);

    if (undoIndex != null) {
      setUndoStack(prev => {
        return prev.slice(0, undoIndex + 1);
      });
    }

    setUndoIndex(undefined);

    if (val) setOpen(true);
    else handleClear();
  };

  const onPaste: ClipboardEventHandler<HTMLInputElement> = async evt => {
    evt.preventDefault();
    const text = `${(await navigator.clipboard.readText()).replaceAll('\n|\t', ' ')}`.trim();

    setInputValue(prev => {
      if (prev) {
        if (inputRef.current) {
          const { selectionStart, selectionEnd } = inputRef.current;
          // 如果选中了文本
          if (selectionStart != null && selectionEnd != null && selectionStart !== selectionEnd) {
            const start = prev.slice(0, selectionStart);
            const end = prev.slice(selectionEnd);
            return `${start}${text}${end}`;
          }

          // 如果前面是特殊标识符号，则不需要中间插入空格
          if (flagRegex.test(prev)) return `${prev}${text}`;
          return `${prev} ${text}`;
        }
      }
      return text;
    });

    if (text) setOpen(true);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = async evt => {
    if (evt.key === KeyboardKeys.Enter) {
      if (composing.current) {
        evt.stopPropagation();
        return;
      }

      if (activeIndex != null && fuzzySearchData?.options?.[activeIndex]) {
        handleChange(fuzzySearchData.options[activeIndex]);
      } else if (enabledParsing) {
        const res = await queryClient.ensureQueryData<RequestResponse<BaseDataBondSearch.Response>>(parsingQueryKey);
        const bondKeyList = getBondKeyList(res?.bond_basic_list);

        // 使用bondKeyList可以查询带跨市场的债券
        onSearch?.({ user_input: searchValue, bond_key_list: bondKeyList });
      } else if (prevSearchParams.current) {
        return;
      } else {
        setOpen(false);
        onSearch?.({ user_input: searchValue });
      }
    }

    if (evt.key === KeyboardKeys.Tab) {
      setOpen(false);
    }

    if (evt.key === KeyboardKeys.ArrowLeft || evt.key === KeyboardKeys.ArrowRight) {
      setActiveIndex(null);
    }

    // 输入空格，会清除当前输入框内容，但使用中文输入法检索中文时输入空格则不会
    if (evt.key === KeyboardKeys.Space) {
      if (!composing.current) {
        evt.preventDefault();
        handleClear();
      }
    }

    handleUndoKeyDown(evt, undo, redo);
  };

  const onFocus: FormEventHandler<HTMLInputElement> = evt => {
    evt.preventDefault();
    intoStack(inputValue);
    if (searchValue) {
      selecting.current = true;
      inputRef.current?.select();
    }
  };

  const onBlur = () => {
    selecting.current = false;
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
      handleInputChange(evt.currentTarget.value);
    }
  };

  // 当输入框有数据时，即使光标不在搜索框中，使用 Escape 与 Space 也是支持清空内容的
  useEventListener('keydown', evt => {
    if (!searchValue || (evt.key !== KeyboardKeys.Escape && evt.key !== KeyboardKeys.Space)) {
      return;
    }

    // 在其他input框中输入Space不响应
    if (
      document.activeElement !== inputRef.current &&
      isTextInputElement(document.activeElement) &&
      evt.key === KeyboardKeys.Space
    ) {
      return;
    }

    if (!composing.current) {
      evt.preventDefault();
      handleClear();
    }
  });

  // Sync input value
  useLayoutEffect(() => {
    setInputValue(prev => {
      if (prev !== value?.user_input) return value?.user_input ?? '';
      return prev;
    });

    if (value?.user_input != null) {
      prevSearchParams.current = null;

      setUndoStack([value.user_input]);
      setUndoIndex(undefined);
    }
  }, [value, setUndoIndex, setUndoStack]);

  // Sync search value
  useEffect(() => {
    if (!composing.current) {
      setSearchValue(prev => {
        if (prev !== inputValue) return inputValue;
        return prev;
      });
    }
  }, [inputValue]);

  return {
    inputRef,
    inputValue,
    searchValue,
    setInputValue,

    onPaste,
    onKeyDown,
    onFocus,
    onBlur,
    onMouseUp,

    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,

    handleInputChange,
    handleChange,
    handleClear
  };
});

export const InputProvider = InputContainer.Provider;
export const useInput = InputContainer.useContainer;
