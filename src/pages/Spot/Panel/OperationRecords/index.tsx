import { memo, useContext, useMemo, useState } from 'react';
import { Dialog } from '@fepkg/components/Dialog';
import { Pagination } from '@fepkg/components/Pagination';
import { ExpandingTable } from '@fepkg/components/Table';
import { APIs } from '@fepkg/services/apis';
import type { DealOperationLogSearch } from '@fepkg/services/types/deal/operation-log-search';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { getOperationLog } from '@/common/services/api/deal/get-operation-log';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { IOperContext } from '../../utils/openDialog';
import { columnVisibleKeys, columns } from './columns';
import { DealOperationLogTableRowData } from './types';
import { getDiffRenders, getMessageRender, notUpdatesOperationTypes } from './utils';

interface IProps {
  context: IOperContext;
}

const getQueryKey = (dealId: string | undefined, page: number) => {
  return [APIs.deal.operationLogSearch, dealId, page] as const;
};

const PAGE_SIZE = 20;

const getQueryFn =
  (): QueryFunction<DealOperationLogSearch.Response, ReturnType<typeof getQueryKey>> =>
  async ({ signal, queryKey }) => {
    const [, dealId, page] = queryKey;

    const params: DealOperationLogSearch.Request = {
      deal_id: dealId,
      offset: (page - 1) * PAGE_SIZE,
      count: PAGE_SIZE
    };
    const res = await getOperationLog(params, { signal });
    return res;
  };

function OperRecords({ context }: IProps) {
  const pageSize = context.pageSize || 20;
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: getQueryKey(context.deal_id, page),
    queryFn: getQueryFn(),
    enabled: !!context.deal_id,
    refetchInterval: 1000,
    keepPreviousData: true
  });
  const total = useMemo(() => data?.total || 0, [data?.total]);
  const tableData: DealOperationLogTableRowData[] | undefined = useMemo(
    () =>
      data?.log_list?.map(d => {
        const diffs = notUpdatesOperationTypes.has(d.operation_type)
          ? []
          : getDiffRenders(d.before_deal_snapshot, d.after_deal_snapshot);

        return {
          id: d.log_id,
          original: { ...d, updated: { messageRender: getMessageRender(d), ...diffs[0] } },
          children:
            diffs.length <= 1
              ? []
              : diffs.map(diff => ({
                  id: `${d.log_id}${diff.label}`,
                  original: { ...d, updated: diff }
                }))
        };
      }),
    [data?.log_list]
  );

  const queryClient = useQueryClient();

  const prefetch = (newPage: number) => {
    queryClient.prefetchQuery(getQueryKey(context.deal_id, newPage), getQueryFn(), {
      staleTime: 15 * 1000
    });
  };

  return (
    <>
      <DialogLayout.Header>
        <Dialog.Header>成交记录操作日志</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="idc-oper-dialog-body h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ExpandingTable<DealOperationLogTableRowData>
            className="h-[400px] rounded-t-lg"
            data={tableData ?? []}
            loading={tableData == null}
            rowKey="id"
            defaultExpanded={false}
            columns={columns}
            columnVisibleKeys={columnVisibleKeys}
            hasColumnSettings={false}
            showHeaderReorder={false}
            showHeaderResizer={false}
            showHeaderContextMenu={false}
            onPrevPagePrefetch={() => {
              const prev = page - 1;
              if (prev < 1) {
                return;
              }
              prefetch(prev);
            }}
            onNextPagePrefetch={() => {
              const max = Math.ceil(total / pageSize);
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
        </div>
        <div className="component-dashed-x h-px" />

        <div className="flex justify-between items-center shrink-0 h-12 px-4 bg-gray-800 rounded-b-lg">
          <div className="flex leading-6 text-gray-300">
            共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
          </div>

          <Pagination
            showQuickJumper
            showSizeChanger={false}
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </div>
      </Dialog.Body>
    </>
  );
}

const MemoOperRecords = memo(OperRecords, (prevProps, nextProps) => isEqual(prevProps?.context, nextProps?.context));

export default () => {
  const context = useContext<IOperContext>(DialogContext);
  return context ? (
    <MemoOperRecords
      context={context}
      key={context.deal_id}
    />
  ) : null;
};
