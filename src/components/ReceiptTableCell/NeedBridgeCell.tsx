import { Button } from '@fepkg/components/Button';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { IconBridge } from '@fepkg/icon-park-react';
import { DealOperationType, OperationSource, ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { mulUpdateNeedBridge } from '@/common/services/api/bridge/mul-update-need-bridge';
import { miscStorage } from '@/localdb/miscStorage';
import { useReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';

type NeedBridgeCellProps = {
  receiptDeal: ReceiptDeal;
  editable: boolean;
};

export const NeedBridgeCell = ({ receiptDeal, editable }: NeedBridgeCellProps) => {
  const { handleRefetch } = useReceiptDealPanel();

  const { receipt_deal_status, destroy_reason } = receiptDeal;
  const isDestroying = Boolean(receipt_deal_status === ReceiptDealStatus.ReceiptDealSubmitApproval && destroy_reason);

  const handleConfirm = useMemoizedFn(() => {
    mulUpdateNeedBridge({
      receipt_deal_id_list: [receiptDeal.receipt_deal_id],
      need_bridge: !receiptDeal.flag_need_bridge,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTReceiptDealNeedBridge,
        operation_source: OperationSource.OperationSourceReceiptDeal
      }
    }).then(handleRefetch);
  });

  const buttonDisable = isDestroying || !editable || !!receiptDeal?.order_no;

  // 已确认的成交单点亮加桥标志触发重置时加弹窗
  if (!buttonDisable && receiptDeal.flag_bid_broker_confirmed && receiptDeal.flag_ofr_broker_confirmed) {
    return (
      <Popconfirm
        type="warning"
        placement="right"
        content="将重置成交单状态"
        floatingProps={{ className: 'w-[240px]' }}
        onConfirm={handleConfirm}
      >
        <Button.Icon
          icon={<IconBridge size={20} />}
          type="green"
          bright
          checked={receiptDeal.flag_need_bridge}
          className="h-6 w-6 p-0"
          disabled={buttonDisable}
        />
      </Popconfirm>
    );
  }
  return (
    <Button.Icon
      icon={<IconBridge size={20} />}
      type="green"
      bright
      checked={receiptDeal.flag_need_bridge}
      className="h-6 w-6 p-0"
      disabled={isDestroying || !editable || !!receiptDeal?.order_no}
      onClick={() => {
        handleConfirm();
      }}
    />
  );
};
