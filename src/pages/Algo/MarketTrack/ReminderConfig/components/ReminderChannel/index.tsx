import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Table } from '@fepkg/components/Table';
import { IconReset } from '@fepkg/icon-park-react';
import { CONTAINER_CLS, CONTENT_CLS, baseTableProps } from '../../constants';
import { Header } from '../Header';
import { ReminderChannelProvider, useReminderChannel } from './ReminderChannelProvider';
import { TraderSettingFilter } from './TraderSettingFilter';
import { reminderChannelColumns, visibleColumns } from './columns';

const Inner = () => {
  // 暂时去掉选中功能
  // const [selected, setSelected] = useState<Set<string>>();
  const { traderSetting, handleRefetch } = useReminderChannel();

  return (
    <div className={CONTAINER_CLS}>
      <Header
        title="提醒渠道管理"
        type="orange"
        behindTitle={
          <Button.Icon
            className="inline-block ml-0.5"
            onClick={() => handleRefetch()}
            icon={<IconReset className="pt-0.5" />}
          />
        }
        leftNode={<TraderSettingFilter />}
      />
      <div className={cx(CONTENT_CLS, 'h-[calc(100%_-_43px)]')}>
        <Table
          // 这里需要一个relative，否则会出现表格空状态异常的情况
          className="relative remind-config-table"
          data={traderSetting}
          placeholderSize="xs"
          columns={reminderChannelColumns}
          columnVisibleKeys={visibleColumns}
          rowKey={row => row.trader_id}
          // selectedKeys={selected}
          // onSelect={setSelected}
          {...baseTableProps}
        />
      </div>
    </div>
  );
};

export const ReminderChannel = () => {
  return (
    <ReminderChannelProvider>
      <Inner />
    </ReminderChannelProvider>
  );
};
