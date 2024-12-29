import { memo, useMemo } from 'react';
import cx from 'classnames';
import { SideMap } from '@fepkg/business/constants/map';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { OppositePriceNotification } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { isEqual, isNil } from 'lodash-es';
import { getSideFontCls } from '@/components/QuoteTableCell/SideCell';

type Props = {
  list: OppositePriceNotification[];
};

const PriceComp = ({ notification }: { notification: OppositePriceNotification }) => {
  const { return_point, flag_rebate, quote_price, quote_side, flag_internal, flag_intention } = notification;
  let priceContent = '--';
  // 是平价返
  const showFlatRateReturn =
    flag_rebate && (isNil(quote_price) || quote_price <= 0) && !isNil(return_point) && return_point <= 0;
  if (!isNil(quote_price) && quote_price >= 0) {
    priceContent = transformPriceContent(quote_price);
  } else if (flag_intention) {
    // priceContent = quote_side === Side.SideBid ?'BID' : 'OFR';
    priceContent = SideMap[quote_side].upperCase;
  } else if (showFlatRateReturn) {
    priceContent = '平价返';
  }
  const returnPointContent =
    !isNil(return_point) && return_point >= 0 ? ` F${transformPriceContent(return_point)}` : '--';
  const fontCls = getSideFontCls(quote_side, undefined, flag_internal);
  return (
    <div className={cx(fontCls, 'ml-0.5 flex')}>
      {priceContent}
      {flag_rebate && !showFlatRateReturn && <div className="ml-0.5">{returnPointContent}</div>}
    </div>
  );
};

const TraderComp = ({ notificationList }: { notificationList: OppositePriceNotification[] }) => {
  const { trader_name, quote_side, flag_internal } = notificationList[0];
  const priceContainCls = useMemo(() => {
    if (notificationList.length === 1) {
      return getSideFontCls(quote_side, undefined, flag_internal);
    }
    return getSideFontCls(quote_side, undefined, false);
  }, [flag_internal, notificationList.length, quote_side]);

  return (
    <div className="flex items-center">
      <div className="text-gray-100 ">{trader_name}</div>
      <div className={cx(priceContainCls, 'flex items-center')}>
        (
        {notificationList.map((notification, index) => (
          <div
            className="flex items-center"
            key={notification.opposite_price_notification_id}
          >
            {index > 0 && notificationList.length > 1 ? (
              <div
                className={cx('w-0.5 h-3 ml-2 mr-1 bg-gray-300')}
                key={`split${notification.opposite_price_notification_id}`}
              />
            ) : (
              ''
            )}
            <PriceComp
              notification={notification}
              key={`price${notification.opposite_price_notification_id}`}
            />
          </div>
        ))}
        )
      </div>
    </div>
  );
};

const Inner = ({ list }: Props) => {
  const bidNotificationList = useMemo(() => {
    const map = new Map<string, OppositePriceNotification[]>();
    list
      .filter(notification => notification.quote_side === Side.SideBid)
      .forEach(notification => {
        const k = notification.inst_id + notification.trader_id;
        const v = map.get(k) ?? [];
        v.push(notification);
        map.set(k, v);
      });
    return Array.from(map.values());
  }, [list]);

  const ofrNotificationList = useMemo(() => {
    const map = new Map<string, OppositePriceNotification[]>();
    list
      .filter(notification => notification.quote_side === Side.SideOfr)
      .forEach(notification => {
        const k = notification.inst_id + notification.trader_id;
        const v = map.get(k) ?? [];
        v.push(notification);
        map.set(k, v);
      });
    return Array.from(map.values());
  }, [list]);

  return (
    <div className="flex items-center gap-x-4 gap-y-2 pl-11 pr-3 leading-4 flex-wrap min-h-[32px] py-2">
      {bidNotificationList.length > 0 ? (
        bidNotificationList.map((notificationList, index) => (
          <TraderComp
            notificationList={notificationList}
            key={Side.SideBid + index}
          />
        ))
      ) : (
        <div className="text-auxiliary-200">-</div>
      )}
      <div className="border-0 w-[1px] h-3 bg-gray-300" />
      {ofrNotificationList.length ? (
        ofrNotificationList.map((notificationList, index) => (
          <TraderComp
            notificationList={notificationList}
            key={Side.SideOfr + index}
          />
        ))
      ) : (
        <div className="text-auxiliary-200">-</div>
      )}
    </div>
  );
};

export const TraderInfo = memo(Inner, (prevProps, nextProps) => isEqual(prevProps, nextProps));
