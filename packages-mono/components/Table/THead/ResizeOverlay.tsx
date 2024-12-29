import { useTHeadResize } from '../providers/THeadResizeProvider';
import { useTableState } from '../providers/TableStateProvider';

export const THeaderResizeOverlay = () => {
  const { tHeadRef } = useTableState();
  const { resizingTHeadRef } = useTHeadResize();

  const resizingEl = resizingTHeadRef.current;

  if (!resizingEl) return null;

  const { width: resizingElWidth, left: resizingElLeft } = resizingEl.getBoundingClientRect();

  const tHeadLeft = tHeadRef.current?.getBoundingClientRect().left ?? 0;

  return (
    <div
      className="z-[100] absolute top-0 left-0 w-0.5 h-full bg-primary-100 will-change-transform"
      style={{ transform: `translateX(${resizingElLeft - tHeadLeft + resizingElWidth - 2}px)` }}
    />
  );
};
