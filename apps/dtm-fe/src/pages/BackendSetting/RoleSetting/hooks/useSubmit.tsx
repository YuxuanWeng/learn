import { message } from '@fepkg/components/Message';
import { ModalUtilProps, ModalUtils } from '@fepkg/components/Modal';
import { AccessCode } from '@fepkg/services/access-code';
import { UserAccess } from '@fepkg/services/types/bdm-common';
import {
  ReceiptDealApprovalRole,
  ReceiptDealApprovalRule,
  ReceiptDealRoleMember
} from '@fepkg/services/types/bds-common';
import { DealOperationType, OperationSource } from '@fepkg/services/types/bds-enum';
import type { ReceiptDealApprovalRoleMulUpsert } from '@fepkg/services/types/receipt-deal/approval-role-mul-upsert';
import { useAuth } from '@/providers/AuthProvider';
import { isEqual } from 'lodash-es';
import { mulUpsertRole } from '@/common/services/api/approval/role';
import { fetchUsersAccess } from '@/common/services/api/auth/user-mul-get';
import { useRole } from '../providers/RoleProvider';
import { getAllRoleIdFromRule, getAllRoleList } from '../utils.ts';

type MulUpsertRoleRequest = {
  operator: string;
  role_list?: ReceiptDealApprovalRoleMulUpsert.UpsertReceiptDealApprovalRole[];
};

type MulUpsertRoleRequestOptions = {
  withModal?: boolean;
  modalProps?: ModalUtilProps;
};

const validateAccess = (allRoles: ReceiptDealRoleMember[], accessList: UserAccess[] | undefined) => {
  if (!allRoles?.length) return { hasAccess: true };
  if (!accessList?.length) return { hasAccess: false, noAccessNameList: allRoles.map(i => i.member_name) };

  const noAccessNameList: string[] = [];

  for (const item of allRoles) {
    const { member_name, member_id } = item;
    const accessItem = accessList.find(i => i.user_id === member_id);
    const accessCodes = accessItem?.access_list?.map(i => i.access_code);

    if (!accessItem || !accessCodes?.includes(AccessCode.CodeDTMApprovalPage)) {
      noAccessNameList.push(member_name);
    }
  }
  return { hasAccess: !noAccessNameList.length, noAccessNameList };
};

