import { IconUpArrow } from '@fepkg/icon-park-react';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

export const PriceChangeCell = ({ original }: { original?: NCDPTableColumn }) => {
  const { price_changed = 0 } = original?.original ?? {};

  const unchanged = price_changed === 0;
  const content = unchanged ? undefined : Math.abs(price_changed);
  const arrowCls = price_changed > 0 ? 'mr-2 text-danger-100' : 'mr-2 text-secondary-100 rotate-180';

  return (
    <>
      {!unchanged && (
        <IconUpArrow
          className={arrowCls}
          size={12}
        />
      )}
      {content}
    </>
  );
};
