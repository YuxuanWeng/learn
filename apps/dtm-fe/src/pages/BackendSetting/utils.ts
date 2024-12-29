import { ReceiptDealApprovalRule } from '@fepkg/services/types/bds-common';
import { v4 } from 'uuid';

export const AVATAR_COLOR_TW: string[] = [
  'text-secondary-100',
  'text-primary-100',
  'text-orange-100',
  'text-purple-100'
];
const FE_RECEIPT_APPROVAL_ROLE_TEMP_ID = 'FE_RECEIPT_APPROVAL_ROLE_TEMP_ID';

export function nameToColorTw(name: string) {
  const remainder = (name || '').split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0) % 4;
  return AVATAR_COLOR_TW[remainder];
}

export const createTempId = () => {
  return FE_RECEIPT_APPROVAL_ROLE_TEMP_ID + v4();
};
export const isFETempId = (str: string) => {
  return str.includes(FE_RECEIPT_APPROVAL_ROLE_TEMP_ID);
};

export const splitList = (list: ReceiptDealApprovalRule[]) => {
  const titleList: ReceiptDealApprovalRule[] = [];
  const subList: ReceiptDealApprovalRule[] = [];
  for (const item of list) {
    if (!item.rule_subtype?.length) {
      titleList.push(item);
    } else {
      subList.push(item);
    }
  }

  return { subList, titleItem: titleList.pop() };
};
