import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Institution } from '@fepkg/services/types/common';
import { BrokerSearch } from '@/components/business/Search/BrokerSearch';
import { TraderSearch } from '@/components/business/Search/TraderSearch';
import { useITBSearchConnector } from '@/components/business/Search/providers/ITBSearchConnectorProvider';
import { MAX_BRIDGES_LENGTH, ReceiptDealBridgeState, useReceiptDealBridge } from '../../providers/BridgeProvider';

export const DealBridge = ({ index }: { index: number }) => {
  const { instRefs, bridgeDisabled, bridges, addBridge, deleteBridge, updateBridge } = useReceiptDealBridge();

  const { handleInstChange, handleTraderChange, handleBrokerChange } = useITBSearchConnector();
  const { instSearchState } = useInstSearch();

  const bridge = bridges[index];

  const inst = instSearchState.selected?.original;
  const city = inst?.district_name ?? (inst as Institution)?.area?.name ?? '-';

  return (
    <div className="flex flex-col gap-2 w-[152px]">
      <InstSearch
        ref={el => {
          if (el) instRefs.current[index] = el;
        }}
        label=""
        className="h-7 bg-gray-800"
        placeholder="机构"
        disabled={bridgeDisabled}
        error={bridge?.instError}
        onChange={opt => {
          handleInstChange(opt, (i, t, b) => {
            const updated: Partial<ReceiptDealBridgeState> = {
              inst_id: i?.inst_id,
              instName: i?.short_name_zh,
              trader_id: t?.trader_id,
              traderName: t?.name_zh,
              broker_id: b?.user_id
            };
            if (opt) updated.instError = false;

            updateBridge(index, updated);
          });
        }}
      />

      <div className="flex h-7 px-3 text-sm/7 bg-gray-600 rounded-lg truncate">
        <Tooltip
          truncate
          content={city}
        >
          <div className="text-gray-000 truncate">{city}</div>
        </Tooltip>
      </div>

      <TraderSearch
        label=""
        className="h-7 bg-gray-800"
        placeholder="交易员"
        searchParams={{ need_area: true }}
        disabled={bridgeDisabled}
        error={bridge?.traderError}
        onChange={opt => {
          handleTraderChange(opt, undefined, (i, t, b) => {
            const updated: Partial<ReceiptDealBridgeState> = {
              inst_id: i?.inst_id,
              instName: i?.short_name_zh,
              trader_id: t?.trader_id,
              traderName: t?.name_zh,
              broker_id: b?.user_id
            };
            if (opt) updated.traderError = false;

            updateBridge(index, updated);
          });
        }}
      />

      <BrokerSearch
        label=""
        className="h-7 bg-gray-800"
        placeholder="经纪人"
        disabled={bridgeDisabled}
        error={bridge?.brokerError}
        onChange={opt => {
          handleBrokerChange(opt);

          const updated: Partial<ReceiptDealBridgeState> = { broker_id: opt?.original.user_id };
          if (opt) updated.brokerError = false;

          updateBridge(index, updated);
        }}
      />

      <div className="flex-center gap-3">
        <Button
          className="w-[70px] h-7"
          type="gray"
          plain
          disabled={bridgeDisabled}
          onClick={() => deleteBridge(index)}
        >
          删除
        </Button>

        {bridges.length < MAX_BRIDGES_LENGTH && (
          <Button
            className="w-[70px] h-7"
            type="gray"
            plain="primary"
            disabled={bridgeDisabled}
            onClick={() => addBridge(index)}
          >
            加桥
          </Button>
        )}
      </div>
    </div>
  );
};
