import { alignLeftCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { formatDate } from '@fepkg/common/utils/date';
import { Tooltip } from '@fepkg/components/Tooltip';
import { MarketNotifyMsg } from '@fepkg/services/types/market-notify/msg-search';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { v4 as uuidv4 } from 'uuid';
import { ColumnFieldMap, TypeColumnFields } from '@/common/constants/column-fields-map';
import { ColumnFieldsEnum } from '@/common/types/column-fields-enum';
import HeadCell from './OutBoundRecord/components/HeadCell';

export const dataConvert = (msg: MarketNotifyMsg, fieldsList: ColumnFieldsEnum[]) => {
  const { data_map, create_time } = msg;
  const obj = {
    uuid: uuidv4(),
    SendTime: '',
    original: data_map
  };
  for (const tag of fieldsList) {
    const field = ColumnFieldMap[tag];
    obj[field.name_en] = data_map[field.id];
  }
  obj.SendTime = formatDate(create_time, 'YYYY-MM-DD HH:mm:ss');
  return obj;
};

export const columnHelper = createColumnHelper<TypeColumnFields>();

const getColumn = (fields: TypeColumnFields) =>
  columnHelper.display({
    id: fields.name_en,
    header: () => <HeadCell tag={fields} />,
    minSize: 200,
    meta: {
      columnKey: fields.name_en,
      align: 'left',
      tdCls: alignLeftCls,
      thCls: 'h-[60px]'
    },
    cell: ({ row }) => {
      const val = row.original[fields.name_en];
      return (
        <Tooltip
          truncate
          content={val}
        >
          <div className="truncate">{val}</div>
        </Tooltip>
      );
    }
  });

export const getColumns = (list: ColumnFieldsEnum[]) => {
  const sendTime = { id: -1, name_cn: '发送时间', name_en: 'SendTime' };
  const columns: ColumnDef<TypeColumnFields>[] = [getColumn(sendTime)];

  for (const tag of list) {
    const fields = ColumnFieldMap[tag];
    columns.push(getColumn(fields));
  }
  return columns;
};
