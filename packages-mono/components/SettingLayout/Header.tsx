import cx from 'classnames';
import { SettingLayoutProps } from './types';

export const Header = ({ className, children }: SettingLayoutProps.Header) => {
  return <div className={cx('flex justify-between items-center def:h-10', className)}>{children}</div>;
};
