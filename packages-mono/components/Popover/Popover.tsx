import { HTMLProps, RefAttributes, cloneElement, forwardRef, isValidElement } from 'react';
import cx from 'classnames';
import { noopRef } from '@fepkg/common/utils';
import { FloatingArrow, FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react';
import { PopoverProps } from './types';
import { PopoverContext, usePopover, usePopoverFloat } from './usePopoverFloat';

export const Trigger = forwardRef<HTMLElement, HTMLProps<HTMLElement>>(({ children, ...restProps }, ref) => {
  const popover = usePopover();
  const childrenRef = (children as RefAttributes<HTMLElement>)?.ref;
  const mergedRefs = useMergeRefs([ref, popover?.refs.setReference ?? noopRef, childrenRef ?? noopRef]);

  if (!isValidElement(children)) return null;

  return cloneElement(
    children,
    popover?.getReferenceProps({
      ref: mergedRefs,
      ...restProps,
      ...children.props,
      'data-state': popover?.innerOpen ? 'open' : 'closed'
    })
  );
});

export const Content = forwardRef<HTMLDivElement, PopoverProps>(
  ({ children, floatingProps, floatingFocus = false, arrow = true, arrowStyle }, ref) => {
    const popover = usePopover();
    const mergedRefs = useMergeRefs([ref, popover?.refs.setFloating ?? noopRef]);

    if (!popover?.context) return null;
    if (!popover?.innerOpen && popover?.destroyOnClose) return null;

    return (
      <FloatingPortal
        id={popover?.floatingId ?? 'floating-container'}
        root={popover?.floatingRoot}
      >
        <FloatingFocusManager
          context={popover.context}
          initialFocus={floatingFocus ? 1 : -1}
          modal
        >
          <div
            ref={mergedRefs}
            style={{
              ...popover?.floatingStyles,
              ...floatingProps?.style
            }}
            {...popover?.getFloatingProps({
              onDoubleClick: evt => evt.stopPropagation(),
              ...floatingProps,
              className: cx(
                's-popover',
                'z-floating min-w-[136px] p-[15px] bg-gray-600 border border-solid border-gray-500 rounded-lg drop-shadow-dropdown',
                'flex flex-col gap-4',
                popover?.innerOpen ? 'visible' : 'invisible',
                floatingProps?.className
              )
            })}
          >
            {children}

            {arrow && (
              <FloatingArrow
                ref={popover?.arrowRef}
                context={popover.context}
                width={12}
                style={arrowStyle}
                height={6}
                tipRadius={2}
                fill={arrowStyle?.fill ?? 'var(--color-gray-600)'}
                stroke={arrowStyle?.stroke ?? 'var(--color-gray-500)'}
                strokeWidth={1}
              />
            )}
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }
);

export const Popover = (props: PopoverProps) => {
  const { children, content, onPopupClick } = props;
  const popover = usePopoverFloat(props);

  return (
    <PopoverContext.Provider value={popover}>
      {children && <Trigger onClick={onPopupClick}>{children}</Trigger>}
      {content && <Content {...props}>{content}</Content>}
    </PopoverContext.Provider>
  );
};
