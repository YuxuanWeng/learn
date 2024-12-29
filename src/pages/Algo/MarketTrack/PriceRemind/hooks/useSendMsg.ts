import { MarketTrackOperateEnum, MarketTrackOperateStatusEnum } from '@fepkg/business/constants/log-map';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { ImMsgSendStatus } from '@fepkg/services/types/enum';
import type { OppositePriceNotificationMulUpdate } from '@fepkg/services/types/opposite-price-notification/mul-update';
import { useMemoizedFn } from 'ahooks';
import { mulUpdateOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-update';
import { sendIMMsg } from '@/common/utils/im-helper';
import { trackPoint } from '@/common/utils/logger/point';
import { IMHelperMsgSendSingleResultForDisplay, SendMsgDetail } from '@/components/IMHelper/type';
import { useProductParams } from '@/layouts/Home/hooks';
import { useRemind } from '../../providers/RemindProvider';
import { TypeCardItem } from '../../type';
import {
  getClosedTraderIdList,
  getMessageSuccessNum,
  getNotificationContent,
  getPriceMsg,
  getRemindKey,
  getTraderQQMap
} from '../../util';

/**
 *
 * 封装批量发送的hook
 */
export const useSendMsg = () => {
  const { productType } = useProductParams();
  const {
    checkedKeyMarketList,
    notificationList,
    setNotificationList,
    sendErrorMap,
    setSendErrorMap,
    remindList,
    bondMap
  } = useRemind();

  const sendMessage = async (cardList: TypeCardItem[], messages: SendMsgDetail[]) => {
    let resultForDisplay: IMHelperMsgSendSingleResultForDisplay[] = [];
    const closedTraderIdList = await getClosedTraderIdList(productType);
    try {
      const res = await sendIMMsg({
        messages,
        extraPresendFilter: m => {
          if (closedTraderIdList.includes(m.receiver_id ?? '')) {
            return '未开启提醒渠道，消息发送失败！';
          }
          return undefined;
        }
      });
      resultForDisplay = res.resultForDisplay;
    } catch (e) {
      message.error((e as Error)?.message);
      return;
    }

    const resultForDisplayMap = new Map<string, IMHelperMsgSendSingleResultForDisplay>();
    const successNum = getMessageSuccessNum(messages, resultForDisplay);
    for (const item of resultForDisplay) {
      resultForDisplayMap.set(item.trader_id, item);
    }
    const sendSuccessNotificationIdList: string[] = [];
    const map = new Map(sendErrorMap);
    const params: OppositePriceNotificationMulUpdate.OppositePriceNotificationMarkSent[] = [];
    for (const item of cardList) {
      for (const notification of item.notifications) {
        const errorK = getRemindKey(notification);
        const res = resultForDisplayMap.get(notification.trader_id);
        const success = res?.success ?? true;
        const errorMsg = res?.msg ?? '';
        if (success) {
          map.delete(errorK);
          sendSuccessNotificationIdList.push(notification.opposite_price_notification_id);
          params.push({
            notification_id: notification.opposite_price_notification_id,
            send_status: ImMsgSendStatus.SendSuccess
          });
        } else {
          map.set(errorK, errorMsg);
          trackPoint(MarketTrackOperateStatusEnum.SendFailure, errorMsg);
        }
      }
    }
    setSendErrorMap(map);
    const validNotificationList = notificationList.filter(
      item => !sendSuccessNotificationIdList.includes(item.opposite_price_notification_id)
    );
    setNotificationList(validNotificationList);
    if (params.length > 0) {
      mulUpdateOppositePriceNotification({ update_list: params });
    }
    const failedNum = messages.length - successNum;
    if (failedNum > 0) {
      ModalUtils.destroyAll();
      ModalUtils.warning({
        title: successNum > 0 ? '部分发送失败' : '全部发送失败',
        content: `成功发送${successNum}条，失败发送${failedNum}条！`,
        showCancel: false,
        okText: '我知道了'
      });
    }
  };

  /**
   *   批量合并发送情况下的批量发送
   *   批量合并发送情况下 trader只会收到一条 需要根据traderId进行限制
   */
  const mergeMsgSendMsg = useMemoizedFn(async (cardList: TypeCardItem[]) => {
    const traderQQMap = await getTraderQQMap(cardList);
    const msgMap = new Map<string, string[]>();
    for (const item of cardList) {
      for (const notification of item.notifications) {
        const k = `${notification.trader_id}|${notification.trader_name}|${notification.inst_name}`;
        const v = msgMap.get(k) ?? [];
        const notificationContent = getNotificationContent(notification);
        const priceMsg = getPriceMsg(item, notificationContent);
        v.push(priceMsg, notificationContent?.notification_msg ?? '');
        msgMap.set(k, v);
      }
    }
    const messages: SendMsgDetail[] = [];
    for (const [k, msgArr] of msgMap) {
      const receiveArr = k.split('|');
      const msg = msgArr.join('\n');
      messages.push({
        receiver_id: receiveArr[0],
        receiver_name: receiveArr[1],
        inst_name: receiveArr[2],
        msg,
        recv_qq: traderQQMap.get(receiveArr[0])
      });
    }
    await sendMessage(cardList, messages);
  });

  const onBatchSendMsg = useMemoizedFn(() => {
    if (checkedKeyMarketList.length === 0) {
      return;
    }
    trackPoint(MarketTrackOperateEnum.BatchBondSend);
    const cardList = remindList
      .filter(item => checkedKeyMarketList.includes(item.keyMarket))
      .map(remind => ({
        ...remind,
        bondInfo: bondMap.get(remind.keyMarket)
      }));
    mergeMsgSendMsg(cardList);
  });

  return {
    onBatchSendMsg
  };
};
