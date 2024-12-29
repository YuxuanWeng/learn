import { ChatScriptOptions } from '@fepkg/business/constants/options';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Modal } from '@fepkg/components/Modal';
import { QuickChatScriptAlgoOperationType } from '@fepkg/services/types/algo-enum';
import { useChatScript } from '../../providers/ChatScriptProvider';
import { ChatScriptInput } from './ChatScriptInput';

export const ChatScriptModal = () => {
  const { visible, close, save, chatScriptList, setChatScriptList } = useChatScript();

  const handleInputChange = (val: string, key: QuickChatScriptAlgoOperationType) => {
    setChatScriptList(draft => {
      draft[key].chat_script = val;
    });
  };

  return (
    <Modal
      keyboard
      visible={visible}
      width={400}
      draggable={false}
      title="设置话术"
      onCancel={close}
      onConfirm={save}
      confirmByEnter
      footerProps={{ confirmBtnProps: { label: '保存' }, centered: true }}
    >
      <div className="px-3 py-3">
        {ChatScriptOptions.map((v, i) => {
          const value = Object.values(chatScriptList)?.find(item => item.operation_type === v.value)?.chat_script;
          return (
            <ChatScriptInput
              value={value || ''}
              className={i !== 0 ? 'mt-2' : ''}
              prefix={v.label}
              key={v.value}
              onKeyDown={evt => {
                if (evt.key === KeyboardKeys.Enter) {
                  evt.preventDefault();
                  save();
                }
              }}
              onChange={val => handleInputChange(val, v.value)}
            />
          );
        })}
      </div>
    </Modal>
  );
};
