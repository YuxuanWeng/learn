import { Modal } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useHotKeys } from '../../hooks/useHotKeys';
import { useTraderConfig } from '../../providers/TraderConfigContainer';
import { Body } from './Body';
import { ModalTitle } from './ModalTitle';
import { Traders } from './Traders';

/** 交易员挂单设置 */
export const TraderConfigModal = () => {
  const { visible, traderConfigList, closeModal } = useTraderConfig();
  useHotKeys();

  const containerRender = () => {
    if (!traderConfigList?.length) {
      return (
        <div className="flex-center h-full w-full">
          <Placeholder
            type="no-data"
            size="xs"
            label="暂未交易员"
          />
        </div>
      );
    }
    return (
      <>
        <Traders />
        <Body />
      </>
    );
  };

  return (
    <Modal
      keyboard
      visible={visible}
      draggable={false}
      width={400}
      title={<ModalTitle />}
      footer={null}
      onCancel={closeModal}
    >
      <div className="flex bg-gray-700 h-[218px]">{containerRender()}</div>
    </Modal>
  );
};
