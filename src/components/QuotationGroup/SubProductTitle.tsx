import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconAddCircle, IconDownSmall, IconUpSmall } from '@fepkg/icon-park-react';

type SubProductProps = {
  title: string;
  isFold: boolean;
  onFoldClick?: () => void;
  onAddClick?: () => void;
  disabledAdd?: boolean;
  className?: string;
  hideDashline?: boolean;
};

export const SubProductTitle = ({
  title,
  isFold,
  onFoldClick,
  onAddClick,
  disabledAdd,
  className,
  hideDashline
}: SubProductProps) => {
  return (
    <div className={cx('flex flex-col', className)}>
      {!hideDashline && <div className="component-dashed-x-500 h-px mt-0.5" />}
      <div className="flex items-center h-10 justify-between select-none mt-3">
        <div className="flex items-center text-sm">
          <span className="ml-4 mr-1">{title}</span>
          <Button.Icon
            text
            icon={isFold ? <IconDownSmall className="text-gray-300" /> : <IconUpSmall className="text-gray-300" />}
            onClick={onFoldClick}
          />
        </div>
        <Button.Icon
          text
          icon={<IconAddCircle />}
          disabled={disabledAdd}
          tooltip={{ content: disabledAdd ? '看板数量已达上限' : '', visible: true }}
          throttleWait={500}
          onClick={onAddClick}
        />
      </div>
    </div>
  );
};
