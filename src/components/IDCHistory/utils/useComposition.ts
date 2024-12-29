import { useRef } from 'react';

export const useComposition = () => {
  const hasCompostionRef = useRef(false);

  const onCompositionStart = () => {
    hasCompostionRef.current = true;
  };

  const onCompositionEnd = () => {
    hasCompostionRef.current = false;
  };

  return {
    hasCompostionRef,
    elementProps: {
      onCompositionStart,
      onCompositionEnd
    }
  };
};
