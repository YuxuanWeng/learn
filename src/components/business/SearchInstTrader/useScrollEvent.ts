import { UIEventHandler, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

type Props = {
  /** 最大页码 */
  maxPage: number;
  /** 当前请求到第几页数据 */
  page: number;
  /** 更新页码 */
  setPage: React.Dispatch<React.SetStateAction<number>>;
  /** 请求下一页数据 */
  onNextPagePrefetch?: (page: number) => Promise<void>;
};

/** 懒加载 */
export const useScrollPage = (props: Props) => {
  const { page, maxPage, setPage, onNextPagePrefetch } = props;

  const fetchingRef = useRef(false);

  /** 处理数据的预加载 */
  const handleDataPrefetch: UIEventHandler<HTMLDivElement> = useMemoizedFn(async evt => {
    const { scrollHeight, scrollTop, clientHeight } = evt.currentTarget;

    if (scrollTop + clientHeight + 20 >= scrollHeight) {
      if (!fetchingRef.current) {
        if (page + 1 > maxPage) return;
        fetchingRef.current = true;
        setPage(page + 1);
        await onNextPagePrefetch?.(page + 1);
        fetchingRef.current = false;
      }
    }
  });

  const handleWrapperScroll: UIEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    evt.stopPropagation();
    handleDataPrefetch(evt);
  });

  return { page, handleWrapperScroll };
};
