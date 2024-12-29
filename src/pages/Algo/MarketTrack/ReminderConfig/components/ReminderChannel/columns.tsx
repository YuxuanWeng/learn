import cx from 'classnames';
import { Switch } from '@fepkg/components/Switch';
import { Tooltip } from '@fepkg/components/Tooltip';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { updateTraderSetting } from '@/common/services/api/opposite-price-notification/trader-setting-update';
import { useProductParams } from '@/layouts/Home/hooks';
import { ReminderChannelColumns } from '../../types';
import { useReminderChannel } from './ReminderChannelProvider';

export const columnHelper = createColumnHelper<ReminderChannelColumns>();

export const TurnOnCell = ({ row }: { row: ReminderChannelColumns }) => {
  const { productType } = useProductParams();
  const { traderSetting, handleRefetch } = useReminderChannel();
  // 没有QQ就禁用
  const disabled = !row.trader_qq;

  const onOff = traderSetting.reduce(
    (prev, curr) => {
      if (curr.turn_on) prev.on.add(curr.trader_id);
      else prev.off.add(curr.trader_id);
      return prev;
    },
    { on: new Set(''), off: new Set('') }
  );

  function handleChange(val: boolean) {
    const addField = val ? 'on' : 'off';
    const delField = val ? 'off' : 'on';
    onOff[addField].add(row.trader_id);
    onOff[delField].delete(row.trader_id);
    updateTraderSetting({
      open_trader_id_list: [...onOff.on],
      close_trader_id_list: [...onOff.off],
      product_type: productType
    }).then(res => {
      if (res.base_response?.code === 0) handleRefetch();
    });
  }

  return (
    <Tooltip
      placement="bottom"
      content={disabled ? '用户未绑定账号' : ''}
      destroyOnClose
    >
      {/* 表单元素被disabled后，浏览器会禁用掉该元素的所有事件，无法触发onMouseEnter导致提示没法出现。解决办法有readonly代替disabled或添加一个父元素。flex-1的作用是使单元格尺寸发生变化继而更新tooltip的位置 */}
      <div className="flex-center flex-1">
        <Switch
          tabIndex={-1}
          // 需要先有QQ，然后才能开启
          checked={!!row.trader_qq && row.turn_on}
          disabled={disabled}
          onChange={val => handleChange(val)}
        />
      </div>
    </Tooltip>
  );
};

const tdCls = '!border-0 pl-4 pr-3 leading-7';
export const reminderChannelColumns: ColumnDef<ReminderChannelColumns>[] = [
  columnHelper.display({
    id: 'trader_name',
    header: '姓名',
    cell: ({ row }) => row.original.trader_name,
    minSize: 250,
    meta: {
      columnKey: 'trader_name',
      align: 'left',
      thCls: 'ml-4 flex-1',
      tdCls: cx('ml-4 flex-1', tdCls)
    }
  }),

  columnHelper.display({
    id: 'inst_name',
    header: '机构名称',
    cell: ({ row }) => row.original.inst_name,
    minSize: 224,
    meta: {
      columnKey: 'inst_name',
      align: 'left',
      thCls: 'flex-1 min-w-[224px]',
      tdCls: cx('flex-1 min-w-[224px]', tdCls)
    }
  }),

  columnHelper.display({
    id: 'trader_qq',
    header: '账号',
    cell: ({ row }) => row.original.trader_qq ?? '-',
    minSize: 224,
    meta: {
      columnKey: 'trader_qq',
      align: 'left',
      thCls: 'flex-1 min-w-[224px]',
      tdCls: cx('flex-1 min-w-[224px]', tdCls)
    }
  }),

  columnHelper.display({
    id: 'turn_on',
    header: '开启/关闭',
    cell: ({ row }) => <TurnOnCell row={row.original} />,
    minSize: 100,
    meta: {
      columnKey: 'turn_on',
      align: 'center',
      tdCls: cx('flex-center', tdCls)
    }
  })
];

export const visibleColumns: (keyof ReminderChannelColumns)[] = ['trader_name', 'inst_name', 'trader_qq', 'turn_on'];
