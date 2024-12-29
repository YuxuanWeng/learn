import { useState } from 'react';
import cx from 'classnames';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { usePublishAllBondQuery } from '@/pages/Quote/BondDetail/hooks/useDataQuery';
import { PAGE_SIZE } from '@/pages/Quote/BondDetail/utils';
import BondLiteTable from '../BondLiteTable';
import { publisherAllBondColumns } from '../BondLiteTable/columns';

type Props = {
  issuer_code: string; // 发行商代码
};

const tabList = [
  { label: '银行间', value: 'CIB' },
  { label: '上交所', value: 'SSE' },
  { label: '深交所', value: 'SZE' }
];

const PublisherAllBond = ({ issuer_code }: Props) => {
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useLocalStorage('singleBondDetail-publisherAllBond', true);
  const [tab, setTab] = useState('CIB');

  const { data: res } = usePublishAllBondQuery(page, tab, issuer_code);
  const data = res?.bond_basic_list ?? [];
  const total = res?.total ?? 0;

  const onChangeVisible = (level: number, v: boolean) => {
    setVisible(v);
  };

  return (
    <BondLiteTable
      columns={publisherAllBondColumns}
      data={data}
      columnVisibleKeys={['time_to_maturity', 'display_code', 'short_name', 'rating']}
      visible={visible}
      onChange={onChangeVisible}
      pageSize={PAGE_SIZE}
      total={total}
      page={page}
      pageChange={setPage}
      showPagination
      title="发行人所有债券(流通中)"
      className="bg-gray-800 rounded-lg mb-4 border border-solid border-gray-600 overflow-hidden"
      tablePrefix={
        <div className="flex bg-gray-700 rounded-lg w-[276px] h-6 mx-4 my-3 text-xs font-medium leading-[22.5px] text-center cursor-pointer">
          {tabList.map(item => {
            return (
              <div
                key={item.value}
                onClick={() => {
                  setTab(item.value || '');
                  if (tab !== item.value) {
                    setPage(1);
                  }
                }}
                className={cx(
                  'flex-1 text-gray-200 select-none rounded-lg border border-solid',
                  item.value === tab
                    ? 'text-primary-100 border-primary-100 hover:text-primary-000 hover:border-primary-000'
                    : 'hover:text-primary-100 border-transparent'
                )}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      }
    />
  );
};
export default PublisherAllBond;
