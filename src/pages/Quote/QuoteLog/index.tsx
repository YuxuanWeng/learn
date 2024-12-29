import { useContext, useEffect, useState } from 'react';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Dialog } from '@fepkg/components/Dialog';
import { message } from '@fepkg/components/Message';
import { Pagination } from '@fepkg/components/Pagination';
import { Table } from '@fepkg/components/Table';
import { ColumnOrderState } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { OPERATION_LOG_TABLE_COLUMN } from '@/common/constants/table';
import { useOperationLogColumnSettings } from '@/common/services/hooks/useSettings/useOperationLogTableColumnSettings';
import { TableColumnSettingsModal } from '@/components/TableColumnSettingsModal';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { operationLogColumns } from './columns';
import { OperationLogColumn, OperationLogContext } from './types';
import { PAGE_SIZE, useOperationLogQuery } from './useOperationLogQuery';

const QuoteLog = () => {
  const context = useContext(DialogContext) as OperationLogContext | undefined;

  const [page, setPage] = useState(1);

  const { quoteOperationLogList, total, isLoading, refetch } = useOperationLogQuery(
    context?.quoteId,
    context?.keyMarket,
    page
  );

  const { columnSettings, setColumnSettings } = useOperationLogColumnSettings();

  const [columnSettingsMdlOpen, setColumnSettingsMdlOpen] = useState(false);

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

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DialogLayout.Header controllers={['min', 'max', 'close']}>
        <Dialog.Header>报价日志</Dialog.Header>
      </DialogLayout.Header>
      <div className="flex flex-col h-full bg-gray-700 p-3 overflow-hidden">
        <Table<OperationLogColumn, BondQuoteTableColumnKey>
          className="rounded-t-lg bg-gray-800"
          active
          data={quoteOperationLogList}
          columns={operationLogColumns}
          rowKey={log => log.original.log_id}
          columnSettings={columnSettings}
          loading={isLoading}
          noSearchResult={quoteOperationLogList.length === 0 && !isLoading}
          onColumnOrderChange={handleColumnOrderChange}
          onColumnResizeEnd={handleColumnResizeEnd}
          onColumnSettingTrigger={() => setColumnSettingsMdlOpen(true)}
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
            if (page >= Math.ceil(total / PAGE_SIZE)) {
              scrollCallback(false);
              return;
            }
            let next = page + 1;
            const max = Math.ceil(total / PAGE_SIZE);
            if (next > max) next = max;
            if (next < 1) next = 1;
            setPage(next);
            scrollCallback(true);
          }}
        />
        <TableColumnSettingsModal<BondQuoteTableColumnKey>
          visible={columnSettingsMdlOpen}
          columnSettings={columnSettings}
          onSubmit={val => {
            setColumnSettings(val);
            message.success('保存成功');
            setColumnSettingsMdlOpen(false);
          }}
          onReset={() => {
            setColumnSettings([...OPERATION_LOG_TABLE_COLUMN]);
            message.success('保存成功');
            setColumnSettingsMdlOpen(false);
          }}
          onCancel={() => setColumnSettingsMdlOpen(false)}
        />
        <div className="component-dashed-x-600 z-10" />
        <div className="flex justify-between py-3 px-4 bg-gray-800 rounded-b-lg">
          <div className="flex leading-6 text-gray-300">
            共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
          </div>
          <Pagination
            showQuickJumper
            showSizeChanger={false}
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={val => setPage(val)}
          />
        </div>
      </div>
    </>
  );
};

export default QuoteLog;
