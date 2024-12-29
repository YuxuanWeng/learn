import { ActionInput } from '@fepkg/business/components/ActionInput';
import { Button } from '@fepkg/components/Button';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { IconChange } from '@fepkg/icon-park-react';
import { useGroupSetting } from '../providers';
import { AddBrokerModal } from './AddModal';

export const Head = () => {
  const { selectedGroup, checkValid, updateGroupName, handleOpenAddBrokerModal } = useGroupSetting();

  if (!selectedGroup) return null;

  const handleValidate = async (targetValue: string) => {
    const res = checkValid(targetValue);
    return res;
  };

  const handleRename = (targetValue: string) => {
    if (targetValue === selectedGroup.name) return;
    updateGroupName(selectedGroup.id, targetValue);
  };

  return (
    <>
      <SettingLayout.Header>
        <ActionInput
          defaultValue={selectedGroup.name}
          showTrigger
          onValidate={handleValidate}
          onSubmit={handleRename}
          placeholder="分组名称修改中.."
        />

        <Button
          plain
          type="primary"
          icon={<IconChange />}
          tooltip={{ content: '变更分组成员' }}
          className="h-6 w-6 !p-0"
          onClick={handleOpenAddBrokerModal}
        />
      </SettingLayout.Header>

      <AddBrokerModal />
    </>
  );
};
