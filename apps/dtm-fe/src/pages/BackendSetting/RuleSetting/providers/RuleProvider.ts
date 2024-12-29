import { useState } from 'react';
import { ReceiptDealApprovalRule } from '@fepkg/services/types/bds-common';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useRoleSettingList } from '../../RoleSetting/hooks';
import { useRuleSettingList } from '../hooks';

type IError = { [approval_role_id in string]?: { advancedListError?: boolean; normalListError?: boolean } };

export const RuleContainer = createContainer(() => {
  const [isEdit, setIsEdit] = useState(false);
  const { data: ruleSettingList = [], refetch, isLoading } = useRuleSettingList();
  const [updateList, setUpdateList] = useImmer<ReceiptDealApprovalRule[]>(ruleSettingList);
  const [error, setError] = useImmer<IError>({});
  const { data: roleSettingList = [] } = useRoleSettingList();

  const onEdit = () => {
    setUpdateList(ruleSettingList);
    setIsEdit(true);
    setError({});
  };

  return {
    isEdit,
    setIsEdit,
    onEdit,

    isLoading,
    refetch,
    ruleSettingList,

    updateList,
    setUpdateList,

    showRuleSettingList: isEdit ? updateList : ruleSettingList,
    roleSettingList,

    error,
    setError
  };
});

export const RuleProvider = RuleContainer.Provider;
export const useRule = RuleContainer.useContainer;
