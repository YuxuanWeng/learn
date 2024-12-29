import { PropsWithChildren, createContext, useContext, useMemo, useRef } from 'react';
import { SearchImperativeRef, SearchOption } from '@fepkg/components/Search';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useImmer } from 'use-immer';
import { transform2InstOpt } from './utils';

type InitialState<T extends InstitutionTiny = InstitutionTiny> = {
  /** 产品类型 */
  productType?: ProductType;
  /** 默认带入的机构信息 */
  defaultValue?: T;
  /** 下拉选项转换函数 */
  transformOption?: typeof transform2InstOpt;
};

type InstSearchState<T extends InstitutionTiny = InstitutionTiny> = {
  /** 模糊搜索关键词 */
  keyword: string;
  /** 已选择的机构信息 */
  selected: SearchOption<T> | null;
};

const useInstSearchValue = <T extends InstitutionTiny = InstitutionTiny>(initialState?: InitialState<T>) => {
  /** Search input ref */
  const instSearchRef = useRef<HTMLInputElement>(null);
  /** Search imperative fef */
  const instSearchImpRef = useRef<SearchImperativeRef>(null);
  /** Search options 是否打开 */
  const instOptionsOpen = useRef(false);

  const transformOption = initialState?.transformOption ?? transform2InstOpt;

  const [instSearchState, updateInstSearchState] = useImmer<InstSearchState<T>>(() => {
    return {
      keyword: '',
      selected: initialState?.defaultValue ? transformOption<T>(initialState.defaultValue) : null
    };
  });

  return useMemo(
    () => ({
      productType: initialState?.productType,
      transformOption,
      instSearchRef,
      instSearchImpRef,
      instOptionsOpen,
      instSearchState,
      updateInstSearchState
    }),
    [initialState?.productType, instSearchState, transformOption, updateInstSearchState]
  );
};

const InstSearchContext = createContext<ReturnType<typeof useInstSearchValue> | null>(null);

export const InstSearchProvider = <T extends InstitutionTiny = InstitutionTiny>({
  initialState,
  children
}: PropsWithChildren<{
  initialState?: InitialState<T>;
}>) => {
  const value = useInstSearchValue(initialState) as unknown as ReturnType<typeof useInstSearchValue>;
  return <InstSearchContext.Provider value={value}>{children}</InstSearchContext.Provider>;
};
export const useInstSearch = <T extends InstitutionTiny = InstitutionTiny>() =>
  useContext(InstSearchContext) as unknown as ReturnType<typeof useInstSearchValue<T>>;
