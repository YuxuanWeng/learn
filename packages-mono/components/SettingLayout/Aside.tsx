import cx from 'classnames';
import { Caption } from '@fepkg/components/Caption';
import { SettingLayoutProps } from './types';

export const Aside = ({ className, label, suffix, children }: SettingLayoutProps.Aside) => {
  return (
    // 为了让children滚动条的位置能够贴到边缘，这里就不能给容器加边距
    <div className={cx('w-40 border-0 border-r border-solid border-gray-600', className)}>
      <div className="flex px-3 justify-between items-center def:h-10">
        <Caption>{label}</Caption>
        {suffix}
      </div>

      <div className="component-dashed-x-600 mx-3 h-px" />

      {/* 这里减去的40是 caption 一行的高度 */}
      <div className="flex-1 px-3 py-2 h-[calc(100%_-_40px)] overflow-y-overlay">{children}</div>
    </div>
  );
};
