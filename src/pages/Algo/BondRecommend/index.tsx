import { FC, useState } from 'react';
import cx from 'classnames';
import { Tabs } from 'antd';
import { Input } from '@fepkg/components/Input';
import { IconSearch } from '@fepkg/icon-park-react';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { BCOBondRecommendBonds } from './BondListTab';
import { BCOBondRecommendTraderManagement } from './TraderManagementTab';
import { useTraderManegeMentSearchingValue } from './atoms';
import { BCORecommendSchemaInputProvider, BCORecommendTraderConfigListProvider } from './provider';
import { checkUnsaved } from './useTraderEditingConfig';
import styles from './style.module.less';

type TabType = 'bondRec' | 'traderManage';

export const getBCOBondRecommendDialogConfig = () => ({
  name: WindowName.BcoBondRecommend,
  options: { width: 1714, height: 960, minHeight: 800, minWidth: 1200 },
  custom: { route: CommonRoute.BondRecommend }
});

const BondRecommend: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('bondRec');
  const { cancel } = useDialogLayout();
  const [traderSearch, setTraderSearch] = useTraderManegeMentSearchingValue();
  const [traderManagementInitTraderID, setTraderManagementInitTraderID] = useState<string>();

  return (
    <div className="h-full flex flex-col">
      <BCORecommendTraderConfigListProvider>
        <DialogLayout.Header
          className="text-md"
          onCancel={() => {
            if (activeTab === 'traderManage') {
              checkUnsaved(cancel);
            } else {
              cancel();
            }
          }}
          controllers={['min', 'max', 'close']}
        >
          推券-信用债
        </DialogLayout.Header>
        <div className="flex-1 bg-gray-600 flex flex-col overflow-hidden">
          <div className={cx('flex justify-between items-center', styles['bond-rec-tab'])}>
            <Tabs
              className="px-6 mt-4 mr-6"
              activeKey={activeTab}
              onChange={v => {
                if (v === 'bondRec') {
                  checkUnsaved(() => setActiveTab(v as TabType));
                } else {
                  setActiveTab(v as TabType);
                }
              }}
            >
              <Tabs.TabPane
                tab="推券提醒"
                key="bondRec"
              />
              <Tabs.TabPane
                tab="交易员管理"
                key="traderManage"
              />
            </Tabs>
            {activeTab === 'traderManage' && (
              <Input
                className="ml-auto !w-[268px] h-8 mr-6"
                placeholder="请输入交易员姓名/机构简称"
                suffixIcon={<IconSearch />}
                value={traderSearch}
                onChange={setTraderSearch}
              />
            )}
          </div>
          <BCORecommendSchemaInputProvider>
            <BCOBondRecommendBonds
              isIdle={activeTab === 'traderManage'}
              onJumpToManagement={traderID => {
                setActiveTab('traderManage');
                setTraderManagementInitTraderID(traderID);
              }}
            />
          </BCORecommendSchemaInputProvider>
          {activeTab === 'traderManage' && (
            <BCOBondRecommendTraderManagement initTraderID={traderManagementInitTraderID} />
          )}
        </div>
      </BCORecommendTraderConfigListProvider>
    </div>
  );
};

export default BondRecommend;
