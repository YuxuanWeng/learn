import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { isEqual } from 'lodash-es';

const getChangedQuoteDraftMessage = (oldMessageList: QuoteDraftMessage[], newMessageList: QuoteDraftMessage[]) => {
  const oldMessageMap = new Map<string, QuoteDraftMessage>(oldMessageList.map(m => [m.message_id, m]));
  const newMessageMap = new Map<string, QuoteDraftMessage>(newMessageList.map(m => [m.message_id, m]));
  const upsert_message_list: QuoteDraftMessage[] = [];
  const delete_message_id_list: string[] = [];

  const oldMessageIdList = oldMessageList.map(m => m.message_id);
  const newMessageIdList = newMessageList.map(m => m.message_id);

  // 新增的message
  newMessageIdList.forEach(id => {
    if (!oldMessageIdList.includes(id)) {
      const newMessage = newMessageMap.get(id);
      if (newMessage) {
        upsert_message_list.push(newMessage);
      }
    }
  });
  // 修改的message
  oldMessageIdList.forEach(id => {
    const newMessage = newMessageMap.get(id);
    // 被删除的message
    if (!newMessageIdList.includes(id)) {
      delete_message_id_list.push(id);
    } else if (!isEqual(oldMessageMap.get(id), newMessage) && newMessage) {
      // 被修改的message
      upsert_message_list.push(newMessage);
    }
  });
  return { upsert_message_list, delete_message_id_list };
};

export const getQuoteDraftMessageDiff = (
  oldValue: LocalQuoteDraftMessageList.Response,
  newValue: LocalQuoteDraftMessageList.Response
) => {
  let has_diff = false;
  const { upsert_message_list, delete_message_id_list } =
    getChangedQuoteDraftMessage(oldValue.quote_draft_message_list ?? [], newValue.quote_draft_message_list ?? []) ?? {};

  if (
    oldValue.hasMore !== newValue.hasMore ||
    oldValue.total !== newValue.total ||
    oldValue.latestCreateTime !== newValue.latestCreateTime ||
    upsert_message_list.length ||
    delete_message_id_list.length
  ) {
    has_diff = true;
  }

  return { upsert_message_list, delete_message_id_list, has_diff };
};
