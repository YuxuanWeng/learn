import { DealSorSendStatus, ReceiptDealStatus } from '@fepkg/services/types/bds-enum';

export const receiptDealStatusOptions = [
  { label: '待移交', value: ReceiptDealStatus.ReceiptDealToBeHandOver, className: 'text-gray-100' },
  { label: '待确认', value: ReceiptDealStatus.ReceiptDealToBeConfirmed, className: 'text-orange-100' },
  { label: '待提交', value: ReceiptDealStatus.ReceiptDealToBeSubmitted, className: 'text-yellow-100' },
  { label: '送审中', value: ReceiptDealStatus.ReceiptDealSubmitApproval, className: 'text-purple-100' },
  { label: '待审核', value: ReceiptDealStatus.ReceiptDealToBeExamined, className: 'text-secondary-100' },
  { label: '未通过', value: ReceiptDealStatus.ReceiptDealNoPass, className: 'text-danger-100' },
  { label: '已通过', value: ReceiptDealStatus.ReceiptDealPass, className: 'text-primary-100' },
  { label: '已毁单', value: ReceiptDealStatus.ReceiptDealDestroyed, className: 'text-gray-300' },
  { label: '已删除', value: ReceiptDealStatus.ReceiptDealDeleted, className: 'text-gray-300' }
];

export const dealSorSendStatusMap = new Map<DealSorSendStatus, string>([
  [DealSorSendStatus.DSSendStatusToBeSent, '待推送'],
  [DealSorSendStatus.DSSendStatusSent, '已推送'],
  [DealSorSendStatus.DSSendStatusApplying, '申请单'],
  [DealSorSendStatus.DSSendStatusRefused, '拒绝更新'],
  [DealSorSendStatus.DSSendStatusInstruction, '指令单'],
  [DealSorSendStatus.DSSendStatusToBeExecuted, '交易执行'],
  [DealSorSendStatus.DSSendStatusWithdrew, '交易撤单'],
  [DealSorSendStatus.DSSendStatusDeleted, '已删除'],
  [DealSorSendStatus.DSSendStatusExecuting, '处理中'],
  [DealSorSendStatus.DSSendStatusConfirmed, '成交确认']
]);

export const UrgeReceiptDealStatusSet = new Set([
  ReceiptDealStatus.ReceiptDealToBeHandOver,
  ReceiptDealStatus.ReceiptDealToBeConfirmed,
  ReceiptDealStatus.ReceiptDealToBeSubmitted,
  ReceiptDealStatus.ReceiptDealNoPass
]);
