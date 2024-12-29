import { useState } from 'react';
import { ReceiptDealApprovalRole } from '@fepkg/services/types/bds-common';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useRuleSettingList } from '../../RuleSetting/hooks';
import { useRoleSettingList } from '../hooks';

type IError = {
  [approval_role_id in string]?: {
    /** 审核角色名称 error 态 */
    roleNameError?: boolean;
    /** 成员 error 态 */
    roleListError?: boolean;
  };
};

export const RoleContainer = createContainer(() => {
  const [isEdit, setIsEdit] = useState(false);
  const [needNotify, setNeedNotify] = useState(false);
  const { data: roleSettingList = [], refetch: refetchRole, isLoading } = useRoleSettingList();
  const { data: ruleSettingList = [], refetch: refetchRule } = useRuleSettingList();

  const [updateList, setUpdateList] = useImmer<ReceiptDealApprovalRole[]>(roleSettingList);
  const [error, setError] = useImmer<IError>({});

  const onEdit = () => {
    setUpdateList(roleSettingList);
    setNeedNotify(true);
    setIsEdit(true);
    setError({});
  };

  const replaceRoleTable = useMemoizedFn(async (targetId: string, destId?: string) => {
    const approvalRoleIdList = updateList.map(item => item.approval_role_id);
    if (!approvalRoleIdList.includes(targetId) || targetId === destId) return;

    let settings: string[] = [];
    const noTargetIdList = approvalRoleIdList.filter(id => id !== targetId).filter(Boolean);

    if (destId) {
      for (const id of noTargetIdList) {
        if (id === destId) {
          settings.push(targetId);
        }
        settings.push(id || '');
      }
    } else {
      settings = [...noTargetIdList, targetId];
    }

    // 乐观更新顺序
    const groupReSort = [...updateList];
    groupReSort.sort(
      (prev, next) => settings.indexOf(prev.approval_role_id || '') - settings.indexOf(next.approval_role_id || '')
    );

    setUpdateList(() =>
      groupReSort.map((item, index) => ({
        ...item,
        approval_role_level: index + 1
      }))
    );

    // const result = await orderUpdateGroup({ product_type: productType, group_id_list: settings });
    // if (result && result.base_response?.code === 0) refetch();
  });

  const deleteRoleItem = useMemoizedFn((approvalRoleId: string) => {
    setUpdateList(draft => draft.filter(i => i.approval_role_id !== approvalRoleId));
  });

  const disableOptions = [
    ...new Set(
      updateList.flatMap(i => {
        return i.role_member_list?.map(inner => inner.member_id) ?? [];
      })
    )
  ];

  return {
    isEdit,
    setIsEdit,
    onEdit,

    roleSettingList,
    isLoading,
    refetchRole,
    ruleSettingList,
    refetchRule,

    updateList,
    setUpdateList,
    deleteRoleItem,
    replaceRoleTable,

    showRoleSettingList: isEdit ? updateList : roleSettingList,

    needNotify,
    setNeedNotify,

    error,
    setError,

    disableOptions
  };
});

export const RoleProvider = RoleContainer.Provider;
export const useRole = RoleContainer.useContainer;
