import { Button } from '@fepkg/components/Button';
import { Modal, ModalProps } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useDealPanel } from '../../provider';
import { ChangeAgentModal } from './ChangeAgentModal';
import { InstList } from './InstList';
import { RateSetting } from './RateSetting';
import { useAgency } from './provider';

const Inner = () => {
  const { agencyOptions, agentContainerRef, setChangeAgentModalVisible } = useAgency();
  if (!agencyOptions?.length) {
    return (
      <div className="flex h-[368px] select-none">
        <Placeholder
          type="no-setting"
          size="xs"
          label={
            <div className="flex flex-col items-center">
              <span className="text-gray-200">暂未配置需代付</span>
              <span className="text-gray-300">请点击下方按钮添加需代付机构</span>
              <Button
                className="w-[123px] mt-2"
                onClick={() => {
                  setChangeAgentModalVisible(true);
                }}
              >
                添加需代付机构
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-[368px] select-none focus:outline-none"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={agentContainerRef}
    >
      {/* 机构列表 */}
      <InstList />
      {/* 费率设置 */}
      <RateSetting />
    </div>
  );
};

export const AgentModal = (props: ModalProps) => {
  const { agentVisible, setAgentVisible } = useDealPanel();
  const { setCostIsEditing } = useAgency();
  return (
    <Modal
      width={744}
      title="需代付机构"
      footer={null}
      keyboard
      onCancel={() => {
        setAgentVisible(false);
        setCostIsEditing(false);
      }}
      visible={agentVisible}
      {...props}
    >
      <Inner />
      <ChangeAgentModal />
    </Modal>
  );
};
