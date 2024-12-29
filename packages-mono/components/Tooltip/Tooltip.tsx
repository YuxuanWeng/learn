import { HTMLProps, RefAttributes, cloneElement, forwardRef, isValidElement } from 'react';
import cx from 'classnames';
import { noopRef } from '@fepkg/common/utils';
import { FloatingPortal, useMergeRefs } from '@floating-ui/react';
import { TooltipProps } from './types';
import { TooltipContext, useTooltip, useTooltipFloat } from './useTooltipFloat';

const Trigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & Pick<TooltipProps, 'referenceRefField' | 'visible'>>(
  ({ children, referenceRefField = 'ref', visible = false, ...restProps }, ref) => {
    const tooltip = useTooltip();
    const childrenRef = (children as RefAttributes<HTMLElement>)?.ref;
    const mergedRefs = useMergeRefs([ref, tooltip?.refs.setReference ?? noopRef, childrenRef ?? noopRef]);

    if (!isValidElement(children)) return null;

    if (visible) {
      return (
        <div
          className="inline-flex"
          {...tooltip?.getReferenceProps({
            ref: mergedRefs,
            ...restProps
          })}
          data-state={tooltip?.computedOpen ? 'open' : 'closed'}
        >
          {children}
        </div>
      );
    }

    return cloneElement(
      children,
      tooltip?.getReferenceProps({
        [referenceRefField]: mergedRefs,
        ...restProps,
        ...children.props,
        'data-state': tooltip?.computedOpen ? 'open' : 'closed'
      })
    );
  }
);

const Content = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const tooltip = useTooltip();
  const mergedRefs = useMergeRefs([ref, tooltip?.refs.setFloating ?? noopRef]);

  if (!tooltip?.computedOpen && tooltip?.destroyOnClose) return null;

  return (
    <FloatingPortal
      id={tooltip?.floatingId ?? 'floating-container'}
      root={tooltip?.floatingRoot}
    >
      <div
        ref={mergedRefs}
        style={{
          ...tooltip?.floatingStyles,
          ...props?.style
        }}
        {...tooltip?.getFloatingProps({
          ...props,
          className: cx(
            's-tooltip',
            'z-floating py-[7px] px-[15px] text-xs bg-gray-600 border border-solid border-gray-500 rounded-lg whitespace-nowrap drop-shadow-dropdown',
            tooltip?.computedOpen ? 'visible' : 'invisible',
            props?.className
          ),
          // 这样做是为了解决 @floating-ui/react 在点击 Trigger 后快速移动到 tooltip content 中，
          // 没有让未设置 SafePolygon tooltip content 消失的问题
          onMouseEnter: () => {
            if (!tooltip?.shouldSafePolygon) tooltip?.setInnerOpen?.(false);
          }
        })}
      />
    </FloatingPortal>
  );
});

export const Tooltip = ({
  children,
  referenceRefField,
  visible,
  floatingProps,
  content,
  ...restProps
}: TooltipProps) => {
  const tooltip = useTooltipFloat(restProps);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children && (
        <Trigger
          referenceRefField={referenceRefField}
          visible={visible}
        >
          {children}
        </Trigger>
      )}
      {content && <Content {...floatingProps}>{content}</Content>}
    </TooltipContext.Provider>
  );
};
