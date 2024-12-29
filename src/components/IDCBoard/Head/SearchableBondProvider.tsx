import { useRef, useState } from 'react';
import { createContainer } from 'unstated-next';

const SearchableBondContainer = createContainer(() => {
  const [kwd, setKwd] = useState('');
  const searchIptRef = useRef<HTMLInputElement>(null);

  return {
    kwd,
    setKwd,
    searchIptRef
  };
});

export const SearchableBondProvider = SearchableBondContainer.Provider;
export const useSearchableBond = SearchableBondContainer.useContainer;
