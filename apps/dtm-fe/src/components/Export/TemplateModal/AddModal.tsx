import { useRef } from 'react';
import { Input } from '@fepkg/components/Input';
import { Modal, ModalUtils } from '@fepkg/components/Modal';
import { v4 } from 'uuid';
import { DEFAULT_EXPORT_TEMPLATE_VALUE, MAX_TEMPLATE_COUNT } from '../constants';
import { ExportTemplate } from '../types';
import { useTemplateModal } from './TemplateModalProvider';

export const AddModal = () => {
  const { addMdlState, updateMdlState, updateAddMdlState, checkRename, update } = useTemplateModal();

  const inputRef = useRef<HTMLInputElement>(null);

  if (!addMdlState.open) return null;

  const handleCancel = () => {
    updateAddMdlState({ open: false, keyword: '', error: false });
  };

  const handleConfirm = async () => {
    if (!addMdlState.keyword) return;

    const { rename, data = [] } = await checkRename(undefined, undefined, addMdlState.keyword);

    // 检查模板是否重名
    if (rename) {
      updateAddMdlState(draft => {
        draft.error = true;
      });

      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    // 检查是否已达模板上限
    if (data.length >= MAX_TEMPLATE_COUNT) {
      ModalUtils.warning({
        title: '模板上限',
        content: `当前已有${MAX_TEMPLATE_COUNT}个模板，已达上限!`,
        okText: '我知道了',
        showCancel: false
      });
    } else {
      const template: ExportTemplate = {
        id: v4(),
        label: addMdlState.keyword,
        value: DEFAULT_EXPORT_TEMPLATE_VALUE
      };

      update([...data, template]);

      // update 有乐观更新，可以不需要 await 直接更新 selectedId
      updateMdlState(draft => {
        draft.editing = false;
        draft.selectedId = template.id;
        draft.updated = DEFAULT_EXPORT_TEMPLATE_VALUE;
      });
    }

    handleCancel();
  };

  if (!addMdlState.open) return null;

  return (
    <Modal
      visible={addMdlState.open}
      className="[&_.ant-modal-body]:px-3 [&_.ant-modal-body]:py-2"
      title="添加模板"
      width={320}
      draggable={false}
      confirmByEnter
      footerProps={{ centered: true, confirmBtnProps: { disabled: !addMdlState.keyword } }}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <Input
        ref={inputRef}
        label="模板名称"
        className="bg-gray-800"
        autoFocus
        maxLength={10}
        error={addMdlState.error}
        value={addMdlState.keyword}
        onChange={val =>
          updateAddMdlState(draft => {
            draft.keyword = val;
            draft.error = false;
          })
        }
      />
    </Modal>
  );
};
