import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { updateChatScript } from '@/common/services/api/algo/quick-chat-api/update-chat-scrpt';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap } from '../constants';
import { useChatScriptData } from '../queries/useChatScriptData';

/** 话术配置上下文 */
const ChatScriptContainer = createContainer(() => {
  const [visible, setVisible] = useState(false);
  const config = useChatScriptData(!visible);

  const { productType } = useProductParams();

  const close = () => {
    setVisible(false);
  };

  const open = () => {
    setVisible(true);
  };

  const save = async () => {
    await updateChatScript({
      chat_script_list: Object.values(config.chatScriptList),
      product_type: BdsProductTypeMap[productType]
    });
    await config.refetch();
    close();
  };

  return { ...config, visible, save, setVisible, close, open };
});

export const ChatScriptProvider = ChatScriptContainer.Provider;
export const useChatScript = ChatScriptContainer.useContainer;
