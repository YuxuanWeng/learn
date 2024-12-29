import { ConfigRedisGetParams } from '@fepkg/services/api/template/validate';
import { ExportTemplate, ExportTemplateConfigItem, ExportTemplateConfigItemKey, ExportTemplateValue } from './types';

export const btnProps = { className: 'w-16 h-6 px-0', plain: true } as const;

/** 最大模板数量 */
export const MAX_TEMPLATE_COUNT = 3;

/** 基本信息默认模板配置 */
export const BASE_DEFAULT_EXPORT_TEMPLATE_CONFIG: ExportTemplateConfigItem[] = [
  { key: ExportTemplateConfigItemKey.Product, label: '业务台', header: '业务台', wpx: 44 },
  { key: ExportTemplateConfigItemKey.ProductType, label: '业务类别', header: '业务类别', wpx: 56 },
  { key: ExportTemplateConfigItemKey.OrderNo, label: '订单号', header: '订单号', wpx: 70 },
  { key: ExportTemplateConfigItemKey.BridgeCode, label: '过桥码', header: '过桥码', wpx: 44 },
  { key: ExportTemplateConfigItemKey.Status, label: '成交单状态', header: '成交单状态', wpx: 70 },
  { key: ExportTemplateConfigItemKey.CreateTime, label: '创建时间', header: '成交单创建时间', wpx: 98 },
  { key: ExportTemplateConfigItemKey.SubmissionDate, label: '首次提交时间', header: '成交单首次提交时间', wpx: 132 },
  { key: ExportTemplateConfigItemKey.TradedDate, label: '交易日', header: '交易日', wpx: 70 },
  { key: ExportTemplateConfigItemKey.DeliveryDate, label: '交割日', header: '交割日', wpx: 70 },
  { key: ExportTemplateConfigItemKey.Exercise, label: '行权/到期', header: '行权/到期', wpx: 62 },
  { key: ExportTemplateConfigItemKey.OptionDate, label: '行权日', header: '行权日', wpx: 70 },
  { key: ExportTemplateConfigItemKey.MaturityDate, label: '到期日', header: '到期日', wpx: 70 },
  { key: ExportTemplateConfigItemKey.BondSubtype, label: '债券分类', header: '债券分类', wpx: 56 },
  { key: ExportTemplateConfigItemKey.BondDisplayCode, label: '债券代码', header: '债券代码', wpx: 56 },
  { key: ExportTemplateConfigItemKey.BondShortName, label: '债券简称', header: '债券简称', wpx: 56 },
  { key: ExportTemplateConfigItemKey.Price, label: '价格', header: '价格', wpx: 56 },
  { key: ExportTemplateConfigItemKey.ReturnPoint, label: '返点数值', header: '返点数值', wpx: 56 },
  { key: ExportTemplateConfigItemKey.Volume, label: '数量', header: '数量', wpx: 56 },
  { key: ExportTemplateConfigItemKey.Yield, label: '收益率', header: '收益率', wpx: 56 },
  { key: ExportTemplateConfigItemKey.CleanPrice, label: '净价', header: '净价', wpx: 56 },
  { key: ExportTemplateConfigItemKey.FullPrice, label: '全价', header: '全价', wpx: 56 },
  { key: ExportTemplateConfigItemKey.SettlementMode, label: '结算方式', header: '结算方式', wpx: 56 },
  { key: ExportTemplateConfigItemKey.SettlementAmount, label: '结算金额', header: '结算金额', wpx: 78 },
  { key: ExportTemplateConfigItemKey.BackendMsg, label: '后台信息', header: '后台信息', wpx: 56 }
];

/** Bid 方信息默认模板配置 */
export const BID_DEFAULT_EXPORT_TEMPLATE_CONFIG: ExportTemplateConfigItem[] = [
  { key: ExportTemplateConfigItemKey.BidInstCode, label: '机构代码', header: 'Bid方机构代码', wpx: 92 },
  { key: ExportTemplateConfigItemKey.BidInstShortName, label: '机构简称', header: 'Bid方机构简称', wpx: 92 },
  { key: ExportTemplateConfigItemKey.BidCity, label: '城市', header: 'Bid方城市', wpx: 62 },
  { key: ExportTemplateConfigItemKey.BidPayfor, label: '代付机构', header: 'Bid方代付机构', wpx: 92 },
  { key: ExportTemplateConfigItemKey.BidTrader, label: '交易员', header: 'Bid方交易员', wpx: 78 },
  { key: ExportTemplateConfigItemKey.BidTraderMode, label: '撮合方式', header: 'Bid方撮合方式', wpx: 92 },
  { key: ExportTemplateConfigItemKey.BidBroker, label: '经纪人', header: 'Bid方经纪人', wpx: 104 },
  { key: ExportTemplateConfigItemKey.BidBrokerage, label: '佣金方式', header: 'Bid方佣金方式', wpx: 92 },
  { key: ExportTemplateConfigItemKey.BidInstBrokerageComment, label: '免佣原因', header: 'Bid方免佣原因', wpx: 124 },
  { key: ExportTemplateConfigItemKey.BidFlagNC, label: '是否NC', header: 'Bid方是否NC', wpx: 78 },
  { key: ExportTemplateConfigItemKey.BidNCReason, label: 'NC原因', header: 'Bid方NC原因', wpx: 78 }
];

