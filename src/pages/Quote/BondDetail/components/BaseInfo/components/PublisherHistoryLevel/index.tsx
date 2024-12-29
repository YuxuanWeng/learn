import { FC, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { InstRating } from '@fepkg/services/types/common';
import { PAGE_SIZE } from '@/pages/Quote/BondDetail/utils';
import InstRatingTable from '../InstRatingTable';
import { instRatingColumns } from '../InstRatingTable/columns';

type Props = {
  issuerRatingList: InstRating[];
};

const PublisherHistoryLevel: FC<Props> = ({ issuerRatingList }) => {
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useLocalStorage('singleBondDetail-publishHistoryLevel', true);

  const onChangeVisible = (level: number, v: boolean) => {
    setVisible(v);
  };

  return (
    <InstRatingTable
      columns={instRatingColumns}
      columnVisibleKeys={['rate_val', 'rating_date', 'inst_name']}
      data={issuerRatingList.slice((page - 1) * PAGE_SIZE, Math.min(page * PAGE_SIZE, issuerRatingList.length))}
      visible={visible}
      onChange={onChangeVisible}
      pageSize={PAGE_SIZE}
      total={issuerRatingList.length}
      page={page}
      pageChange={setPage}
      showPagination
      title="发行人主体历史评级"
      className="bg-gray-800 rounded-lg border border-solid border-gray-600 overflow-hidden"
    />
  );
};
export default PublisherHistoryLevel;
