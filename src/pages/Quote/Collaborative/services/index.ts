import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { QueryKey } from '@tanstack/react-query';
import { QuoteDraftDetail, QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { QuoteDraftMessageListQueryResult } from '@/common/services/hooks/useLiveQuery/type';
import { miscStorage } from '@/localdb/miscStorage';

export const draftDataIncrementalUpdater = (
  queryKey: QueryKey,
  response: LocalQuoteDraftMessageList.Response,
  data: QuoteDraftMessageListQueryResult
): QuoteDraftMessageListQueryResult => {
  const userId = miscStorage.userInfo?.user_id;

  console.log('draftDataIncrementalUpdater', response, data);

  const {
    upsert_message_list = [],
    upsert_detail_list = [],
    delete_message_id_list = [],
    base_response,
    quote_draft_message_list,
    ...restResponse
  } = response;
  let { messages = [] } = data;

  const messagesLen = messages.length;
  const upsertMessagesLen = upsert_message_list.length;
  const upsertDetailsLen = upsert_detail_list.length;

  const upsertMessageCache = new Map<string, QuoteDraftMessage | undefined>();
  const upsertDetailCache = new Map<string, QuoteDraftDetail>();
  /** 需要被移除的 message id 集合 */
  const removeMessageIds = new Set<string>(delete_message_id_list);

  for (let i = 0; i < upsertMessagesLen; i++) {
    const message = upsert_message_list[i];
    upsertMessageCache.set(message.message_id, message);
  }

  for (let i = 0; i < upsertDetailsLen; i++) {
    const detail = upsert_detail_list[i];
    if (detail?.message_id) upsertMessageCache.set(detail.message_id, void 0);
    upsertDetailCache.set(detail.detail_id, detail);
  }

  if (upsertMessageCache.size) {
    const updateMessageIds = new Set<string>();

    let insertMessages: QuoteDraftMessage[] = [];

    if (messagesLen) {
      const messageIds = new Set(messages.map(message => message.message_id));

      for (let i = 0; i < messagesLen; i++) {
        const { message_id } = messages[i];
        if (upsertMessageCache.has(message_id) && messageIds.has(message_id)) {
          updateMessageIds.add(message_id);
        }
      }

      for (let i = 0; i < upsertMessagesLen; i++) {
        const message = upsert_message_list[i];
        if (!updateMessageIds.has(message.message_id)) insertMessages.push(message);
      }
    } else {
      insertMessages = upsert_message_list;
    }

    messages = [...messages, ...insertMessages].sort(
      (a, b) => Number(b?.create_time ?? 0) - Number(a?.create_time ?? 0)
    );
  }

  messages = messages.map(message => {
    const upsertMessage = upsertMessageCache.get(message.message_id);

    if (upsertMessage) {
      const { detail_order_list = [], operator, create_time, sync_version } = upsertMessage;

      const details = [...(upsertMessage?.quote_draft_detail_list ?? [])];

      const detailIds = detail_order_list.flatMap(order => order.detail_id_list).filter(Boolean);

      detailIds.forEach(id => {
        const upsertDetail = upsertDetailCache.get(id);
        if (upsertDetail) {
          const detailIdx = details.findIndex(detail => detail.detail_id === upsertDetail.detail_id);
          if (detailIdx > -1) details.splice(detailIdx, 1, upsertDetail);
          else details.push(upsertDetail);
        }
      });

      // 如果 operator 为登录用户，并且不是识别（sync_version === create_time)，不需要对这条信息的 ITB 信息进行改动
      // ITB 信息重置主要通过 message.sync_version
      if (
        operator === userId &&
        sync_version !== create_time &&
        upsertMessage?.modified_status === message?.modified_status
      ) {
        return { ...upsertMessage, quote_draft_detail_list: details, sync_version: message?.sync_version };
      }
      return { ...upsertMessage, quote_draft_detail_list: details };
    }
    return message;
  });

  return { messages: messages.filter(message => !removeMessageIds.has(message.message_id)), ...restResponse };
};
