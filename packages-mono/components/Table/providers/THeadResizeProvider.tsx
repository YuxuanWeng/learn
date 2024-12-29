import { useRef } from 'react';
import { createContainer } from 'unstated-next';

export const THeadResizeContainer = createContainer(() => {
  const resizingTHeadRef = useRef<HTMLDivElement | null>(null);
  return { resizingTHeadRef };
});

export const THeadResizeProvider = THeadResizeContainer.Provider;
export const useTHeadResize = THeadResizeContainer.useContainer;
