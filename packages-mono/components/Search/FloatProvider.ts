import { useEffect, useRef, useState } from 'react';
import {
  Placement,
  Strategy,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole
} from '@floating-ui/react';
import { createContainer } from 'unstated-next';

type InitialState = {
  offset?: number;
  placement?: Placement;
  strategy?: Strategy;
  updateByOpen?: boolean;
  /** 是否滚动后立即关闭浮动层 */
  ancestorScroll?: boolean;
  /** 是否限制浮动层宽度不超过触发器 */
  limitWidth?: boolean;
  /** 当空间不充足时，浮动层是否需要自动翻转到另一侧 */
  floatFlip?: boolean;
  /** 当浮动层随着触发器移动到边缘时，是否需要固定到边缘以便完全展示 */
  floatShift?: boolean;
};

const FloatContainer = createContainer((initialState?: InitialState) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);

  const floating = useFloating<HTMLDivElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    strategy: initialState?.strategy ?? 'absolute',
    placement: initialState?.placement ?? 'bottom-start',
    middleware: [
      offset(initialState?.offset ?? 6),
      initialState?.floatShift && shift(),
      initialState?.floatFlip && flip(),
      size({
        apply({ rects, elements }) {
          const width = `${rects.reference.width}px`;
          Object.assign(elements.floating.style, initialState?.limitWidth ? { width } : { minWidth: width });
        }
      })
    ]
  });

  const { context, update } = floating;

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context, { ancestorScroll: initialState?.ancestorScroll, bubbles: { escapeKey: true } });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    focusItemOnOpen: false,
    virtual: true,
    loop: true
  });

  const interactions = useInteractions([role, dismiss, listNavigation]);

  useEffect(() => {
    if (initialState?.updateByOpen && open) update();
  }, [initialState?.updateByOpen, open, update]);

  return { open, setOpen, activeIndex, setActiveIndex, listRef, floating, interactions };
});

export const FloatProvider = FloatContainer.Provider;
export const useFloat = FloatContainer.useContainer;
