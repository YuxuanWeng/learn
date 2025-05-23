import { useMemo } from 'react';
import { Pagination } from '@fepkg/components/Pagination';
import { ExpandingTable } from '@fepkg/components/Table';
import { ProductType } from '@fepkg/services/types/enum';
import { RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE } from '../ReceiptDealLogTable/constants';
import { useDealDetailLogTable } from './TableProvider';
import { columnVisibleKeys, getColumns } from './columns';
import { DealDetailLogTableRowData } from './types';

export const DealDetailLogTable = ({ productType }: { productType: ProductType }) => {
  const { list, total, page, setPage, prefetch } = useDealDetailLogTable();

  const columns = useMemo(() => getColumns(productType), [productType]);

  return (
    <>
      <ExpandingTable<DealDetailLogTableRowData>
        className="rounded-t-lg"
        data={list}
        rowKey="id"
        defaultExpanded={false}
        columns={columns}
        columnVisibleKeys={columnVisibleKeys}
        hasColumnSettings={false}
        showHeaderReorder={false}
        showHeaderResizer={false}
        showHeaderContextMenu={false}
        onPrevPage={scrollCallback => {
          if (page === 1) {
            scrollCallback(false);
            return;
          }
          let prev = page - 1;
          if (prev < 1) prev = 1;
          setPage(prev);
          scrollCallback(true);
        }}
        onNextPage={scrollCallback => {
          const max = Math.ceil(total / RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE);
          if (page >= max) {
            scrollCallback(false);
            return;
          }
          let next = page + 1;
          if (next > max) next = max;
          if (next < 1) next = 1;
          setPage(next);
          scrollCallback(true);
        }}
        onPrevPagePrefetch={() => {
          const prev = page - 1;
          if (prev < 1) {
            return;
          }
          prefetch(prev);
        }}
        onNextPagePrefetch={() => {
          const max = Math.ceil(total / RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE);
          if (max <= 1) {
            return;
          }
          let next = page + 1;
          if (next > max) next = max;
          if (next === page) {
            return;
          }
          prefetch(next);
        }}
      />

      <div className="component-dashed-x h-px" />

      <div className="flex justify-between items-center shrink-0 h-12 px-4 bg-gray-800 rounded-b-lg">
        <div className="flex leading-6 text-gray-300">
          共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
        </div>

        {!!total && (
          <Pagination
            showQuickJumper
            showSizeChanger={false}
            current={page}
            pageSize={RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        )}
      </div>
    </>
  );
};
