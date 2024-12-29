import { Button } from '@fepkg/components/Button';
import { Modal } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { AddGroupModal } from '@/components/AddGroupModal';
import { useDealPanel } from '../../provider';
import { GroupContainer } from './components/group';
import { Body } from './components/trader/Body';
import { Header } from './components/trader/Header';
import { useGroupConfig } from './provider';

const Inner = () => {
  const { groups, groupContainerRef, setAddGroupModalVisible } = useGroupConfig();
  if (!groups.length) {
    return (
      <div className="bg-gray-750 relative flex items-center h-[368px]  w-full">
        <Placeholder
          type="no-setting"
          size="xs"
          label={
            <div className=" flex items-center text-gray-200 flex-col gap-3">
              <span>暂未配置分组</span>
              <Button
                className="w-[116px]"
                onClick={() => {
                  setAddGroupModalVisible(true);
                }}
              >
                添加分组
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div
      className="h-[368px] focus:outline-none"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={groupContainerRef}
    >
      <SettingLayout
        containerCls="h-full"
        aside={<GroupContainer />}
        header={<Header />}
      >
        <Body />
      </SettingLayout>
    </div>
  );
};

export const GroupSettingModal = () => {
  const { groupSettingVisible, setGroupSettingVisible } = useDealPanel();
  const { addGroupModalVisible, addGroup, setAddGroupModalVisible } = useGroupConfig();

  const handleClose = () => {
    setGroupSettingVisible(false);
  };

  return (
    <>
      <Modal
        keyboard
        confirmByEnter
        visible={groupSettingVisible}
        width={600}
        title="分组配置"
        onCancel={handleClose}
        footer={null}
      >
        <Inner />
      </Modal>
      <AddGroupModal
        visible={addGroupModalVisible}
        onOk={addGroup}
        onCancel={() => {
          setAddGroupModalVisible(false);
        }}
      />
    </>
  );
};
