import { MouseEventHandler, useRef } from 'react';
import cx from 'classnames';
import { SystemEventEnum } from 'app/types/IPCEvents';

type ForceOpenDevToolsProps = {
  content?: string;
  className?: string;
};

/** 开发者调试面版-后门入口 */
export const ForceOpenDevTools = (props: ForceOpenDevToolsProps) => {
  const clickTime = useRef(0);
  const clickTimes = useRef(0);

  const handleOpenDevTools: MouseEventHandler<HTMLSpanElement> = evt => {
    evt.stopPropagation();
    const now = performance.now();
    const diff = now - clickTime.current;
    clickTime.current = now;
    if (diff > 1000) {
      clickTimes.current = 1;
      return;
    }
    if (clickTimes.current < 4) {
      clickTimes.current += 1;
    } else {
      clickTimes.current = 0;
      window.Main?.sendMessage(SystemEventEnum.ForceOpenDevTools);
    }
  };

  return (
    <span
      className={cx('undraggable', props.className)}
      onClick={handleOpenDevTools}
      onDoubleClick={evt => {
        evt.stopPropagation();
      }}
    >
      {props?.content}
    </span>
  );
};
