import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { isTextInputElement } from '@fepkg/common/utils/element';
import {
  arrow as arrowMiddleware,
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
import { useEventListener } from 'usehooks-ts';
import { PopoverProps } from './types';

export const usePopoverFloat = ({
  floatingId,
  floatingRoot,
  trigger = 'click',
  placement = 'top-end',
  destroyOnClose = true,
  closeOnInput = true,
  arrow = true,
  safePolygon = true,
  defaultOpen = false,
  updateByOpen,
  open,
  onOpenChange,
  ...restProps
}: PopoverProps) => {
  const arrowRef = useRef<SVGSVGElement>(null);

  const [innerOpen, setInnerOpen] = usePropsValue({ defaultValue: defaultOpen, value: open, onChange: onOpenChange });

  const floating = useFloating({
    placement,
    open: innerOpen,
    onOpenChange: setInnerOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(restProps?.offset ?? 14), shift(), flip(), arrow && arrowMiddleware({ element: arrowRef })]
  });

  const { context, update } = floating;

  const role = useRole(context);
  const dismiss = useDismiss(context, { ancestorScroll: true, bubbles: { escapeKey: true } });
  const click = useClick(context, { enabled: trigger === 'click' });
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay: { open: 200 },
    mouseOnly: true,
    handleClose: safePolygon
      ? safePolygonMiddleware(typeof safePolygon === 'object' ? safePolygon : undefined)
      : undefined
  });

  const interactions = useInteractions([role, dismiss, click, hover]);

  // 监听按键，如果焦点在input中就关闭popconfirm
  useEventListener('keydown', () => {
    if (isTextInputElement(document.activeElement) && closeOnInput) setInnerOpen(false);
  });

  useEffect(() => {
    if (updateByOpen && innerOpen) update();
  }, [innerOpen, update, updateByOpen]);

  return useMemo(
    () => ({
      arrowRef,
      innerOpen,
      setInnerOpen,
      destroyOnClose,
      floatingId,
      floatingRoot,
      arrow,
      ...floating,
      ...interactions
    }),
    [innerOpen, setInnerOpen, destroyOnClose, floatingId, floatingRoot, arrow, floating, interactions]
  );
};

export type PopoverContextType = ReturnType<typeof usePopoverFloat> | null;

export const PopoverContext = createContext<PopoverContextType>(null);
export const usePopover = () => useContext(PopoverContext);
