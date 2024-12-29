import { UIEventHandler, WheelEventHandler, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';

export enum ThumbPosition {
  Top = 'top',
  Bottom = 'bottom'
}

export const useTBodyScrollEvent = () => {
  const {
    active,
    lineHeight,
    loading,
    pageSize = 60,
    onPrevPage,
    onNextPage,
    onPrevPagePrefetch,
    onNextPagePrefetch
  } = useTableProps();
  const { tHeadRef, tBodyRef } = useTableState();

  const deltaY = useRef(0);
  // const OVER_WHEEL_Y = useMemo(() => getAutoPagerOverWheel(), []);
  // 先移除 A/B 逻辑，后续有需要加上
  const OVER_WHEEL_Y = 2000;

  /** 当前的 scroll thumb 的位置 */
  const scrollThumbPosition = useRef<ThumbPosition>(ThumbPosition.Top);
  const prevScrollThumbPosition = useRef<ThumbPosition>(ThumbPosition.Top);

  /** 处理 Thead 的 Translate 改变事件 */
  const handleTheadTranslateChange: UIEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    if (!active) return;

    const { scrollLeft } = evt.currentTarget;
    tHeadRef.current?.scrollTo({ left: scrollLeft, top: 0 });
  });

  /** 处理数据的预加载 */
  const handleDataPrefetch: UIEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    if (!active) return;
    if (loading) return;

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
    handleTheadTranslateChange(evt);
    handleDataPrefetch(evt);
  });

  const handleContainerWheel: WheelEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    evt.stopPropagation();
    if (!active || loading || !onPrevPage || !onNextPage) return;

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
          onNextPage(isPageChange => {
            deltaY.current = 0;
            if (isPageChange) {
              evt.currentTarget.scrollTo({ top: 0 });
            }
          });
        } else {
          deltaY.current = 0;
        }
      } else if (deltaY.current > -OVER_WHEEL_Y && deltaY.current + evt.deltaY <= -OVER_WHEEL_Y) {
        if (isTop) {
          onPrevPage(isPageChange => {
            deltaY.current = 0;
            if (isPageChange) {
              evt.currentTarget.scrollTo({ top: lineHeight * pageSize });
              /**
               * 当从最后一页翻至前一页时，上方的代码并不能将滚动条置底，
               * 因为此时的滚动区域的高度小于LINE_HEIGHT * MAX_ROW_LENGTH，
               * 并且这个回调函数执行完毕之后，表格的DOM会刷新，设置的top会失效，
               * 因此应采取下方的延迟执行的方法才能真正置底（可能会有抖动，暂无解决方法）
               */
              if (evt.currentTarget.scrollHeight < lineHeight * pageSize) {
                setTimeout(() => tBodyRef.current?.scrollTo({ top: lineHeight * pageSize }));
              }
            }
          });
        } else {
          deltaY.current = 0;
        }
      }
      deltaY.current += evt.deltaY;
    }
  });

  return { handleTBodyWrapperScroll, handleContainerWheel };
};
