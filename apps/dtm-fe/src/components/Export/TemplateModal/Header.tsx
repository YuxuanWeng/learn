import { ActionInput } from '@fepkg/business/components/ActionInput';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { IconEdit } from '@fepkg/icon-park-react';
import { btnProps } from '../constants';
import { useTemplateModal } from './TemplateModalProvider';

export const Header = () => {
  const {
    templates,
    selectedTemplate,
    isDefaultSelected,
    mdlState,
    checkExists,
    checkRename,
    handleEdit,
    handleEditCancel,
    handleSave,
    update
  } = useTemplateModal();

  const handleValidate = async (val: string) => {
    if (!val) {
      message.error('不允许为空');
      return false;
    }
    const { exist, data } = await checkExists(selectedTemplate?.id);
    if (!exist) return false;

    const { rename } = await checkRename(data, selectedTemplate?.id, val);
    return !rename;
  };

  const handleRename = (val: string) => {
    const selectedIdx = templates.findIndex(item => item.id === selectedTemplate?.id);
    templates[selectedIdx].label = val;

    update([...templates]);
  };

  return (
    <SettingLayout.Header>
      <ActionInput
        defaultValue={selectedTemplate?.label}
        showTrigger={!isDefaultSelected}
        onValidate={handleValidate}
        onSubmit={handleRename}
      />

      {!mdlState.editing ? (
        <Button
          {...btnProps}
          icon={<IconEdit />}
          onClick={handleEdit}
        >
          编辑
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            {...btnProps}
            type="gray"
            onClick={handleEditCancel}
          >
            取消
          </Button>
          <Button
            {...btnProps}
            loading={mdlState.loading}
            disabled={mdlState.loading}
            onClick={handleSave}
          >
            保存
          </Button>
        </div>
      )}
    </SettingLayout.Header>
  );
};
