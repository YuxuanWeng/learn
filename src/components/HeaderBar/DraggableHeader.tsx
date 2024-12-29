import { HTMLAttributes, PropsWithChildren, forwardRef, useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { useLongPress } from 'ahooks';
import { ForceOpenDevTools } from '../ForceOpenDevTools';
import { DRAGGABLE_DELAY, useDraggable } from './useDraggable';

export const HEADER_ID = 'home-app-bar';

export type DraggableHeaderProps = Omit<HTMLAttributes<HTMLHeadElement>, 'draggable' | 'onDragStart' | 'onDragEnd'> &
  PropsWithChildren<{
    /** 是否能够拖动 */
    draggable?: boolean;
    /** 拖动开始时的回调 */
    onDragStart?: VoidFunction;
    /** 拖动结束时的回调 */
    onDragEnd?: VoidFunction;
  }>;

export const DraggableHeader = forwardRef<HTMLHeadElement, DraggableHeaderProps>(
  ({ children, draggable = true, onDragStart, onDragEnd, ...rest }, ref) => {
    const { handleLongPress, handleMouseUp } = useDraggable(draggable, onDragStart, onDragEnd);

    const headerRef = useRef<HTMLDivElement>(null);
    const headerRefs = useMemo(() => mergeRefs([headerRef, ref]), [ref]);

    useLongPress(
      event => {
        handleLongPress(event);
      },
      headerRef,
      { delay: DRAGGABLE_DELAY, moveThreshold: { x: 5, y: 5 } }
    );

    return (
      <header
        id={HEADER_ID}
        ref={headerRefs}
        onMouseUp={handleMouseUp}
        {...rest}
        className={cx('select-none relative', rest?.className)}
      >
        <ForceOpenDevTools
          content={' '}
          className="absolute right-0 w-3 h-full -translate-y-1/2 top-1/2"
        />
        {children}
      </header>
    );
  }
);
