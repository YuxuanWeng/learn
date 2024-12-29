import cx from 'classnames';
import { IconUrgentFilled } from '@fepkg/icon-park-react';

type OrderNoCellProp = {
  orderNo?: string;
  flagUrgent: boolean;
  disabledStyle?: boolean;
  hasBridgeCode?: boolean;
};

export const OrderNoCell = ({ orderNo, flagUrgent, disabledStyle, hasBridgeCode }: OrderNoCellProp) => {
  return (
    <div className={cx(hasBridgeCode && 'text-blue-200', 'flex items-center')}>
      {flagUrgent ? (
        <IconUrgentFilled className={cx('absolute -left-0.5', disabledStyle ? 'text-orange-400' : 'text-orange-100')} />
      ) : null}
      {orderNo ?? '-'}
    </div>
  );
};
