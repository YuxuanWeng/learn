import cx from 'classnames';
import { Tabs } from '@fepkg/components/Tabs';
import { IconDeleteFilled, IconTender } from '@fepkg/icon-park-react';
import { FuzzySearchType, ProductType } from '@fepkg/services/types/enum';
import { WindowName } from 'app/types/window-v2';
import { GlobalSearch } from '@/components/business/GlobalSearch';
import { useGlobalSearchValue, useUpdateGlobalSearchValue } from '../../atoms/global-search';
import { useGlobalSearchObserver } from '../../hooks/useGlobalSearchObserver';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useMainGroupData } from '../../providers/MainGroupProvider';
import { useProductPanel } from '../../providers/PanelProvider';
import { ProductPanelTableKey } from '../../types';
import { TableContent } from './Table';

const observerNames = new Set([WindowName.MainHome, WindowName.ProductPanel]);

const tabs = [
  { key: ProductPanelTableKey.Basic, label: '投标中', icon: <IconTender /> },
  { key: ProductPanelTableKey.Referred, label: '已删除', icon: <IconDeleteFilled /> }
];

export const NCDPContent = ({ showMenu }: { showMenu?: boolean }) => {
  const { activeTableKey, setActiveTableKey, groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const searchValue = useGlobalSearchValue();
  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
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
          <GlobalSearch
            className="w-50"
            onlyRemote
            productType={ProductType.NCDP}
            placeholder="发行机构/操作人"
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
        <TableContent />
        <TableContent referred />
      </div>
    </div>
  );
};