export const useSubmit = () => {
  const { user } = useAuth();

  const { setIsEdit, updateList, setUpdateList, roleSettingList, setError, refetchRole, refetchRule } = useRole();

  const changeWithCheckData = async (
    successCB: (val?: ReceiptDealApprovalRule[]) => Promise<unknown>,
    failureCB = () => Promise.resolve(false)
  ) => {
    const [newRoleList, allRule] = await Promise.all([
      refetchRole()
        .then(res => res?.data ?? [])
        .catch(() => {
          message.error('请求失败！');
          return void 0;
        }),
      refetchRule()
        .then(res => res?.data ?? [])
        .catch(() => {
          message.error('查询规则失败');
          return void 0;
        })
    ]);

    return new Promise(resolve => {
      if (!isEqual(newRoleList, roleSettingList)) {
        ModalUtils.warning({
          title: '配置更新',
          content: '当前角色配置已更新，请刷新！',
          okText: '我知道了',
          showCancel: false,
          onOk: () => {
            setUpdateList(newRoleList ?? []);

            return failureCB().finally(() => {
              return resolve(false);
            });
          }
        });
      } else {
        successCB(allRule).finally(() => resolve(true));
      }
    });
  };

  const setRoleNameError = (approval_role_ids: string[], msg: string) => {
    message.error(msg);

    setError(draft => {
      for (const approval_role_id of approval_role_ids) {
        draft[approval_role_id] = {
          ...draft[approval_role_id],
          roleNameError: true
        };
      }
    });
  };
  const setRoleListError = (approval_role_id: string, msg: string) => {
    message.error(msg);
    setError(draft => {
      if (approval_role_id) {
        draft[approval_role_id] = {
          ...draft[approval_role_id],
          roleListError: true
        };
      }
    });
  };

  const validateName = (list: ReceiptDealApprovalRole[]) => {
    return list.every(item => {
      const { approval_role_id, approval_role_name } = item;
      if (!approval_role_name?.trim()) {
        setRoleNameError([approval_role_id], '审核角色名称不得为空');
        return false;
      }
      if (approval_role_name?.length > 10) {
        setRoleNameError([approval_role_id], '审核角色名称不得超出10个字符');
        return false;
      }

      return true;
    });
  };
  const validateDuplicates = (list: ReceiptDealApprovalRole[]) => {
    const duplicates = new Map();

    for (const item of list) {
      const { approval_role_name } = item;
      if (duplicates.get(approval_role_name) !== undefined) {
        const duplicateIDs = list
          .filter(i => i.approval_role_name.trim() === approval_role_name.trim())
          .map(i => i.approval_role_id);
        setRoleNameError(duplicateIDs, '审核角色名称重复');
        return false;
      }
      duplicates.set(item.approval_role_name, item.approval_role_name);
    }
    return true;
  };

  const validateRoleList = (list: ReceiptDealApprovalRole[], allRule?: ReceiptDealApprovalRule[]) => {
    if (!allRule) return false;

    const allActiveRoleIdList = getAllRoleIdFromRule(allRule);

    return list.every(item => {
      const { approval_role_id, role_member_list } = item;

      if (allActiveRoleIdList.includes(approval_role_id) && !role_member_list?.length) {
        setRoleListError(approval_role_id, '审核成员不得为空');
        return false;
      }

      return true;
    });
  };

  const upsertWithModal = (params: MulUpsertRoleRequest, option?: MulUpsertRoleRequestOptions) => {
    const { operator, role_list } = params;
    const upsert = () => {
      return mulUpsertRole({
        operation_info: {
          operator,
          operation_type: DealOperationType.DOTApprovalRuleReset,
          operation_source: OperationSource.OperationSourceApproveReceiptDeal
        },
        role_list
      })
        .then(() => {
          message.success('修改成功！');
          setIsEdit(false);
        })
        .catch(() => {
          message.error('修改失败！');
        });
    };
    const { withModal, modalProps } = option ?? {};

    if (withModal) {
      return new Promise((resolve, reject) => {
        ModalUtils.warning({
          ...modalProps,
          onOk: async () => {
            await upsert().catch(err => {
              reject(new Error(err));
            });
            return resolve('ok');
          },
          onCancel: () => resolve('cancel')
        });
      });
    }

    return upsert();
  };

  const handleSubmit = () => {
    return changeWithCheckData(async allRule => {
      if (!validateName(updateList) || !validateDuplicates(updateList) || !validateRoleList(updateList, allRule)) {
        return;
      }

      const option: MulUpsertRoleRequestOptions = {
        withModal: false,
        modalProps: undefined
      };

      const allRoles = getAllRoleList(updateList);
      const allAccessList = (await fetchUsersAccess(allRoles.map(i => i.member_id)))?.user_access_list;

      const { hasAccess, noAccessNameList } = validateAccess(allRoles, allAccessList);
      const noAccessNameStr = noAccessNameList?.join(',');

      if (!hasAccess) {
        option.withModal = true;
        option.modalProps = {
          title: '权限未开启',
          content: (
            <div>
              成员<span className="text-primary-100">({noAccessNameStr})</span>
              CRM【审核列表】权限未开启，请及时操作。
            </div>
          )
        };
      }

      const roleList = updateList.map(item => {
        return {
          ...item,
          approval_role_name: item.approval_role_name?.trim(),
          role_member_id_list: item.role_member_list?.map(i => i.member_id),
          role_member_list: undefined
        };
      });

      await upsertWithModal(
        {
          operator: user?.user_id ?? '',
          role_list: roleList
        },
        option
      );
    });
  };
  return { handleSubmit, changeWithCheckData };
};
