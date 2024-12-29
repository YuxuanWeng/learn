import { ForwardedRef, forwardRef, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useFuzzySearchContext } from '@fepkg/business/providers/FuzzySearchContext';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconDown } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { InstitutionTiny } from '@fepkg/services/types/common';
import type { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import { useMemoizedFn } from 'ahooks';
import { take } from 'lodash-es';
import { useInstSearch } from './InstSearchProvider';
import { InstOptionRender } from './OptionRender';
import { InstSearchProps, InstSearchRequest, InstSearchResponse } from './types';

const defaultSearchParams = {
  offset: 0,
  count: 10
};

const Inner = <T extends InstitutionTiny = InstitutionTiny, Req extends InstSearchRequest = InstFuzzySearch.Request>(
  {
    api = APIs.inst.fuzzySearch,
    label = '机构',
    placeholder = '请输入',
    suffixIcon = <IconDown />,
    clearByKeyboard = KeyboardKeys.Escape,
    searchParams,
    disabled,
    onFilter,
    optionRender,
    onChange,
    onInputChange,
    onOptionsVisibleChange,
    onBeforeSearch,
    onlyRemoteQuery,
    ...restProps
  }: InstSearchProps<T, Req>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { useFuzzySearchQuery } = useFuzzySearchContext();
  const {
    productType,
    transformOption,
    instSearchRef,
    instSearchImpRef,
    instOptionsOpen,
    instSearchState,
    updateInstSearchState
  } = useInstSearch<T>();

  optionRender = useMemoizedFn(optionRender ?? InstOptionRender(productType));

  const searchRef = useMemo(() => mergeRefs([ref, instSearchRef]), [instSearchRef, ref]);

  const query = useFuzzySearchQuery<InstSearchResponse<T>, Req>({
    api,
    keyword: instSearchState.keyword.trim(),
    searchParams: { product_type: productType, ...defaultSearchParams, ...searchParams } as unknown as Req,
    queryOptions: { enabled: !disabled, notifyOnChangeProps: ['data'] },
    onQuery: onBeforeSearch,
    onlyRemoteQuery
  });
  const searchData = query?.data;

  const options = useMemo(() => {
    let res: T[] = [];

    if (instSearchState.selected) res = [instSearchState.selected.original];
    else res = searchData?.list ?? [];
    if (onFilter) res = onFilter(res);
    // 此处前端做限制取前N个，原因是该接口服务端无法保证count的准确性
    return take(res.map(transformOption).filter(Boolean), searchParams?.count ?? defaultSearchParams.count);
  }, [instSearchState.selected, onFilter, searchData?.list, searchParams?.count, transformOption]);

  const handleInputChange = (val: string) => {
    updateInstSearchState(draft => {
      draft.keyword = val;
    });
    onInputChange?.(val);
  };

  const handleChange = (opt?: SearchOption<T> | null) => {
    if (onChange) {
      onChange(opt);
    } else {
      updateInstSearchState(draft => {
        // @ts-ignore immer 抽风了，这里是对的，先 ignore 了
        draft.selected = opt ?? null;
      });
    }
  };

  const mergedClearByKeyboard = instSearchState.keyword || instSearchState.selected ? clearByKeyboard : null;

  return (
    <Search<T>
      ref={searchRef}
      imperativeRef={instSearchImpRef}
      label={label}
      placeholder={placeholder}
      suffixIcon={suffixIcon}
      focusAfterClearing
      disabled={disabled}
      clearByKeyboard={mergedClearByKeyboard}
      options={options}
      optionRender={optionRender}
      inputValue={instSearchState.keyword}
      value={instSearchState.selected}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onOptionsVisibleChange={val => {
        instOptionsOpen.current = !!val;
        onOptionsVisibleChange?.(val);
      }}
      {...restProps}
    />
  );
};

export const InstSearch = forwardRef(Inner);
