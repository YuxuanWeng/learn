import { useLayoutEffect, useRef } from 'react';

export const useWindowBeActive = () => {
  const timerRef = useRef<NodeJS.Timeout>();
  const sumRef = useRef<number>(0);

  useLayoutEffect(() => {
    /**
     * 这点“没什么用”的逻辑是为了窗口在内存中时是“活跃的”
     * 降低被操作系统认为是空闲进程导致被杀进程的风险；
     * TODO：比较好的，是在窗口不可见的时候再启用定时器，focus时再销毁；
     * 但是目前Electron和前端没有很好的api支持，实现的复杂度太高；
     */
    timerRef.current = setInterval(() => {
      if (sumRef.current >= 1000) sumRef.current = 0;
      sumRef.current += 1;
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = undefined;
    };
  }, []);
};
