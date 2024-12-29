import { IconFullInquiryText } from '@fepkg/icon-park-react';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

export const VolumeCell = ({ original }: { original?: NCDPTableColumn }) => {
  const { volume, flag_full } = original?.original ?? {};
  return (
    <>
      {flag_full && (
        <div className="absolute left-4 flex-center w-4 h-4 text-gray-000 bg-green-100 rounded">
          <IconFullInquiryText />
        </div>
      )}

      <span className="z-10 bg-placeholder">{volume || '--'}</span>
    </>
  );
};
