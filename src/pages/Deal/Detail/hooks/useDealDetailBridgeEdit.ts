import { useState } from 'react';
import { ModalUtils } from '@fepkg/components/Modal';
import { BridgeInstInfo, ReceiptDealDetail } from '@fepkg/services/types/common';
import { DealOperationType, OperationSource, Side } from '@fepkg/services/types/enum';
import { updateSendOrderInfo } from '@/common/services/api/receipt-deal/update-send-order-info';
import { useFilter } from '@/components/IDCDealDetails/SearchFilter/providers/FilterStateProvider';
import { ContextMenuEnum, DealContainerData } from '@/components/IDCDealDetails/type';
import { findDirectDealDetail } from '@/components/IDCDealDetails/utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { addSingleBridge, changeBridge, deleteBridge } from '../../../Spot/utils/bridge';

type Props = {
  dealList: ReceiptDealDetail[];
  refetchFn: () => void;
  setVisibleBridgeModal: (val: boolean) => void;
};

export const useDealDetailBridgeEdit = ({ dealList = [], refetchFn, setVisibleBridgeModal }: Props) => {
  const [operateFlag, setOperateFlag] = useState<ContextMenuEnum | undefined>();
  const { selectBridgeId } = useFilter();

  const exchangeBridge = async (bridgeInst: BridgeInstInfo) => {
    changeBridge({
      dealList,
      bridgeInst,
      currentInstId: selectBridgeId?.current ?? '',
      refetch: refetchFn,
      fromDetail: true
    });
  };

  const showBridgeSearchModal = (menuEnum: ContextMenuEnum) => {
    if (!dealList?.length) return;

    setVisibleBridgeModal(true);
    setOperateFlag(menuEnum);
  };

  const { productType } = useProductParams(); // 不同台子切换时重置组件所有状态

  const onAddSingleBridge = async (bridgeInst: BridgeInstInfo) => {
    addSingleBridge({ bridgeInst, dealList, refetch: refetchFn, fromDetail: true, productType });
  };

  const handleCancelBridge = () => {
    setVisibleBridgeModal(false);
  };

  /**  桥modal的回调函数 */
  const handleChangeBridge = (bridgeInst?: BridgeInstInfo) => {
    if (!dealList.length || !bridgeInst) return;

    // 换桥
    if (operateFlag === ContextMenuEnum.AddBridge) {
      onAddSingleBridge(bridgeInst);
      return;
    }
    exchangeBridge(bridgeInst);
  };

  const handleDelBridge = () => {
    if (!dealList?.length) return;

    ModalUtils.warning({
      title: '是否删除桥？',
      buttonsCentered: true,
      onOk: () => {
        if (dealList.length > 1) return;
        deleteBridge({ dealList, refetch: refetchFn, curInstId: selectBridgeId?.current, fromDetail: true });
      }
    });
  };

  const sendMessageEdit = async (data?: DealContainerData, val?: string) => {
    const directDeal = findDirectDealDetail(data);
    await updateSendOrderInfo({
      parent_deal_id: data?.parent_deal.parent_deal_id || '',
      send_order_info: val || '',
      receipt_deal_id: directDeal?.receipt_deal_id || '',
      side: data?.dealSide ?? Side.SideNone,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifySendOrderInfo,
        operation_source: OperationSource.OperationSourceReceiptDealDetail
      }
    });
    refetchFn();
  };

  return {
    addSingleBridge: onAddSingleBridge,
    handleChangeBridge,
    handleCancelBridge,
    showBridgeSearchModal,
    handleDelBridge,
    sendMessageEdit
  };
};
