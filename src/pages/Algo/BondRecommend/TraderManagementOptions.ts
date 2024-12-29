import { BondRecommendConfig } from '@fepkg/services/types/algo-common';
import {
  BondAssetType,
  BondFinancialCategoryType,
  BondGoodsType,
  BondInstType,
  BondMarketType,
  BondPeriodType,
  BondPerpetualType,
  InstRatingType,
  IsMunicipalType,
  IsPlatformType,
  IssuerRatingType,
  RecommendRuleType,
  WithWarranterType
} from '@fepkg/services/types/algo-enum';

export const getBondGoodsOptions = (isMortgage: boolean) => [
  { value: BondGoodsType.GoodsSCP, label: '超短融' },
  { value: BondGoodsType.GoodsCP, label: '短融', disabled: isMortgage },
  { value: BondGoodsType.GoodsMTN, label: '中票', disabled: isMortgage },
  { value: BondGoodsType.GoodsED, label: '企业债' },
  { value: BondGoodsType.GoodsCD, label: '公司债' },
  { value: BondGoodsType.GoodsSD, label: '次级债' },
  { value: BondGoodsType.GoodsPPN, label: 'PPN' },
  { value: BondGoodsType.GoodsOtr, label: '其他' }
];

export const BondGoodsAllOption = { value: BondGoodsType.GoodsAll, label: 'All' };

export const BondAssetAllOption = { value: BondAssetType.AssetAll, label: 'All' };

export const BondInstAllOption = { value: BondInstType.InstAll, label: 'All' };

export const getBondMarketTypeOption = (isMortgage: boolean) => [
  { value: BondMarketType.MarketSSE, label: '上交所' },
  { value: BondMarketType.MarketSZE, label: '深交所' },
  { value: BondMarketType.MarketCIB, label: '银行间', disabled: isMortgage }
];

export const BondMarketTypeAllOption = { value: BondMarketType.MarketAll, label: 'All' };

export const BondPeriodTypeAllOption = { value: BondPeriodType.PeriodALL, label: 'All' };

export const IssuerRatingTypeAllOption = { value: IssuerRatingType.IssuerRatingAll, label: 'All' };

export const InstRatingTypeAllOption = { value: InstRatingType.InstRatingAll, label: 'All' };

export const IsMunicipalTypeAllOption = { value: IsMunicipalType.MunicipalAll, label: 'All' };

export const IsPlatformTypeAllOption = { value: IsPlatformType.PlatformAll, label: 'All' };

export const WithWarranterTypeAllOption = { value: WithWarranterType.WarranterAll, label: 'All' };

export const BondPerpetualTypeAllOption = { value: BondPerpetualType.BondPerpetualAll, label: 'All' };

export const BondFinancialCategoryTypeOptionAll = {
  value: BondFinancialCategoryType.BondFinancialCategoryAll,
  label: '全部'
};

export const distrctOptions = [
  { value: 'GZPRN', label: '贵州' },
  { value: 'YNPRN', label: '云南' },
  { value: 'LNPRN', label: '辽宁' },
  { value: 'IMPRN', label: '内蒙古' },
  { value: 'GDPRN', label: '广东' },
  { value: 'FJPRN', label: '福建' },
  { value: 'ZJPRN', label: '浙江' },
  { value: 'BJPRN', label: '北京' },
  { value: 'JSPRN', label: '江苏' },
  { value: 'SHPRN', label: '上海' },
  { value: 'SDPRN', label: '山东' },
  { value: 'HBPRN', label: '湖北' },
  { value: 'JXPRN', label: '江西' },
  { value: 'SCPRN', label: '四川' },
  { value: 'CQPRN', label: '重庆' },
  { value: 'HNPRN', label: '湖南' },
  { value: 'AHPRN', label: '安徽' },
  { value: 'HEPRN', label: '河北' },
  { value: 'HAPRN', label: '河南' },
  // { value: 'OVS', label: '海外' },
  { value: 'XGPRN', label: '香港' },
  { value: 'AMPRN', label: '澳门' },
  { value: 'TWPRN', label: '台湾' },
  // { value: 'XAOTH002', label: '雄安新区' },
  { value: 'XZPRN', label: '西藏' },
  { value: 'TJPRN', label: '天津' },
  { value: 'SNPRN', label: '陕西' },
  { value: 'GSPRN', label: '甘肃' },
  { value: 'XJPRN', label: '新疆' },
  { value: 'SXPRN', label: '山西' },
  { value: 'NXPRN', label: '宁夏' },
  { value: 'GXPRN', label: '广西' },
  { value: 'JLPRN', label: '吉林' },
  { value: 'HLPRN', label: '黑龙江' },
  { value: 'QHPRN', label: '青海' },
  { value: 'HIPRN', label: '海南' }
];

export const getEmptyTraderConfig: (type: RecommendRuleType) => BondRecommendConfig = type => {
  const isHRule = type === RecommendRuleType.H;

  return {
    id: '0', // 模板唯一ID
    name: '', // 模板名称
    bond_goods_type: isHRule ? [BondGoodsType.GoodsAll] : undefined, // 产品类型
    bond_asset_type: isHRule ? [BondAssetType.AssetAll] : undefined, // 发行
    bond_inst_type: isHRule ? [BondInstType.InstAll] : undefined, // 债券主体类型
    bond_market_type: isHRule ? [BondMarketType.MarketAll] : undefined, // 交易所
    period_type: [BondPeriodType.PeriodALL], // 久期
    issuer_rating_type: isHRule ? [IssuerRatingType.IssuerRatingAll] : undefined, // 主体评级
    inst_rating_type: isHRule ? [InstRatingType.InstRatingAll] : undefined, // 中信资债评级
    is_municipal: isHRule ? IsMunicipalType.MunicipalAll : undefined, // 是否为城投债
    with_warranter: isHRule ? WithWarranterType.WarranterAll : undefined, // 是否有担保
    is_financing_platform_bond: isHRule ? IsPlatformType.PlatformAll : undefined, // 是否是平台债
    is_perpetual_bond: isHRule ? [BondPerpetualType.BondPerpetualAll] : undefined, // 是否是永续债
    issue_year: isHRule ? [] : undefined, // 发行年份
    config_desc: '', // 配置描述
    bond_financial_category_type: isHRule ? undefined : [BondFinancialCategoryType.BondFinancialCategoryAll], // 金融债分类
    province_code_list: isHRule ? ['全部'] : undefined, // 省份
    is_mortgage: false, // 是否可质押
    is_gn: false, // GN
    is_not_option: false, // 是否非含权
    rule_type: type
  };
};
