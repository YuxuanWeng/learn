import { ReactNode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import cx from 'classnames';
import { isEqual } from 'lodash';
import { divArr } from './algorithm';

interface IProps {
  maxColsCount?: number;
  colWidth?: number;
  fixedStyles?: string;
  items: ReactNode[];
}

type ITmp = Pick<IProps, 'items'> & { callback: (eles: HTMLElement[]) => void };
const Tmp = ({ items, callback }: ITmp) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const eles = Array.from(ref.current?.children || []) as HTMLElement[];
    callback?.(eles);
  }, [callback]);
  return <div ref={ref}>{items}</div>;
};

export default function Layout({
  maxColsCount = 2,
  colWidth = 450,
  fixedStyles = 'right-0 bottom-0',
  items = []
}: IProps) {
  const [cols, setCols] = useState<ReactNode[][]>([]);
  const [itemHeights, setItemHeights] = useState<number[] | null>(null);

  useEffect(() => {
    let tmp: HTMLDivElement | null = document.createElement('div');
    tmp.style.width = '1px';
    tmp.style.height = '1px';
    tmp.style.overflow = 'hidden';
    document.body.appendChild(tmp);
    createRoot(tmp).render(
      <Tmp
        items={items}
        callback={(v: HTMLElement[]) => {
          const heights = v.map(ele => ele.getBoundingClientRect().height);
          setItemHeights(heights);
          tmp?.parentNode?.removeChild(tmp);
          tmp = null;
        }}
      />
    );
    return () => {
      tmp?.parentNode?.removeChild(tmp);
      tmp = null;
    };
  }, [items]);

  const prevHeights = useRef<number[] | null>(null);
  useEffect(() => {
    if (isEqual(itemHeights, prevHeights.current)) return;
    prevHeights.current = itemHeights;

    if (itemHeights === null) return;
    const height2DimArr = divArr({
      items: itemHeights,
      maxColsCount,
      colCapacity: window.innerHeight,
      offset: 50
    });
    let cursor = 0;
    const arr: ReactNode[][] = [];
    for (const item of height2DimArr) {
      const len = item.length;
      arr.push(items.slice(cursor, cursor + len));
      cursor += len;
    }
    setCols(arr);
  }, [items, itemHeights, maxColsCount]);

  return (
    <div className={cx('fixed', fixedStyles, 'h-full', 'flex', 'flex-row-reverse', 'items-end', 'z-50')}>
      {cols.map((col, cidx) => (
        <ul
          key={String(cidx)}
          className={cx('ml-[1px]', 'last:ml-0', 'overflow-y-overlay', 'h-full', 'flex', 'flex-col-reverse')}
          style={{ width: colWidth }}
        >
          {col.map((ele, eidx) => (
            <li key={String(eidx)}>{ele}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
