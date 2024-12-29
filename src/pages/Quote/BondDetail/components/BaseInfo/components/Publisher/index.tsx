import { FC } from 'react';
import { TypePublisher } from '@/pages/Quote/BondDetail/type';
import { CollapseCaption } from '../CollapseCaption';

type Props = {
  publisher: TypePublisher;
};

const Publisher: FC<Props> = ({ publisher }) => {
  return (
    <div className="mb-4 rounded-lg bg-gray-800 border border-solid border-gray-600">
      <CollapseCaption
        title="发行人"
        haveIcon={false}
      />
      <div className="ml-9 py-3 text-orange-100 flex items-center gap-2">
        <span className="text-md font-bold">{publisher?.company ?? '--'}</span>
        <span className="h-5 px-2 text-xs leading-5 rounded-lg bg-orange-700">{publisher?.type ?? '--'}</span>
      </div>
    </div>
  );
};
export default Publisher;
