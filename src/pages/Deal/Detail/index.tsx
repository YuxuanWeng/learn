import { useMemo, useRef, useState } from 'react';
import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { InstSearchProvider, transform2AgencyInstOpt } from '@fepkg/business/components/Search/InstSearch';
import { PopoverPosition } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { SubMenu } from '@fepkg/components/ContextMenu';
import { Dialog } from '@fepkg/components/Dialog';
import { message } from '@fepkg/components/Message';
import { IconMenuFold } from '@fepkg/icon-park-react';
import { ReceiptDealDetail } from '@fepkg/services/types/common';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { mulResetBridgeInfo } from '@/common/services/api/bridge/mul-reset-bridge-info';
import { EditBridgeModal } from '@/components/EditBridge';
import { Source } from '@/components/EditBridge/types';
import {
  getBridgeInstSendMsg,
  isNeedResetBridge,
  showResetModal,
  transReceiptDealDetailToMulModalState,
  transReceiptDealDetailToNoneModalState,
  transReceiptDealDetailToSingleModalState
} from '@/components/EditBridge/utils';
import { BridgeInstList } from '@/components/IDCBridge/BridgeInstList';
import { BridgeModal } from '@/components/IDCBridge/BridgeModal';
import { DealDetailMessageEditModal } from '@/components/IDCBridge/DealDetailMessageEditModal';
import { EditBridgeInstModal } from '@/components/IDCBridge/EditBridgeInst';
import { ContextMenu, MenuItem } from '@/components/IDCDealDetails/ContextMenu';
import { Container } from '@/components/IDCDealDetails/DealContent/Container';
import { DealContainerProvider } from '@/components/IDCDealDetails/DealContent/DealContainerProvider';
import { VSConnectProvider, useVSConnect } from '@/components/IDCDealDetails/DealContent/VSConnectProvider';
import { VirtualListProvider } from '@/components/IDCDealDetails/DealContent/VirtualListProvider';
import { SearchFilter } from '@/components/IDCDealDetails/SearchFilter';
import { FilterStateProvider, useFilter } from '@/components/IDCDealDetails/SearchFilter/providers/FilterStateProvider';
import { HistoryStackProvider } from '@/components/IDCDealDetails/SearchFilter/providers/HistoryStackProvider';
import { useContextMenu } from '@/components/IDCDealDetails/hooks/useContextMenu';
import { ContextMenuEnum } from '@/components/IDCDealDetails/type';
import { InstTraderSearchProvider } from '@/components/business/Search/InstTraderSearch';
import { DialogLayout } from '@/layouts/Dialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import useBridge from '@/pages/Deal/Bridge/hooks/useBridge';
import { BridgeProvider, useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { useDealDetailBridgeEdit } from '@/pages/Deal/Detail/hooks/useDealDetailBridgeEdit';
import { useKeyboard } from '@/pages/ProductPanel/hooks/useKeyboard';
import { getBridgeNumber } from '@/pages/Spot/utils/bridge';
import { useBridgeInstList } from '../Bridge/hooks/useBridgeInstList';
import { ArrowAreaEnum, EditBridgeMode } from '../Bridge/types';
import { getRelatedBridgeInstIds } from '../Bridge/utils';
import { AgencyProvider } from './components/AgentModal/provider';
import { DealBrokers } from './components/Brokers';
import { DiffModal } from './components/DiffModal.tsx';
import { GroupConfigProvider } from './components/GroupSettingModal/provider';
import { SettingGroup } from './components/HeadBar';
import { DealPanelProvider, useDealPanel } from './provider';
import { checkIsDestroyedDeal, getBirderEditState, transToShowBrokerStruct } from './utils';

// 成交明细中会出现toast多个的需求
message.config({ maxCount: 20 });

const DealDetailsInner = () => {
  const {
    bridgeVisible,
    bridgeOnSubmit,
    bridgeOnCancel,
    bridgeModify,
    bridge,
    visibleBridgeModal,
    setVisibleBridgeModal
  } = useBridge();

  const innerReceiptDealDetailRef = useRef<ReceiptDealDetail>();

  const [confirmViewLoading, setConfirmViewLoading] = useState(false);

  const { editBridgeVisible, agentVisible, setEditBridgeVisible, messageEditValue, setMessageEditValue } =
    useDealPanel();
  const { bridgeList } = useBridgeInstList();
  const { contentList, selectedDeals, queryResult, containerRef, openBrokers, updateOpenBrokers } = useFilter();
  const { refetch } = queryResult;

  const formatBrokers = useMemo(() => contentList.map(transToShowBrokerStruct), [contentList]);

  const birderEditState = getBirderEditState(selectedDeals);
  const parentDealId = selectedDeals[0]?.parent_deal?.parent_deal_id;

  const {
    addSingleBridge,
    handleChangeBridge,
    handleCancelBridge,
    showBridgeSearchModal,
    handleDelBridge,
    sendMessageEdit
  } = useDealDetailBridgeEdit({
    dealList: selectedDeals,
    refetchFn: refetch,
    setVisibleBridgeModal
  });

  const {
    accessCache,
    selectedBrokerId,
    diff,
    bridgeListVisible,
    setBridgeListVisible,
    setSelectedBrokerId,
    closeDiffModal,
    handleDiffModalConfirm
  } = useDealPanel();

  const [anchorPoint, setAnchorPoint] = useState<PopoverPosition>({ x: 0, y: 0 });
  const senMessages = getBridgeInstSendMsg(bridgeList, selectedDeals[0]);

  const resetBridge = async () => {
    if (!parentDealId) return;
    const result = await mulResetBridgeInfo({
      parent_receipt_deal_ids: [parentDealId],
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTResetBridge,
        operation_source: OperationSource.OperationSourceReceiptDealDetail
      }
    });
    innerReceiptDealDetailRef.current = result.receipt_deal_detail_list?.[0];
    setEditBridgeVisible(true);
  };

  const openMessageEditModal = () => {
    if (checkIsDestroyedDeal(selectedDeals)) return;
    const deal = selectedDeals[0];
    if (deal) {
      setMessageEditValue(deal);
    }
  };

  const openBridgeEditModal = () => {
    if (!selectedDeals.length || selectedDeals.length > 1) return;

    if (!accessCache.bridgeEdit) return;

    const bridgeNum = getBridgeNumber(selectedDeals[0]?.details);
    const needBridge = selectedDeals[0].parent_deal.flag_need_bridge;
    if (needBridge && bridgeNum === 0) {
      message.error('当前成交待加桥！');
      return;
    }
    innerReceiptDealDetailRef.current = undefined;
    if (checkIsDestroyedDeal(selectedDeals)) return;

    if (bridgeNum > 0 && senMessages.includes(undefined)) {
      message.error('选择成交存在未维护的桥机构！');
      return;
    }
    if (bridgeNum > 0 && isNeedResetBridge(selectedDeals)) showResetModal(resetBridge);
    else setEditBridgeVisible(true);
  };

  const onContextItemClick = useMemoizedFn((item: ContextMenuEnum) => {
    switch (item) {
      case ContextMenuEnum.AddBridge:
        showBridgeSearchModal(ContextMenuEnum.AddBridge);
        break;
      case ContextMenuEnum.ChangeBridge:
        showBridgeSearchModal(ContextMenuEnum.ChangeBridge);
        break;
      case ContextMenuEnum.DeleteBridge:
        handleDelBridge();
        break;
      case ContextMenuEnum.ModifySendMessage:
        openMessageEditModal();
        break;
      default:
        break;
    }
  });

  const { scrollToBroker } = useVSConnect();

  const {
    contextMenuOptions,
    contextMenuVisible,

    handleContextMenu,
    setContextMenuVisible,
    handleCheckedContextOption
  } = useContextMenu(onContextItemClick);

  useKeyboard({
    onEscDown: () => {
      if (contextMenuVisible) setContextMenuVisible(false);
    }
  });

  // 当前选中项的桥idList
  const invalidBridgeList = useMemo(() => {
    if (selectedDeals.length !== 1) return [];

    return getRelatedBridgeInstIds(selectedDeals?.at(0));
  }, [selectedDeals]);

  const EditModalEnable =
    editBridgeVisible && parentDealId && birderEditState.enable && birderEditState.mode === EditBridgeMode.Single;

  const bridgeNum = getBridgeNumber(selectedDeals[0]?.details);

  const { activeArea, setActiveArea } = useBridgeContext();

  const handleEditBridgeClose = () => {
    refetch();
    setEditBridgeVisible(false);
    innerReceiptDealDetailRef.current = undefined;
  };

  const handleViewConfirm = async () => {
    setConfirmViewLoading(true);
    try {
      await handleDiffModalConfirm();
    } finally {
      setConfirmViewLoading(false);
    }
    refetch();
  };

  /** 清空经纪人列表的选中态 */
  const resetBroker = () => {
    const brokerId = miscStorage.userInfo?.user_id;
    setSelectedBrokerId(miscStorage.userInfo?.user_id);
    if (brokerId) scrollToBroker(brokerId);
  };

  /** 回复明细分组的折叠展开状态 */
  const resetOpenBrokers = () => {
    const me = miscStorage.userInfo?.user_id;
    const brokersOpenState = openBrokers.map(v => {
      if (v.userId === me) return { userId: v.userId, isOpen: true };
      return { userId: v.userId, isOpen: false };
    });
    updateOpenBrokers(brokersOpenState);
  };

  /** 清空筛选条件 */
  const handleResetFilter = useMemoizedFn(() => {
    resetBroker();
    resetOpenBrokers();
  });

  const handleBrokerChange = useMemoizedFn((brokerId?: string) => {
    setSelectedBrokerId(brokerId);
    if (!brokerId) return;

    updateOpenBrokers(oldBrokers => {
      const newBrokers = oldBrokers.map(item => ({ userId: item.userId, isOpen: false }));
      const targetItem = newBrokers.find(item => item.userId === brokerId);

      if (targetItem) targetItem.isOpen = true;
      else newBrokers.push({ userId: brokerId, isOpen: true });

      return newBrokers;
    });

    requestIdleCallback(() => {
      scrollToBroker(brokerId);
    });
  });

  return (
    <>
      <DialogLayout.Header
        keyboard={false}
        controllers={['min', 'max', 'close']}
        extraControllers={<SettingGroup />}
      >
        <Dialog.Header>明细</Dialog.Header>
      </DialogLayout.Header>
      {!bridgeListVisible && (
        <Button.Icon
          icon={<IconMenuFold />}
          className="absolute right-3 top-[60px] z-50"
          tooltip={{ content: '展开桥列表', delay: { open: 600 } }}
          onClick={() => setBridgeListVisible(true)}
        />
      )}

      <div className="flex select-none bg-gray-800 flex-auto h-0">
        <div className="flex flex-col flex-1 w-0">
          <SearchFilter resetFilter={handleResetFilter} />
          <div className="h-px w-full bg-gray-600" />
          <div className="flex flex-row flex-auto h-0">
            {/* 经纪人列表 */}
            <DealBrokers
              data={formatBrokers}
              selectedId={selectedBrokerId}
              onChange={handleBrokerChange}
            />

            <div
              className="flex-1 py-2 pr-3 w-0"
              ref={containerRef}
              onClick={() => {
                if (activeArea !== ArrowAreaEnum.BridgeRecord) {
                  setActiveArea(ArrowAreaEnum.BridgeRecord);
                }
              }}
            >
              <DealContainerProvider
                initialState={{
                  onItemContextMenu: evt => {
                    handleContextMenu(evt);
                    setAnchorPoint({ x: evt.pageX, y: evt.pageY });
                  },
                  onDoubleClick: openBridgeEditModal
                }}
              >
                <Container />
              </DealContainerProvider>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-px h-full bg-gray-600" />

        {/* 桥机构列表 */}
        <BridgeInstList
          enableOpenBridge
          showMenuUnFoldIcon={bridgeListVisible}
          onUnFoldIconClick={() => {
            setBridgeListVisible(false);
          }}
          allowArrowSelect={!agentVisible}
          className={bridgeListVisible ? '' : '-mr-[201px]'}
          inputClassName="bg-gray-800 focus-within:bg-primary-700"
          onDrop={val => {
            if (!accessCache.bridgeEdit) return;
            addSingleBridge(val);
          }}
        />
      </div>

      <EditBridgeInstModal
        visible={bridgeVisible}
        bridge={bridge}
        isModify={bridgeModify}
        onSubmit={bridgeOnSubmit}
        onCancel={bridgeOnCancel}
      />

      {/** 加桥换桥弹窗 */}
      <BridgeModal
        visible={visibleBridgeModal}
        invalidBridgeIdList={invalidBridgeList || []}
        onChange={handleChangeBridge}
        onCancel={handleCancelBridge}
        position={[anchorPoint.x, anchorPoint.y]}
      />
      {/** 发单信息编辑弹窗 */}
      {!!messageEditValue && (
        <DealDetailMessageEditModal
          deal={messageEditValue}
          onSubmit={(deal, val) => {
            sendMessageEdit(deal, val);
            setMessageEditValue(undefined);
          }}
          onCancel={() => {
            setMessageEditValue(undefined);
          }}
        />
      )}

      <ContextMenu
        open={contextMenuVisible}
        position={anchorPoint}
        onOpenChange={setContextMenuVisible}
        closeByKeyboard={null}
      >
        {contextMenuOptions?.map(item => {
          if (item.subContextMenuItem?.length) {
            return (
              <SubMenu
                key={item.key}
                label={item.label}
                disabled={item.disabled}
              >
                {item.subContextMenuItem.map(v => (
                  <MenuItem
                    key={v.key}
                    disabled={v.disabled}
                    onClick={() => handleCheckedContextOption({ ...v, key: item.key })}
                  >
                    {v.label}
                  </MenuItem>
                ))}
              </SubMenu>
            );
          }

          return (
            <MenuItem
              key={item.key}
              disabled={item.disabled}
              onClick={() => handleCheckedContextOption(item)}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </ContextMenu>

      {/* 无桥 */}
      {EditModalEnable && bridgeNum === 0 && (
        <EditBridgeModal.None
          onClose={handleEditBridgeClose}
          visible={editBridgeVisible}
          {...transReceiptDealDetailToNoneModalState(
            innerReceiptDealDetailRef.current ?? selectedDeals[0],
            Source.Detail
          )}
        />
      )}

      {/* 单桥 */}
      {EditModalEnable && bridgeNum === 1 && (
        <EditBridgeModal.Single
          onClose={handleEditBridgeClose}
          visible={editBridgeVisible}
          defaultSendMsg={senMessages.find(Boolean)?.sendMsg}
          {...transReceiptDealDetailToSingleModalState(
            innerReceiptDealDetailRef.current ?? selectedDeals[0],
            Source.Detail
          )}
        />
      )}

      {/* 多桥 */}
      {EditModalEnable && bridgeNum > 1 && (
        <EditBridgeModal.Mul
          onClose={handleEditBridgeClose}
          defaultSendMsg={senMessages.filter(Boolean)}
          visible={editBridgeVisible}
          dealSide={selectedDeals[0]?.dealSide}
          {...transReceiptDealDetailToMulModalState(
            innerReceiptDealDetailRef.current ?? selectedDeals[0],
            Source.Detail
          )}
        />
      )}

      <DiffModal
        visible={!!diff}
        data={diff}
        confirmButProps={{ loading: confirmViewLoading, disabled: confirmViewLoading }}
        onCancel={closeDiffModal}
        onConfirm={handleViewConfirm}
      />
    </>
  );
};

const DealDetailsDialog = () => {
  const { productType } = useProductParams();

  return (
    <DealPanelProvider>
      {/* 债券搜索 */}
      <BondSearchProvider initialState={{ productType }}>
        {/* 机构搜索 */}
        <InstSearchProvider initialState={{ productType, transformOption: transform2AgencyInstOpt(productType) }}>
          {/* 机构/交易员搜索 */}
          <InstTraderSearchProvider initialState={{ productType }}>
            <HistoryStackProvider>
              {/* 分组配置 */}
              <GroupConfigProvider>
                {/* 桥相关上下文 */}
                <BridgeProvider>
                  {/* 顶部筛选状态 */}
                  <FilterStateProvider>
                    {/* 虚拟列表状态 */}
                    <VirtualListProvider>
                      {/* 虚拟列表与业务逻辑联动部分状态 */}
                      <VSConnectProvider>
                        {/* 需代付机构窗口上下文 */}
                        <AgencyProvider>
                          <DealDetailsInner />
                        </AgencyProvider>
                      </VSConnectProvider>
                    </VirtualListProvider>
                  </FilterStateProvider>
                </BridgeProvider>
              </GroupConfigProvider>
            </HistoryStackProvider>
          </InstTraderSearchProvider>
        </InstSearchProvider>
      </BondSearchProvider>
    </DealPanelProvider>
  );
};

export default DealDetailsDialog;
