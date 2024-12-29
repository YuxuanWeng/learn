import { IconBrokerage } from '@fepkg/icon-park-react';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

export const IssuerInstCell = ({ original }: { original?: NCDPTableColumn }) => {
  const { inst_name, flag_brokerage } = original?.original ?? {};
  return (
    <>
      {inst_name}

      {flag_brokerage && (
        <div className="flex-center w-4 h-4 ml-2 text-gray-000 bg-orange-100 rounded">
          <IconBrokerage />
        </div>
      )}
    </>
  );
};
