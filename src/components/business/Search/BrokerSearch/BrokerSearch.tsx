import { forwardRef, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconDown } from '@fepkg/icon-park-react';
import { fetchUserList } from '@fepkg/services/api/user/list';
import { APIs } from '@fepkg/services/apis';
import { User } from '@fepkg/services/types/common';
import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { Post } from '@fepkg/services/types/enum';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isUseLocalServer } from '@/common/ab-rules';
import { localFuzzySearch } from '@/common/request/local-fuzzy-search';
import { fetchLocalServerUserList } from '@/common/services/api/local-server/user-list';
import { useBrokerSearch } from './BrokerSearchProvider';
import { OptionRender } from './OptionRender';
import { BrokerSearchProps } from './types';
import { transform2BrokerOpt } from './utils';

const BROKERS_PAGE_SIZE = 100;

const defaultSearchParams = {
  post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee],
  count: BROKERS_PAGE_SIZE
};

export const BrokerSearch = forwardRef<HTMLInputElement, BrokerSearchProps>(
  (
    {
      label = '经纪人',
      placeholder = '请输入',
      suffixIcon = <IconDown />,
      disabled,
      clearByKeyboard = KeyboardKeys.Escape,
      optionFilter,
      onChange,
      onBeforeSearch,
      ...restProps
    },
    ref
  ) => {
    const {
      productType,
      brokerSearchRef,
      brokerSearchImpRef,
      brokerOptionsOpen,
      brokerSearchState,
      updateBrokerSearchState
    } = useBrokerSearch();

    const searchRef = useMemo(() => mergeRefs([ref, brokerSearchRef]), [ref, brokerSearchRef]);

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
      queryKey: [APIs.user.list, 'broker-infinite', productType, brokerSearchState.keyword] as const,
      queryFn: async ({ pageParam = 0, signal }) => {
        onBeforeSearch?.();

        const searchParams = {
          product_type: productType,
          keyword: brokerSearchState.keyword.trim(),
          offset: (pageParam ?? 0) * BROKERS_PAGE_SIZE,
          ...defaultSearchParams
        };

        let result: LocalUserSearch.Response;
        try {
          // 前端本地化与local server AB
          if (isUseLocalServer()) {
            result = await fetchLocalServerUserList(searchParams);
          } else {
            result = await localFuzzySearch<LocalUserSearch.Request, LocalUserSearch.Response>(
              APIs.user.list,
              searchParams
            );
          }

          return { ...result, pageParam };
        } catch {
          const res = await fetchUserList(searchParams, { signal });
          return { ...res, pageParam };
        }
      },
      getNextPageParam(lastPage) {
        const { pageParam, has_more } = lastPage;
        if (has_more) return pageParam + 1;
        return void 0;
      },
      enabled: !disabled && !!brokerSearchState.keyword.trim()
    });
    const options = useMemo(() => {
      const res = data?.pages?.map(page => page?.list as User[]).flat() ?? [];
      const formatRes = res.map(transform2BrokerOpt).filter(Boolean);
      return optionFilter ? formatRes?.filter(optionFilter) : formatRes;
    }, [data?.pages, optionFilter]);

    const handleLoadMore = () => {
      if (isFetchingNextPage) return;
      if (hasNextPage) fetchNextPage();
    };

    const handleInputChange = (val: string) => {
      updateBrokerSearchState(draft => {
        draft.keyword = val;
      });
    };

    const handleChange = (opt?: SearchOption<User> | null) => {
      if (onChange) {
        onChange(opt);
      } else {
        updateBrokerSearchState(draft => {
          draft.selected = opt ?? null;
        });
      }
    };

    const mergedClearByKeyboard = brokerSearchState.keyword || brokerSearchState.selected ? clearByKeyboard : null;

    return (
      <Search<User>
        ref={searchRef}
        imperativeRef={brokerSearchImpRef}
        label={label}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        focusAfterClearing
        disabled={disabled}
        options={options}
        optionRender={OptionRender}
        clearByKeyboard={mergedClearByKeyboard}
        inputValue={brokerSearchState.keyword}
        value={brokerSearchState.selected}
        onLoadMore={handleLoadMore}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onOptionsVisibleChange={val => {
          brokerOptionsOpen.current = !!val;
        }}
        {...restProps}
      />
    );
  }
);
