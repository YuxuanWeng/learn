import { getSettlement, liquidationSpeedToString } from '@fepkg/business/utils/liq-speed';
import { SPACE_TEXT } from '@fepkg/common/constants';
import { LiquidationSpeed, ReceiptDeal, ReceiptDealTrade } from '@fepkg/services/types/common';
import { ProductType, ReceiptDealStatus, SettlementMode } from '@fepkg/services/types/enum';
import { ReceiptDealSearchV2 } from '@fepkg/services/types/receipt-deal/search-v2';
import { getDealPrice } from '@/common/utils/copy/market-deal';
import { getBondName, getRating, getTimeToMaturity } from '@/common/utils/copy/quote';

function formatSettlementMode(settlement_mode: SettlementMode) {
  switch (settlement_mode) {
    case SettlementMode.DVP:
      return 'DVP';
    default:
      return '';
  }
}

function formatReceiptDealTrade(receiptDealTrade?: ReceiptDealTrade) {
  if (!receiptDealTrade) return [];
  const instStr = receiptDealTrade.trader?.name_zh
    ? (receiptDealTrade.inst?.short_name_zh ?? '机构待定') + SPACE_TEXT + receiptDealTrade.trader.name_zh
    : receiptDealTrade.inst?.short_name_zh ?? '机构待定';
  const result = [instStr];
  if (receiptDealTrade.pay_for_info) {
    let payForStr = '';
    if (receiptDealTrade.pay_for_info.pay_for_inst) {
      payForStr = receiptDealTrade.pay_for_info.pay_for_inst.short_name_zh ?? '';
    }
    if (receiptDealTrade.pay_for_info.pay_for_trader) {
      payForStr += SPACE_TEXT + receiptDealTrade.pay_for_info.pay_for_trader.name_zh;
    }
    if (payForStr) {
      payForStr = `(${payForStr})`;
      result.push(payForStr);
    }
  }
  return result;
}

function formatBridgeList(bridgeList: ReceiptDealTrade[]) {
  if (!bridgeList.length) return '';
  // 反转桥机构方向，展示为ofr->bid
  const listStr = bridgeList
    .reverse()
    .map(b => `${b.inst?.short_name_zh ?? ''}${b.trader?.name_zh ? ` ${b.trader?.name_zh}` : ''}`)
    .join(' / ');
  return `(桥:${listStr})`;
}

function formatReceiptDealLiqSpeed(liqSpeedList: LiquidationSpeed[], format?: string) {
  if (!liqSpeedList.length) {
    return '';
  }
  if (liqSpeedList.length === 1) {
    return liquidationSpeedToString(liqSpeedList[0], format);
  }
  const speedList = liqSpeedList
    .filter(v => v.date || v.tag)
    .map(liqSpeed => {
      return liquidationSpeedToString(liqSpeed, format);
    });
  const bidLiqSpeed = speedList.at(0);
  const ofrLiqSpeed = speedList.at(-1);
  // 所有结算方式相同则只展示一个
  if (speedList.every(liqSpeed => liqSpeed === bidLiqSpeed)) {
    return bidLiqSpeed;
  }
  const bridgeLiqSpeedList = speedList.slice(1, -1);
  // 所有桥之间的交割与真实对手方和相连桥交割的任一交割相同
  if (
    bridgeLiqSpeedList.every(liqSpeed => liqSpeed === bidLiqSpeed) ||
    bridgeLiqSpeedList.every(liqSpeed => liqSpeed === ofrLiqSpeed)
  ) {
    // 展示为ofr/bid
    return `${ofrLiqSpeed}/${bidLiqSpeed}`;
  }
  // 展示为ofr->bid
  return speedList.reverse().join('/');
}

