import { getSettlement, liquidationSpeedToString } from '@fepkg/business/utils/liq-speed';
import { DealConfirmSnapshot, DealConfirmTradeInfo, DeliveryInfo } from '@fepkg/services/types/bds-common';
import { isEmpty } from 'lodash-es';
import { DiffDeal, DiffDealType, DiffKeys } from '@/components/IDCDealDetails/type';

const getDiffBrokers = (_old: DealConfirmTradeInfo, _new: DealConfirmTradeInfo) => {
  let hasChanged = false;

  const oldBrokers = [
    { userId: _old.broker_id, userName: _old.broker_name },
    { userId: _old.broker_id_b, userName: _old.broker_name_b },
    { userId: _old.broker_id_c, userName: _old.broker_name_c },
    { userId: _old.broker_id_d, userName: _old.broker_name_d }
  ].map(v => ({ ...v, userId: !v.userId || v.userId === '0' ? void 0 : v.userId }));

  const newBrokers = [
    { userId: _new.broker_id, userName: _new.broker_name },
    { userId: _new.broker_id_b, userName: _new.broker_name_b },
    { userId: _new.broker_id_c, userName: _new.broker_name_c },
    { userId: _new.broker_id_d, userName: _new.broker_name_d }
  ].map(v => ({ ...v, userId: !v.userId || v.userId === '0' ? void 0 : v.userId }));

  for (const [i, v] of newBrokers.entries()) {
    if (v.userId !== oldBrokers[i].userId) hasChanged = true;
  }

  return {
    hasChanged,
    prev: oldBrokers
      .filter(v => Boolean(v.userId))
      .map(v => v.userName)
      .join(' '),
    next: newBrokers
      .filter(v => Boolean(v.userId))
      .map(v => v.userName)
      .join(' ')
  };
};

const getDiffCp = (_old: DealConfirmTradeInfo, _new: DealConfirmTradeInfo) => {
  let hasChanged = false;
  if (_new.inst_id !== _old.inst_id || _new.trader_id !== _old.trader_id) {
    hasChanged = true;
  }
  const oldValue = (_old?.inst_name ?? '') + (_old?.trader_name ? `(${_old?.trader_name})` : '');
  const newValue = (_new?.inst_name ?? '') + (_new?.trader_name ? `(${_new?.trader_name})` : '');

  return { hasChanged, prev: oldValue, next: newValue };
};

const getPriceText = (price: number, returnPoint?: number) => {
  const hasReturnPoint = returnPoint && returnPoint > 0;

  const returnPointText = hasReturnPoint ? `F${returnPoint}` : '';

  return `${price > 0 ? price : '--'}${returnPointText}`;
};

const OptionsMap: { [key in DiffKeys]: DiffDeal } = {
  [DiffKeys.OfrBroker]: { label: 'Ofr-经纪人', key: DiffKeys.OfrBroker },
  [DiffKeys.BidBroker]: { label: 'Bid-经纪人', key: DiffKeys.BidBroker },
  [DiffKeys.BondCode]: { label: '债券代码', key: DiffKeys.BondCode },
  [DiffKeys.DealPrice]: { label: '成交价', key: DiffKeys.DealPrice },
  [DiffKeys.DealVolume]: { label: '成交量', key: DiffKeys.DealVolume },
  [DiffKeys.LiqSpeed]: { label: '交割方式', key: DiffKeys.LiqSpeed },
  [DiffKeys.OfrCp]: { label: 'Ofr-CP', key: DiffKeys.OfrCp },
  [DiffKeys.BidCp]: { label: 'Bid-CP', key: DiffKeys.BidCp },
  [DiffKeys.SendMsg]: { label: '发单信息', key: DiffKeys.SendMsg },
  [DiffKeys.BidSendMsg]: { label: 'Bid-发单信息', key: DiffKeys.BidSendMsg },
  [DiffKeys.OfrSendMsg]: { label: 'Ofr-发单信息', key: DiffKeys.OfrSendMsg },
  [DiffKeys.FlagBridge]: { label: '是否过桥', key: DiffKeys.FlagBridge }
};

