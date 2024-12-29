import { useMemoizedFn } from 'ahooks';
import { useEventListener } from 'usehooks-ts';

export const useClose = (ref: React.RefObject<HTMLElement>, open?: boolean, onOpenChange?: (val: boolean) => void) => {
  const handleClose = useMemoizedFn(() => {
    if (open) onOpenChange?.(false);
  });

  useEventListener('resize', handleClose);
  useEventListener('wheel', evt => {
    if (!ref.current?.contains(evt.target as any)) {
      handleClose();
    }
  });
  useEventListener('scroll', evt => {
    if (!ref.current?.contains(evt.target as any)) {
      handleClose();
    }
  });

  return { handleClose };
};
