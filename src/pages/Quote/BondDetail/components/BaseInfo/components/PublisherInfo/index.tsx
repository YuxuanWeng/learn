import { FC } from 'react';
import cx from 'classnames';
import { FiccBondDetail, InstRating } from '@fepkg/services/types/common';
import { TypePublisher } from '@/pages/Quote/BondDetail/type';
import Publisher from '../Publisher';
import PublisherAllBond from '../PublisherAllBond';
import PublisherHistoryLevel from '../PublisherHistoryLevel';

type Props = {
  visible: boolean;
  bondInfo?: FiccBondDetail;
  publisher?: TypePublisher;
  issuerRatingList: InstRating[];
};
const PublisherInfo: FC<Props> = ({ visible, bondInfo, publisher, issuerRatingList }) => {
  return (
    <div className={cx(!visible && 'h-0 overflow-hidden')}>
      <Publisher publisher={publisher || {}} />
      <PublisherAllBond issuer_code={bondInfo?.issuer_code ?? ''} />
      <PublisherHistoryLevel issuerRatingList={issuerRatingList} />
    </div>
  );
};

export default PublisherInfo;