const getSnapShotDeliveryInfo = (
  snapShot: DealConfirmSnapshot,
  useChildDelivery = false
): { delivery: DeliveryInfo[]; hasBridge: boolean } => {
  const hasBridge = (snapShot.delivery_info_list ?? []).length > 1;

  const isBidOfrDeliveryEmpty =
    (!snapShot.bid_delivery_info?.traded_date && !snapShot.bid_delivery_info?.delivery_date) ||
    (!snapShot.ofr_delivery_info?.traded_date && !snapShot.ofr_delivery_info?.delivery_date);

  if (!hasBridge && !isBidOfrDeliveryEmpty && !useChildDelivery) {
    const isBothSideSame =
      snapShot.bid_delivery_info?.traded_date === snapShot.ofr_delivery_info?.traded_date &&
      snapShot.bid_delivery_info?.delivery_date === snapShot.ofr_delivery_info?.delivery_date;
    return {
      delivery: isBothSideSame
        ? [
            {
              traded_date: snapShot.bid_delivery_info?.traded_date,
              delivery_date: snapShot.bid_delivery_info?.delivery_date
            }
          ]
        : [
            {
              traded_date: snapShot.bid_delivery_info?.traded_date,
              delivery_date: snapShot.bid_delivery_info?.delivery_date
            },
            {
              traded_date: snapShot.ofr_delivery_info?.traded_date,
              delivery_date: snapShot.ofr_delivery_info?.delivery_date
            }
          ],
      hasBridge
    };
  }

  return { delivery: snapShot.delivery_info_list ?? [], hasBridge };
};

