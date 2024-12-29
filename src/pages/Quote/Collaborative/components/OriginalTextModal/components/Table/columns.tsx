import { alignLeftCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { IconAttentionFilled, IconCheckCircleFilled } from '@fepkg/icon-park-react';
import { createColumnHelper } from '@tanstack/react-table';
import { OriginalTextTableColumnKey, OriginalTextTableRowData } from '@/pages/Quote/Collaborative/types/table';

export const columnHelper = createColumnHelper<OriginalTextTableRowData>();

export const columns = [
  columnHelper.display({
    id: OriginalTextTableColumnKey.Index,
    minSize: 72,
    header: '序号',
    meta: {
      columnKey: OriginalTextTableColumnKey.Index,
      align: 'center',
      tdCls: 'flex-center select-none'
    },
    cell: ({ row }) => (
      <>
        <span className="w-0 h-0 opacity-0">&ZeroWidthSpace;</span>
        {row.original.index}
        <span className="w-0 h-0 opacity-0">&ZeroWidthSpace;</span>
      </>
    )
  }),
  columnHelper.display({
    id: OriginalTextTableColumnKey.Text,
    minSize: 592,
    header: '提取文本',
    meta: {
      columnKey: OriginalTextTableColumnKey.Text
    },
    // 如果没有文本时，也需要复制出一个空格
    cell: ({ row }) => row.original.text || <span>&nbsp;</span>
  }),
  columnHelper.display({
    id: OriginalTextTableColumnKey.Status,
    minSize: 116,
    header: '状态',
    meta: {
      columnKey: OriginalTextTableColumnKey.Status,
      tdCls: alignLeftCls
    },
    cell: ({ row }) => {
      const { status } = row.original;

      if (status === 'valid') {
        return (
          <span className="flex-center gap-1 text-gray-100 font-medium select-none">
            <IconCheckCircleFilled className="text-primary-100" />
            已识别
          </span>
        );
      }

      return (
        <span className="flex-center gap-1 text-gray-300 font-medium select-none">
          <IconAttentionFilled />
          无效文本
        </span>
      );
    }
  })
];

export const columnVisibleKeys = [
  OriginalTextTableColumnKey.Index,
  OriginalTextTableColumnKey.Text,
  OriginalTextTableColumnKey.Status
];
