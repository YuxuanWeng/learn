import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { v4 as uuidv4 } from 'uuid';
import { AddGroupModal } from '@/components/AddGroupModal';
import { useGroupSetting } from '../providers';

export const Footer = () => {
  const { handleAddGroup } = useGroupSetting();

  const [visible, setVisible] = useState(false);

  const handleOpenAddGroupModal = () => {
    setVisible(true);
  };

  const handleCloseAddGroupModal = () => {
    setVisible(false);
  };

  const handleOk = async (val?: string) => {
    if (!val) {
      message.error('分组名称不能为空');
      return false;
    }
    const added = await handleAddGroup({ id: uuidv4(), name: val });
    if (added) handleCloseAddGroupModal();
    return added;
  };

  return (
    <>
      <Button
        type="primary"
        ghost
        className="h-8 w-[136px] absolute bottom-3 left-0 right-0 m-auto"
        onClick={handleOpenAddGroupModal}
      >
        添加分组
      </Button>

      {visible && (
        <AddGroupModal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCloseAddGroupModal}
        />
      )}
    </>
  );
};
