import cx from 'classnames';
import { SettingLayoutProps } from './types';

export const SettingLayout = ({ className, containerCls, aside, header, children }: SettingLayoutProps.Layout) => {
  return (
    <div className={cx('flex', containerCls)}>
      {aside}

      <div className="flex-1 flex flex-col px-3">
        {header}

        <div className="component-dashed-x-600 h-px" />

        {/* Content */}
        <div className={cx('flex-1 flex h-0 pt-2', className)}>{children}</div>
      </div>
    </div>
  );
};
