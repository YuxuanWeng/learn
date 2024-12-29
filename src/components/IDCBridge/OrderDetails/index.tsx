import { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { message } from '@fepkg/components/Message';
import { Placeholder } from '@fepkg/components/Placeholder';
import { APIs } from '@fepkg/services/apis';
import { PayForInstWithFee } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { ReceiptDeal, ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { DealOperationType, OperationSource, SettlementLabel } from '@fepkg/services/types/bds-enum';
import { useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { mulResetBridgeInfo } from '@/common/services/api/bridge/mul-reset-bridge-info';
import { fetchPayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee';
import { DealDetailList, DealDetailListMenuItem } from '@/components/DealDetailList';
import { IDCDealDetailItemType as DealDetailItemType } from '@/components/DealDetailList/item';
import { getBridgeInstSendMsg, isNeedResetBridge, showResetModal } from '@/components/EditBridge/utils';
import { getAddBridgeDragData } from '@/components/IDCDealDetails/type';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { BridgeDialogSum } from '@/pages/Deal/Bridge/Sum';
import { useBridgeInstList } from '@/pages/Deal/Bridge/hooks/useBridgeInstList';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { ArrowAreaEnum, ContextMenuEnum } from '@/pages/Deal/Bridge/types';
import { getRelatedBridgeInstIds, getSum } from '@/pages/Deal/Bridge/utils';
import { getDealDetailLogConfig } from '@/pages/Deal/DealDetailLog/utils';
import { checkIsDestroyedDeal } from '@/pages/Deal/Detail/utils';
import { addBridgeByChildDealId, addSingleBridge, changeBridge, deleteBridge } from '@/pages/Spot/utils/bridge';
import { useSumMove } from './useSumMove';
import {
  getBridgeLiqSpeed,
  getNeedHighlightEdit,
  getReceiptBid,
  getReceiptDealText,
  getReceiptOfr,
  getRelatedDetails
} from './util';

type Props = {
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  list: ReceiptDealDetail[];
  onSelect?: (items: ReceiptDealDetail[]) => void;
  refetch: VoidFunction;
  selectedItems: ReceiptDealDetail[];
  highlightItems: ReceiptDealDetail[];
};

export default function OrderDetails({ onKeyDown, list, onSelect, refetch, selectedItems, highlightItems }: Props) {
  const {
    accessCache,
    containerRef,
    innerReceiptDealDetailRef,
    bridge,
    activeArea,
    setActiveArea,
    setParentDealIds,
    setBatchModalVisible,
    activeTab
  } = useBridgeContext();

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current != null) {
        if (selectedItems.length === 1) {
          const index = list.findIndex(
            item => item.parent_deal.parent_deal_id === selectedItems[0].parent_deal.parent_deal_id
          );

          containerRef.current.children[0]?.children?.[index]?.children[0]?.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }, [selectedItems, list]);

  const { bridgeList } = useBridgeInstList();

  const [bridgeListVisible, setBridgeListVisible] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { productType } = useProductParams();
  const { openDialog } = useDialogWindow();

  const isChangingBridge = useRef(false);

  const [addBridgeTarget, setAddBridgeTarget] = useState<{ parent: ReceiptDealDetail; child: ReceiptDeal }>();

  const openOperateLog = (dealId: string) => {
    openDialog(getDealDetailLogConfig(productType, dealId));
  };

  const selectedDealIds = selectedItems.map(v => v.parent_deal.parent_deal_id).filter(Boolean);

  /** 重置桥信息 */
  const resetBridge = async (defaultParentDealIds?: string[]) => {
    const parentDealIds = defaultParentDealIds ?? selectedDealIds;
    if (!parentDealIds?.length) return;
    const result = await mulResetBridgeInfo({
      parent_receipt_deal_ids: parentDealIds,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTResetBridge,
        operation_source: OperationSource.OperationSourceReceiptDealBridge
      }
    });
    innerReceiptDealDetailRef.current = result.receipt_deal_detail_list;
    if (parentDealIds.length === 1) setParentDealIds(parentDealIds);
    else setBatchModalVisible(true);
  };

  const openModal = () => {
    if (!selectedItems.length) return;

    if (!accessCache.bridgeEdit) return;

    innerReceiptDealDetailRef.current = undefined;
    const isBatch = selectedItems.length > 1;

    if (!isBatch && checkIsDestroyedDeal(selectedItems)) return;

    for (const v of selectedItems) {
      const senMessages = getBridgeInstSendMsg(bridgeList, v);
      if (senMessages.includes(undefined)) {
        message.error('选择成交存在未维护的桥机构！');
        return;
      }
    }
    if (isNeedResetBridge(selectedItems)) showResetModal(resetBridge);
    else if (isBatch) setBatchModalVisible(true);
    else setParentDealIds(selectedDealIds);
  };

  const getCopyText = (i: ReceiptDealDetail) => {
    const index = list.findIndex(d => d.parent_deal.parent_deal_id === i.parent_deal.parent_deal_id);

    const content = getReceiptDealText({
      deal: i,
      curInstId: bridge?.contact_inst?.inst_id,
      currentBridgeInst: bridge,
      fullInstList: bridgeList,
      includesRating: productType === ProductType.NCD,
      isCopy: true
    }).text;

    return `${index + 1}) ${content}`;
  };

  const getFieldRender = (i: ReceiptDealDetail) =>
    getReceiptDealText({
      deal: i,
      curInstId: bridge?.contact_inst?.inst_id,
      currentBridgeInst: bridge,
      fullInstList: bridgeList,
      includesRating: productType === ProductType.NCD,
      isCopy: false
    }).render;

  const contextMenuOptions: DealDetailListMenuItem[] = [
    {
      key: ContextMenuEnum.UpdateBridgeRecord,
      label: '编辑',
      disabled: !accessCache.bridgeEdit,
      onClick: openModal
    },
    selectedItems.some(i => {
      return (
        bridge != null &&
        getRelatedDetails(i.details, bridge.contact_inst.inst_id).every(d => !d.order_no) &&
        getBridgeLiqSpeed(i, bridge).length === 1
      );
    }) && {
      key: ContextMenuEnum.DeleteBridgeRecord,
      label: '删桥',
      disabled: !accessCache.bridgeRecordEdit,
      onClick: () => {
        setShowDelete(true);
      }
    },
    {
      key: ContextMenuEnum.ChangeBridge,
      label: '换桥',
      disabled: !accessCache.bridgeRecordEdit,
      onClick: () => {
        if (bridge == null) return;

        setBridgeListVisible(true);
        isChangingBridge.current = true;
      }
    },
    selectedItems.length === 1 && {
      key: ContextMenuEnum.OperateLog,
      label: '操作日志',
      disabled: !accessCache.log,
      onClick: () => {
        if (bridge == null) return;
        openOperateLog(selectedItems[0].parent_deal.parent_deal_id ?? '');
      }
    },
    {
      key: ContextMenuEnum.NoInternalCodeCopy,
      label: '不带内码复制',
      onClick: () => {
        window.Main.copy(selectedItems.map(i => `${getCopyText(i)}`).join('\n'));
      }
    },
    {
      key: ContextMenuEnum.NoBrokerCopy,
      label: '不带broker复制',
      onClick: () => {
        window.Main.copy(selectedItems.map(i => `${i.parent_deal.internal_code}-${getCopyText(i)}`).join('\n'));
      }
    }
  ].filter(Boolean);

  const onClickOrderDetails = useMemoizedFn(() => {
    if (activeArea !== ArrowAreaEnum.BridgeRecord) {
      setActiveArea(ArrowAreaEnum.BridgeRecord);
    }
  });

  const sumData = useMemo(() => getSum(list), [list]);

  useEffect(() => {
    setBridgeListVisible(false);
    setShowDelete(false);
  }, [bridge?.bridge_inst_id]);

  const searchIds = list
    .reduce(
      (prev, next) => [
        ...prev,
        next.parent_deal.bid_trade_info.inst?.inst_id ?? '',
        next.parent_deal.ofr_trade_info.inst?.inst_id ?? ''
      ],
      [] as string[]
    )
    .filter(i => i !== '');

  const [feeList, setFeeList] = useState<PayForInstWithFee[]>([]);

  useQuery({
    queryKey: [APIs.deal.payForInstFeeGet, searchIds] as const,
    queryFn: async ({ signal }) => {
      if (searchIds.length === 0) return [];
      const res = await fetchPayForInstFee({ inst_id_list: searchIds }, { signal });
      return res.pay_for_inst_with_fee_list ?? [];
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 30000,
    refetchInterval: 30000,
    onSuccess: data => {
      if (!data) return;
      setFeeList(data);
    }
  });

  const { sumHeight, startBoundMove } = useSumMove();

  const hiddenInstIds = useMemo(() => {
    if (selectedItems.length === 0 || bridge == null) return [];
    if (selectedItems.length > 1) return [bridge.contact_inst.inst_id];

    return getRelatedBridgeInstIds(selectedItems[0]);
  }, [selectedItems]);

  return (
    <div
      className="bg-gray-800 flex flex-col flex-1 overflow-hidden"
      onClick={onClickOrderDetails}
      onKeyDown={onKeyDown}
      onDrop={() => {
        if (!accessCache.bridgeEdit) return;
        const items = getAddBridgeDragData();
        if (items == null || bridge == null) return;
        addSingleBridge({ bridgeInst: bridge, dealList: items, refetch, productType });
      }}
    >
      <div
        className={cx(
          'px-3 flex-1',
          list.length ? 'flex flex-col overflow-y-overlay' : 'flex items-center overflow-hidden'
        )}
        ref={containerRef}
      >
        {list.length ? (
          <DealDetailList
            hiddenInstIds={[
              bridge?.contact_inst.inst_id ?? '',
              ...getRelatedBridgeInstIds(addBridgeTarget?.parent),
              ...hiddenInstIds
            ]}
            selectedKeys={selectedItems.map(r => r.parent_deal.parent_deal_id ?? '')}
            highlightKeys={highlightItems.map(r => r.parent_deal.parent_deal_id ?? '')}
            bridgeListVisible={bridgeListVisible}
            showDelete={showDelete}
            className="flex-1"
            data={list}
            getKey={r => r.parent_deal.parent_deal_id ?? ''}
            getDisableDelete={r =>
              getRelatedDetails(r.details, bridge?.contact_inst.inst_id).some(i => Boolean(i.order_no))
            }
            getBidName={getReceiptBid}
            getOfrName={getReceiptOfr}
            getInternalCode={r => r.parent_deal.internal_code ?? '-'}
            getCreateTime={r => r.parent_deal.create_time}
            getFieldRender={r => getFieldRender(r)}
            getItemType={() => DealDetailItemType.Bold}
            menuItems={contextMenuOptions}
            getHighlightEdit={r => getNeedHighlightEdit(r, bridge, feeList, bridgeList)}
            onOpenSelectDealContext={(parent, child) => {
              setAddBridgeTarget({ parent, child });
              setBridgeListVisible(true);
            }}
            onSelectBridgeInst={val => {
              setBridgeListVisible(false);
              if (val == null) {
                isChangingBridge.current = false;
              }

              if (isChangingBridge.current && val != null && bridge?.contact_inst.inst_id != null) {
                isChangingBridge.current = false;
                changeBridge({
                  dealList: selectedItems,
                  bridgeInst: val,
                  currentInstId: bridge.contact_inst.inst_id,
                  refetch
                });
                return;
              }

              if (addBridgeTarget == null) return;

              if (val != null) {
                addBridgeByChildDealId({
                  bridgeInst: val,
                  parentDeal: addBridgeTarget.parent,
                  refetch,
                  targetDealIds: [addBridgeTarget.child.receipt_deal_id],
                  productType
                });
              }

              setAddBridgeTarget(undefined);
            }}
            onClickEdit={(value: ReceiptDealDetail) => {
              if (!accessCache.bridgeEdit) return;
              innerReceiptDealDetailRef.current = undefined;

              const senMessages = getBridgeInstSendMsg(bridgeList, value);

              if (checkIsDestroyedDeal([value])) return;

              if (senMessages.includes(undefined)) {
                message.error('选择成交存在未维护的桥机构！');
                return;
              }

              // 存在至少一个计费人为空的情况
              if (isNeedResetBridge([value])) {
                showResetModal(() => resetBridge([value.parent_deal.parent_deal_id ?? '']));
              } else {
                setParentDealIds([value.parent_deal.parent_deal_id ?? '']);
              }
            }}
            currentBridgeInst={bridge}
            onSelect={items => {
              onSelect?.(items);
              window.Main.copy(
                items
                  .map(i => `${getReceiptOfr(i)} ${getReceiptBid(i)} ${i.parent_deal.internal_code}-${getCopyText(i)}`)
                  .join('\n')
              );
            }}
            onClickDelete={() => {
              setShowDelete(true);
            }}
            onChangeShowDelete={() => {
              setShowDelete(false);
            }}
            onDeleteBridge={() => {
              deleteBridge({
                curInstId: bridge?.contact_inst.inst_id,
                dealList: selectedItems,
                refetch
              });
              setShowDelete(false);
            }}
            onClickLog={item => {
              openOperateLog(item.parent_deal.parent_deal_id ?? '');
            }}
            onDoubleClick={openModal}
          />
        ) : (
          <Placeholder
            label="暂无明细记录"
            type="no-data"
          />
        )}
      </div>

      {activeTab === SettlementLabel.SettlementLabelToday && list.length !== 0 && (
        <>
          <div
            className={cx('w-full h-1 -mt-[2px] border-none bg-transparent z-50 hover:cursor-row-resize')}
            onMouseDown={startBoundMove}
          />
          <BridgeDialogSum
            height={sumHeight}
            data={sumData}
            currentBridgeInst={bridge}
          />
        </>
      )}
    </div>
  );
}