/** Ofr 方信息默认模板配置 */
export const OFR_DEFAULT_EXPORT_TEMPLATE_CONFIG: ExportTemplateConfigItem[] = [
  { key: ExportTemplateConfigItemKey.OfrInstCode, label: '机构代码', header: 'Ofr方机构代码', wpx: 92 },
  { key: ExportTemplateConfigItemKey.OfrInstShortName, label: '机构简称', header: 'Ofr方机构简称', wpx: 92 },
  { key: ExportTemplateConfigItemKey.OfrCity, label: '城市', header: 'Ofr方城市', wpx: 62 },
  { key: ExportTemplateConfigItemKey.OfrPayfor, label: '代付机构', header: 'Ofr方代付机构', wpx: 92 },
  { key: ExportTemplateConfigItemKey.OfrTrader, label: '交易员', header: 'Ofr方交易员', wpx: 78 },
  { key: ExportTemplateConfigItemKey.OfrTraderMode, label: '撮合方式', header: 'Ofr方撮合方式', wpx: 92 },
  { key: ExportTemplateConfigItemKey.OfrBroker, label: '经纪人', header: 'Ofr方经纪人', wpx: 104 },
  { key: ExportTemplateConfigItemKey.OfrBrokerage, label: '佣金方式', header: 'Ofr方佣金方式', wpx: 92 },
  { key: ExportTemplateConfigItemKey.OfrInstBrokerageComment, label: '免佣原因', header: 'Ofr方免佣原因', wpx: 124 },
  { key: ExportTemplateConfigItemKey.OfrFlagNC, label: '是否NC', header: 'Ofr方是否NC', wpx: 78 },
  { key: ExportTemplateConfigItemKey.OfrNCReason, label: 'NC原因', header: 'Ofr方NC原因', wpx: 78 }
];

/** 默认模板配置 */
export const DEFAULT_EXPORT_TEMPLATE_CONFIG: ExportTemplateConfigItem[] = [
  ...BASE_DEFAULT_EXPORT_TEMPLATE_CONFIG,
  ...BID_DEFAULT_EXPORT_TEMPLATE_CONFIG,
  ...OFR_DEFAULT_EXPORT_TEMPLATE_CONFIG
];

export const BaseExportTemplateOptions = BASE_DEFAULT_EXPORT_TEMPLATE_CONFIG.map(item => ({
  label: item.label,
  value: item.key
}));

export const BidExportTemplateOptions = BID_DEFAULT_EXPORT_TEMPLATE_CONFIG.map(item => ({
  label: item.label,
  value: item.key
}));

export const OfrExportTemplateOptions = OFR_DEFAULT_EXPORT_TEMPLATE_CONFIG.map(item => ({
  label: item.label,
  value: item.key
}));

/** 默认模板内容 */
export const DEFAULT_EXPORT_TEMPLATE_VALUE = Object.freeze(
  DEFAULT_EXPORT_TEMPLATE_CONFIG.reduce((target, curr) => {
    target[curr.key] = true;
    return target;
  }, {} as ExportTemplateValue)
);

/** 默认模板 */
export const DEFAULT_EXPORT_TEMPLATE: ExportTemplate = Object.freeze({
  id: 'dtm_default_export_template',
  label: '默认',
  value: DEFAULT_EXPORT_TEMPLATE_VALUE
});

/** 默认模板配置请求参数 */
export const EXPORT_TEMPLATE_CONFIG_PARAMS: ConfigRedisGetParams<ExportTemplate[]> = {
  key: 'dtm_export_template_config',
  type: 'array',
  defaultValue: [DEFAULT_EXPORT_TEMPLATE]
};

/** 默认已选模板 id 请求参数 */
export const getExportTemplateSelectedIdParams = (userId?: string): ConfigRedisGetParams<string> => ({
  // 这个与用户有关，需要使用 userId 作为 key 的一部分
  key: `dtm_export_template_selected_id_${userId}`,
  type: 'string',
  defaultValue: DEFAULT_EXPORT_TEMPLATE.id
});
