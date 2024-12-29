import { RefObject, UIEventHandler, WheelEventHandler, useMemo, useRef } from 'react';
import { ThumbPosition } from '@fepkg/components/Table/hooks/useTBodyScrollEvent';
import { useMemoizedFn } from 'ahooks';
import { getAutoPagerOverWheel } from '@/common/ab-rules';
import { useRemind } from '../../providers/RemindProvider';

/**
 * 滚动分页相关的逻辑
 */
type Props = {
  scrollContainerRef: RefObject<HTMLDivElement>;
};

export const useScrollPage = ({ scrollContainerRef }: Props) => {
  const { onPrevPagePrefetch, onNextPagePrefetch, page, setPage, maxPage } = useRemind();
  /** 当前的 scroll thumb 的位置 */
  const scrollThumbPosition = useRef<ThumbPosition>(ThumbPosition.Top);
  const prevScrollThumbPosition = useRef<ThumbPosition>(ThumbPosition.Top);
  /** 垂直方向的滚动量 */
  const deltaY = useRef(0);
  /**  自动翻页过度滚动距离触发值 */
  const OVER_WHEEL_Y = useMemo(() => getAutoPagerOverWheel(), []);

  /** 处理数据的预加载 */
  const handleDataPrefetch: UIEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    prevScrollThumbPosition.current = scrollThumbPosition.current;
    const { scrollHeight, scrollTop, clientHeight } = evt.currentTarget;

    /**
     * 1. 先计算展示区域的顶部和底部占可滚动区域的高度百分比
     *    - topRatio为滑块距离顶部的高度占滚动条高度比例
     *    - bottomRatio为滑块距离顶部的高度占滚动条高度比例
     * 2. (topRatio + bottomRatio) / 2 为滚动条的中点占滚动条高度比例，
     *    用其与0.5比较可以得到当前滚动条在上半区还是下半区
     * 3. 当从上向下滑过中点时，触发 onNextPagePrefetch
     * 4. 当从下向上滑过中点时，触发 onPrevPagePrefetch
     */
    const topRatio = scrollTop / scrollHeight;
    const bottomRatio = (scrollTop + clientHeight) / scrollHeight;

    if ((topRatio + bottomRatio) / 2 < 0.5) {
      scrollThumbPosition.current = ThumbPosition.Top;
    } else {
      scrollThumbPosition.current = ThumbPosition.Bottom;
    }

    if (prevScrollThumbPosition.current !== scrollThumbPosition.current) {
      if (scrollThumbPosition.current === ThumbPosition.Top) {
        onPrevPagePrefetch?.();
      } else if (scrollThumbPosition.current === ThumbPosition.Bottom) {
        onNextPagePrefetch?.();
      }
    }
  });
  const handleTBodyWrapperScroll: UIEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    evt.stopPropagation();
    handleDataPrefetch(evt);
  });
  const handleContainerWheel: WheelEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    evt.stopPropagation();

    if (
      (deltaY.current > 0 && evt.deltaY < 0) ||
      (deltaY.current < 0 && evt.deltaY > 0) ||
      deltaY.current > OVER_WHEEL_Y ||
      deltaY.current < -OVER_WHEEL_Y
    ) {
      deltaY.current = 0;
      return;
    }

    const { scrollHeight, scrollTop, clientHeight } = evt.currentTarget;

    const isTop = scrollTop === 0;
    const isBottom = scrollTop + clientHeight + 1 >= scrollHeight;

    if (isTop || isBottom) {
      if (deltaY.current < OVER_WHEEL_Y && deltaY.current + evt.deltaY >= OVER_WHEEL_Y) {
        if (isBottom) {
          if (page < maxPage) {
            setPage(page + 1);
            deltaY.current = 0;
            evt.currentTarget.scrollTo({ top: 0 });
          } else {
            deltaY.current = 0;
          }
        } else {
          deltaY.current = 0;
        }
      } else if (deltaY.current > -OVER_WHEEL_Y && deltaY.current + evt.deltaY <= -OVER_WHEEL_Y) {
        if (isTop) {
          if (page > 1) {
            setPage(page - 1);
            deltaY.current = 0;
            const top = scrollContainerRef.current?.scrollHeight ?? 0;
            evt.currentTarget.scrollTo({ top });
          } else {
            deltaY.current = 0;
          }
        } else {
          deltaY.current = 0;
        }
      }
      deltaY.current += evt.deltaY;
    }
  });
  return { handleTBodyWrapperScroll, handleContainerWheel };
};
