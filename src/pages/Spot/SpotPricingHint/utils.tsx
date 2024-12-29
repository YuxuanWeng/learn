import { BondDeal } from '@fepkg/services/types/common';
import { BondDealStatus, ReceiverSide } from '@fepkg/services/types/enum';
import { SpotPricingHintEnum } from 'app/types/IPCEvents';
import { getIDCDealDetail } from '@/common/services/api/deal/idc-deal-detail';
import { miscStorage } from '@/localdb/miscStorage';
import { SpotPricingDisplayRecord } from './types';

export const isSameSpotPricingHintCard = (
  cardA: SpotPricingDisplayRecord,
  cardB: SpotPricingDisplayRecord,
  checkIsStatusSame = false
) => {
  if (cardA.isOffline && cardB.isOffline) {
    return cardA.deal_list?.[0]?.deal_id === cardB.deal_list?.[0]?.deal_id;
  }

  if (cardA.dealID != null && cardA.dealID === cardB.dealID) {
    return true;
  }

  if (!cardA.isOffline && !cardB.isOffline) {
    const isSameSide = cardA.receiverSide === cardB.receiverSide;

    if (checkIsStatusSame) {
      const isContractSame =
        cardA.deal_list != null &&
        cardB.deal_list != null &&
        cardA.deal_list.length !== 0 &&
        cardB.deal_list.length !== 0 &&
        cardA.deal_list.every((d, i) => {
          return (
            d.deal_id != null &&
            d.deal_id === cardB.deal_list?.[i]?.deal_id &&
            (!checkIsStatusSame || d.update_time === cardB.deal_list?.[i]?.update_time)
          );
        });

      return isSameSide && isContractSame;
    }

    const isContractSame =
      cardA.deal_list != null &&
      cardB.deal_list != null &&
      cardA.deal_list.length !== 0 &&
      cardB.deal_list.length !== 0 &&
      cardA.deal_list.some(dealA => {
        return cardB.deal_list?.some(dealB => dealA.deal_id === dealB.deal_id);
      });

    return isSameSide && isContractSame;
  }

  return false;
};

export const isMessageRelated = (message: BondDeal, receiverSide: ReceiverSide) => {
  const currentUserID = miscStorage.userInfo?.user_id;

  return (
    (receiverSide === ReceiverSide.SpotPricinger && message?.spot_pricinger?.broker?.user_id === currentUserID) ||
    (receiverSide === ReceiverSide.BeSpotPricinger && message?.spot_pricingee?.broker?.user_id === currentUserID)
  );
};

// 根据成交单ID获取点价提示，会去除与自己无关的条目
export const getRecordsByContractID = async (
  contractIDs: string[],
  forceVisible: boolean,
  isManualRefresh: boolean
) => {
  const data = (await getIDCDealDetail({ deal_id_list: contractIDs })).spot_pricing_detail_list;

  if (data == null) return undefined;

  return data.reduce((prev, next) => {
    if (next?.spot_pricing_record == null) {
      const res: SpotPricingDisplayRecord = {
        ...next,
        forceVisible,
        receiverSide: ReceiverSide.BeSpotPricinger,
        isOffline: true,
        isManualRefresh
      };

      return [...prev, res];
    }

    const isSelfSpotter = miscStorage.userInfo?.user_id === next.spot_pricing_record.spot_pricing_broker_info.user_id;
    const isSelfSpotted = (next.deal_list ?? []).some(
      d => d?.spot_pricingee?.broker?.user_id === miscStorage.userInfo?.user_id
    );

    const res: SpotPricingDisplayRecord[] = [];

    if (isSelfSpotter) {
      res.push({
        ...next,
        forceVisible,
        receiverSide: ReceiverSide.SpotPricinger,
        isOffline: false,
        isManualRefresh
      });
    }

    if (isSelfSpotted) {
      res.push({
        ...next,
        forceVisible,
        receiverSide: ReceiverSide.BeSpotPricinger,
        isOffline: false,
        isManualRefresh
      });
    }

    return [...prev, ...res];
  }, [] as SpotPricingDisplayRecord[]);
};

// 根据成交单ID获取点价提示，并弹出
// forceSide: 在自己点价自己的情况下，若传入 forceSide 则只弹出对应点价/被点价方的点价提示
export const openWindowByContractID = async (contractID: string, forceSide?: ReceiverSide) => {
  const records = (await getRecordsByContractID([contractID], true, false))?.filter(record =>
    (record.deal_list ?? []).some(
      d => d.deal_status === BondDealStatus.DealConfirming && isMessageRelated(d, record.receiverSide)
    )
  );

  if (records == null || records.length === 0) return;

  window.Main.sendMessage(
    SpotPricingHintEnum.NewManualMessage,
    forceSide == null ? records : [{ ...records[0], receiver_side: forceSide }]
  );
};
