import { IconReferDeal, IconReferManualOperation, IconReferSystem } from '@fepkg/icon-park-react';
import { RefType } from '@fepkg/services/types/enum';

type ReferTypeCellProps = {
  type?: RefType;
};

export const ReferTypeCell = ({ type }: ReferTypeCellProps) => {
  switch (type) {
    case RefType.Deal:
      return <IconReferDeal className="text-primary-100" />;
    case RefType.Manual:
      return <IconReferManualOperation className="text-orange-100" />;
    case RefType.Auto:
      return <IconReferSystem className="text-secondary-100" />;
    default:
      return null;
  }
};
