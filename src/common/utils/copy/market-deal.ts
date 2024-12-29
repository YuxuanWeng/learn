import { DirectionMap } from '@fepkg/business/constants/map';
import { SPACE_TEXT } from '@fepkg/common/constants';
import { MarketDeal, ReceiptDeal } from '@fepkg/services/types/common';
import { BondQuoteType, ProductType, UserSettingFunction } from '@fepkg/services/types/enum';
import { mulGetMarketDeal } from '@/common/services/api/market-deal/mul-get';
import { getOneUserSettingsValue } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { trackSpecialSlow } from '../logger/special';
import { compareExpire, delay, formatPrice, getBondName, getLGBType, getRating, getTimeToMaturity } from './quote';

/** 格式化输出成交价 */
export function getDealPrice(deal: MarketDeal | ReceiptDeal) {
  if (deal.price_type === BondQuoteType.Yield && deal.flag_rebate) {
    return `${formatPrice(deal.price, 4)}F${formatPrice(deal.return_point, 4)}`;
  }
  return formatPrice(deal.price, 4);
}

const getMarketDealCopyText = (marketDeal: MarketDeal) => {
  let result: string[];
  const productType = marketDeal.product_type;
  const bond = marketDeal.bond_basic_info;
  switch (productType) {
    case ProductType.BCO:
    case ProductType.NCD:
      result = [
        getTimeToMaturity(bond), // 剩余期限
        getBondName(bond, productType), // 债券简称
        bond.display_code, // 券码
        getDealPrice(marketDeal), // 成交价
        DirectionMap[marketDeal.direction].toLowerCase(), // 成交方向
        getRating(bond, productType) // 评级
      ];
      break;
    case ProductType.BNC:
      result = [
        getTimeToMaturity(bond), // 剩余期限
        bond.display_code, // 券码
        getBondName(bond, productType), // 简称(地方债时显示);票面利率
        getDealPrice(marketDeal), // 成交价
        DirectionMap[marketDeal.direction].toLowerCase(), // 成交方向
        getLGBType(bond) // 地方债类型
      ];
      break;
    default:
      result = [];
      break;
  }
  return result.filter(Boolean).join(SPACE_TEXT.repeat(4));
};

function getMarketDealsContent(marketDeals: MarketDeal[]) {
  // 获取本地userSetting中是否按期限排序
  const sortByTerm = getOneUserSettingsValue(UserSettingFunction.UserSettingSortByTerm) === 'true';

  return (
    sortByTerm
      ? [...marketDeals].sort((a, b) => {
          return compareExpire(a.bond_basic_info?.time_to_maturity, b.bond_basic_info?.time_to_maturity);
        })
      : marketDeals
  ).map(marketDeal => getMarketDealCopyText(marketDeal));
}

export function copyMarketDeals(marketDeals: MarketDeal[]) {
  const result = getMarketDealsContent(marketDeals);
  const copyContent = result.join('\n');
  window.Main.copy(copyContent);
}

export const copyMarketDealsByID = async (marketDeals: MarketDeal[]) => {
  if (marketDeals && marketDeals.length > 1) return;
  await delay(100);

  try {
    const marketDealIds = marketDeals.map(m => m.deal_id);
    const res = await mulGetMarketDeal({ market_deal_id_list: marketDealIds });
    copyMarketDeals(res?.market_deal_list ?? []);
  } catch (err) {
    trackSpecialSlow('市场成交复制失败', err);
  }
};
