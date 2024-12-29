import { useMemo, useRef } from 'react';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { SystemType } from '@fepkg/components/Logo';
import { fetchMulMessage } from '@fepkg/services/api/message/mul-get';
import { Enable } from '@fepkg/services/types/bdm-enum';
import { Message } from '@fepkg/services/types/bds-common';
import { FrontendSyncMsgScene, MessageSource, MessageType } from '@fepkg/services/types/bds-enum';
import { MessageMulGet } from '@fepkg/services/types/message/mul-get';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { useMessageFeedLiveQuery } from '../../../hooks/message-feed/useMessageFeedLiveQuery';
import { getMessageFeedChannel } from '../../../hooks/message-feed/utils';
import { MESSAGE_HEIGHT } from '../List/BackTop';
import { MessageCenterDataProps, UserMessage } from '../types';
import { useMessageCenterCommonAction } from './MessageCenterCommonActionProvider';
import { useNotification } from './NotificationProvider';
import { useToastConfig } from './ToastConfigProvider';

const MessageCenterQueryKey = ['UserMessage'];
const getMessageFromSystem = (source?: MessageSource): SystemType | undefined => {
  if (!source) {
    return undefined;
  }
  const MessageFromSystem: { [k in MessageSource]?: SystemType } = {
    [MessageSource.MessageSourceDTM]: 'dtm',
    [MessageSource.MessageSourceOMS]: 'oms'
  };
  return MessageFromSystem[source];
};

export const MessageCenterDataContainer = createContainer((initialState?: MessageCenterDataProps) => {
  const { userId } = initialState ?? {};

  const { isToast } = useToastConfig();
  const { listScrollTop, setHasNewMessage } = useMessageCenterCommonAction();
  const { toast, isToasting } = useNotification();

  const toastCount = useRef(0);
  const handleWSMessage = useMemoizedFn((wsData: Message, prevData?: MessageMulGet.Response) => {
    const prevMessageList = prevData?.message_list ?? [];
    const changeIndex = prevMessageList.findIndex(i => i.message_id === wsData.message_id);

    // 删除message
    if (wsData.enable !== Enable.DataEnable) {
      return {
        ...prevData,
        message_list: prevMessageList.filter(i => i.message_id !== wsData.message_id)
      };
    }

    // 修改message
    if (changeIndex !== -1) {
      const curMessageList = [...prevMessageList];
      curMessageList.splice(changeIndex, 1, wsData);
      return {
        ...prevData,
        message_list: curMessageList
      };
    }

    // 处理无效message，若变更的消息早于第一条消息的时间则无需处理，若消息中心暂无消息，则均认为是新增
    if (
      prevMessageList[0] &&
      (prevMessageList[0]?.create_time === undefined ||
        Number(wsData.create_time) - Number(prevMessageList[0].create_time) < 0)
    ) {
      return {
        ...prevData,
        message_list: prevMessageList
      };
    }

    // 新增message
    if ((listScrollTop?.current ?? 0) > MESSAGE_HEIGHT) {
      setHasNewMessage?.(true);
    }

    const curMessageList = [...prevMessageList];
    const lastIndex = curMessageList.findIndex(i => i.create_time < wsData.create_time);
    // 第一个的时间就在新消息之前则说明消息最新，直接插入头部
    if (lastIndex === 0) {
      curMessageList.unshift(wsData);
    } else if (lastIndex === -1) {
      // 如果没找到则说明消息最旧，直接插入尾部
      curMessageList.push(wsData);
    } else {
      // 找到则按index插入
      curMessageList.splice(lastIndex, 0, wsData);
    }

    if (!isToast) {
      return { ...prevData, message_list: curMessageList };
    }
    /** 弹窗逻辑 */
    const { message_id: messageId, source, message_type } = wsData;
    const system = getMessageFromSystem(source);

    if (!isToasting()) {
      toastCount.current = 1;
      switch (message_type) {
        case MessageType.MessageTypeUrgentDeal: {
          toast({
            messageId,
            system,
            content: (
              <span>
                <span className="pr-1 text-primary-100">{wsData.detail?.sender_name ?? '-'}</span>
                催了你一下，请尽快处理！
              </span>
            )
          });
          break;
        }
        default: {
          toast({
            icon: null,
            messageId,
            system,
            content: (
              <BadgeV2
                dot
                style={{ top: 6, right: -6 }}
              >
                <div className="pl-1">[当前版本不支持查看消息类型，请升级至最新版本]</div>
              </BadgeV2>
            )
          });
          break;
        }
      }
    } else {
      toastCount.current += 1;
      toast({
        messageId,
        system,
        content: (
          <span>
            你有<span className="px-1 text-primary-100">{toastCount.current}</span>条催单消息，请尽快处理！
          </span>
        )
      });
    }

    return { ...prevData, message_list: curMessageList.slice(0, 200) };
  });

  const { data, queryKey, refetch } = useMessageFeedLiveQuery<MessageMulGet.Response>({
    centrifugeChannel: getMessageFeedChannel(FrontendSyncMsgScene.UserMessage, userId),
    queryKey: MessageCenterQueryKey,
    queryFn: fetchMulMessage,
    handleWSMessage
  });

  const messageList = useMemo(() => {
    const list: UserMessage[] = [...(data?.message_list ?? [])].filter(i => i.enable === Enable.DataEnable);
    const historyDividerIndex = list.findIndex(i => {
      return !moment(normalizeTimestamp(i.create_time)).isSame(moment(), 'day');
    });
    if (historyDividerIndex !== -1) {
      list[historyDividerIndex] = {
        ...list[historyDividerIndex],
        isHistoryDivider: true
      };
    }
    return (
      list
        // 只展示48小时内的消息
        .filter(i => Date.now() - (normalizeTimestamp(i.create_time) ?? 0) <= 48 * 60 * 60 * 1000)
        .slice(0, 200)
    );
  }, [data]);

  const unReadMessageCount = useMemo(() => {
    return [...(messageList ?? [])].filter(i => !i.flag_read).length;
  }, [messageList]);

  return {
    queryKey,
    messageList,
    refetch,

    unReadMessageCount
  };
});

export const MessageCenterDataProvider = MessageCenterDataContainer.Provider;
export const useMessageCenterData = MessageCenterDataContainer.useContainer;
