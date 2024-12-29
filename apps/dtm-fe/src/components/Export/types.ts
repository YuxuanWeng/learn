import { ModalProps } from '@fepkg/components/Modal';
import { DynamicFilterParams } from '@/common/services/hooks/useReceiptDealApprovalSearch';

export namespace ExportProps {
  export type Button = {
    /** 过滤参数 */
    filterParams: DynamicFilterParams;
  };

  export type TemplateModal = ModalProps;

  export type TemplateModalContent = {
    /** 默认的模版内容 */
    defaultValue?: ExportTemplateValue;
  };
}

export type TemplateModalState = {
  /** 是否正在编辑中 */
  editing: boolean;
  /** 是否正在保存中 */
  loading: boolean;
  /** 已选中模板的 id */
  selectedId?: string;
  /** 已更新的模板内容 */
  updated?: ExportTemplateValue;
};

/** 导出模板内容 */
export type ExportTemplateValue = { [key in ExportTemplateConfigItemKey]: boolean };
/** 导出模版顺序索引缓存，后端会按照顺序返回每行导出内容，前端会使用 split(',') 对该行内容进行分割，
 * 出于性能考虑，需要一个索引缓存，记录 split(',') 分割后内容顺序对应导出模板对应的 ExportTemplateConfigItemKey 的 boolean 值，
 * 例如：ExportTemplate 为 { [ExportTemplateConfigItemKey.Product]: true }，
 * 对应的 ExportTemplateIdxCache 为 { 1: true }，这个顺序转换为 DEFAULT_EXPORT_TEMPLATE_CONFIG 内的顺序 */
export type ExportTemplateIdxCache = { [idx in number]: boolean };

/** 导出模板 */
export type ExportTemplate = {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  label: string;
  /** 模板内容 */
  value: ExportTemplateValue;
};

export type ExportTemplateConfigItem = {
  /** Key */
  key: ExportTemplateConfigItemKey;
  /** 配置项展示文案 */
  label: string;
  /** 表头 */
  header: string;
  /** ColInfo width in screen pixels */
  wpx: number;
};

export enum ExportTemplateConfigItemKey {
  // Base

  /** 业务台 */
  Product = 'product',
  /** 业务类别 */
  ProductType = 'product_type',
  /** 订单号 */
  OrderNo = 'order_no',
  /** 过桥码 */
  BridgeCode = 'bridge_code',
  /** 成交单状态 */
  Status = 'status',
  /** 成交单创建时间 */
  CreateTime = 'create_time',
  /** 成交单首次提交时间 */
  SubmissionDate = 'submission_date',
  /** 交易日 */
  TradedDate = 'traded_date',
  /** 交割日 */
  DeliveryDate = 'delivery_date',
  /** 行权/到期 */
  Exercise = 'exercise',
  /** 行权日 */
  OptionDate = 'option_date',
  /** 到期日 */
  MaturityDate = 'maturity_date',
  /** 债券分类 */
  BondSubtype = 'bond_subtype',
  /** 债券代码 */
  BondDisplayCode = 'bond_display_code',
  /** 债券简称 */
  BondShortName = 'bond_short_name',
  /** 价格 */
  Price = 'price',
  /** 返点数值 */
  ReturnPoint = 'return_point',
  /** 数量 */
  Volume = 'volume',
  /** 收益率 */
  Yield = 'yield',
  /** 净价 */
  CleanPrice = 'clean_price',
  /** 全价 */
  FullPrice = 'full_price',
  /** 结算模式 */
  SettlementMode = 'settlement_mode',
  /** 结算金额 */
  SettlementAmount = 'settlement_amount',
  /** 后台信息 */
  BackendMsg = 'backend_msg',

  // Bid

  /** 机构代码 */
  BidInstCode = 'bid_inst_code',
  /** 机构简称 */
  BidInstShortName = 'bid_inst_short_name',
  /** 城市 */
  BidCity = 'bid_city',
  /** 代付机构 */
  BidPayfor = 'bid_payfor',
  /** 交易员 */
  BidTrader = 'bid_trader',
  /** 交易员标签 */
  // BidTraderTag = 'bid_trader_tag',
  /** 撮合方式 */
  BidTraderMode = 'bid_trader_mode',
  /** 经纪人 */
  BidBroker = 'bid_broker',
  /** 佣金方式 */
  BidBrokerage = 'bid_brokerage',
  /** 免佣原因 */
  BidInstBrokerageComment = 'bid_inst_brokerage_comment',
  /** 是否NC */
  BidFlagNC = 'bid_flag_nc',
  /** NC原因 */
  BidNCReason = 'bid_nc_reason',

  // Ofr

  /** 机构代码 */
  OfrInstCode = 'ofr_inst_code',
  /** 机构简称 */
  OfrInstShortName = 'ofr_inst_short_name',
  /** 城市 */
  OfrCity = 'ofr_city',
  /** 代付机构 */
  OfrPayfor = 'ofr_payfor',
  /** 交易员 */
  OfrTrader = 'ofr_trader',
  /** 交易员标签 */
  // OfrTraderTag = 'ofr_trader_tag',
  /** 撮合方式 */
  OfrTraderMode = 'ofr_trader_mode',
  /** 经纪人 */
  OfrBroker = 'ofr_broker',
  /** 佣金方式 */
  OfrBrokerage = 'ofr_brokerage',
  /** 免佣原因 */
  OfrInstBrokerageComment = 'ofr_inst_brokerage_comment',
  /** 是否NC */
  OfrFlagNC = 'ofr_flag_nc',
  /** NC原因 */
  OfrNCReason = 'ofr_nc_reason'
}
