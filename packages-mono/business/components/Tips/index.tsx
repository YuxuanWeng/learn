import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';
import { Placement } from '@floating-ui/react';

type TipsProps = {
  /** 是否展示提示图标 */
  show?: boolean;
  /** 提示文本 */
  tipsContent: string;
  placement?: Placement;
  className?: string;
};

export const Tips = ({ show, tipsContent, placement = 'bottom', className }: TipsProps) => {
  if (!show) return null;

  return (
    <Tooltip
      placement={placement}
      content={tipsContent}
    >
      <IconInfo
        size={12}
        className={cx('p-1.5 text-orange-100 hover:text-orange-000', className)}
      />
    </Tooltip>
  );
};
