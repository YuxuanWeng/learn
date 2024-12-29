import { MouseEvent, useRef } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { useEventListener } from 'ahooks';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';

const DEFAULT_HEIGHT = 200;
const MAX_HEIGHT = 268;
const MIN_HEIGHT = 40;

export const useSumMove = () => {
  /** 汇总高度 */
  const key = getLSKeyWithoutProductType(LSKeys.BridgeSumHeight);
  const [sumHeight, setSumHeight] = useLocalStorage<number>(key, DEFAULT_HEIGHT);

  /** 拖动状态 */
  const movingRef = useRef(false);
  const heightStart = useRef<number>();
  const offsetStart = useRef<number>();

  const startBoundMove = (evt: MouseEvent) => {
    window.document.body.style.cursor = 'move';
    if (heightStart.current == null) {
      heightStart.current = sumHeight;
    }
    if (offsetStart.current == null) {
      offsetStart.current = evt.pageY;
    }
    movingRef.current = true;
  };

  /** 监听鼠标拖动 */
  useEventListener('mousemove', evt => {
    if (!movingRef.current || heightStart.current == null || offsetStart.current == null) return;

    let height = heightStart.current - evt.pageY + offsetStart.current;
    height = Math.max(height, MIN_HEIGHT);
    height = Math.min(height, MAX_HEIGHT);

    setSumHeight(height);
  });

  useEventListener('mouseup', () => {
    window.document.body.style.cursor = '';
    movingRef.current = false;
    heightStart.current = undefined;
    offsetStart.current = undefined;
  });

  return {
    sumHeight,
    startBoundMove
  };
};
