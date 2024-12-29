import cx from 'classnames';
import { DraggableTable } from '@fepkg/components/Table';
import { CONTAINER_CLS, CONTENT_CLS, baseTableProps } from '../../constants';
import { useMutationSetting } from '../../hooks/useMutationSetting';
import { useReminderConfig } from '../../provider';
import { Header } from '../Header';
import { LogicsConfigColumns, visibleColumns } from './columns';

export const LogicsConfig = () => {
  const { notifyLogics } = useReminderConfig();
  const { update } = useMutationSetting();

  // 暂时去掉选中功能
  // const [selected, setSelected] = useState<Set<string>>();

  return (
    <div className={CONTAINER_CLS}>
      <Header title="逻辑话术配置" />
      <div className={cx(CONTENT_CLS, 'h-[calc(100%_-_44px)]')}>
        <DraggableTable
          className="relative remind-config-table"
          data={notifyLogics}
          placeholderSize="xs"
          columns={LogicsConfigColumns}
          columnVisibleKeys={visibleColumns}
          // selectedKeys={selected}
          // onSelect={setSelected}
          // 更新时不应该有id
          onDrag={val => update({ notify_logic: val.map(i => ({ ...i, id: void 0 })) })}
          {...baseTableProps}
          // 这里需要一个对标每一行的id，否则位置移动后选中状态不会跟着移动
          rowKey={row => row.id}
          copyEnabled
        />
      </div>
    </div>
  );
};
