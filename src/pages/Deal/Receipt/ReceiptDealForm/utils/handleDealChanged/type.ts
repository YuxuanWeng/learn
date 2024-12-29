import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';

export type handleDealChangedParams = {
  initialRowData?: Partial<ReceiptDeal>;
  receiptDealInfo?: ReceiptDealMulAdd.CreateReceiptDeal;
  hasSyncEditDiff?: boolean;
};
