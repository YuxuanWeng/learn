import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import IPCEventEnum from 'app/types/IPCEvents';
import { useAtomValue } from 'jotai';
import { useEventListener } from 'usehooks-ts';
import { draggableAtom } from './atoms';

// 识别拖拽的间隔
export const DRAGGABLE_DELAY = 36;

export const useDraggable = (isDraggable: boolean, onDragStart?: VoidFunction, onDragEnd?: VoidFunction) => {
  const canMoving = useRef(false);
  const draggableCallback = useAtomValue(draggableAtom);

  const { sendMessage, invoke } = window.Main;

  const handleMouseMove = useMemoizedFn(async () => {
    if (canMoving.current && isDraggable) {
      const isInvalid = await invoke(IPCEventEnum.WindowMoving);
      if (isInvalid) return;
      window.requestAnimationFrame(handleMouseMove);
    }
  });

  const dragDocumentMousemove = (event: MouseEvent) => {
    /** 如果是在窗口拖动中 且 鼠标的左键、右键都没有处于按下状态，则认为拖拽无效 */
    if (canMoving.current && event.buttons !== 1 && event.buttons !== 2) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleMouseUp();
    }
  };

  const handleLongPress = async (e: MouseEvent | TouchEvent) => {
    if (isDraggable) {
      const target = e.target as HTMLElement;
      if (target == null || target.closest('.undraggable') != null) canMoving.current = false;
      else {
        canMoving.current = true;
        draggableCallback?.dragStart?.();
        onDragStart?.();
        window.addEventListener('mousemove', dragDocumentMousemove);
        await invoke(IPCEventEnum.WindowWillMove);
        handleMouseMove();
      }
    }
  };

  const handleMouseUp = () => {
    if (canMoving.current && isDraggable) {
      canMoving.current = false;
      onDragEnd?.();
      draggableCallback?.dragEnd?.();
      sendMessage(IPCEventEnum.WindowMoveEnd);
    }
    window.removeEventListener('mousemove', dragDocumentMousemove);
  };

  useEventListener('mouseup', handleMouseUp);
  useEventListener('contextmenu', handleMouseUp);

  return {
    handleLongPress,
    handleMouseUp
  };
};
