import { ReceiptDealStatus } from '@fepkg/services/types/enum';
import deletedSvg from '@/assets/images/orderstatus.deleted.svg';
import destroyedSvg from '@/assets/images/orderstatus.destroyed.svg';
import noPassSvg from '@/assets/images/orderstatus.no-pass.svg';
import passSvg from '@/assets/images/orderstatus.pass.svg';
import submitApprovalSvg from '@/assets/images/orderstatus.submit-approval.svg';
import toBeConfirmedSvg from '@/assets/images/orderstatus.to-be-confirmed.svg';
import toBeExaminedSvg from '@/assets/images/orderstatus.to-be-examined.svg';
import toBeHandOverSvg from '@/assets/images/orderstatus.to-be-handover.svg';
import toBeSubmittedSvg from '@/assets/images/orderstatus.to-be-submitted.svg';

export const StatusImageMap: Record<ReceiptDealStatus, string> = {
  [ReceiptDealStatus.ReceiptDealStatusNone]: '',
  [ReceiptDealStatus.ReceiptDealToBeHandOver]: toBeHandOverSvg,
  [ReceiptDealStatus.ReceiptDealToBeConfirmed]: toBeConfirmedSvg,
  [ReceiptDealStatus.ReceiptDealToBeSubmitted]: toBeSubmittedSvg,
  [ReceiptDealStatus.ReceiptDealSubmitApproval]: submitApprovalSvg,
  [ReceiptDealStatus.ReceiptDealToBeExamined]: toBeExaminedSvg,
  [ReceiptDealStatus.ReceiptDealNoPass]: noPassSvg,
  [ReceiptDealStatus.ReceiptDealPass]: passSvg,
  [ReceiptDealStatus.ReceiptDealDestroyed]: destroyedSvg,
  [ReceiptDealStatus.ReceiptDealDeleted]: deletedSvg
};
