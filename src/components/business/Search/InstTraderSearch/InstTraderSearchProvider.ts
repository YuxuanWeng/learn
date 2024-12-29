import { useRef } from 'react';
import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { transform2InstTraderOpt } from './utils';

type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 默认带入的机构交易员信息 */
  defaultValue?: TraderWithPref;
  /** 下拉选项转换函数 */
  transformOption?: typeof transform2InstTraderOpt;
};

type InstTraderSearchState = {
  /** 模糊搜索关键词 */
  keyword: string;
  /** 已选择的机构交易员信息 */
  selected: SearchOption<TraderWithPref> | null;
  /** 报价识别解析出来的交易员（带标签）列表 */
  parsingList: TraderWithPref[];
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const InstTraderSearchContainer = createContainer((initialState: InitialState) => {
  /** Search input ref */
  const instTraderSearchRef = useRef<HTMLInputElement>(null);
  /** Search imperative fef */
  const instTraderSearchImpRef = useRef<SearchImperativeRef>(null);
  /** Search options 是否打开 */
  const instTraderOptionsOpen = useRef(false);

  const transformOption = initialState?.transformOption ?? transform2InstTraderOpt;

  const [instTraderSearchState, updateInstTraderSearchState] = useImmer<InstTraderSearchState>(() => {
    return {
      keyword: '',
      selected: initialState?.defaultValue
        ? transformOption(initialState.defaultValue, initialState.productType)
        : null,
      parsingList: []
    };
  });

  return {
    productType: initialState.productType,
    transformOption,
    instTraderSearchRef,
    instTraderSearchImpRef,
    instTraderOptionsOpen,
    instTraderSearchState,
    updateInstTraderSearchState
  };
});

export const InstTraderSearchProvider = InstTraderSearchContainer.Provider;
export const useInstTraderSearch = InstTraderSearchContainer.useContainer;
