import { memo, useMemo } from 'react';
import cx from 'classnames';
import { MarketTrackOperateEnum, MarketTrackOperateStatusEnum } from '@fepkg/business/constants/log-map';
import { SideMap } from '@fepkg/business/constants/map';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { Badge } from '@fepkg/components/Badge';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAttentionFilled, IconSend, IconUserSquare } from '@fepkg/icon-park-react';
import { OppositePriceNotification, OppositePriceNotifyLogic } from '@fepkg/services/types/common';
import { ImMsgSendStatus, OppositePriceNotifyColor, Side } from '@fepkg/services/types/enum';
import type { OppositePriceNotificationMulUpdate } from '@fepkg/services/types/opposite-price-notification/mul-update';
import { useMemoizedFn } from 'ahooks';
import { isEqual } from 'lodash-es';
import { mulUpdateOppositePriceNotification } from '@/common/services/api/opposite-price-notification/mul-update';
import { sendIMMsg } from '@/common/utils/im-helper';
import { trackPoint } from '@/common/utils/logger/point';
import { IMHelperMsgSendSingleResultForDisplay, SendMsgDetail } from '@/components/IMHelper/type';
import { getSideFontCls } from '@/components/QuoteTableCell/SideCell';
import { useProductParams } from '@/layouts/Home/hooks';
import { useRemind } from '../../../providers/RemindProvider';
import { TypeCardItem } from '../../../type';
import {
  getClosedTraderIdList,
  getLogicMsg,
  getNotificationContent,
  getPriceMsg,
  getRemindKey,
  getTraderQQMap,
  oppositePriceNotifyColorMap
} from '../../../util';

type Props = {
  data: OppositePriceNotification;
  original: TypeCardItem;
  includeSpeech: boolean;
};

const PriceComp = ({ data }: { data: OppositePriceNotification }) => {
  const { return_point, flag_rebate, quote_price, quote_side, flag_internal, flag_intention } = data;
  let priceContent = '--';
  // 是平价返
  const showFlatRateReturn =
    flag_rebate && (quote_price === undefined || quote_price <= 0) && return_point !== undefined && return_point <= 0;
  if (quote_price !== undefined && quote_price >= 0) {
    priceContent = transformPriceContent(quote_price);
  } else if (flag_intention) {
    // priceContent = quote_side === Side.SideBid ?'BID' : 'OFR';
    priceContent = SideMap[quote_side].upperCase;
  } else if (showFlatRateReturn) {
    priceContent = '平价返';
  }
  const returnPointContent =
    return_point !== undefined && return_point >= 0 ? ` F${transformPriceContent(return_point)}` : '--';
  const fontColorCls = getSideFontCls(quote_side, undefined, flag_internal);
  const fontSizeCls = flag_rebate && !showFlatRateReturn ? 'text-sm' : 'text-md';
  return (
    <div className={cx(fontColorCls, fontSizeCls, 'font-extrabold  px-3 w-[120px]  truncate')}>
      {priceContent}
      {flag_rebate && !showFlatRateReturn && (
        <div className="font-medium text-[12px] leading-3">{returnPointContent}</div>
      )}
    </div>
  );
};

const InstTraderComp = ({ data }: { data: OppositePriceNotification }) => {
  const { inst_name, trader_name, trader_tag } = data;
  let instTrader = inst_name;
  if (trader_name) instTrader += `(${trader_name ?? ''}${trader_tag ?? ''})`;
  return (
    <div className=" text-orange-050 text-[13px] w-[200px]  px-3  truncate text-sm font-medium">
      <Tooltip content={instTrader}>
        <span>{instTrader}</span>
      </Tooltip>
    </div>
  );
};

const ReminderComp = ({ logicList }: { logicList: OppositePriceNotifyLogic[] }) => {
  const notificationMsg = logicList.map(logic => getLogicMsg(logic)).join('  ');
  return (
    <Tooltip
      floatingProps={{ className: 'max-w-[700px] whitespace-break-spaces break-words' }}
      content={notificationMsg}
      truncate
    >
      <div className=" text-gray-000 font-medium text-sm px-[13px] truncate w-[calc(100vw_-_440px)]">
        {logicList.map((logic, index) => (
          <span
            key={logic.notify_logic_id}
            className={index === 0 ? '' : 'ml-4'}
          >
            <span>{logic.msg_template}</span>
            <span
              key={logic.notify_logic_id}
              className={cx(logic.turn_on ? oppositePriceNotifyColorMap[logic.color] : '')}
            >
              {` [${logic.notify_logic_name}] `}
            </span>
          </span>
        ))}
      </div>
    </Tooltip>
  );
};