function getReceiptDealContent(
  receiptDeal: ReceiptDeal,
  index: number,
  productType: ProductType,
  parentDeal?: ReceiptDealSearchV2.ParentChildDeal
) {
  const {
    bond_basic_info,
    volume,
    liquidation_speed_list,
    traded_date,
    delivery_date,
    settlement_mode,
    ofr_trade_info,
    bid_trade_info
  } = receiptDeal;
  let bidTradeInfo: ReceiptDealTrade | undefined = bid_trade_info;
  let ofrTradeInfo: ReceiptDealTrade | undefined = ofr_trade_info;
  let bridgeList: ReceiptDealTrade[] | undefined;
  let bridgeLiqList: LiquidationSpeed[] | undefined;
  if (parentDeal) {
    const siblingList =
      parentDeal.receipt_deal_info_list?.sort((a, b) => (a?.bridge_index ?? 0) - (b?.bridge_index ?? 0)) ?? [];
    // 填入真实对手方
    bidTradeInfo = siblingList.at(0)?.bid_trade_info;
    ofrTradeInfo = siblingList.at(-1)?.ofr_trade_info;
    bridgeList = [];
    for (let i = 0; i < siblingList.length - 1; i++) {
      bridgeList.push(siblingList[i].ofr_trade_info);
    }
    // 反转桥机构方向，展示为ofr->bid
    bridgeLiqList = siblingList
      .map(s => s.liquidation_speed_list?.at(0) ?? getSettlement(s.traded_date, s.delivery_date, false, false))
      .filter(Boolean);
  }

  switch (productType) {
    case ProductType.BNC: {
      const result = [
        String(index), // 序号
        getTimeToMaturity(bond_basic_info), // 剩余期限
        bond_basic_info.display_code, // 代码
        getBondName(bond_basic_info, productType), // 简称(地方债时显示);票面利率
        getDealPrice(receiptDeal), // 成交价
        String(volume || '--'), // 交易量
        formatReceiptDealLiqSpeed(
          bridgeLiqList ?? [liquidation_speed_list?.at(0) ?? getSettlement(traded_date, delivery_date, false, false)],
          'MM.DD'
        ), // 结算方式
        formatSettlementMode(settlement_mode), // 结算模式
        ...formatReceiptDealTrade(ofrTradeInfo), // 卖方机构 卖方交易员 (卖方被代付机构 被代付交易员)
        '出给',
        ...formatReceiptDealTrade(bidTradeInfo), // 买方机构 买方交易员 (卖方被代付机构 被代付交易员)
        bridgeList ? formatBridgeList(bridgeList) : '' // (桥:桥机构 桥交易员 / 桥机构 桥交易员/...)
      ];
      return result.filter(r => r && r !== '').join(SPACE_TEXT.repeat(4));
    }
    case ProductType.BCO:
    case ProductType.NCD: {
      const result = [
        String(index), // 序号
        getTimeToMaturity(bond_basic_info), // 剩余期限
        bond_basic_info.display_code, // 代码
        getBondName(bond_basic_info, productType), // 债券简称
        getRating(bond_basic_info, productType), // 评级
        getDealPrice(receiptDeal), // 成交价
        String(volume || '--'), // 交易量
        formatReceiptDealLiqSpeed(
          bridgeLiqList ?? [liquidation_speed_list?.at(0) ?? getSettlement(traded_date, delivery_date, false, false)],
          'MM.DD'
        ), // 结算方式
        formatSettlementMode(settlement_mode), // 结算模式
        ...formatReceiptDealTrade(ofrTradeInfo), // 卖方机构 卖方交易员 (卖方被代付机构 被代付交易员)
        '出给',
        ...formatReceiptDealTrade(bidTradeInfo), // 买方机构 买方交易员 (卖方被代付机构 被代付交易员)
        bridgeList ? formatBridgeList(bridgeList) : '' // (桥:桥机构 桥交易员 / 桥机构 桥交易员/...)
      ];
      return result.filter(r => r && r !== '').join(SPACE_TEXT.repeat(4));
    }
    default:
      return '';
  }
}

export async function copyReceiptDeals(
  receiptDeals: ReceiptDeal[],
  productType: ProductType,
  parentDeals?: ReceiptDealSearchV2.ParentChildDeal[]
) {
  const bridgeCodeSet = new Set<string>();
  const result = receiptDeals
    .sort((a, b) => +b.update_time - +a.update_time)
    .filter(d => {
      // 过滤重复过桥码的成交单，已删除成交单按不含桥成交单处理
      if (
        d.bridge_code &&
        d.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted &&
        !bridgeCodeSet.has(d.bridge_code)
      ) {
        bridgeCodeSet.add(d.bridge_code);
        return true;
      }
      return !(
        d.bridge_code &&
        d.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted &&
        bridgeCodeSet.has(d.bridge_code)
      );
    })
    .map((d, i) =>
      getReceiptDealContent(
        d,
        i + 1,
        productType,
        d.bridge_code && d.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted
          ? parentDeals?.find(p => p.bridge_code === d.bridge_code)
          : void 0
      )
    );
  window.Main.copy(result.join('\n'));
}
