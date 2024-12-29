import { useRef } from 'react';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { User } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { miscStorage } from '@/localdb/miscStorage';
import { transform2BrokerOpt } from './utils';

type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 默认带入的经纪人信息 */
  defaultValue?: User;
};

type BrokerSearchState = {
  /** 模糊搜索关键词 */
  keyword: string;
  /** 已选择的经纪人信息 */
  selected: SearchOption<User> | null;
};

export const DEFAULT_HANDLER = { broker: miscStorage.userInfo };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const BrokerSearchContainer = createContainer((initialState: InitialState) => {
  /** Search input ref */
  const brokerSearchRef = useRef<HTMLInputElement>(null);
  /** Search imperative fef */
  const brokerSearchImpRef = useRef<SearchImperativeRef>(null);
  /** Search options 是否打开 */
  const brokerOptionsOpen = useRef(false);

  const [brokerSearchState, updateBrokerSearchState] = useImmer<BrokerSearchState>(() => {
    return {
      keyword: '',
      selected: initialState?.defaultValue ? transform2BrokerOpt(initialState.defaultValue) : null
    };
  });

  return {
    productType: initialState.productType,
    brokerSearchRef,
    brokerSearchImpRef,
    brokerOptionsOpen,
    brokerSearchState,
    updateBrokerSearchState,
    transformOption: transform2BrokerOpt
  };
});

export const BrokerSearchProvider = BrokerSearchContainer.Provider;
export const useBrokerSearch = BrokerSearchContainer.useContainer;
