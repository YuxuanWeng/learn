import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Tabs } from '@fepkg/components/Tabs';
import {
  IconBond,
  IconDeleteFilled,
  IconMarketTransaction,
  IconNewWindow,
  IconPankou,
  IconRealTimeQuotation
} from '@fepkg/icon-park-react';
import { FuzzySearchType } from '@fepkg/services/types/enum';
import { WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { GlobalSearch } from '@/components/business/GlobalSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { getDealRecommendDialogConfig } from '@/pages/Deal/Market/MarketDealRecommend/utils';
import { DealContent } from '@/pages/ProductPanel/components/Content/Deal';
import { useGlobalSearchValue, useUpdateGlobalSearchValue } from '../../atoms/global-search';
import { useGlobalSearchObserver } from '../../hooks/useGlobalSearchObserver';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { BasicContent } from './Basic';
import { BondContent } from './Bond';
import { OptimalContent } from './Optimal';
import { ReferredContent } from './Referred';

const observerNames = new Set([
  WindowName.MainHome,
  WindowName.ProductPanel,
  WindowName.CollaborativeQuote,
  WindowName.MarketRecommend
]);

const tabs = [
  { key: ProductPanelTableKey.Basic, label: '实时报价', icon: <IconRealTimeQuotation /> },
  { key: ProductPanelTableKey.Optimal, label: '实时盘口', icon: <IconPankou /> },
  { key: ProductPanelTableKey.Bond, label: '债券列表', icon: <IconBond /> },
  { key: ProductPanelTableKey.Deal, label: '市场成交', icon: <IconMarketTransaction /> },
  { key: ProductPanelTableKey.Referred, label: '作废报价', icon: <IconDeleteFilled /> }
];

export const Content = ({ showMenu }: { showMenu?: boolean }) => {
  const { productType, panelId } = useProductParams();
  const { activeTableKey, setActiveTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const searchValue = useGlobalSearchValue();
  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { openDialog } = useDialogWindow();
  useGlobalSearchObserver(observerNames);

  return (
    <div className={cx('flex flex-col flex-1 border-0 border-solid border-gray-600', showMenu && 'border-l')}>
      <div className="flex items-center justify-between px-3 h-12">
        <Tabs
          items={tabs}
          defaultActiveKey={tabs[0].key}
          activeKey={activeTableKey}
          onChange={item => setActiveTableKey(item.key)}
        />

        <div className="flex gap-2">
          {/* 当前页签为市场成交时，需要展示市场成交悬浮窗的入口 */}
          {activeTableKey === ProductPanelTableKey.Deal && (
            <Button.Icon
              icon={<IconNewWindow />}
              className="h-8 w-8"
              onClick={() => {
                openDialog(getDealRecommendDialogConfig(productType, { panelId }));
              }}
            />
          )}

          <GlobalSearch
            className="w-50"
            needInvalid
            productType={productType}
            searchType={FuzzySearchType.MainPage}
            value={searchValue}
            onSearch={(val, selected) =>
              updateGlobalSearch({ groupId: activeGroup?.groupId, inputFilter: val, selected })
            }
            onClear={() => updateGlobalSearch({ groupId: activeGroup?.groupId })}
          />
        </div>
      </div>

      <div className="h-px component-dashed-x-600" />

      <div className="flex flex-col flex-1">
        <BasicContent />
        <OptimalContent />
        <BondContent />
        <DealContent />
        <ReferredContent />
      </div>
    </div>
  );
};
