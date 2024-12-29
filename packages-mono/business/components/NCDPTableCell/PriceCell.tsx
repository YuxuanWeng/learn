import { padDecimal } from '@fepkg/common/utils';
import { TextBadge } from '@fepkg/components/Tags';
import { FRType } from '@fepkg/services/types/enum';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

export const PriceCell = ({ original }: { original?: NCDPTableColumn }) => {
  const { price = 0, flag_internal, fr_type } = original?.original ?? {};
  const content = padDecimal(price, 2);
  const showBadge = fr_type === FRType.Shibor;
  return (
    <>
      <span className={`text-md font-heavy ${flag_internal ? 'text-primary-100' : ''}`}>{content}</span>
      <div className="flex-center shrink-0 w-6 h-6">
        {showBadge && (
          <TextBadge
            text="S"
            type="BOND"
          />
        )}
      </div>
    </>
  );
};
