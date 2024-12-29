import cx from 'classnames';
import { DialogHeaderProps } from './types';

export const Header = ({ children, subtitle, childrenCls, ...restProps }: DialogHeaderProps) => {
  return (
    <header
      className="flex items-baseline gap-2 text-md select-none"
      {...restProps}
    >
      <span className={cx('flex-shrink-0', childrenCls)}>{children}</span>
      {subtitle && <div className="text-xs text-gray-200 truncate">{subtitle}</div>}
    </header>
  );
};
