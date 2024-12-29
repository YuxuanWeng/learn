import cx from 'classnames';
import { DialogFooterItemProps } from './types';

export const FooterItem = ({ className, label, children }: DialogFooterItemProps) => {
  return (
    <div className={cx('flex items-center gap-3 def:h-7 px-3 def:bg-gray-700 rounded-lg', className)}>
      {label && <div className="text-sm leading-4 text-gray-200 font-medium">{label}</div>}
      {children}
    </div>
  );
};
