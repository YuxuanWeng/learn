import cx from 'classnames';
import { message } from '@fepkg/components/Message';
import { Switch } from '@fepkg/components/Switch';
import { ReceiptDealApprovalRole, ReceiptDealApprovalRule } from '@fepkg/services/types/bds-common';
import { RoleSelect } from './RoleSelect';
import { switchColWidth } from './constants';
import { useRule } from './providers/RuleProvider';

const sortRoleByLevel = (a: ReceiptDealApprovalRole, b: ReceiptDealApprovalRole) =>
  a.approval_role_level - b.approval_role_level;

export const FormItem = ({
  approval_rule_id,
  is_active,
  advanced_role_list,
  normal_role_list,
  hideSwitch,
  hideAdvancedRole,
  hideNormalRole,
  isTitle
}: ReceiptDealApprovalRule & {
  hideSwitch?: boolean;
  hideAdvancedRole?: boolean;
  hideNormalRole?: boolean;
  isTitle?: boolean;
}) => {
  const { isEdit, setUpdateList, error, setError } = useRule();

  const errorState = error[approval_rule_id];

  const onRuleActiveChange = val => {
    setUpdateList(draft => {
      const item = draft.find(i => i.approval_rule_id === approval_rule_id);
      if (item) {
        item.is_active = val;
      }
    });
  };
  const onChangeAdvancedRole = (val: ReceiptDealApprovalRole[]) => {
    setUpdateList(draft => {
      const item = draft.find(i => i.approval_rule_id === approval_rule_id);
      if (!item) {
        return;
      }

      if (val.length > 5) {
        message.error('普通审核角色不得超过5个');
        // 超过五个只让减不让增
        if (item.advanced_role_list && val.length > item.advanced_role_list.length) return;
      }

      item.advanced_role_list = val;
    });
    setError(draft => {
      draft[approval_rule_id] = {
        ...draft[approval_rule_id],
        advancedListError: !val?.length
      };
    });
  };
  const onChangeNormalRole = (val: ReceiptDealApprovalRole[]) => {
    setUpdateList(draft => {
      const item = draft.find(i => i.approval_rule_id === approval_rule_id);

      if (!item) {
        return;
      }

      if (val.length > 2) {
        message.error('普通审核角色不得超过2个');
        // 超过两个只让减不让增
        if (item.normal_role_list && val.length > item.normal_role_list.length) return;
      }
      item.normal_role_list = val;
    });

    setError(draft => {
      draft[approval_rule_id] = {
        ...draft[approval_rule_id],
        normalListError: !val?.length
      };
    });
  };

  const advancedRoleList = [...(advanced_role_list ?? [])].sort(sortRoleByLevel);
  const normalRoleList = [...(normal_role_list ?? [])].sort(sortRoleByLevel);

  return (
    <div className="flex flex-1 w-0">
      <div className={cx('flex flex-shrink-0 justify-center items-center', switchColWidth)}>
        {!hideSwitch && (
          <Switch
            tabIndex={-1}
            disabled={!isEdit}
            checked={is_active}
            onChange={onRuleActiveChange}
          />
        )}
      </div>
      <div className="flex flex-1 items-start overflow-hidden">
        {!hideAdvancedRole && (
          <RoleSelect
            error={errorState?.advancedListError}
            roleList={advancedRoleList}
            onChange={onChangeAdvancedRole}
            isEdit={isEdit}
            theme={isTitle ? undefined : 'dark'}
          />
        )}
      </div>
      <div className="flex flex-1 items-start overflow-hidden">
        {!hideNormalRole && (
          <RoleSelect
            error={errorState?.normalListError}
            roleList={normalRoleList}
            onChange={onChangeNormalRole}
            isEdit={isEdit}
            theme={isTitle ? undefined : 'dark'}
          />
        )}
      </div>
    </div>
  );
};
