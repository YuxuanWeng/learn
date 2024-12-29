import { Button } from '@fepkg/components/Button';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useMaximize } from '@/common/hooks/useMaximize';
import { Action } from '@/components/AppBar/Action';
import { DraggableHeader } from '@/components/HeaderBar';
import { RenameTabs } from '@/components/RenameTabs';
import { useProductParams } from '@/layouts/Home/hooks';
import { usePanelState } from '@/pages/Spot/Panel/Providers/PanelStateProvider';
import { BondTabs } from '@/pages/Spot/types';
import { getIDCDealDetailConfig } from '@/pages/Spot/utils/openDialog';
import { getSpotHistoryRecordsConfig } from '../../HistoryRecords/utils';

const SpotAppBar = () => {
  const { toggleMaximize } = useMaximize();
  const { accessCache, bondsCache, activeBondTabId, setActiveBondTabId, handleBondTabNameChange } = usePanelState();
  const { openDialog } = useDialogWindow();

  const { productType } = useProductParams();

  return (
    <DraggableHeader onDoubleClick={toggleMaximize}>
      <div className="flex items-center justify-between bg-gray-800 h-10 w-full pl-4 border border-solid border-transparent border-b-gray-600">
        <RenameTabs<BondTabs>
          baseLine
          maxLength={10}
          items={Object.values(bondsCache)}
          defaultActiveKey={Object.values(bondsCache)[0]?.key}
          activeKey={activeBondTabId}
          onChange={val => {
            setActiveBondTabId(val.key);
          }}
          onRename={handleBondTabNameChange}
        />
        <div className="flex items-center">
          {accessCache.dealDetail && (
            <Button
              className="mr-4 w-22 h-7"
              ghost
              type="gray"
              size="xs"
              text
              onClick={() => {
                openDialog(getIDCDealDetailConfig(productType));
              }}
              onDoubleClick={e => {
                e.stopPropagation();
              }}
            >
              明细
            </Button>
          )}
          {accessCache.history && (
            <Button
              className="w-22 h-7"
              ghost
              type="gray"
              size="xs"
              text
              onClick={() => {
                openDialog(getSpotHistoryRecordsConfig());
              }}
              onDoubleClick={e => {
                e.stopPropagation();
              }}
            >
              历史记录
            </Button>
          )}

          <Action />
        </div>
      </div>
    </DraggableHeader>
  );
};

export default SpotAppBar;
