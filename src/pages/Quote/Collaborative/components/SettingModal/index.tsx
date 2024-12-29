import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { useAtom } from 'jotai';
import { settingMdlOpenAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { Body } from './Broker/Body';
import { Head } from './Broker/Head';
import { GroupContainer } from './Group';
import { useGroupSetting } from './providers';

export const SettingModal = () => {
  const [open, setOpen] = useAtom(settingMdlOpenAtom);
  const { selectedGroup, setSelectedGroupId, panelBrokerGroupId } = useGroupSetting();

  const handleClose = () => {
    setOpen(false);
    setSelectedGroupId(panelBrokerGroupId);
  };

  return (
    <Modal
      keyboard
      confirmByEnter
      visible={open}
      width={600}
      draggable={false}
      title={<Dialog.Header>协同分组配置</Dialog.Header>}
      footerProps={{ style: { padding: 12 } }}
      onCancel={handleClose}
      footer={null}
    >
      <SettingLayout
        key={selectedGroup?.id}
        containerCls="h-[368px]"
        header={<Head />}
        aside={<GroupContainer />}
      >
        <Body />
      </SettingLayout>
    </Modal>
  );
};
