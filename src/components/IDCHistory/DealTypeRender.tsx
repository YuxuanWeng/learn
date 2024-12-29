import { FC } from 'react';
import cx from 'classnames';
import { DealType } from '@fepkg/services/types/enum';

/** 点价类型 */
export const DealTypeRender: FC<{ type?: DealType }> = ({ type }) => {
  const classNames = cx(
    'h-7 flex items-center justify-center border-solid border border-gray-600 rounded-full w-14 mx-4 whitespace-nowrap text-sm',
    type === DealType.TKN ? 'text-secondary-100' : 'text-orange-100'
  );
  switch (type) {
    case DealType.GVN:
      return <span className={classNames}>GVN</span>;
    case DealType.TKN:
      return <span className={classNames}>TKN</span>;
    default:
      return <span className={classNames}>出给</span>;
  }
};
