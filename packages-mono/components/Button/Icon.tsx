import { MouseEvent, forwardRef, useMemo } from 'react';
import cx from 'classnames';
import { useMemoizedFn } from 'ahooks';
import { throttle } from 'lodash-es';
import { Tooltip } from '../Tooltip';
import { ButtonIconProps, DEFAULT_THROTTLE_WAIT } from './types';
import './button.less';

export const Icon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      className,
      type = 'gray',
      block,
      ghost,
      text,
      bright,
      checked,
      disabled,
      plain,
      icon,
      tooltip,
      onClick,
      enableThrottle = false,
      throttleWait,
      children,
      ...restProps
    },
    ref
  ) => {
    const withChildren = children !== void 0;

    const onMemoizedClick = useMemoizedFn(evt => onClick?.(evt));

    const debounceClick = useMemo(
      () =>
        throttle(
          (evt: MouseEvent<HTMLButtonElement>) => onMemoizedClick?.(evt),
          throttleWait ?? DEFAULT_THROTTLE_WAIT,
          {
            leading: true,
            trailing: false
          }
        ),
      [onMemoizedClick, throttleWait]
    );

    const handleClick = useMemoizedFn((evt: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        evt.preventDefault();
        return;
      }

      if (enableThrottle || throttleWait !== undefined) debounceClick(evt);
      else onClick?.(evt);
    });

    const btnNode = (
      <button
        ref={ref}
        tabIndex={-1}
        className={cx(
          's-icon-btn',
          `s-btn-${type}`,
          block && 's-btn-block',
          ghost && 's-btn-ghost',
          text && 's-btn-text s-btn-ghost',
          bright && 's-btn-bright',
          checked && 's-btn-checked',
          plain && 's-btn-plain',
          withChildren && 's-btn-with-children',
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        {...restProps}
      >
        {icon && <span className="s-icon-btn-icon">{icon}</span>}
        {children}
      </button>
    );

    if (tooltip?.content && (tooltip?.visible || !disabled)) {
      return (
        <Tooltip
          destroyOnClose
          {...tooltip}
        >
          {btnNode}
        </Tooltip>
      );
    }

    return btnNode;
  }
);
