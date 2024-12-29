import { createContainer } from 'unstated-next';
import { GlobalSearchProps } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const SearchPropsContainer = createContainer((initialState: GlobalSearchProps) => {
  return initialState;
});

export const SearchPropsProvider = SearchPropsContainer.Provider;
export const useSearchProps = SearchPropsContainer.useContainer;
