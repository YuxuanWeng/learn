import cx from 'classnames';
import { alignCenterCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconHelp } from '@fepkg/icon-park-react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { OppositePriceNotifyLogicTable } from '../../types';
import { ColorCell, LogicCell, NValueCell, NotifyLogicTypeCell, TurnOnCell } from './CustomizeCell';

export const columnHelper = createColumnHelper<OppositePriceNotifyLogicTable>();

const tdCls = 'flex !border-0 leading-8';
export const LogicsConfigColumns: ColumnDef<OppositePriceNotifyLogicTable>[] = [
  columnHelper.display({
    id: 'notify_logic_type',
    header: () => <div className="ml-4">提醒逻辑</div>,
    minSize: 160,
    cell: ({ row }) => <NotifyLogicTypeCell row={row.original} />,
    // 宽度自适应
    meta: {
      columnKey: 'notify_logic_type',
      align: 'left',
      thCls: 'w-40 min-w-40',
      tdCls: cx('w-40 min-w-40', tdCls)
    }
  }),

  columnHelper.display({
    id: 'n_value',
    header: 'N值',
    minSize: 100,
    cell: ({ row }) => (
      <NValueCell
        key={row.original.n_value}
        row={row.original}
      />
    ),
    meta: {
      columnKey: 'n_value',
      align: 'center',
      thCls: 'w-[100px] min-w-[100px] ml-5',
      tdCls: cx('w-[100px] min-w-[100px]', tdCls)
    }
  }),

  columnHelper.display({
    id: 'color',
    header: '颜色',
    minSize: 100,
    cell: ({ row }) => <ColorCell row={row.original} />,
    meta: {
      columnKey: 'color',
      align: 'center',
      thCls: 'w-[100px] min-w-[100px]',
      tdCls: cx('w-[100px] min-w-[100px]', alignCenterCls, tdCls)
    }
  }),

  columnHelper.display({
    id: 'turn_on',
    header: '开启/关闭',
    minSize: 100,
    cell: ({ row }) => <TurnOnCell row={row.original} />,
    meta: {
      columnKey: 'turn_on',
      align: 'center',
      thCls: 'w-[100px] min-w-[100px]',
      tdCls: cx('w-[100px] min-w-[100px]', alignCenterCls, tdCls)
    }
  }),

  columnHelper.display({
    id: 'msg_template',
    header: () => (
      <div className="flex gap-x-1">
        自定义话术
        <Tooltip content="双击话术区域即可自定义编辑（限15个字符）">
          <div className="flex items-center">
            <IconHelp className="hover:text-primary-000" />
          </div>
        </Tooltip>
      </div>
    ),
    minSize: 428,
    cell: ({ row }) => <LogicCell row={row.original} />,

    meta: {
      columnKey: 'msg_template',
      align: 'left',
      thCls: 'flex-1',
      tdCls: cx('flex-1 pl-[18px]', tdCls)
    }
  })
];

export const visibleColumns: (keyof OppositePriceNotifyLogicTable)[] = [
  'notify_logic_type',
  'n_value',
  'color',
  'turn_on',
  'msg_template'
];
