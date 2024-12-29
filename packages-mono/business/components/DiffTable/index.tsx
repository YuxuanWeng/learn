import { ReactNode } from 'react';
import cx from 'classnames';
import { IconBridgeText, IconPayfor, IconRightArrow } from '@fepkg/icon-park-react';
import { ReceiptDealUpdatedBadgeType } from '../ReceiptDealLogTable/types';

export const UpdatesNone = () => (
  <span className="w-9 h-[22px] text-gray-300 font-medium bg-gray-600 rounded-lg">无</span>
);

const badgeCommonCls = 'w-4 h-4 text-gray-000 rounded inline-block';

export const UpdatesBadge = ({ type, className }: { type: ReceiptDealUpdatedBadgeType; className?: string }) => {
  switch (type) {
    case 'purple-bridge':
    case 'orange-bridge':
      return (
        <IconBridgeText
          size={16}
          className={cx(badgeCommonCls, type === 'purple-bridge' ? 'bg-purple-100' : 'bg-orange-100', className)}
        />
      );
    case 'danger-payfor':
      return (
        <IconPayfor
          size={16}
          className={cx(badgeCommonCls, 'bg-danger-100', className)}
        />
      );
    default:
      return null;
  }
};

export const UpdatesRender = ({
  updated,
  rowCls
}: {
  updated?: {
    label?: string;
    labelSuffix?: ReactNode;
    beforeRender?: ReactNode;
    afterRender?: ReactNode;
  };
  rowCls?: string;
}) => {
  const label = (
    <span className="flex-center self-start shrink-0 w-[92px] h-[22px] text-gray-200 font-medium border border-solid border-gray-600 rounded-lg">
      {updated?.label}
    </span>
  );

  return (
    <>
      {label}
      {updated?.labelSuffix}
      <div className={cx('flex items-center flex-wrap gap-y-2 gap-x-3', rowCls)}>
        {updated?.beforeRender ?? <UpdatesNone />}
        <IconRightArrow className="text-gray-300" />
        {updated?.afterRender ?? <UpdatesNone />}
      </div>
    </>
  );
};

export const UpdatesNum = ({ length }: { length: number }) => {
  if (length) {
    return (
      <>
        <div className="-mr-1 text-primary-100">{length}</div>
        条变更记录
      </>
    );
  }

  return null;
};
