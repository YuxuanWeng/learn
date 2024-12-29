import { FiccBondBasic } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';

export type QuickSearchProps = {
  productType?: ProductType;
  /** 选项回调 */
  onSelect?: (val?: FiccBondBasic) => void;
};

const SearchPropsContainer = createContainer((initialState?: QuickSearchProps) => {
  return { ...initialState };
});

export const SearchPropsProvider = SearchPropsContainer.Provider;
export const useSearchProps = SearchPropsContainer.useContainer;
