import { Button } from '@fepkg/components/Button';
import { IconCheckCircleFilled, IconTimeFilled } from '@fepkg/icon-park-react';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { DealOperationType, OperationSource, ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { useAccess } from '@/common/providers/AccessProvider';
import { confirmReceiptDeal } from '@/common/services/api/receipt-deal/confirm';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { validationReceiptDeal } from '@/pages/Deal/Receipt/ReceiptDealForm/utils/validation/validationReceiptDeal';
import { useReceiptDealPanel } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';

type ReceiptBrokerCellProp = {
  receiptDeal: ReceiptDeal;
  isMine: boolean;
  side: Side.SideBid | Side.SideOfr;
  brokerContent?: string;
  disabledStyle?: boolean;
};

export const ReceiptBrokerCell = ({
  receiptDeal,
  isMine,
  side,
  brokerContent,
  disabledStyle
}: ReceiptBrokerCellProp) => {
  const { access } = useAccess();
  const { productType } = useProductParams();
  const { handleRefetch } = useReceiptDealPanel();
  if (!brokerContent) {
    return null;
  }
  const confirmed =
    side === Side.SideBid ? receiptDeal.flag_bid_broker_confirmed : receiptDeal.flag_ofr_broker_confirmed;
  const showButton = isMine && receiptDeal.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeConfirmed;

  if (disabledStyle) {
    return <span className="ml-[52px]">{brokerContent}</span>;
  }

  const disabled =
    !access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealSubmit)) ||
    receiptDeal.flag_need_bridge ||
    !validationReceiptDeal(receiptDeal);

  return (
    <>
      {confirmed ? (
        <span className="w-12 h-6 shrink-0 bg-opacity-4 bg-white rounded-lg inline-flex justify-center items-center">
          <IconCheckCircleFilled className="text-primary-100" />
        </span>
      ) : null}
      {!confirmed && !showButton ? (
        <span className="w-12 h-6 shrink-0 bg-opacity-4 bg-white rounded-lg inline-flex justify-center items-center">
          <IconTimeFilled className="text-orange-100" />
        </span>
      ) : null}
      {!confirmed && showButton ? (
        <Button
          className="w-12 h-6 p-0"
          plain
          disabled={disabled}
          onClick={() => {
            confirmReceiptDeal({
              receipt_deal_id: receiptDeal.receipt_deal_id,
              side,
              operation_info: {
                operator: miscStorage.userInfo?.user_id ?? '',
                operation_type:
                  side === Side.SideBid
                    ? DealOperationType.DOTReceiptDealBidConfirm
                    : DealOperationType.DOTReceiptDealOfrConfirm,
                operation_source: OperationSource.OperationSourceReceiptDeal
              }
            }).then(handleRefetch);
          }}
        >
          确认
        </Button>
      ) : null}
      <span className="ml-1">{brokerContent}</span>
    </>
  );
};
