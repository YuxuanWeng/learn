import { SettlementLabel } from '@fepkg/services/types/enum';
import { ReceiptDealDetailSearchByBridgeInst } from '@fepkg/services/types/receipt-deal/detail-search-by-bridge-inst';
import { useSetAtom } from 'jotai';
import { selectedRecordIdsAtom } from '@/pages/Deal/Bridge/atoms';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { tabList } from '@/pages/Deal/Bridge/utils';
import { TabComp } from '../TabComp';

export const SettlementTab = ({ data }: { data?: ReceiptDealDetailSearchByBridgeInst.Response }) => {
  const { activeTab, setActiveTab } = useBridgeContext();
  const setSelectedBridgeRecordIds = useSetAtom(selectedRecordIdsAtom);

  const amountMap = {
    [SettlementLabel.SettlementLabelToday]: data?.today_receipt_deals?.length ?? 0,
    [SettlementLabel.SettlementLabelTomorrow]: data?.tomorrow_receipt_deals?.length ?? 0,
    [SettlementLabel.SettlementLabelOther]: data?.other_receipt_deals?.length ?? 0
  };

  return (
    <TabComp
      items={tabList.map(i => ({ ...i, amount: amountMap[i.key] ?? 0 }))}
      activeKey={activeTab}
      onItemClick={item => {
        setActiveTab(item.key);
        setSelectedBridgeRecordIds([]);
      }}
    />
  );
};
