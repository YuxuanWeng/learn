import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { QuoteComponentRef } from '@/components/business/Quote';
import { useMarketDealFormParams } from '../hooks/useParams';

export const FocusContainer = createContainer(() => {
  const { defaultFocused } = useMarketDealFormParams();

  /** 是否首次聚焦已完成 */
  const isFirstFocusingFinished = useRef(false);

  const bondSearchCbRef = useMemoizedFn((node: HTMLInputElement | null) => {
    if (node && defaultFocused === 'bond' && !isFirstFocusingFinished.current) {
      node.focus();
      isFirstFocusingFinished.current = true;
    }
  });

  const priceCbRef = useMemoizedFn((node: QuoteComponentRef | null) => {
    if (node && defaultFocused === 'price' && !isFirstFocusingFinished.current) {
      node.select?.();
      isFirstFocusingFinished.current = true;
    }
  });

  return { bondSearchCbRef, priceCbRef };
});

export const FocusProvider = FocusContainer.Provider;
export const useFocus = FocusContainer.useContainer;
