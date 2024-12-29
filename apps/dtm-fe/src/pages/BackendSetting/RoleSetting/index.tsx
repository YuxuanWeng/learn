import { useState } from 'react';
import { ModalUtils } from '@fepkg/components/Modal';
import { AccessCode } from '@fepkg/services/access-code';
import { useProductParams } from '@/hooks/useProductParams';
import { useAuth } from '@/providers/AuthProvider';
import { isEqual } from 'lodash-es';
import { Header } from '../Header';
import { RoleTable } from './RoleTable';
import { useSubmit } from './hooks/useSubmit';
import { RoleProvider, useRole } from './providers/RoleProvider';

const RoleSettingInner = () => {
  const { access } = useAuth();
  const { isEdit, setIsEdit, roleSettingList, updateList, onEdit, refetchRole, isLoading } = useRole();
  const [saveLoading, setSaveLoading] = useState(false);
  const { handleSubmit } = useSubmit();

  const editable = access?.has(AccessCode?.CodeDTMSettingRoleEdit) && !isLoading;

  const onCancelEdit = () => {
    if (isEqual(roleSettingList, updateList)) {
      setIsEdit(false);
    } else {
      ModalUtils.warning({
        title: '退出编辑',
        content: '您本次更改的内容将不会保存，确定退出编辑吗？',
        okText: '确定',
        cancelText: '继续编辑',
        onOk: () => {
          setIsEdit(false);
        }
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 m-4 mt-0 overflow-hidden">
      <Header
        title="审核角色"
        isEdit={isEdit}
        onCancel={onCancelEdit}
        onEdit={onEdit}
        editable={editable}
        saveLoading={saveLoading}
        onSave={async () => {
          setSaveLoading(true);
          handleSubmit().finally(() => {
            setSaveLoading(false);
            refetchRole();
          });
        }}
      />
      <RoleTable />
    </div>
  );
};

const RoleSetting = () => {
  const { productType } = useProductParams(); // 不同台子切换时重置组件所有状态
  return (
    <RoleProvider key={productType}>
      <RoleSettingInner />
    </RoleProvider>
  );
};

export default RoleSetting;
