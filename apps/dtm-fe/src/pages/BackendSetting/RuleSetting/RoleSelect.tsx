import cx from 'classnames';
import { Select } from '@fepkg/components/Select';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Theme } from '@fepkg/components/types';
import { ReceiptDealApprovalRole } from '@fepkg/services/types/bds-common';
import { useRule } from './providers/RuleProvider';

const TextList = ({ list }: { list?: ReceiptDealApprovalRole[] }) => {
  return (
    <div className="mx-4 flex flex-wrap gap-1 my-3">
      {list?.map(item => {
        const { approval_role_name = '' } = item;

        return (
          <span
            key={item.approval_role_id}
            className="bg-gray-600 px-3 py-[1px] rounded font-normal text-gray-000"
          >
            {approval_role_name.length > 6 ? (
              <Tooltip content={approval_role_name}>
                <span className="cursor-pointer">{approval_role_name.slice(0, 6)}...</span>
              </Tooltip>
            ) : (
              approval_role_name
            )}
          </span>
        );
      })}
    </div>
  );
};

type IRoleSelect = {
  error?: boolean;
  isEdit?: boolean;
  roleList?: ReceiptDealApprovalRole[];
  onChange?: (val: ReceiptDealApprovalRole[]) => void;
  theme?: Theme;
};
export const RoleSelect = ({ error, roleList, onChange, isEdit, theme }: IRoleSelect) => {
  const { roleSettingList } = useRule();
  const value = roleList?.map(i => i.approval_role_id) ?? [];

  const options = roleSettingList.map(i => {
    return {
      label: i.approval_role_name,
      value: i.approval_role_id,
      disabled: !i.role_member_list?.length
    };
  });
  const handleChange = (val: string[]) => {
    onChange?.(
      val
        .map(i => {
          return roleSettingList.find(inner => inner.approval_role_id === i);
        })
        .filter(Boolean)
    );
  };

  return isEdit ? (
    <div className="w-full h-12 flex items-center px-4">
      <Select<string[]>
        multiple
        placeholder="请选择"
        error={error}
        className={cx('w-full max-w-[320px]', theme === 'dark' && '!bg-gray-800')}
        options={options}
        value={value}
        onChange={handleChange}
      />
    </div>
  ) : (
    <TextList list={roleList} />
  );
};
