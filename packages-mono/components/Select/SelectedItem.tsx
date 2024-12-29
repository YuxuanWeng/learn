import { MouseEventHandler } from 'react';
import cx from 'classnames';
import { IconClose } from '@fepkg/icon-park-react';
import { Tooltip } from '../Tooltip';

type SelectedItemProps = {
  className?: string;
  label: string;
  /** 是否可以关闭——默认true */
  closable?: boolean;
  /** 点击关闭触发 */
  handleClose?: MouseEventHandler<HTMLSpanElement>;
};

// 下拉框中的已选项宽度自适应，弹窗中的已选项宽度根据需要传入最大宽度
// 当已选项内容非常多时，已选项最少要在modal中平铺三列，例如420的modal最大宽度不超过120，480的modal中最大宽度不超过138
/** 多选下拉框的已选项展示 */
export const SelectedItem = ({ label, className, closable = true, handleClose }: SelectedItemProps) => {
  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 def:h-6',
        'leading-6 px-3 text-sm text-gray-000 bg-gray-600',
        'border border-solid border-gray-500 rounded overflow-hidden',
        className
      )}
    >
      {/* 超出后省略显示，hover后一定要展示tooltip */}
      <Tooltip
        truncate
        content={label}
        floatingProps={{ className: '!z-hightest' }}
      >
        <span className="truncate">{label}</span>
      </Tooltip>
      {closable ? (
        <IconClose
          className="text-gray-200 h-3 text-xs cursor-pointer hover:text-gray-000"
          onMouseDown={handleClose}
        />
      ) : null}
    </div>
  );
};
