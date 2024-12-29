import { MouseEventHandler, useRef } from 'react';

type Props = {
  /** 多少ms内的两次click算双击双击操作，默认250 --这个值会影响单击时间的执行速度，即延长多久执行单击事件 */
  delay?: number;
  /** 触发单击 */
  onClick: MouseEventHandler<HTMLElement>;
  /** 触发双击 */
  onDoubleClick: MouseEventHandler<HTMLElement>;
};

/**
 * 用于需要同时绑定单击和双击事件，但又互不影响的情况 --双击时不触发单击
 */
export function useDoubleClick(props: Props) {
  const { delay = 250, onClick, onDoubleClick } = props;
  const clickTimer = useRef<NodeJS.Timeout>();
  const firstTimestamp = useRef<number>(0);

  const handleClick: MouseEventHandler<HTMLElement> = evt => {
    const curT = Date.now();
    const lastT = firstTimestamp.current;
    firstTimestamp.current = curT;
    const isDouble = curT - lastT < delay;
    if (isDouble) {
      onDoubleClick(evt);
      // 清除单击的定时器
      clearTimeout(clickTimer.current);
    } else {
      clickTimer.current = setTimeout(() => {
        onClick(evt);
      }, delay);
    }
  };
  return { handleClick };
}
