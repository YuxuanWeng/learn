import { message } from '@fepkg/components/Message';
import { ReceiptDealApprovalRule } from '@fepkg/services/types/common';
import { DealOperationType, OperationSource, ReceiptDealRuleType } from '@fepkg/services/types/enum';
import { useAuth } from '@/providers/AuthProvider';
import { isEqual } from 'lodash-es';
import { mulUpsertRule } from '@/common/services/api/approval/rule';
import { isFETempId } from '../../utils';
import { useRule } from '../providers/RuleProvider';

const getDiff = (prev: ReceiptDealApprovalRule[], cur: ReceiptDealApprovalRule[]) => {
  const diff: ReceiptDealApprovalRule[] = [];
  for (const curItem of cur) {
    const prevItem = prev.find(i => {
      return i.rule_type === curItem.rule_type && isEqual(i.rule_subtype, curItem.rule_subtype);
    });
    if (!isEqual(prevItem, curItem)) {
      diff.push(curItem);
    }
  }
  return diff;
};

export const useSubmit = () => {
  const { user } = useAuth();
  const { setIsEdit, updateList, setError, ruleSettingList } = useRule();

  const validationRules = (values: ReceiptDealApprovalRule[]) => {
    for (const item of values) {
      const { approval_rule_id, advanced_role_list, normal_role_list } = item;
      if (item.rule_type !== ReceiptDealRuleType.ReceiptDealRuleTypeDefault && !advanced_role_list?.length) {
        message.error('高级审核角色不得为空');
        setError(draft => {
          draft[approval_rule_id] = {
            ...draft[approval_rule_id],
            advancedListError: true
          };
        });
        return false;
      }
      if (item.rule_type !== ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal && !normal_role_list?.length) {
        message.error('普通审核角色不得为空');
        setError(draft => {
          draft[approval_rule_id] = {
            ...draft[approval_rule_id],
            normalListError: true
          };
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validationRules(updateList)) {
      return Promise.reject();
    }

    const diffList = getDiff(ruleSettingList, updateList);

    const rule_list = diffList.map(item => {
      const { approval_rule_id, advanced_role_list, normal_role_list, ...rest } = item;
      const advanced_role_id_list = advanced_role_list?.map(i => i.approval_role_id);
      const normal_role_id_list = normal_role_list?.map(i => i.approval_role_id);

      if (isFETempId(approval_rule_id)) {
        return {
          ...rest,
          advanced_role_id_list,
          normal_role_id_list
        };
      }
      return {
        ...rest,
        approval_rule_id,
        advanced_role_id_list,
        normal_role_id_list
      };
    });

    return mulUpsertRule({
      rule_list,
      operation_info: {
        operator: user?.user_id ?? '',
        operation_type: DealOperationType.DOTApprovalRuleReset,
        operation_source: OperationSource.OperationSourceApproveReceiptDeal
      }
    })
      .then(() => {
        message.success('修改成功！');
        setIsEdit(false);
      })
      .catch(() => {
        message.error('修改失败！');
      });
  };
  return { handleSubmit };
};
