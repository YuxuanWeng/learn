import { useEffect, useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { ModalProps } from './types';

export const ModalRender = ({
  visible,
  disabled,

  children
}: ModalProps & { disabled?: boolean }) => {
  const draggleRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

  const handleDragStart = (e: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) return false;
    const pageY = (e as React.MouseEvent<HTMLElement>)?.pageY;
    /** 当前鼠标y轴是否在弹窗的header区域内 */
    if (pageY && !Number.isNaN(pageY) && (pageY - targetRect.y < 0 || pageY - targetRect.y > 48)) return false;
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
    return void 0;
  };

  useEffect(() => {
    if (!visible) return;
    setTimeout(() => {
      draggleRef.current?.focus();
    });
  }, [visible]);

  return (
    <Draggable
      disabled={disabled}
      bounds={bounds}
      onStart={handleDragStart}
    >
      <div
        ref={draggleRef}
        className="focus:outline-none"
      >
        {children}
      </div>
    </Draggable>
  );
};
