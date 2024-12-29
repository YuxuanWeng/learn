import cx from 'classnames';
import { Popover } from '@fepkg/components/Popover';
import { IconAttention } from '@fepkg/icon-park-react';
import { DealSorSendStatus } from '@fepkg/services/types/bds-enum';
import { dealSorSendStatusMap } from './constants';

type SendStatusCellProps = {
  sendStatus?: DealSorSendStatus;
  flagChange?: boolean;
  disabled?: boolean;
};
export const SendStatusCell = ({ sendStatus, flagChange, disabled }: SendStatusCellProps) => {
  return (
    <>
      {flagChange && (
        <Popover
          trigger="hover"
          content="进入处理流程后有新变更"
          offset={4}
          placement="top"
          floatingProps={{ className: 'py-2 leading-4' }}
          arrow={false}
        >
          <IconAttention
            className="absolute left-2 text-orange-100"
            size={16}
          />
        </Popover>
      )}
      <span className={cx('ml-2.5', disabled ? 'text-gray-300' : 'text-gray-100')}>
        {(sendStatus ? dealSorSendStatusMap.get(sendStatus) : void 0) || '-'}
      </span>
    </>
  );
};
