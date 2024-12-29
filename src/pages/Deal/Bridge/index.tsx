import { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { Placeholder } from '@fepkg/components/Placeholder';
import { ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { ReceiptDealStatus, SettlementLabel, Side } from '@fepkg/services/types/bds-enum';
import { usePrevious } from '@dnd-kit/utilities';
import { EditBridgeModal } from '@/components/EditBridge';
import { Source } from '@/components/EditBridge/types';
import {
  getBatchParams,
  getBridgeInstSendMsg,
  transReceiptDealDetailToMulModalState,
  transReceiptDealDetailToSingleModalState
} from '@/components/EditBridge/utils';
import { BridgeDetail } from '@/components/IDCBridge/BridgeDetail';
import { BridgeInstList } from '@/components/IDCBridge/BridgeInstList';
import { EditBridgeInstModal } from '@/components/IDCBridge/EditBridgeInst';
import OrderDetails from '@/components/IDCBridge/OrderDetails';
import { SearchFilter } from '@/components/IDCBridge/SearchFilter';
import { SettlementTab } from '@/components/IDCBridge/SettlementTypeTab';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  BridgeDialogContext,
  BridgeReceiptDealListFilter,
  DateType,
  EditBridgeMode,
  EditBridgeType
} from '@/pages/Deal/Bridge/types';
import { addBridgeByInternalCode } from '../../Spot/utils/bridge';
import { getBirderEditState } from '../Detail/utils';
import useBridge from './hooks/useBridge';
import { useBridgeInstList } from './hooks/useBridgeInstList';
import { useBridgeReceiptDeals } from './hooks/useBridgeReceiptDeals';
import { BridgeProvider, useBridgeContext } from './providers/BridgeProvider';
import { searchFilterMatch } from './utils';

const Panel = () => {
  // 获取唤起时带的桥机构Id
  const context = useContext<BridgeDialogContext>(DialogContext);

  const { productType } = useProductParams();

  const {
    bridgeVisible,
    setBridgeVisible,
    bridgeOnSubmit,
    bridgeOnCancel,
    updateBridge,
    delBridge,
    bridgeModify,
    setBridgeModify,
    bridge
  } = useBridge();

  const { bridgeList } = useBridgeInstList();

  const {
    activeTab,
    innerReceiptDealDetailRef,
    setActiveTab,
    parentDealIds: selectedDealIds,
    setParentDealIds,
    setBridge,
    batchModalVisible,
    setBatchModalVisible
  } = useBridgeContext();

  const prevBridgeList = usePrevious(bridgeList);
  const prevBridgeInstId = usePrevious(context?.bridgeInstId);

  // 通过context传入的桥id设置初始选中的桥
  useEffect(() => {
    if (bridgeList.length !== 0 && (prevBridgeList?.length === 0 || prevBridgeInstId !== context?.bridgeInstId)) {
      const initBridge = bridgeList.find(b => b.bridge_inst_id === context?.bridgeInstId);

      if (initBridge != null) {
        setBridge(initBridge);
        setBridgeVisible(false);
        setBridgeModify(false);
        setParentDealIds(undefined);
      }
    }
  }, [prevBridgeList, bridgeList, context?.bridgeInstId, prevBridgeInstId, setBridge]);

  const [filter, setFilter] = useState<BridgeReceiptDealListFilter>({
    dateParams: { type: DateType.RecordDay, value: '' }
  });

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { data, refetch } = useBridgeReceiptDeals({
    product_type: productType,
    bridge_inst_id: bridge?.bridge_inst_id ?? '',
    deal_date:
      filter.dateParams.type === DateType.RecordDay && filter.dateParams.value ? filter.dateParams.value : undefined,
    traded_date:
      filter.dateParams.type === DateType.TradeDay && filter.dateParams.value ? filter.dateParams.value : undefined,
    my_bridge: filter.myBridge,
    intelligence_sorting: filter.intelligenceSorting
  });

  const list = useMemo(() => {
    const curList: ReceiptDealDetail[] | undefined = {
      [SettlementLabel.SettlementLabelOther]: data?.other_receipt_deals?.filter(i => (i.details?.length ?? 0) > 1),
      [SettlementLabel.SettlementLabelToday]: data?.today_receipt_deals?.filter(i => (i.details?.length ?? 0) > 1),
      [SettlementLabel.SettlementLabelTomorrow]: data?.tomorrow_receipt_deals?.filter(i => (i.details?.length ?? 0) > 1)
    }[activeTab];

    return curList ?? [];
  }, [data, activeTab]);

  const selectedItems = useMemo(
    () => list.filter(i => selectedKeys.includes(i.parent_deal.parent_deal_id ?? '')),
    [list, selectedKeys]
  );

  const highlightItems = useMemo(() => list.filter(i => searchFilterMatch(filter, i)), [filter, list]);

  const { mode, type, enable } = getBirderEditState(selectedItems);

  const parentDealIds = selectedItems
    .filter(
      v =>
        !(
          !!v.details?.[0].destroy_reason &&
          (v.details?.[0].receipt_deal_status === ReceiptDealStatus.ReceiptDealSubmitApproval ||
            v.details?.[0].receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeExamined)
        )
    )
    .map(v => v.parent_deal.parent_deal_id)
    .filter(Boolean);

  /** 批量编辑桥参数 */
  const batchEditDefaultValue = getBatchParams(
    innerReceiptDealDetailRef.current ?? selectedItems,
    bridge?.contact_inst.inst_id
  );

  const senMessages = getBridgeInstSendMsg(bridgeList, selectedItems[0]);

  const { addBridge } = useBridge();

  const onSearch = (params: BridgeReceiptDealListFilter) => {
    const getTabByIndex = (index: number) => {
      let tab = SettlementLabel.SettlementLabelToday;

      if (index >= (data?.today_receipt_deals ?? []).length) {
        tab = SettlementLabel.SettlementLabelTomorrow;
      }

      if (index >= (data?.today_receipt_deals ?? []).length + (data?.tomorrow_receipt_deals ?? []).length) {
        tab = SettlementLabel.SettlementLabelOther;
      }

      return tab;
    };

    const fullList = [
      ...(data?.today_receipt_deals ?? []),
      ...(data?.tomorrow_receipt_deals ?? []),
      ...(data?.other_receipt_deals ?? [])
    ];
    const prevIndex =
      selectedItems.length !== 1
        ? -1
        : fullList.findIndex(
            (i, index) =>
              selectedKeys.includes(i.parent_deal.parent_deal_id ?? '') && getTabByIndex(index) === activeTab
          );

    const restList = prevIndex === -1 ? fullList : fullList.slice(prevIndex + 1);

    let nextIndex = restList.findIndex(item => searchFilterMatch(params, item)) + prevIndex + 1;

    if (nextIndex === prevIndex) {
      nextIndex = fullList.findIndex(item => searchFilterMatch(params, item));

      if (nextIndex === -1) {
        setSelectedKeys([]);
      }
    }

    setActiveTab(getTabByIndex(nextIndex));

    const next = fullList[nextIndex];

    if (next?.parent_deal.parent_deal_id != null) setSelectedKeys([next.parent_deal.parent_deal_id]);
  };

  const enableModal = selectedDealIds?.length && mode === EditBridgeMode.Single && enable;

  const oneEnable = enableModal && type === EditBridgeType.One;
  const mulEnable = enableModal && type === EditBridgeType.Mul;

  const handleEditBridgeClose = () => {
    refetch();
    setBatchModalVisible(false);
    setParentDealIds(void 0);
    innerReceiptDealDetailRef.current = undefined;
  };

  return (
    <>
      <DialogLayout.Header
        controllers={['min', 'max', 'close']}
        keyboard={false}
      >
        <Dialog.Header>过桥</Dialog.Header>
      </DialogLayout.Header>
      <div
        className="p-3 h-full bg-gray-700 flex flex-col w-full overflow-hidden"
        onDragOver={event => {
          event.preventDefault();
        }}
      >
        <SearchFilter
          filter={filter}
          onFilterChange={setFilter}
          onSearch={onSearch}
        />
        {bridgeList == null || bridgeList.length !== 0 ? (
          <div className="border border-solid border-gray-500 rounded-lg flex-1 overflow-hidden">
            <div className="flex flex-1 h-full overflow-hidden">
              <BridgeInstList
                className="rounded-r-none !bg-gray-700 border-0 border-solid border-r flex-shrink-0 border-gray-500"
                inputClassName="!bg-gray-800 focus-within:!bg-primary-700"
              />
              {bridgeList.length ? (
                <div
                  id="bridge-inst-container"
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <BridgeDetail
                    onModify={updateBridge}
                    onDel={delBridge}
                    onAddRecord={ids => {
                      if (bridge == null) return;
                      addBridgeByInternalCode({ bridgeInst: bridge, internalCodeList: ids, refetch, productType });
                    }}
                  />
                  <SettlementTab data={data} />
                  <OrderDetails
                    refetch={refetch}
                    list={list}
                    selectedItems={selectedItems}
                    highlightItems={highlightItems}
                    onSelect={items => {
                      setSelectedKeys(items.map(i => i.parent_deal.parent_deal_id ?? ''));
                    }}
                  />
                </div>
              ) : (
                ''
              )}
            </div>

            {/* 单桥编辑 */}
            {oneEnable && (
              <EditBridgeModal.Single
                onClose={handleEditBridgeClose}
                visible={!!selectedDealIds[0]}
                defaultSendMsg={senMessages.find(Boolean)?.sendMsg}
                {...transReceiptDealDetailToSingleModalState(
                  innerReceiptDealDetailRef.current?.[0] ?? selectedItems[0],
                  Source.Bridge
                )}
              />
            )}

            {/* 多桥编辑 */}
            {mulEnable && (
              <EditBridgeModal.Mul
                onClose={handleEditBridgeClose}
                defaultSendMsg={senMessages.filter(Boolean)}
                visible={!!selectedDealIds[0]}
                {...transReceiptDealDetailToMulModalState(
                  innerReceiptDealDetailRef.current?.[0] ?? selectedItems[0],
                  Source.Bridge,
                  bridge?.contact_trader.trader_id
                )}
              />
            )}

            {/* 批量桥编辑 */}
            {batchModalVisible && mode === EditBridgeMode.Batch && (
              <EditBridgeModal.Batch
                onClose={handleEditBridgeClose}
                visible={batchModalVisible}
                parentDealIds={parentDealIds}
                bidDirectConnectionDealIds={batchEditDefaultValue.bidDirectConnectionDealIds}
                ofrDirectConnectionDealIds={batchEditDefaultValue.ofrDirectConnectionDealIds}
                defaultBridgeValue={{
                  bid_send_msg: bridge?.send_msg,
                  ofr_send_msg: bridge?.send_msg,
                  bid_bridge_direction: batchEditDefaultValue[Side.SideBid].bridgeDirection,
                  ofr_bridge_direction: batchEditDefaultValue[Side.SideOfr].bridgeDirection,
                  bidBridgeDirectionDisabled: batchEditDefaultValue[Side.SideBid].bidBridgeDirectionDisabled,
                  ofrBridgeDirectionDisabled: batchEditDefaultValue[Side.SideOfr].ofrBridgeDirectionDisabled,
                  inst: bridge?.contact_inst
                    ? { ...bridge.contact_inst, inst_id: bridge?.bridge_inst_id ?? '' }
                    : undefined,
                  trader: bridge?.contact_trader
                }}
                defaultTradeValue={batchEditDefaultValue}
              />
            )}
          </div>
        ) : (
          <div className="flex-center flex-col flex-1">
            <Placeholder
              className="flex-grow-0 mb-4"
              type="no-setting"
              label="暂未配置桥机构，请点击下方按钮添加桥机构"
            />
            <Button
              ghost
              onClick={addBridge}
            >
              添加桥机构
            </Button>
          </div>
        )}
        <EditBridgeInstModal
          visible={bridgeVisible}
          bridge={bridge}
          isModify={bridgeModify}
          onSubmit={bridgeOnSubmit}
          onCancel={bridgeOnCancel}
        />
      </div>
    </>
  );
};

export default function Bridge() {
  return (
    <BridgeProvider>
      <Panel />
    </BridgeProvider>
  );
}
