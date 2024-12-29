import { forwardRef, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconDown } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import type { InstTraderSearch as InstTraderSearchType } from '@fepkg/services/types/inst-trader/search';
import { useMemoizedFn } from 'ahooks';
import { merge } from 'lodash-es';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { useTraderPreference } from '../TraderSearch/TraderPreferenceProvider';
import { useInstTraderSearch } from './InstTraderSearchProvider';
import { InstTraderSearchProps } from './types';
import { optionRenderWithPreference } from './utils';

export const InstTraderSearch = forwardRef<HTMLInputElement, InstTraderSearchProps>(
  (
    {
      label = '交易员',
      placeholder = '请输入',
      suffixIcon = <IconDown />,
      searchParams,
      disabled,
      clearByKeyboard = KeyboardKeys.Escape,
      showOptions,
      preferenceHighlight = true,
      optionRender,
      onChange,
      onInputChange,
      onOptionsVisibleChange,
      onBeforeSearch,
      hiddenTraderIDs,
      ...restProps
    },
    ref
  ) => {
    const {
      productType,
      transformOption,
      instTraderSearchRef,
      instTraderSearchImpRef,
      instTraderOptionsOpen,
      instTraderSearchState,
      updateInstTraderSearchState
    } = useInstTraderSearch();
    const traderPreference = useTraderPreference();

    const searchRef = useMemo(() => mergeRefs([ref, instTraderSearchRef]), [ref, instTraderSearchRef]);

    const defaultOptionRender = useMemoizedFn(() => {
      if (!optionRender && preferenceHighlight) return optionRenderWithPreference(productType);
      return optionRender;
    });

    const { data: searchData } = useFuzzySearchQuery<InstTraderSearchType.Response, InstTraderSearchType.Request>({
      api: APIs.instTrader.search,
      keyword: instTraderSearchState.keyword.trim(),
      searchParams: { product_type: productType, ...searchParams },
      onlyRemoteQuery: true,
      queryOptions: { enabled: !disabled, notifyOnChangeProps: ['data'] },
      onQuery: onBeforeSearch
    });

    const options = useMemo(() => {
      let res: TraderWithPref[] = [];
      let opts: SearchOption<TraderWithPref>[] = [];

      const searchList = searchData?.trader_list ?? [];
      let preferenceKey = instTraderSearchState.keyword;

      if (instTraderSearchState.selected) res = [instTraderSearchState.selected.original];
      else res = searchList;
      // 如果有识别的结果，options就展示识别的结果
      if (instTraderSearchState.parsingList.length) {
        const [target] = instTraderSearchState.parsingList;
        if (target) preferenceKey = target.name_zh;

        res = instTraderSearchState.parsingList;
        opts = res.map(i => transformOption(i, productType)).filter(Boolean);
      } else {
        opts = res
          .map(i => transformOption(i, productType))
          .filter(
            i => Boolean(i) && !hiddenTraderIDs?.includes(i?.original.trader_id ?? '')
          ) as SearchOption<TraderWithPref>[];
      }

      const hasPreference =
        !!opts.length && traderPreference?.preference && traderPreference?.preference.has(preferenceKey);

      // 设置的首选项影响到不需要首选项置顶到地方
      if (preferenceHighlight && hasPreference) {
        const preferenceValue = traderPreference?.preference.get(preferenceKey);
        const index = opts.findIndex(opt => opt.original.trader_id === preferenceValue);
        // 看看交易员首选项在这次搜索的返回值中是否存在，如果存在，将其放在列表首位
        if (index > -1) {
          const [preferTrader] = opts.splice(index, 1);
          opts.unshift(merge({ original: { preference: true } }, preferTrader));
        }
      }

      return opts;
    }, [
      searchData?.trader_list,
      instTraderSearchState.keyword,
      instTraderSearchState.parsingList,
      instTraderSearchState.selected,
      productType,
      transformOption,
      traderPreference?.preference,
      preferenceHighlight,
      hiddenTraderIDs
    ]);

    /** 是否展示 options */
    let mergedShowOptions = !instTraderSearchState.selected && !!options.length;
    if (showOptions !== undefined) {
      if (typeof showOptions === 'function') mergedShowOptions = showOptions(instTraderSearchState.selected, options);
      else mergedShowOptions = showOptions;
    }

    const handleInputChange = (val: string) => {
      updateInstTraderSearchState(draft => {
        draft.keyword = val;
      });
      onInputChange?.(val);
    };

    const handleChange = (opt?: SearchOption<TraderWithPref> | null) => {
      if (onChange) {
        onChange(opt);
      } else {
        updateInstTraderSearchState(draft => {
          draft.selected = opt ?? null;
        });
      }
    };

    const mergedClearByKeyboard =
      instTraderSearchState.keyword || instTraderSearchState.selected ? clearByKeyboard : null;

    return (
      <Search<TraderWithPref>
        ref={searchRef}
        imperativeRef={instTraderSearchImpRef}
        label={label}
        placeholder={placeholder}
        limitWidth
        suffixIcon={suffixIcon}
        focusAfterClearing
        disabled={disabled}
        showOptions={mergedShowOptions}
        options={options}
        optionRender={defaultOptionRender()}
        clearByKeyboard={mergedClearByKeyboard}
        inputValue={instTraderSearchState.keyword}
        value={instTraderSearchState.selected}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onOptionsVisibleChange={val => {
          instTraderOptionsOpen.current = !!val;
          onOptionsVisibleChange?.(val);
        }}
        {...restProps}
      />
    );
  }
);