const Inner = ({ data, original, includeSpeech }: Props) => {
  const { productType } = useProductParams();
  const { sendErrorMap, setSendErrorMap, notificationList, setNotificationList, logicList } = useRemind();

  const errorK = getRemindKey(data);
  const errorV = sendErrorMap?.get(errorK);
  const sendMsg = useMemoizedFn(async () => {
    trackPoint(MarketTrackOperateEnum.Send);
    const traderQQMap = await getTraderQQMap([original]);
    const notificationContent = getNotificationContent(data);
    const priceMsg = getPriceMsg(original, notificationContent);
    const msg = includeSpeech ? `${priceMsg}\n${notificationContent?.notification_msg ?? ''}` : priceMsg;
    const messages: SendMsgDetail[] = [
      {
        receiver_id: data.trader_id,
        receiver_name: data.trader_name,
        inst_name: data.inst_name,
        msg,
        recv_qq: traderQQMap.get(data.trader_id)
      }
    ];
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

    const map = new Map(sendErrorMap);
    // 发送成功
    if (resultForDisplay.length === 0) {
      const validNotificationList = notificationList.filter(
        item => item.opposite_price_notification_id !== data.opposite_price_notification_id
      );
      setNotificationList(validNotificationList);
      map.delete(errorK);
      // 执行更新请求
      const params: OppositePriceNotificationMulUpdate.OppositePriceNotificationMarkSent[] = [
        {
          notification_id: data.opposite_price_notification_id,
          send_status: ImMsgSendStatus.SendSuccess
        }
      ];
      mulUpdateOppositePriceNotification({ update_list: params });
    } else {
      map.set(errorK, resultForDisplay[0]?.msg ?? '');
      trackPoint(MarketTrackOperateStatusEnum.SendFailure, resultForDisplay[0]?.msg ?? '');
    }
    setSendErrorMap(map);
  });

  // 要求自定义话术取触发时的自定义话术而不是实时话术
  const localLogicList = useMemo(() => {
    const logicMap = new Map<string, OppositePriceNotifyLogic>();
    for (const logic of logicList) {
      logicMap.set(logic.notify_logic_id, logic);
    }
    const logicArr: OppositePriceNotifyLogic[] = [];
    if (data.notification_content)
      for (const content of data.notification_content) {
        const logic = logicMap.get(content.notify_logic_id);
        if (logic) {
          logicArr.push({ ...logic, msg_template: content.notification_msg });
        } else {
          logicArr.push({
            notify_logic_id: content.notify_logic_id,
            notify_logic_type: content.notify_logic_type,
            notify_logic_name: content.notify_logic_name,
            msg_template: content.notification_msg,
            color: OppositePriceNotifyColor.OppositePriceNotifyColorNone,
            turn_on: true,
            copied: true
          });
        }
      }
    return logicArr;
  }, [logicList, data.notification_content]);

  return (
    <div className="whitespace-nowrap flex justify-between items-center h-10 px-3">
      <div className="flex items-center">
        <IconUserSquare className="text-gray-300 pr-1" />
        <InstTraderComp data={data} />
        <PriceComp data={data} />
        <ReminderComp logicList={localLogicList} />
      </div>
      <Tooltip content={errorV}>
        <div className="bg-gray-600 relative rounded-lg">
          <Badge
            children={errorV ? <IconAttentionFilled className="text-danger-100" /> : null}
            className="!absolute right-[-8px] top-[-8px]"
          />
          <Button.Icon
            icon={<IconSend />}
            onClick={sendMsg}
            onMouseDown={evt => evt.stopPropagation()}
            className="w-7 h-7 rounded-lg"
          />
        </div>
      </Tooltip>
    </div>
  );
};

export const RemindItem = memo(Inner, (prevProps, nextProps) => isEqual(prevProps, nextProps));
