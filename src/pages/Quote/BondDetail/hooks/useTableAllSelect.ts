import { RefObject, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const useTableAllSelect = () => {
  const [active, setActive] = useState(false);
  const ref = useRef(null) as RefObject<HTMLDivElement>;
  const el = ref.current;
  useEventListener('mouseover', (e: Event) => {
    if (active && !el?.contains(e.target as Node)) {
      // 鼠标在组件外，表格处于激活状态
      setActive(preState => {
        if (preState) {
          return false;
        }
        return preState;
      });
    } else if (!active && el?.contains(e.target as Node)) {
      // 鼠标在组件内， 表格没有处于激活状态
      setActive(preState => {
        if (!preState) {
          return true;
        }
        return preState;
      });
    }
  });
  return [ref, active] as const;
};
