import { InstitutionTiny, Trader, User } from '@fepkg/services/types/bdm-common';
import { MarketDeal } from '@fepkg/services/types/bds-common';
import { Direction, ProductType, Side } from '@fepkg/services/types/enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { omit } from 'lodash-es';
import { miscStorage } from '@/localdb/miscStorage';
import { InitMarketDealTradeState, MarketDealDialogContext } from './types';

export const getMarketDealDialogConfig = (productType: ProductType, context: MarketDealDialogContext) => ({
  name: WindowName.MarketDeal,
  custom: {
    route: CommonRoute.MarketDeal,
    routePathParams: [productType.toString()],
    context: omit(context, 'onSuccess', 'onCancel'),
    isTop: true
  },
  options: {
    width: 720 + 4, // 3 * 2 为边框 px
    height: productType === ProductType.NCD ? 488 + 4 : 388, // 3 * 2 为边框 px
    minWidth: 340,
    minHeight: 218,
    resizable: false
  }
});

/** 将 Side 转换为 Direction */
export const side2Direction = (side?: Side) => {
  if (!side) return Direction.DirectionTrd;
  return {
    [Side.SideBid]: Direction.DirectionGvn,
    [Side.SideOfr]: Direction.DirectionTkn
  }[side];
};

export const getInitMarketDealTradeState = (
  defaultValue?: Partial<MarketDeal>,
  side?: Side,
  isJoin?: boolean
): InitMarketDealTradeState => {
  if (isJoin) {
    return { broker: miscStorage.userInfo };
  }
  const instIdAttribute = side === Side.SideBid ? 'bid_institution_id' : 'ofr_institution_id';
  const instNameAttribute = side === Side.SideBid ? 'bid_institution_name' : 'ofr_institution_name';
  const traderIdAttribute = side === Side.SideBid ? 'bid_trader_id' : 'ofr_trader_id';
  const traderNameAttribute = side === Side.SideBid ? 'bid_trader_name' : 'ofr_trader_name';
  const traderTagAttribute = side === Side.SideBid ? 'bid_trader_tag' : 'ofr_trader_tag';
  const traderIsVipAttribute = side === Side.SideBid ? 'bid_trader_is_vip' : 'ofr_trader_is_vip';
  const brokerIdAttribute = side === Side.SideBid ? 'bid_broker_id' : 'ofr_broker_id';
  const brokerNameAttribute = side === Side.SideBid ? 'bid_broker_name' : 'ofr_broker_name';
  const broker = defaultValue?.[brokerIdAttribute]
    ? ({
        user_id: defaultValue?.[brokerIdAttribute],
        name_cn: defaultValue?.[brokerNameAttribute] ?? ''
      } as User)
    : miscStorage.userInfo;
  return {
    inst: defaultValue?.[instIdAttribute]
      ? ({
          inst_id: defaultValue?.[instIdAttribute],
          short_name_zh: defaultValue?.[instNameAttribute] ?? ''
        } as InstitutionTiny)
      : void 0,
    trader: defaultValue?.[traderIdAttribute]
      ? ({
          trader_id: defaultValue?.[traderIdAttribute],
          name_zh: defaultValue?.[traderNameAttribute] ?? 0,
          tags: defaultValue?.[traderTagAttribute] ? [defaultValue?.[traderTagAttribute]] : void 0,
          is_vip: defaultValue?.[traderIsVipAttribute]
        } as unknown as Trader)
      : void 0,
    broker
  };
};
