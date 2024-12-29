import cx from 'classnames';
import { useAtomValue } from 'jotai';
import { activeTab } from '../atom';
import { ReminderTabsEnum } from '../type';
import { LogicsConfig } from './components/LogicsConfig';
import { ReminderChannel } from './components/ReminderChannel';
import { ReminderConfigProvider } from './provider';
import './tableStyle.less';

const Inner = () => {
  const activeTabKey = useAtomValue(activeTab);
  // 这里隐藏用hidden解决不了表格宽度变化的问题
  const displayCls = activeTabKey === ReminderTabsEnum.ConfigTab ? 'h-full pt-3' : 'h-0 opacity-0';

  return (
    <div className={cx('flex flex-col gap-3 px-3 pb-3', displayCls)}>
      <LogicsConfig />
      <ReminderChannel />
    </div>
  );
};

export const RemindConfig = () => {
  return (
    <ReminderConfigProvider>
      <Inner />
    </ReminderConfigProvider>
  );
};
