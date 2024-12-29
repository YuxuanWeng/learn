import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { FiccBondBasic } from '@fepkg/services/types/common';

const NAMESPACE = 'global-search-searching-bond';

type GlobalSearchingBondCache = { [key in string]?: FiccBondBasic };

/** 正在搜索中的债券 */
export const useGlobalSearchingBond = () => {
  const [cache, setCache] = useLocalStorage<GlobalSearchingBondCache>(NAMESPACE, {});

  const getSearchingBond = (key?: string) => {
    if (key) return cache[key];
    return void 0;
  };

  const updateSearchingBond = (key: string, bond?: FiccBondBasic) => {
    setCache(prev => ({ ...prev, [key]: bond }));
  };

  const clearSearchingBond = (key: string) => {
    setCache(prev => {
      delete prev[key];
      return { ...prev };
    });
  };

  return { getSearchingBond, updateSearchingBond, clearSearchingBond };
};
