import cx from 'classnames';
import { Size } from '../types';
import { DialogBodyProps } from './types';

const sizeClsMap: Record<Size, string> = {
  md: 'p-3',
  sm: 'p-3',
  xs: 'p-2 pt-0'
};

export const Body = ({
  children,
  className,
  size = 'sm',
  background = 'bg-gray-700',
  ...restProps
}: DialogBodyProps) => {
  const sizeCls = sizeClsMap[size];

  return (
    <div
      className={cx('overflow-hidden flex-auto', background, sizeCls, className)}
      {...restProps}
    >
      {children}
    </div>
  );
};
