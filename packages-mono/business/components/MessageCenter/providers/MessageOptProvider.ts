import { mulDeleteMessage } from '@fepkg/services/api/message/mul-delete';
import { mulReadMessage } from '@fepkg/services/api/message/mul-read';
import { MessageMulGet } from '@fepkg/services/types/message/mul-get';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { MessageOptProps } from '../types';
import { useMessageCenterData } from './MessageCenterDataProvider';

export const MessageOptContainer = createContainer((initialState?: MessageOptProps) => {
  const { onMessageClick } = initialState ?? {};
  const queryClient = useQueryClient();

  const { queryKey, messageList } = useMessageCenterData();

  /** 已读 */
  const readMessageMutation = useMutation({
    mutationFn(messageId?: string) {
      if (!messageId) {
        return Promise.reject(new Error('messageId is undefined!'));
      }
      return mulReadMessage({ message_id_list: [messageId] });
    },
    onMutate(targetId) {
      const cache = queryClient.getQueryData<MessageMulGet.Response | undefined>(queryKey, { exact: true });

      // 乐观更新
      queryClient.setQueryData(queryKey, {
        ...cache,
        message_list: messageList.map(item => {
          if (item.message_id === targetId) {
            return { ...item, flag_read: true };
          }
          return item;
        })
      });

      // 乐观更新失败的回滚函数
      return () => {
        // 乐观更新失败后的回滚
        queryClient.setQueryData(queryKey, cache);
      };
    },
    onError(_, __, restoreCache) {
      // 失败时回滚缓存内的内容
      restoreCache?.();
    }
  });

  /** 删除message */
  const deleteMessageMutation = useMutation({
    mutationFn(messageId?: string) {
      if (!messageId) {
        return Promise.reject(new Error('messageId is undefined!'));
      }
      return mulDeleteMessage({ message_id_list: [messageId] });
    },
    onMutate(targetId) {
      const cache = queryClient.getQueryData<MessageMulGet.Response | undefined>(queryKey, { exact: true });
      // 乐观更新
      queryClient.setQueryData(queryKey, {
        ...cache,
        message_list: messageList.filter(item => {
          return item.message_id !== targetId;
        })
      });

      // 乐观更新失败的回滚函数
      return () => {
        // 乐观更新失败后的回滚
        queryClient.setQueryData(queryKey, cache);
      };
    },
    onError(_, __, restoreCache) {
      // 失败时回滚缓存内的内容
      restoreCache?.();
    }
  });

  /** 一键已读 */
  const readAllMessage = useMemoizedFn(() => {
    return mulReadMessage({ read_time: Date.now().toString() });
  });

  return {
    readMessage: readMessageMutation.mutate,
    readAllMessage,

    deleteMessage: deleteMessageMutation.mutate,

    onMessageClick
  };
});

export const MessageOptProvider = MessageOptContainer.Provider;
export const useMessageOpt = MessageOptContainer.useContainer;
