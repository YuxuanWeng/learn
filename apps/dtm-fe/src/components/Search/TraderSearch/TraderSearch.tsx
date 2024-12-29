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
import { useMemoizedFn } from 'ahooks';
import { useInstTraderListQuery } from '@/common/services/hooks/useInstTraderListQuery';

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
      onBeforeSearch,
      onInputChange,
      searchParams,
      optionRender,
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

    optionRender = useMemoizedFn(optionRender ?? TraderOptionRender(productType));

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

      if (traderSearchState.parsingList.length) {
        res = traderSearchState.parsingList;
        opts = res.map(transformOption).filter(Boolean);
      } else if (traderSearchState?.inst) {
        res =
          instTraderListData?.list?.map(item => ({ ...item, inst_info: traderSearchState?.inst as Institution })) ?? [];
        opts = res.map(transform2TraderOpt).filter(Boolean);
      } else {
        res = searchData?.list ?? [];
        opts = res.map(transform2TraderOpt).filter(Boolean);
      }

      return opts;
    }, [
      traderSearchState.parsingList,
      traderSearchState?.inst,
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
        floatShift={false}
        imperativeRef={traderSearchImpRef}
        label={label}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        focusAfterClearing
        disabled={disabled}
        options={options}
        optionRender={optionRender}
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
