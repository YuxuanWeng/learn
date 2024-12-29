import { useMemo } from 'react';
import { Pagination } from '@fepkg/components/Pagination';
import { Table } from '@fepkg/components/Table';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealSearchRealParentDeal } from '@fepkg/services/types/receipt-deal/search-real-parent-deal';
import { useQuery } from '@tanstack/react-query';
import { historyDealSearch } from '@/common/services/api/receipt-deal/history-search';
import { ColumnSettingsKeysType } from '../../types';
import { getColumns } from '../../utils/table';
import { useHistoryRecords } from './provider';
import { columnSettings } from './utils';

export const columns = getColumns<ReceiptDealSearchRealParentDeal.RealReceiptDealInfo>(columnSettings);

export default function HistoryTable() {
  const { filterData: params, page, setPage, size } = useHistoryRecords();
  const { data } = useQuery<ReceiptDealSearchRealParentDeal.Response>({
    queryKey: [APIs.receiptDeal.historyDealSearch, params, page] as const,
    queryFn: async ({ signal }) => {
      if (!params) return {};
      const res = await historyDealSearch(
        {
          ...params,
          offset: (page - 1) * size,
          count: size
        },
        {
          signal
        }
      );
      return res;
    },
    refetchInterval: 1000,
    keepPreviousData: true
  });
  const total = useMemo(() => data?.total || 0, [data?.total]);
  const tableData: ReceiptDealSearchRealParentDeal.RealReceiptDealInfo[] = useMemo(
    () => data?.real_receipt_deal_info_list || [],
    [data?.real_receipt_deal_info_list]
  );

  return (
    <div className="relative flex flex-col flex-1 rounded-lg overflow-hidden">
      <Table<
        ReceiptDealSearchRealParentDeal.RealReceiptDealInfo,
        ColumnSettingsKeysType<ReceiptDealSearchRealParentDeal.RealReceiptDealInfo>
      >
        className="absolute left-0 right-0 top-0 bottom-[49px] !h-auto"
        showPlaceholder={false}
        showHeaderReorder={false}
        showHeaderResizer={false}
        showHeaderContextMenu={false}
        pageSize={size}
        data={tableData}
        columns={columns}
        columnSettings={columnSettings}
        rowKey={(original, idx) => original?.parent_id || `${idx}`}
      />
      <div className="absolute bottom-0 left-0 right-0 select-none">
        <div className="component-dashed-x-600 h-px" />

        <div className="flex justify-between py-3 px-4 bg-gray-800">
          <div className="flex leading-6 text-gray-300">
            共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
          </div>
          <Pagination
            showQuickJumper
            showSizeChanger={false}
            current={page}
            pageSize={size}
            total={total}
            onChange={val => setPage(val)}
          />
        </div>
      </div>
    </div>
  );
}
