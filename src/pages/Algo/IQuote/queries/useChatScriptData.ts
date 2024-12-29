import { useEffect } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { APIs } from '@fepkg/services/apis';
import { QuickChatScriptAlgoOperationType } from '@fepkg/services/types/algo-enum';
import type { QuickChatChatScript } from '@fepkg/services/types/common';
import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'lodash-es';
import { useImmer } from 'use-immer';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { fetchChatScript } from '@/common/services/api/algo/quick-chat-api/get-chat-script';
import { useProductParams } from '@/layouts/Home/hooks';
import { defaultChatScriptConfig } from '../components/ChatScriptModal/constants';
import { BdsProductTypeMap } from '../constants';

/** 话术列表 */
export const useChatScriptData = (enabled = true) => {
  const { productType } = useProductParams();

  const defaultMap = keyBy(defaultChatScriptConfig, 'operation_type') as {
    [key in QuickChatScriptAlgoOperationType]: QuickChatChatScript;
  };
  const [chatScriptList, setChatScriptList] = useImmer<{
    [key in QuickChatScriptAlgoOperationType]: QuickChatChatScript;
  }>(defaultMap);

  const { refetch } = useQuery({
    queryKey: [APIs.algo.getChatScript, productType] as const,
    queryFn: async ({ signal }) => {
      const res = await fetchChatScript({ product_type: BdsProductTypeMap[productType] }, { signal });
      return res.chat_script_list;
    },
    enabled,
    refetchOnWindowFocus: false,
    onSuccess: data => {
      setChatScriptList({ ...defaultMap, ...keyBy(data, 'operation_type') });
    }
  });

  // 仅用于跨进程共享数据
  const key = getLSKeyWithoutProductType(LSKeys.IQuoteScripts);
  const [chatScriptListFromStorage, setChatScriptListFromStorage] = useLocalStorage(key, chatScriptList);

  useEffect(() => {
    setChatScriptListFromStorage(chatScriptList);
  }, [chatScriptList]);

  return { chatScriptList, refetch, setChatScriptList, chatScriptListFromStorage };
};
