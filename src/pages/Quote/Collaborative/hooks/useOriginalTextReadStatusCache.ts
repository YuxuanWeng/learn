import { useMemoizedFn } from 'ahooks';
import { LSKeys } from '@/common/constants/ls-keys';
import { LocalforageCache, useLocalforage } from '@/common/hooks/useLocalforage';
import { miscStorage } from '@/localdb/miscStorage';

// string -> userId
// string[] -> 已读消息 Id 列表
type OriginalTextReadStatusCache = LocalforageCache<Map<string, Set<string>>>;

const NAMESPACE = LSKeys.CoQuoteOriginalTextReadStatus;

const getTomorrowTimestamp = () => {
  const today = new Date();

  // 将日期增加一天
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // 获取明天的时间戳（以毫秒为单位）
  return tomorrow.getTime();
};

/** 协同报价查看原文已读状态缓存 */
export const useOriginalTextReadStatusCache = () => {
  const userId = miscStorage.userInfo?.user_id ?? '';
  const [cache, getter, update, , initialized] = useLocalforage<OriginalTextReadStatusCache | null>(NAMESPACE, null);

  const expires = cache?.expires;
  const readMessageIds = cache?.data?.get(userId);

  const updateReadMessageIds = useMemoizedFn(async (messageId: string) => {
    // 这里用 getter 的原因是因为直接用 cache 拿到的都是上一次的值（暂未理解是为什么）
    const data = (await getter())?.data ?? new Map<string, Set<string>>();
    const messageIds = data.get(userId);

    if (messageIds?.size) {
      messageIds.add(messageId);
      data.set(userId, messageIds);
    } else {
      data.set(userId, new Set([messageId]));
    }

    update({ expires: getTomorrowTimestamp(), data });
  });

  return { initialized, readMessageIds, expires, update, updateReadMessageIds };
};
