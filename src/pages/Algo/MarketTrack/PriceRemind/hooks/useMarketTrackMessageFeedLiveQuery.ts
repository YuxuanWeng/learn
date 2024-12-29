import { useRef, useState } from 'react';
import { useMessageFeedLiveQuery } from '@fepkg/business/hooks/message-feed/useMessageFeedLiveQuery';
import { getMessageFeedChannel } from '@fepkg/business/hooks/message-feed/utils';
import { Enable, ProductType } from '@fepkg/services/types/bdm-enum';
import { OppositePriceNotification } from '@fepkg/services/types/bds-common';
import { FrontendSyncMsgScene } from '@fepkg/services/types/bds-enum';
import { mulDeleteOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-delete';
import { miscStorage } from '@/localdb/miscStorage';
import { batchGetPriceNotificationList, getRemindKey } from '../../util';

type Props = {
  productType: ProductType;
  // 菜单使用
  usedByMenu?: boolean;
};

export const useMarketTrackMessageFeedLiveQuery = ({ productType, usedByMenu = false }: Props) => {
  // 表示已经删除的对价提醒id 如果是这个的话再收到就跳过
  const hasDeletedNotificationIdListRef = useRef<string[]>([]);

  const [updateNotification, setUpdateNotification] = useState<OppositePriceNotification>();

  const [notificationList, setNotificationList] = useState<OppositePriceNotification[]>([]);

  const firstRef = useRef(true);

  /** 数据过滤，失效的对价提醒删除，只保留有效的对价提醒数据  ⚠️同券，同机构，同交易员同明暗 相关的对价提醒id可能相同，可能不相同，3秒内生成的是相同的，之后生成的不相同 */
  const dataFilter = (list: OppositePriceNotification[]) => {
    const hasDeletedNotificationIdList = hasDeletedNotificationIdListRef.current;
    // 有效的对价提醒数据
    const notificationMap = new Map<string, OppositePriceNotification>();
    /**
     * 无效的对价提醒id
     * 比如  1.同券同方向同机构同交易员的对价提醒(除了最新的一条都是无效的)
     *      2.对价提醒id相同的(只取最新的一条，其他的都是无效的 ps 这种情况指机构或者交易员发生了修改)
     *      3.换交易员之后，quote_id对应的对价提醒都要删掉
     * */
    const invalidNotificationIdList: string[] = [];
    const validNotificationIdList: string[] = [];
    const invalidQuoteIdList: string[] = [];
    const validQuoteIdList: string[] = [];
    // 针对的是换broker的情况 这个场景提醒消息需要消失 quoteId相关的提醒消息都要删除
    for (const notification of list) {
      // 停用
      if (notification.enable === Enable.DataDisable) {
        invalidQuoteIdList.push(notification.quote_id);
        invalidNotificationIdList.push(notification.opposite_price_notification_id);
      }
    }
    for (const notification of list.filter(n => !invalidQuoteIdList.includes(n.quote_id))) {
      const k = getRemindKey(notification);
      const { opposite_price_notification_id, update_time, quote_id } = notification;
      const v = notificationMap.get(k);
      // 相同k的更新时间小的作废
      if (
        (v && Number(v.update_time) > Number(update_time)) ||
        validNotificationIdList.includes(opposite_price_notification_id)
      ) {
        invalidNotificationIdList.push(opposite_price_notification_id);
      } else if (
        // quoteId 存在多条，但是 这个对价提醒id不是有效的     ------  换方向 quoteId不变，notificationId可能发生变化，也可能不变
        validQuoteIdList.includes(quote_id) &&
        !validNotificationIdList.includes(opposite_price_notification_id)
      ) {
        invalidNotificationIdList.push(opposite_price_notification_id);
      } else {
        notificationMap.set(k, notification);
        validNotificationIdList.push(opposite_price_notification_id);
        validQuoteIdList.push(quote_id);
      }
    }
    const validNotificationList = [...notificationMap.values()];
    const shouldDeleteIdList = invalidNotificationIdList.filter(id => !validNotificationIdList.includes(id));
    if (shouldDeleteIdList.length > 0) {
      // 避免数组元素过多，清空无效的数据
      if (hasDeletedNotificationIdList.length > 70) {
        hasDeletedNotificationIdList.splice(0, 50);
      }
      hasDeletedNotificationIdListRef.current = [...hasDeletedNotificationIdList, ...shouldDeleteIdList];
      mulDeleteOppositePriceNotification({ notification_id_list: shouldDeleteIdList });
    }
    return validNotificationList;
  };

  const getValidNotificationList = (
    oldList: OppositePriceNotification[],
    newNotification?: OppositePriceNotification
  ) => {
    // 初始化
    if (!newNotification) {
      return dataFilter(oldList);
    }
    // 管道发来新的消息
    const hasDeletedNotificationIdList = hasDeletedNotificationIdListRef.current;
    const { quote_id, opposite_price_notification_id } = newNotification;
    if (hasDeletedNotificationIdList.includes(opposite_price_notification_id)) {
      return oldList;
    }
    const needFilterData: OppositePriceNotification[] = [newNotification];
    const noNeedFilterData: OppositePriceNotification[] = [];
    for (const n of oldList) {
      if (n.quote_id === quote_id) {
        needFilterData.push(n);
      } else {
        noNeedFilterData.push(n);
      }
    }
    const validList = dataFilter(needFilterData);
    return [...validList, ...noNeedFilterData];
  };

  useMessageFeedLiveQuery<OppositePriceNotification[]>({
    centrifugeChannel: getMessageFeedChannel(
      FrontendSyncMsgScene.MarketChangeNotification,
      miscStorage.userInfo?.user_id
    ),
    queryKey: [productType],
    queryFn: async () => {
      if (usedByMenu) {
        return [];
      }
      if (firstRef.current) {
        const originList = await batchGetPriceNotificationList({ product_type: productType });
        const list = getValidNotificationList(originList);
        setNotificationList(list);
        console.log('初始的行情追踪数据-------', list, Date.now());
      } else {
        firstRef.current = false;
      }
      return [];
    },
    handleWSMessage(data: OppositePriceNotification) {
      // 不处理其他台子的提醒消息
      if (data?.product_type !== productType) {
        return [];
      }
      console.log('接收到的行情追踪数据-------', data, Date.now());
      if (usedByMenu) {
        // 作废的数据不需要显示红点
        if (data.enable === Enable.DataEnable) {
          setUpdateNotification(data);
        }
      } else {
        setNotificationList(draft => getValidNotificationList(draft, data));
      }
      return [];
    }
  });
  return {
    notificationList,
    updateNotification,
    setNotificationList
  };
};
