import { Dispatch, SetStateAction } from 'react';
import { RowKeysCache } from '@fepkg/components/Table';
import {
  ColumnAlign,
  GetRowKey,
  TableMouseEvent,
  TableSelectEventHandler,
  TableSorter
} from '@fepkg/components/Table/types';
import { ChildDealApprovalSortedField } from '@fepkg/services/types/bds-enum';
import { QuoteSortedField, ReceiptDealSortedField } from '@fepkg/services/types/enum';
import { ColumnSizingState, Row, RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    rowKey: string | GetRowKey<TData>;
    rowKeysCache: RowKeysCache;
    selectedKeys?: Set<string>;
    disabledKeys?: Set<string>;
    sorter?: TableSorter<SortedField>;
    selectRows?: TableSelectEventHandler;
    sortColumn?: (field: SortedField) => void;
    setColumnSizing: Dispatch<SetStateAction<ColumnSizingState>>;
    resizeColumn?: (key: ColumnKey, width: number) => void;
    triggerColumnSetting?: () => void;
    triggerCellMouseDown?: TableMouseEvent<TData, ColumnKey>;
    triggerCellMouseUp?: TableMouseEvent<TData, ColumnKey>;
    triggerCellDoubleClick?: TableMouseEvent<TData, ColumnKey>;
    triggerCellClick?: TableMouseEvent<TData, ColumnKey>;
    triggerCellContextMenu?: TableMouseEvent<TData, ColumnKey>;
    triggerCellMouseEnter?: TableMouseEvent<TData, ColumnKey>;
    triggerCellMouseLeave?: TableMouseEvent<TData, ColumnKey>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData = RowData, TValue = unknown> {
    columnKey: ColumnKey;
    align?: ColumnAlign;
    sortedField?: QuoteSortedField | ReceiptDealSortedField | ChildDealApprovalSortedField | boolean;
    sortedColor?: string;
    thCls?: string;
    tdCls?: string | ((row: Row<TData>) => string);
    /** 是否能够折叠展开，设置后可对该 memo row 在展开折叠时进行重新渲染，变更样式 */
    expandable?: boolean;
    /** 是否能够调整尺寸，默认为 showHeaderResizer */
    resizable?: boolean;
    /** 是否能够拖拽排序，默认为 showHeaderReorder */
    reorderable?: boolean;
  }
}

declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}
