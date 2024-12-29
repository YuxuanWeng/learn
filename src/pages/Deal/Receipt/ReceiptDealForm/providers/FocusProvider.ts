import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';

export const FocusContainer = createContainer(() => {
  /** 是否首次聚焦已完成 */
  const isFirstFocusingFinished = useRef(false);

  const bondSearchCbRef = useMemoizedFn((node: HTMLInputElement | null) => {
    if (node && !isFirstFocusingFinished.current) {
      node.focus();
      isFirstFocusingFinished.current = true;
    }
  });

  const priceRef = useRef<HTMLInputElement>(null);

  return { bondSearchCbRef, priceRef };
});

export const FocusProvider = FocusContainer.Provider;
export const useFocus = FocusContainer.useContainer;
