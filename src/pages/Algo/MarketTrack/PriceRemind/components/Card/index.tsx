import { useMemo, useState } from 'react';
import { MarketTrackOperateEnum, MarketTrackOperateStatusEnum } from '@fepkg/business/constants/log-map';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconDelete, IconSend } from '@fepkg/icon-park-react';
import { OppositePriceNotification, OppositePriceNotifyLogic } from '@fepkg/services/types/common';
import { ImMsgSendStatus, Side } from '@fepkg/services/types/enum';
import type { OppositePriceNotificationMulUpdate } from '@fepkg/services/types/opposite-price-notification/mul-update';
import { useMemoizedFn } from 'ahooks';
import { mulDeleteOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-delete';
import { mulUpdateOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-update';
import { sendIMMsg } from '@/common/utils/im-helper';
import { trackPoint } from '@/common/utils/logger/point';
import { IMHelperMsgSendSingleResultForDisplay, SendMsgDetail } from '@/components/IMHelper/type';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { useRemind } from '../../../providers/RemindProvider';
import { TypeCardItem } from '../../../type';
import {
  clearInvalidErrorMsgKey,
  getClosedTraderIdList,
  getMessageSuccessNum,
  getNotificationContent,
  getPriceMsg,
  getRemindKey,
  getTraderQQMap,
  isReferredQuote,
  oppositePriceNotifyColorMap
} from '../../../util';
import { BondInfo } from './BondInfo';
import { LatestMarketInfo } from './LatestMarketInfo';
import { OptimalInfo } from './OptimalInfo';
import { RemindItem } from './RemindItem';
import { TraderInfo } from './TraderInfo';

type Props = {
  data: TypeCardItem;
};

/**
 * @param logicList  当前的逻辑List
 * @param logicIdList 按照优先级排好序的逻辑idList
 */
const getHighestColor = (logicIdList: string[], logicList: OppositePriceNotifyLogic[]) => {
  const logic = logicList.find(v => logicIdList[0] === v.notify_logic_id);
  return logic?.turn_on ? oppositePriceNotifyColorMap[logic?.color] : '';
};

/**
 *  获取最新的对价提醒对应的逻辑话术ids
 *  1.更新时间排序获取最新对价提醒的更新时间
 *  2.然后基于更新时间获取相同更新时间的对价提醒对应的逻辑话术ids
 */
const getLatest = (list: OppositePriceNotification[]) => {
  // 按照更新时间排序
  const sortList = list
    .sort((a, b) => +b.update_time - +a.update_time)
    .map(n => n.notification_content?.[0].notify_logic_id ?? '');
  // const latestTime = sortList.at(0)?.update_time ?? '0';
  // // 1秒内的都算是最新的
  // const minUpdateTime = Number(latestTime) - 1000;
  // const latestIdsList = sortList.reduce<string[]>((prev, curr) => {
  //   // push最新的id
  //   if (minUpdateTime <= Number(curr?.update_time) && curr.notification_content) {
  //     prev.push(curr.notification_content[0].notify_logic_id);
  //   }
  //   return prev;
  // }, []);
  return sortList;
};

export const Card = ({ data }: Props) => {
  const brokerId = miscStorage.userInfo?.user_id ?? '';
  const { productType } = useProductParams();
  const {
    setCheckedKeyMarketList,
    checkedKeyMarketList,
    showRemindInfo,
    notificationList,
    setNotificationList,
    notificationIdMap,
    sendErrorMap,
    setSendErrorMap,
    logicList,
    bondMap
  } = useRemind();
  const { bondHandicap, notifications, keyMarket } = data;

  const textCls = useMemo(() => {
    const latest = getLatest(notifications);
    const textColor = getHighestColor(latest, logicList);
    return `text-sm font-medium ${textColor ?? 'text-gray-100'}`;
  }, [notifications, logicList]);

  const bondInfo = bondMap.get(keyMarket);
  const cardData = useMemo(() => ({ ...data, bondInfo }), [data, bondInfo]);
  // 含话术 不含话术
  const [includeSpeech, setIncludeSpeech] = useState(true);

  const onChangeCheckBox = useMemoizedFn((val: boolean) => {
    if (val) {
      setCheckedKeyMarketList([...checkedKeyMarketList, keyMarket]);
    } else {
      const tmp = checkedKeyMarketList.filter(item => item !== keyMarket);
      setCheckedKeyMarketList(tmp);
    }
  });

  const onClickCard = () => {
    if (!checkedKeyMarketList.includes(keyMarket)) {
      onChangeCheckBox(true);
    }
  };

  const onDelete = useMemoizedFn((evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
    trackPoint(MarketTrackOperateEnum.Delete);
    evt.stopPropagation();
    const notificationIdList = notificationIdMap.get(keyMarket) ?? [];
    if (notificationIdList.length === 0) {
      return;
    }
    const errorMsgMap = new Map(sendErrorMap);
    clearInvalidErrorMsgKey(notifications, errorMsgMap);
    setSendErrorMap(errorMsgMap);
    mulDeleteOppositePriceNotification({ notification_id_list: notificationIdList });
    const validNotificationList = notificationList.filter(
      item => !notificationIdList.includes(item.opposite_price_notification_id)
    );
    setNotificationList(validNotificationList);
  });

  const sendMsg = useMemoizedFn(async (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
    trackPoint(MarketTrackOperateEnum.BondSend);
    evt.stopPropagation();
    const messages: SendMsgDetail[] = [];
    const traderQQMap = await getTraderQQMap([data]);

    for (const notification of data.notifications) {
      const notificationContent = getNotificationContent(notification);
      const priceMsg = getPriceMsg(cardData, notificationContent);
      const msg = includeSpeech ? `${priceMsg}\n${notificationContent?.notification_msg ?? ''}` : priceMsg;
      messages.push({
        receiver_id: notification.trader_id,
        receiver_name: notification.trader_name,
        inst_name: notification.inst_name,
        msg,
        recv_qq: traderQQMap.get(notification.trader_id)
      });
    }
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
    } catch (error) {
      message.error((error as Error)?.message);
      return;
    }

    const resultForDisplayMap = new Map<string, IMHelperMsgSendSingleResultForDisplay>();
    for (const item of resultForDisplay) {
      resultForDisplayMap.set(item.trader_id, item);
    }
    const successNum = getMessageSuccessNum(messages, resultForDisplay);
    const sendSuccessNotificationIdList: string[] = [];
    const map = new Map(sendErrorMap);
    const params: OppositePriceNotificationMulUpdate.OppositePriceNotificationMarkSent[] = [];
    for (const item of notifications) {
      const errorK = getRemindKey(item);
      const res = resultForDisplayMap.get(item.trader_id);
      const success = res?.success ?? true;
      const errorMsg = res?.msg ?? '';
      if (success) {
        map.delete(errorK);
        sendSuccessNotificationIdList.push(item.opposite_price_notification_id);
        params.push({
          notification_id: item.opposite_price_notification_id,
          send_status: ImMsgSendStatus.SendSuccess
        });
      } else {
        map.set(errorK, errorMsg);
        trackPoint(MarketTrackOperateStatusEnum.SendFailure, errorMsg);
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
      ModalUtils.warning({
        title: successNum > 0 ? '部分发送失败' : '全部发送失败',
        content: `成功发送${successNum}条，失败发送${failedNum}条！`,
        showCancel: false,
        okText: '我知道了'
      });
    }
  });

  const sortedNotifications = useMemo(
    () =>
      notifications.sort((a, b) => {
        const price1 = a.clean_price ?? 0;
        const price2 = b.clean_price ?? 0;
        const side1 = a.quote_side;
        const side2 = b.quote_side;
        const time1 = Number(a.update_time);
        const time2 = Number(b.update_time);
        if (side1 === side2) {
          if (price1 === price2) {
            if (time2 < time1) {
              return -1;
            }
          } else {
            if (price1 < price2) {
              return -1;
            }
            return 1;
          }
        } else {
          if (side1 < side2) {
            return -1;
          }
          return 1;
        }
        return 1;
      }),
    [notifications]
  );
  /** 当前用户 bid方向有报价 */
  const bidHasQuote = useMemo(() => {
    return notifications.some(
      notification =>
        notification.quote_side === Side.SideBid &&
        notification.broker_id === brokerId &&
        !isReferredQuote(notification)
    );
  }, [brokerId, notifications]);
  /** 当前用户 ofr方向有报价 */
  const ofrHasQuote = useMemo(() => {
    return notifications.some(
      notification =>
        notification.quote_side === Side.SideOfr &&
        notification.broker_id === brokerId &&
        !isReferredQuote(notification)
    );
  }, [brokerId, notifications]);
  return (
    <div className="bg-gray-600 border-solid border-[1px] rounded-lg border-gray-500">
      <div onClick={onClickCard}>
        <div className="h-11 flex justify-between border-0 border-b-[1px] border-solid border-gray-500">
          <div className="flex items-center pl-3">
            <span onClick={evt => evt.stopPropagation()}>
              <Checkbox
                checked={checkedKeyMarketList.includes(keyMarket)}
                onChange={onChangeCheckBox}
              />
            </span>
            {bondInfo && (
              <BondInfo
                bondInfo={bondInfo}
                textCls={textCls}
              />
            )}
          </div>
          <div className="flex items-center gap-x-2 pr-3">
            <LatestMarketInfo data={bondHandicap?.latest_market_deal} />

            <div
              className="w-16 h-7 px-3 box-content bg-gray-700 rounded-lg flex items-center"
              onClick={evt => evt.stopPropagation()}
            >
              <Checkbox
                checked={includeSpeech}
                onChange={checked => {
                  setIncludeSpeech(checked);
                }}
              >
                含话术
              </Checkbox>
            </div>
            <Button
              icon={<IconDelete />}
              className="!w-7 !h-7 rounded-lg p-0 border-0"
              onClick={onDelete}
              type="danger"
              plain
            />
            <Button
              icon={<IconSend />}
              className="!w-7 !h-7 rounded-lg p-0 border-0"
              onClick={sendMsg}
              type="primary"
              plain
            />
          </div>
        </div>
        <OptimalInfo
          bidOptimalQuote={bondHandicap?.bid_optimal_quote}
          ofrOptimalQuote={bondHandicap?.ofr_optimal_quote}
          bondInfo={bondInfo}
          bidHasQuote={bidHasQuote}
          ofrHasQuote={ofrHasQuote}
        />
        <TraderInfo list={notifications} />
      </div>
      {showRemindInfo && (
        <div className=" bg-gray-800 rounded-b-lg">
          {sortedNotifications.map(item => (
            <RemindItem
              data={item}
              original={cardData}
              key={item.opposite_price_notification_id}
              includeSpeech={includeSpeech}
            />
          ))}
        </div>
      )}
    </div>
  );
};
