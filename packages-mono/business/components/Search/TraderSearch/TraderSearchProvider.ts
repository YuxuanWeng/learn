import { useRef } from 'react';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { TraderWithPref } from './types';
import { transform2TraderOpt } from './utils';

type InitialState = {
  /** 产品类型 */
  productType?: ProductType;
  /** 默认带入的机构信息 */
  defaultInst?: InstitutionTiny;
  /** 默认带入的交易员（带标签）信息 */
  defaultValue?: TraderWithPref;
  /** 下拉选项转换函数 */
  transformOption?: typeof transform2TraderOpt;
};

type InstSearchState = {
  /** 模糊搜索关键词 */
  keyword: string;
  /** 机构信息 */
  inst?: InstitutionTiny;
  /** 报价识别解析出来的交易员（带标签）列表 */
  parsingList: TraderWithPref[];
  /** 已选择的交易员（带标签）信息 */
  selected: SearchOption<TraderWithPref> | null;
};

const TraderSearchContainer = createContainer((initialState?: InitialState) => {
  /** Search input ref */
  const traderSearchRef = useRef<HTMLInputElement>(null);
  /** Search imperative fef */
  const traderSearchImpRef = useRef<SearchImperativeRef>(null);
  /** Search options 是否打开 */
  const traderOptionsOpen = useRef(false);

  const transformOption = initialState?.transformOption ?? transform2TraderOpt;

  const [traderSearchState, updateTraderSearchState] = useImmer<InstSearchState>(() => {
    return {
      keyword: '',
      inst: void 0,
      parsingList: [],
      selected: initialState?.defaultValue ? transformOption(initialState.defaultValue) : null
    };
  });

  return {
    productType: initialState?.productType,
    transformOption,
    traderSearchRef,
    traderSearchImpRef,
    traderOptionsOpen,
    traderSearchState,
    updateTraderSearchState
  };
});

export const TraderSearchProvider = TraderSearchContainer.Provider;
export const useTraderSearch = TraderSearchContainer.useContainer;
