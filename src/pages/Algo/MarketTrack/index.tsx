import { useEffect } from 'react';
import { MarketTrackEnum } from '@fepkg/business/constants/log-map';
import { Dialog } from '@fepkg/components/Dialog';
import { Tabs } from '@fepkg/components/Tabs';
import { useAtom } from 'jotai';
import { trackPoint } from '@/common/utils/logger/point';
import { DialogLayout } from '@/layouts/Dialog';
import { PriceRemind } from './PriceRemind';
import { RemindConfig } from './ReminderConfig';
import { activeTab } from './atom';
import { ReminderTabsEnum } from './type';

const remindTabs = [
  { key: ReminderTabsEnum.RemindTab, label: '行情追踪' },
  { key: ReminderTabsEnum.ConfigTab, label: '提醒配置' }
];

const MarketTrack = () => {
  const [activeKey, setActiveKey] = useAtom(activeTab);

  useEffect(() => {
    trackPoint(MarketTrackEnum.Enter);
  }, []);

  return (
    <>
      <DialogLayout.Header
        keyboard={false}
        controllers={['min', 'max', 'close']}
      >
        <Dialog.Header>行情追踪</Dialog.Header>
      </DialogLayout.Header>
      <Dialog.Body style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <div className="flex justify-between pt-3 px-3">
          <div className="bg-gray-800 rounded-lg">
            <Tabs
              defaultActiveKey={remindTabs[0].key}
              activeKey={activeKey}
              onChange={val => setActiveKey(val.key)}
              items={remindTabs}
            />
          </div>
        </div>
        <div className="h-[calc(100%_-_48px)]">
          <PriceRemind />
          <RemindConfig />
        </div>
      </Dialog.Body>
    </>
  );
};

export default MarketTrack;
