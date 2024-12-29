import { createContext, useContext, useMemo } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import {
  autoUpdate,
  flip,
  offset,
  safePolygon as safePolygonMiddleware,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole
} from '@floating-ui/react';
import { TooltipProps } from './types';

export const useTooltipFloat = ({
  trigger = 'hover',
  placement = 'top',
  delay = { open: 200 },
  destroyOnClose = true,
  floatingId,
  floatingRoot,
  safePolygon = false,
  defaultOpen = false,
  open,
  onOpenChange,
  truncate = false,
  strictTruncate = false,
  ...restProps
}: TooltipProps) => {
  const [innerOpen, setInnerOpen] = usePropsValue({ defaultValue: defaultOpen, value: open, onChange: onOpenChange });

  const floating = useFloating({
    placement,
    open: innerOpen,
    onOpenChange: setInnerOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(restProps?.offset ?? 6), shift(), flip()]
  });

  const { context } = floating;

  const role = useRole(context, { role: 'tooltip' });
  const dismiss = useDismiss(context, { ancestorScroll: true });
  const click = useClick(context, { enabled: trigger === 'click' });
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay,
    move: false,
    handleClose: safePolygon
      ? safePolygonMiddleware(typeof safePolygon === 'object' ? safePolygon : undefined)
      : undefined
  });

  const interactions = useInteractions([role, dismiss, hover, click]);

  const computedOpen = useMemo(() => {
    if (!truncate) return innerOpen;
    if (!innerOpen) return false;

    const clientWidth = floating.refs.domReference.current?.clientWidth ?? 0;
    const scrollWidth = floating.refs.domReference.current?.scrollWidth ?? 0;
    // clientWidth和scrollWidth似乎获得的是实际宽度四舍五入的结果，存在一些情况虽然有极小溢出但是clientWidth === scrollWidth
    // 此处考虑到有...的始终可hover看到内容更重要，故加上等号
    const overflow = strictTruncate ? clientWidth <= scrollWidth : clientWidth < scrollWidth;
    return innerOpen && overflow;
  }, [floating.refs.domReference, innerOpen, strictTruncate, truncate]);

  const shouldSafePolygon = !!safePolygon;

  return useMemo(
    () => ({
      innerOpen,
      computedOpen,
      setInnerOpen,
      destroyOnClose,
      shouldSafePolygon,
      floatingId,
      floatingRoot,
      ...floating,
      ...interactions
    }),
    [
      innerOpen,
      computedOpen,
      setInnerOpen,
      destroyOnClose,
      shouldSafePolygon,
      floatingId,
      floatingRoot,
      floating,
      interactions
    ]
  );
};

export type TooltipContextType = ReturnType<typeof useTooltipFloat> | null;

export const TooltipContext = createContext<TooltipContextType>(null);
export const useTooltip = () => useContext(TooltipContext);
