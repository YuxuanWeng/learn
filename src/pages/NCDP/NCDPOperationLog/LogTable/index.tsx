import { LOG_TABLE_PAGE_SIZE } from '@fepkg/business/components/LogTable/constant';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Table } from '@fepkg/components/Table';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useOperationLogColumnSettings } from '@/common/services/hooks/useSettings/useOperationLogTableColumnSettings';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';
import { useLogTable } from './TableProvider';
import { columns } from './columns';

export const NCDPLogTable = () => {
  const { list, total, page, setPage, onNextPage, onPrevPage, onNextPagePrefetch, onPrevPagePrefetch } = useLogTable();
  const { columnSettings, setColumnSettings } = useOperationLogColumnSettings();
  const handleColumnOrderChange = useMemoizedFn((columnOrder: ColumnOrderState) => {
    if (columnSettings) {
      const sortedCols = [...columnSettings]?.sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
      const showCols = sortedCols.filter(item => item.visible);
      const unShowCols = sortedCols.filter(item => !item.visible);
      const updatedCols = showCols.concat(unShowCols);
      setColumnSettings(updatedCols);
    }
  });

  const handleColumnResizeEnd = useMemoizedFn((key: BondQuoteTableColumnKey, width: number) => {
    if (columnSettings) {
      const settingIdx = columnSettings?.findIndex(item => item.key === key);
      if (settingIdx > -1) {
        columnSettings[settingIdx] = { ...columnSettings[settingIdx], width };
        setColumnSettings([...columnSettings]);
      }
    }
  });

  return (
    <>
      <Table<NCDPTableColumn, BondQuoteTableColumnKey>
        active
        data={list}
        columns={columns}
        rowKey={original => original.original.log_id ?? ''}
        columnSettings={columnSettings}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onPrevPagePrefetch={onPrevPagePrefetch}
        onNextPagePrefetch={onNextPagePrefetch}
        onColumnOrderChange={handleColumnOrderChange}
        onColumnResizeEnd={handleColumnResizeEnd}
        showHeaderContextMenu={false}
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
            pageSize={LOG_TABLE_PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        )}
      </div>
    </>
  );
};
