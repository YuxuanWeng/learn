import { MouseEventHandler, ReactNode, forwardRef } from 'react';
import cx from 'classnames';

type AvatarProps = {
  /** 尺寸，支持中等和大号 */
  size?: 'middle' | 'large';
  /** 背景色，仅支持tailwindcss格式 */
  background?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

const sizeMap = {
  middle: 'w-7 h-7 text-xs',
  large: 'w-12 h-12 text-md'
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, size = 'middle', background = 'bg-primary-100', ...rest }, ref) => {
    return (
      <div
        className={cx('flex-center rounded-full cursor-pointer text-gray-700', sizeMap[size], background)}
        ref={ref}
        {...rest}
      >
        <span>{children}</span>
      </div>
    );
  }
);
