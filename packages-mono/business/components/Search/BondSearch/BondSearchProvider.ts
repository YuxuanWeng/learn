import { useRef } from 'react';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { transform2BondOpt } from './utils';

type InitialState = {
  /** 产品类型 */
  productType?: ProductType;
  /** 产品类型, 支持多台子查询 */
  productTypeList?: ProductType[];
  /** 默认带入的债券信息 */
  defaultValue?: FiccBondBasic;
  /** 下拉选项转换函数 */
  transformOption?: typeof transform2BondOpt;
};

export type BondSearchState = {
  /** 模糊搜索关键词 */
  keyword: string;
  /** 已选择的债券信息 */
  selected: SearchOption<FiccBondBasic> | null;
};

const BondSearchContainer = createContainer((initialState?: InitialState) => {
  /** Search input ref */
  const bondSearchRef = useRef<HTMLInputElement>(null);
  /** Search imperative fef */
  const bondSearchImpRef = useRef<SearchImperativeRef>(null);
  /** Search options 是否打开 */
  const bondOptionsOpen = useRef(false);

  const transformOption = initialState?.transformOption ?? transform2BondOpt;

  const [bondSearchState, updateBondSearchState] = useImmer<BondSearchState>(() => {
    return {
      keyword: '',
      selected: initialState?.defaultValue ? transformOption(initialState.defaultValue) : null
    };
  });

  return {
    productType: initialState?.productType,
    productTypeList: initialState?.productTypeList,
    transformOption,
    bondSearchRef,
    bondSearchImpRef,
    bondOptionsOpen,
    bondSearchState,
    updateBondSearchState
  };
});

export const BondSearchProvider = BondSearchContainer.Provider;
export const useBondSearch = BondSearchContainer.useContainer;
