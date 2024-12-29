import { ReactNode, forwardRef } from 'react';
import cx from 'classnames';
import { BadgeStatusProps } from './type';
import styles from './style.module.less';

type BadgeProps = {
  className?: string;
  children?: ReactNode;
  statusProps?: BadgeStatusProps;
};

const StatusNode = (props: BadgeStatusProps) => {
  const { dot, count, offset, color = 'red', blink, children } = props;

  const colorCls = {
    red: 'bg-danger-200',
    green: 'bg-primary-200'
  }[color];

  if (children) return children;

  if (!dot && !count) return null;
  // TODO 数字角标尺寸位置待确认
  const size = dot ? 'w-1.5 h-1.5 top-0.5 -right-2' : '-top-5 -right-5 text-xs px-1.5 py-0.5';
  return (
    <span
      style={{ transform: `translate(${offset})` }}
      className={cx(
        'absolute badge-dot border-solid flex border border-gray-100 rounded-full items-center justify-center z-50',
        size,
        colorCls,
        blink && styles['badge-blink']
      )}
    >
      {count}
    </span>
  );
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const { className, statusProps, children } = props;

  return (
    <span
      ref={ref}
      className={cx('relative', className)}
    >
      {children}
      <StatusNode {...statusProps} />
    </span>
  );
});
