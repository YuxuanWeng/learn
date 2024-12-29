import { forwardRef } from 'react';
import cx from 'classnames';
import { BadgeProps } from './types';
import './badge.less';

export const BadgeV2 = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      containerCls,
      type = 'danger',
      dot,
      count,
      overflowCount = 99,
      showZero,
      style,
      children,
      ...restProps
    },
    ref
  ) => {
    let showCount = count !== undefined;
    let countContent = `${count}`;

    dot = !showCount && dot;

    if (!showZero && count === 0) showCount = false;
    if ((count ?? 0) > overflowCount) countContent = `${overflowCount}+`;

    containerCls = cx('s-badge', `s-badge-${type}`, containerCls);

    return (
      <div
        ref={ref}
        className={containerCls}
        {...restProps}
      >
        {children}

        {dot && (
          <span
            className={cx('s-badge-dot', className)}
            style={style}
          />
        )}

        {showCount && (
          <span
            className={cx('s-badge-count', className)}
            style={style}
          >
            {/* 撑开宽度用 */}
            <span className="invisible px-0.5 text-xs">{countContent}</span>
            {/* 实际展示用 */}
            <span className="absolute text-3xs">{countContent}</span>
          </span>
        )}
      </div>
    );
  }
);
