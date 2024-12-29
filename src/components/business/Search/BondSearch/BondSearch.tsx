import { KeyboardEvent, forwardRef, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch/BondSearchProvider';
import { BondOptionRender } from '@fepkg/business/components/Search/BondSearch/OptionRender';
import { BondSearchProps } from '@fepkg/business/components/Search/BondSearch/types';
import { useParsingQuoteQuery } from '@fepkg/business/components/Search/BondSearch/useParsingQuoteQuery';
import { useFuzzySearchContext } from '@fepkg/business/providers/FuzzySearchContext';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconDown } from '@fepkg/icon-park-react';
import { fetchParsingQuoteInfo } from '@fepkg/services/api/parsing/quote-info';
import { APIs } from '@fepkg/services/apis';
import { FiccBondBasic, QuoteParsing, Trader } from '@fepkg/services/types/common';
import { BondSearchType, FiccBondInfoLevel, UserSettingFunction } from '@fepkg/services/types/enum';
import { LocalServerBaseDataBondSearch } from '@fepkg/services/types/local-server/base-data-bond-search';
import { useMemoizedFn } from 'ahooks';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { QuoteSettingsType } from '@/components/Quote/types';

const defaultSearchParams = {
  search_type: BondSearchType.SearchAllField,
  info_level: FiccBondInfoLevel.BasicInfo,
  offset: '0',
  count: '10'
};

export const PARSING_REGEX = /\s/;

export const BondSearch = forwardRef<HTMLInputElement, BondSearchProps>(
  (
    {
      label = '产品',
      placeholder = '请输入',
      suffixIcon = <IconDown />,
      searchParams,
      parsing,
      disabled,
      showOptions,
      clearByKeyboard = KeyboardKeys.Escape,
      optionRender,
      onChange,
      onInputChange,
      onOptionsVisibleChange,
      onKeyDown,
      onParsingSuccess,
      onBeforeSearch,
      onBeforeParsing,
      dropdownCls,
      ...restProps
    },
    ref
  ) => {
    const { useFuzzySearchQuery } = useFuzzySearchContext();
    const {
      productType,
      transformOption,
      bondSearchRef,
      bondSearchImpRef,
      bondOptionsOpen,
      bondSearchState,
      updateBondSearchState
    } = useBondSearch();
    // 信用债与NCD需要展示评级-避免传入的optionRender不生效
    optionRender = useMemoizedFn(optionRender ?? BondOptionRender(productType));

    const { getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);
    /** 单条报价识别自动加* */
    const autoStar = getSetting<boolean>(UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar);

    const searchRef = useMemo(() => mergeRefs([ref, bondSearchRef]), [bondSearchRef, ref]);
    const searchEnabled = !disabled && !PARSING_REGEX.test(bondSearchState.keyword);

    const query = useFuzzySearchQuery<LocalServerBaseDataBondSearch.Response, LocalServerBaseDataBondSearch.Request>({
      api: APIs.baseData.bondSearch,
      keyword: bondSearchState.keyword,
      searchParams: { product_type: productType, ...defaultSearchParams, ...searchParams },
      queryOptions: { enabled: searchEnabled, notifyOnChangeProps: ['data'] },
      onQuery: () => onBeforeSearch?.(bondSearchState.keyword)
    });
    const searchData = query?.data;

    const {
      data: parsingData,
      refetch: refetchParsingData,
      isFetching: isParsingDataFetching
    } = useParsingQuoteQuery({
      productType,
      keyword: bondSearchState.keyword,
      autoStar,
      requestFn: fetchParsingQuoteInfo,
      queryOptions: {
        onSuccess: data => {
          onParsingSuccess?.(bondSearchState.keyword);
          // 识别成功时需要把 keyword 重置
          const {
            quote_list: [first]
          } = data;
          updateBondSearchState(draft => {
            draft.keyword = first.bond_basic_info.bond_code;
          });
        }
      },
      onQuery: () => onBeforeParsing?.(bondSearchState.keyword)
    });

    const options = useMemo(() => {
      let res: FiccBondBasic[] = [];

      // 如果有识别内容，不需要 options
      if (parsingData?.quote_list?.length) res = [];
      else if (bondSearchState.selected) res = [bondSearchState.selected.original];
      else res = searchData?.bond_basic_list ?? [];

      return res.map(transformOption).filter(Boolean);
    }, [parsingData?.quote_list?.length, bondSearchState.selected, searchData?.bond_basic_list, transformOption]);

    /** 是否展示 options */
    let mergedShowOptions = !bondSearchState.selected && !!options.length;
    if (showOptions !== undefined) {
      if (typeof showOptions === 'function') mergedShowOptions = showOptions(bondSearchState.selected, options);
      else mergedShowOptions = showOptions;
    }

    const handleInputChange = (val: string) => {
      updateBondSearchState(draft => {
        draft.keyword = val;
      });
      onInputChange?.(val);
    };

    const handleChange = (
      opt?: SearchOption<FiccBondBasic> | null,
      parsings?: QuoteParsing[],
      traderList?: Trader[]
    ) => {
      if (onChange) {
        onChange(opt, parsings, traderList);
      } else {
        updateBondSearchState(draft => {
          draft.selected = opt ?? null;
        });
      }
    };

    const handleKeydown = (evt: KeyboardEvent<HTMLInputElement>, composing: boolean) => {
      onKeyDown?.(evt, composing);

      if (evt.key === KeyboardKeys.Enter && parsing) {
        if (searchEnabled) return;
        if (isParsingDataFetching) return;
        refetchParsingData().then(({ data }) => {
          if (data?.quote_list.length) {
            const [first, second] = data.quote_list;

            // 如果连第一条都没有，不用走下面逻辑了
            if (!first) return;

            const parsings = [first];

            // 若前两条报价债券信息相同，但方向不同，需要两个方向的报价
            if (
              first?.bond_basic_info?.code_market === second?.bond_basic_info?.code_market &&
              first?.side !== second?.side
            ) {
              parsings.push(second);
            }

            handleChange(transformOption(first?.bond_basic_info), parsings, data.trader_list);
          }
        });
      }
    };

    const mergedClearByKeyboard = bondSearchState.keyword || bondSearchState.selected ? clearByKeyboard : null;

    return (
      <Search<FiccBondBasic>
        ref={searchRef}
        imperativeRef={bondSearchImpRef}
        label={label}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        dropdownCls={cx('!min-w-[456px]', dropdownCls)}
        focusAfterClearing
        autoClear={!parsing}
        disabled={disabled}
        options={options}
        optionRender={optionRender}
        showOptions={mergedShowOptions}
        clearByKeyboard={mergedClearByKeyboard}
        inputValue={bondSearchState.keyword}
        value={bondSearchState.selected}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        onOptionsVisibleChange={val => {
          bondOptionsOpen.current = !!val;
          onOptionsVisibleChange?.(val);
        }}
        {...restProps}
      />
    );
  }
);
