import { useLayoutEffect, useState } from 'react';

export const useDelayOpen = (open: boolean, delay = 300) => {
  const [innerOpen, setInnerOpen] = useState(open);

  // 延迟关闭，使关闭的高度动画可见
  useLayoutEffect(() => {
    if (open) {
      setInnerOpen(true);
    } else {
      setTimeout(() => setInnerOpen(false), delay);
    }
  }, [open, delay]);

  return innerOpen;
};
