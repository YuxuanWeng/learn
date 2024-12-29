import { MouseEvent, forwardRef, useMemo } from 'react';
import cx from 'classnames';
import { IconLoading } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { throttle } from 'lodash-es';
import { Tooltip } from '../Tooltip';
import { ButtonProps, DEFAULT_THROTTLE_WAIT } from './types';
import './button.less';

export const BasicButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = 'primary',
      htmlType,
      block,
      ghost,
      text,
      plain,
      loading,
      disabled,
      icon,
      tooltip,
      onClick,
      enableThrottle = true,
      throttleWait,
      children,
      ...restProps
    },
    ref
  ) => {
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
      if (loading || disabled) {
        evt.preventDefault();
        return;
      }

      if (enableThrottle || throttleWait !== undefined) debounceClick(evt);
      else onClick?.(evt);
    });

    const iconNode = useMemo(() => {
      if (loading) {
        return (
          <span className="s-btn-icon animate-spin">
            <IconLoading size={16} />
          </span>
        );
      }
      if (icon) return <span className="s-btn-icon">{icon}</span>;

      return null;
    }, [icon, loading]);

    let plainCls = '';
    if (plain) {
      if (typeof plain == 'boolean') plainCls = 's-btn-plain';
      else plainCls = `s-btn-plain s-btn-plain-${plain}`;
    }

    const btnNode = (
      <button
        {...restProps}
        ref={ref}
        type={htmlType}
        className={cx(
          's-btn',
          `s-btn-${type}`,
          block && 's-btn-block',
          ghost && 's-btn-ghost',
          text && 's-btn-text s-btn-ghost',
          plainCls,
          loading && 's-btn-loading',
          className
        )}
        disabled={disabled}
        onClick={handleClick}
      >
        {iconNode}
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
