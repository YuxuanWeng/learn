import { useEffect, useRef, useState } from 'react';
import resizingApng from '@/assets/image/resizing.apng';
import { useMemoizedFn } from 'ahooks';
import IPCEventEnum from 'app/types/IPCEvents';
import { useSetAtom } from 'jotai';
import { draggableAtom } from '../HeaderBar/atoms';

type WindowResizeMaskProps = {
  children: JSX.Element;
  /** 是否支持拖拽时的mask，默认false */
  managedDrag?: boolean;
};

const removeIPCEvent = () => {
  const { remove } = window.Main;
  remove(IPCEventEnum.WindowWillResize);
  remove(IPCEventEnum.WindowResized);
};

export const WindowResizeMask = ({ children, managedDrag = false }: WindowResizeMaskProps) => {
  const [showMask, setShowMask] = useState(false);
  /** 限制每次resize动作只触发一次 willResize */
  const isResizeStart = useRef(false);
  const dragStartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef(100);
  const setDraggableModal = useSetAtom(draggableAtom);

  /** 开始拖拽，但实际测试中，与 resize 事件相同，会触发多次，需要特殊处理 */
  const handleWindowWillResize = useMemoizedFn(() => {
    if (isResizeStart.current) return;
    isResizeStart.current = true;
    setShowMask(true);
  });

  useEffect(() => {
    if (managedDrag === true) {
      setDraggableModal({
        dragStart: () => {
          if (dragStartTimerRef.current != null) clearTimeout(dragStartTimerRef.current);
          dragStartTimerRef.current = setTimeout(() => setShowMask(true), dragStartRef.current);
        },
        dragEnd: () => {
          if (dragStartTimerRef.current != null) {
            clearTimeout(dragStartTimerRef.current);
            dragStartTimerRef.current = null;
          }
          setShowMask(false);
        }
      });
    }
  }, [managedDrag, setDraggableModal]);

  useEffect(() => {
    removeIPCEvent();
    const { on } = window.Main;
    on(IPCEventEnum.WindowWillResize, handleWindowWillResize);
    on(IPCEventEnum.WindowResized, () => {
      isResizeStart.current = false;
      setShowMask(false);
    });
    return () => removeIPCEvent();
  }, [handleWindowWillResize]);

  return (
    <>
      <div
        className="bg-gray-700 fixed top-0 bottom-0 left-0 right-0 z-mask"
        style={{ visibility: showMask ? 'visible' : 'hidden' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px]">
          <img
            className="w-[240px] h-[240px]"
            src={resizingApng}
            alt="resizing.."
          />
        </div>
      </div>
      <div
        className="relative flex flex-col h-full overflow-hidden"
        style={{ visibility: showMask ? 'hidden' : 'visible' }}
      >
        {children}
      </div>
    </>
  );
};
