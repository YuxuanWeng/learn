import { ReceiptDealApprovalRole, ReceiptDealApprovalRule } from '@fepkg/services/types/bds-common';

export const getAllRoleIdFromRule = (allRule: ReceiptDealApprovalRule[]) => {
  return allRule.reduce<string[]>((pre, cur) => {
    const { advanced_role_list = [], normal_role_list = [] } = cur ?? {};
    return [
      ...pre,
      ...advanced_role_list.map(i => i.approval_role_id),
      ...normal_role_list.map(i => i.approval_role_id)
    ];
  }, []);
};

export const getAllRoleList = (list: ReceiptDealApprovalRole[]) => {
  return [...new Set(list.flatMap(i => i.role_member_list).filter(Boolean))];
};
