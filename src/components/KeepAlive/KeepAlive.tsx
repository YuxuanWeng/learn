import type { Key, MutableRefObject, ReactElement, ReactNode } from 'react';
import { isValidElement, memo, useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useRerender } from '@fepkg/common/hooks';
import type { FCWithChildren } from '@fepkg/common/types';
import { InnerComponent } from './InnerComponent';

export type KeepAliveProps = {
  activeKey: Key;
  excludes?: Key[];
  max?: number;
  classnames?: {
    container?: string;
    inner?: string;
  };
};

type KeepAliveCache = { key: Key; el: ReactNode }[];

function updateCache(key: Key, cache: MutableRefObject<KeepAliveCache>, el: ReactElement, max: number) {
  // 如果超过了缓存上限
  if (cache.current.length > max) {
    cache.current = cache.current.slice(1);
  }

  const isIncluded = cache.current.some(item => item.key === key);
  if (!isIncluded) {
    cache.current = [...cache.current, { key, el }];
  }
}

export const KeepAlive: FCWithChildren<KeepAliveProps> = memo(
  ({ max = 10, activeKey, excludes, classnames, children }) => {
    const rerender = useRerender();
    const containerRef = useRef<HTMLDivElement>(null);
    // 使用一个数组作为缓存，缓存组件
    const cache = useRef<KeepAliveCache>([]);

    const handleChildrenChange = useCallback(
      (node: ReactNode) => {
        if (isValidElement(node)) {
          updateCache(activeKey, cache, node, max);
        }
      },
      [activeKey, max]
    );

    const handleOnInActive = useCallback(
      (name: string) => {
        if (!excludes) return;

        if (excludes?.includes(name)) {
          cache.current = cache.current.filter(item => item.key !== name);
        }
      },
      [excludes]
    );

    useEffect(() => {
      if (!activeKey) return;

      // 如果 children 不是一个数组，则说明 keep alive 组件只包裹了一个组件
      if (!Array.isArray(children)) {
        handleChildrenChange(children);
        rerender();
        return;
      }

      children.forEach(handleChildrenChange);
      rerender();
    }, [activeKey, excludes, children, handleChildrenChange, max, rerender]);

    return (
      <>
        <div
          ref={containerRef}
          className={cx('keep-alive', classnames?.container)}
        />

        {cache.current.map(({ key, el }) => (
          <InnerComponent
            key={key}
            name={key as string}
            className={classnames?.inner}
            isActive={key === activeKey}
            onInActive={handleOnInActive}
            renderContainer={containerRef}
          >
            {el}
          </InnerComponent>
        ))}
      </>
    );
  }
);
