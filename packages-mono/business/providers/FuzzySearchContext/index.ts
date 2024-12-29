import { createContext, useContext } from 'react';
import { FuzzySearchOptions } from './types';

export const FuzzySearchContext = createContext<FuzzySearchOptions | null>(null);
export const FuzzySearchProvider = FuzzySearchContext.Provider;

export const useFuzzySearchContext = () => {
  const fuzzySearchContext = useContext(FuzzySearchContext);
  if (!fuzzySearchContext) {
    throw new Error('请使用 FuzzySearchProvider！');
  }
  return {
    useFuzzySearchQuery: fuzzySearchContext.fuzzySearchHook
  };
};