export const getDiffModalDataBySnapshot = (
  oldSnapShot?: DealConfirmSnapshot,
  newSnapShot?: DealConfirmSnapshot,
  useChildDelivery = false
): DiffDealType => {
  let dataIsChanged = false;
  const next: DiffDeal[] = [];
  const prev: DiffDeal[] = [];

  if (oldSnapShot == null || newSnapShot == null) {
    return {
      next,
      prev,
      hasChanged: false
    };
  }

  const {
    bid_deal_confirm_trade_info: newB,
    ofr_deal_confirm_trade_info: newO,
    bond_key_market: newKeyMarket,
    price: newDealPrice,
    return_point: newReturnPoint,
    confirm_volume: newVolume,
    flag_bridge: newFlagBridge
  } = newSnapShot;

  const {
    bid_deal_confirm_trade_info: oldB,
    ofr_deal_confirm_trade_info: oldO,
    bond_key_market: oldKeyMarket,
    price: oldDealPrice,
    return_point: oldReturnPoint,
    confirm_volume: oldVolume,
    flag_bridge: oldFlagBridge
  } = oldSnapShot;
  // 1. 判断OFR经纪人是否变更 broker_a, broker_b, broker_c, broker_d
  const { prev: ofrPrev, next: ofrNext, hasChanged: ofrHasChanged } = getDiffBrokers(oldO, newO);
  dataIsChanged = dataIsChanged || ofrHasChanged;
  prev.push({ ...OptionsMap[DiffKeys.OfrBroker], value: ofrPrev });
  next.push({ ...OptionsMap[DiffKeys.OfrBroker], hasChanged: ofrHasChanged, value: ofrNext });

  // 2. 判断BID经纪人是否变更 broker_a, broker_b, broker_c, broker_d
  const { prev: bidPrev, next: bidNext, hasChanged: bidHasChanged } = getDiffBrokers(oldB, newB);
  dataIsChanged = dataIsChanged || bidHasChanged;
  prev.push({ ...OptionsMap[DiffKeys.BidBroker], value: bidPrev });
  next.push({ ...OptionsMap[DiffKeys.BidBroker], hasChanged: bidHasChanged, value: bidNext });

  // 3. 判断债券代码
  let bondHasChanged = false;
  if (oldKeyMarket !== newKeyMarket) {
    dataIsChanged = true;
    bondHasChanged = true;
  }

  prev.push({ ...OptionsMap[DiffKeys.BondCode], value: oldKeyMarket });
  next.push({ ...OptionsMap[DiffKeys.BondCode], hasChanged: bondHasChanged, value: newKeyMarket });

  // 4. 判断成交价
  let dealPriceHasChanged = false;
  const oldPriceText = getPriceText(oldDealPrice, oldReturnPoint);
  const newPriceText = getPriceText(newDealPrice, newReturnPoint);
  if (oldPriceText !== newPriceText) {
    dataIsChanged = true;
    dealPriceHasChanged = true;
  }
  prev.push({ ...OptionsMap[DiffKeys.DealPrice], value: oldPriceText });
  next.push({
    ...OptionsMap[DiffKeys.DealPrice],
    hasChanged: dealPriceHasChanged,
    value: newPriceText
  });

  // 5. 判断成交量
  let dealVolumeHasChanged = false;

  const oldVolumeText = oldVolume > 0 ? oldVolume.toString() : '--';
  const newVolumeText = newVolume > 0 ? newVolume.toString() : '--';

  if (oldVolumeText !== newVolumeText) {
    dataIsChanged = true;
    dealVolumeHasChanged = true;
  }
  prev.push({ ...OptionsMap[DiffKeys.DealVolume], value: oldVolumeText });
  next.push({ ...OptionsMap[DiffKeys.DealVolume], hasChanged: dealVolumeHasChanged, value: newVolumeText });

  // 6. 判断交割方式
  let liquidationHasChanged = false;

  const { delivery: oldDeliveryList, hasBridge: oldHasBridge } = getSnapShotDeliveryInfo(oldSnapShot, useChildDelivery);
  const { delivery: newDeliveryList, hasBridge: newHasBridge } = getSnapShotDeliveryInfo(newSnapShot, useChildDelivery);

  if (
    oldDeliveryList?.length !== newDeliveryList?.length ||
    oldHasBridge !== newHasBridge ||
    oldDeliveryList?.some((_old, index) => {
      const newDelivery: DeliveryInfo | undefined = newDeliveryList?.[index];

      return (
        !(
          newDelivery?.traded_date === _old.traded_date ||
          (isEmpty(newDelivery?.traded_date) && isEmpty(_old.traded_date))
        ) ||
        !(
          newDelivery?.delivery_date === _old.delivery_date ||
          (isEmpty(newDelivery?.delivery_date) && isEmpty(_old.delivery_date))
        )
      );
    })
  ) {
    dataIsChanged = true;
    liquidationHasChanged = true;
  }

  prev.push({
    ...OptionsMap[DiffKeys.LiqSpeed],
    value: (oldDeliveryList ?? [])
      .map(i => liquidationSpeedToString(getSettlement(i.traded_date, i.delivery_date), 'MM.DD'))
      .join('/')
  });
  next.push({
    ...OptionsMap[DiffKeys.LiqSpeed],
    hasChanged: liquidationHasChanged,
    value: (newDeliveryList ?? [])
      .map(i => liquidationSpeedToString(getSettlement(i.traded_date, i.delivery_date), 'MM.DD'))
      .join('/')
  });

  // 7. 判断Ofr-CP
  const { prev: ofrCpPrev, next: ofrCpNext, hasChanged: ofrCpHasChanged } = getDiffCp(oldO, newO);
  dataIsChanged = dataIsChanged || ofrCpHasChanged;
  prev.push({ ...OptionsMap[DiffKeys.OfrCp], value: ofrCpPrev });
  next.push({ ...OptionsMap[DiffKeys.OfrCp], hasChanged: ofrCpHasChanged, value: ofrCpNext });

  // 8. 判断bid-CP
  const { prev: bidCpPrev, next: bidCpNext, hasChanged: bidCpHasChanged } = getDiffCp(oldB, newB);
  dataIsChanged = dataIsChanged || bidCpHasChanged;
  prev.push({ ...OptionsMap[DiffKeys.BidCp], value: bidCpPrev });
  next.push({ ...OptionsMap[DiffKeys.BidCp], hasChanged: bidCpHasChanged, value: bidCpNext });

  // 8. 判断发单信息-ofr
  const oldOfrSendMsg = oldO?.send_order_info;
  const newOfrSendMsg = newO?.send_order_info;

  let ofrSendMsgChanged = false;
  if (oldOfrSendMsg !== newOfrSendMsg) {
    dataIsChanged = true;
    ofrSendMsgChanged = true;
  }

  prev.push({ ...OptionsMap[oldSnapShot.flag_bridge ? DiffKeys.OfrSendMsg : DiffKeys.SendMsg], value: oldOfrSendMsg });
  next.push({
    ...OptionsMap[newSnapShot.flag_bridge ? DiffKeys.OfrSendMsg : DiffKeys.SendMsg],
    hasChanged: ofrSendMsgChanged,
    value: newOfrSendMsg
  });

  // 9. 判断发单信息-bid
  const oldBidSendMsg = oldB?.send_order_info;
  const newBidSendMsg = newB?.send_order_info;

  let bidSendMsgChanged = false;
  if (oldBidSendMsg !== newBidSendMsg) {
    dataIsChanged = true;
    bidSendMsgChanged = true;
  }

  if (oldSnapShot.flag_bridge) {
    prev.push({ ...OptionsMap[DiffKeys.BidSendMsg], value: oldBidSendMsg });
  }

  if (newSnapShot.flag_bridge) {
    next.push({ ...OptionsMap[DiffKeys.BidSendMsg], hasChanged: bidSendMsgChanged, value: newBidSendMsg });
  }

  // 10. 判断是否过桥
  let flagBridgeHasChanged = false;
  if (oldFlagBridge !== newFlagBridge) {
    dataIsChanged = true;
    flagBridgeHasChanged = true;
  }

  prev.push({ ...OptionsMap[DiffKeys.FlagBridge], value: oldFlagBridge ? '是' : '否' });
  next.push({
    ...OptionsMap[DiffKeys.FlagBridge],
    hasChanged: flagBridgeHasChanged,
    value: newFlagBridge ? '是' : '否'
  });

  return { hasChanged: dataIsChanged, next, prev };
};
