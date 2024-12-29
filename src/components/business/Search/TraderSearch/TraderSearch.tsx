import { forwardRef, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { TraderOptionRender } from '@fepkg/business/components/Search/TraderSearch/OptionRender';
import { useTraderSearch } from '@fepkg/business/components/Search/TraderSearch/TraderSearchProvider';
import { TraderSearchProps, TraderWithPref } from '@fepkg/business/components/Search/TraderSearch/types';
import { transform2TraderOpt } from '@fepkg/business/components/Search/TraderSearch/utils';
import { useFuzzySearchContext } from '@fepkg/business/providers/FuzzySearchContext';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconDown } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { Institution } from '@fepkg/services/types/common';
import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import { merge } from 'lodash-es';
import { useInstTraderListQuery } from '@/common/services/hooks/useInstTraderListQuery';
import { useTraderPreference } from './TraderPreferenceProvider';

const defaultSearchParams = {
  offset: 0,
  count: 20
};

export const TraderSearch = forwardRef<HTMLInputElement, TraderSearchProps>(
  (
    {
      label = '交易员',
      placeholder = '请输入',
      suffixIcon = <IconDown />,
      disabled,
      clearByKeyboard = KeyboardKeys.Escape,
      onChange,
      onInputChange,
      onBeforeSearch,
      searchParams,
      ...restProps
    },
    ref
  ) => {
    const { useFuzzySearchQuery } = useFuzzySearchContext();
    const {
      productType,
      transformOption,
      traderSearchRef,
      traderSearchImpRef,
      traderOptionsOpen,
      traderSearchState,
      updateTraderSearchState
    } = useTraderSearch();
    const traderPreference = useTraderPreference();

    const searchRef = useMemo(() => mergeRefs([ref, traderSearchRef]), [ref, traderSearchRef]);

    const { data: instTraderListData } = useInstTraderListQuery({
      variables: { inst_id: traderSearchState?.inst?.inst_id ?? '', product_type: productType }
    });

    const query = useFuzzySearchQuery<LocalTraderSearch.Response, LocalTraderSearch.Request>({
      api: APIs.trader.search,
      keyword: traderSearchState.keyword.trim(),
      searchParams: { product_type: productType, ...defaultSearchParams, ...searchParams },
      queryOptions: { enabled: !disabled },
      onQuery: onBeforeSearch
    });
    const searchData = query?.data;

    const options = useMemo(() => {
      let res: TraderWithPref[] = [];
      let opts: SearchOption<TraderWithPref>[] = [];

      // 模糊搜索存储的 preference，key 为 ${keyword}，其他情况下存储的 preference，key 为 ${name_zh}
      let preferenceKey = traderSearchState.keyword;

      if (traderSearchState.parsingList.length) {
        const [target] = traderSearchState.parsingList;
        if (target) preferenceKey = target.name_zh;

        res = traderSearchState.parsingList;
        opts = res.map(transformOption).filter(Boolean);
      } else if (traderSearchState?.inst) {
        const [target] = instTraderListData?.list ?? [];
        if (target) preferenceKey = target.name_zh;

        res =
          instTraderListData?.list?.map(item => ({ ...item, inst_info: traderSearchState?.inst as Institution })) ?? [];
        opts = res.map(transform2TraderOpt).filter(Boolean);
      } else {
        res = searchData?.list ?? [];
        opts = res.map(transform2TraderOpt).filter(Boolean);
      }

      const hasPreference =
        !!res.length && traderPreference?.preference && traderPreference?.preference.has(preferenceKey);

      if (hasPreference) {
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
      traderSearchState.keyword,
      traderSearchState.parsingList,
      traderSearchState?.inst,
      traderPreference,
      transformOption,
      instTraderListData?.list,
      searchData?.list
    ]);

    const handleInputChange = (val: string) => {
      updateTraderSearchState(draft => {
        draft.keyword = val;
      });
      onInputChange?.(val);
    };

    const handleChange = (opt?: SearchOption<TraderWithPref> | null) => {
      if (onChange) {
        onChange(opt);
      } else {
        updateTraderSearchState(draft => {
          draft.selected = opt ?? null;
        });
      }
    };

    const mergedClearByKeyboard = traderSearchState.keyword || traderSearchState.selected ? clearByKeyboard : null;

    return (
      <Search<TraderWithPref>
        ref={searchRef}
        imperativeRef={traderSearchImpRef}
        label={label}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        focusAfterClearing
        disabled={disabled}
        options={options}
        optionRender={TraderOptionRender(productType)}
        clearByKeyboard={mergedClearByKeyboard}
        inputValue={traderSearchState.keyword}
        value={traderSearchState.selected}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onOptionsVisibleChange={val => {
          traderOptionsOpen.current = !!val;
        }}
        {...restProps}
      />
    );
  }
);
