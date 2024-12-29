import { FC } from 'react';
import cx from 'classnames';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Pagination } from '@fepkg/components/Pagination';
import { Table, TableMouseEvent } from '@fepkg/components/Table';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ColumnDef } from '@tanstack/react-table';
import { TypeProps } from '@/pages/Quote/BondDetail/type';
import { PAGE_SIZE } from '@/pages/Quote/BondDetail/utils';
import { CollapseCaption } from '../CollapseCaption';

type Props = TypeProps & {
  columnVisibleKeys?: string[];
  columns: ColumnDef<FiccBondBasic>[];
  data?: FiccBondBasic[];
  title: string;
  className?: string;
  visible?: boolean;
  tablePrefix?: React.ReactNode;
  page?: number;
  pageSize?: number;
  showPagination?: boolean;
  total?: number;
  pageChange?: (page: number, pageSize: number) => void;
  onCellClick?: TableMouseEvent<FiccBondBasic>;
};

const BondLiteTable: FC<Props> = ({
  columnVisibleKeys,
  columns,
  data,
  title,
  visible,
  onChange,
  className = '',
  tablePrefix,
  page,
  pageSize = PAGE_SIZE,
  showPagination,
  total,
  pageChange,
  onCellClick
}) => {
  const titleOnChange = (value: boolean) => {
    onChange(2, value);
  };

  return (
    <div className={cx('z-10 text-sm leading-8 text-center', className)}>
      <CollapseCaption
        title={title}
        open={visible}
        onChange={titleOnChange}
      />
      <div className={cx(!visible && 'h-0 overflow-hidden')}>
        {tablePrefix}
        <div className="relative h-full">
          <Table<FiccBondBasic, BondQuoteTableColumnKey>
            className="min-h-[244px]"
            data={data ?? []}
            zebra
            columns={columns}
            columnVisibleKeys={columnVisibleKeys}
            rowKey={original => original.key_market}
            placeholderSize="xs"
            showWatermark={false}
            showHeaderReorder={false}
            onCellClick={onCellClick}
            showHeaderResizer={false}
            showHeaderContextMenu={false}
            hasColumnSettings={false}
            multiSelectEnabled={false}
            showHeaderDivide={false}
          />
        </div>
        {showPagination && (
          <>
            <div className="component-dashed-x-600 h-px" />
            <div className="relative flex justify-between py-3 px-4 bg-gray-800">
              <div className="text-gray-300 flex items-center text-xs">
                共有<span className="pl-1 pr-1 text-primary-100 text-sm">{total}</span>条
              </div>
              <Pagination
                showSizeChanger={false}
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={pageChange}
                showQuickJumper
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BondLiteTable;
