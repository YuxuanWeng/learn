import { Modal } from '@fepkg/components/Modal';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { ExportProps } from '../types';
import { AddModal } from './AddModal';
import { Aside } from './Aside';
import { Content } from './Content';
import { Header } from './Header';
import { TemplateModalProvider, useTemplateModal } from './TemplateModalProvider';

const Inner = ({ visible, onCancel, ...restProps }: ExportProps.TemplateModal) => {
  const { mdlState } = useTemplateModal();

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      title="导出模版预设"
      width={638}
      draggable={false}
      footer={null}
      onCancel={handleCancel}
      {...restProps}
    >
      <SettingLayout
        key={mdlState.selectedId}
        containerCls="h-[552px]"
        aside={<Aside />}
        header={<Header />}
      >
        <Content key={String(mdlState.editing)} />
      </SettingLayout>
    </Modal>
  );
};

export const TemplateModal = (props: ExportProps.TemplateModal) => {
  const { visible } = props;

  if (!visible) return null;

  return (
    <TemplateModalProvider>
      <Inner {...props} />
      <AddModal />
    </TemplateModalProvider>
  );
};
