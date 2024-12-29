import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { IconAdd } from '@fepkg/icon-park-react';
import { v4 as uuidv4 } from 'uuid';
import { AddGroupModal } from '@/components/AddGroupModal';
import { useGroupSetting } from '../providers';
import { Body } from './Body';
import { Footer } from './Footer';
import { Head } from './Head';

export const GroupContainer = () => {
  const { handleAddGroup, checkValid } = useGroupSetting();

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
    const valid = checkValid(val, true);
    if (!valid) return false;
    const added = await handleAddGroup({ id: uuidv4(), name: val });
    if (added) handleCloseAddGroupModal();
    return added;
  };

  return (
    <>
      <SettingLayout.Aside
        label="分组列表"
        suffix={
          <Button.Icon
            type="primary"
            plain
            icon={<IconAdd />}
            onClick={handleOpenAddGroupModal}
          />
        }
      >
        <Body />
      </SettingLayout.Aside>
      {visible && (
        <AddGroupModal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCloseAddGroupModal}
        />
      )}
    </>
  );

  return (
    <div className="w-40 bg-gray-750 border border-solid border-transparent border-r-gray-600 relative">
      <Head />
      <div className="component-dashed-x-600 mx-3" />
      <Body />
      <Footer />
    </div>
  );
};
