import { useEffect, useRef, useState } from 'react';
import { createContainer } from 'unstated-next';

// 本地计时器，用于随时间更新渲染
const LocalTimerContainer = createContainer(() => {
  const [timeNow, setTimeNow] = useState(() => Date.now());

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timerRef != null) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeNow(Date.now());
    }, 30 * 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return {
    timeNow
  };
});

export const LocalTimerProvider = LocalTimerContainer.Provider;
export const useLocalTimer = LocalTimerContainer.useContainer;
