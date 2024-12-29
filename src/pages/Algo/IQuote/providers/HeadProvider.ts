import { useRef } from 'react';
import { createContainer } from 'unstated-next';

/** 估值偏离 */
const HeadContainer = createContainer(() => {
  const searchRef = useRef<HTMLInputElement>(null);

  return {
    /** 估值偏离 */
    searchRef
  };
});

export const HeadProvider = HeadContainer.Provider;
export const useHead = HeadContainer.useContainer;
