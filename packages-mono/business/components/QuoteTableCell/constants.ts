import cx from 'classnames';
import { ColumnOptions } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/enum';
import { BondQuoteTableColumnKey } from './types';

export const basicCls = 'flex items-center h-full';
export const alignLeftCls = cx(basicCls, 'justify-start pl-4');
export const alignCenterCls = cx(basicCls, 'justify-center');
export const alignRightCls = cx(basicCls, 'justify-end pr-4');

export const blockBasicCls = 'px-4 leading-7 truncate';
export const blockAlignCenterCls = cx(blockBasicCls, 'text-center');
export const blockAlignRightCls = cx(blockBasicCls, 'text-right');

export const valuationCellCls = cx('flex items-center gap-1.5 truncate-clip', alignRightCls);

export const DATA_PREFETCH_STALE_TIME = 15 * 1000;

/** 剩余期限列配置 */
export const firstMaturityDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.FirstMaturityDate,
  header: '剩余期限',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.FirstMaturityDate,
    sortedField: sort && QuoteSortedField.FieldFirstMaturityDate
  }
});

/** 代码列配置 */
export const bondCodeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.BondCode,
  header: '代码',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.BondCode,
    sortedField: sort && QuoteSortedField.FieldBondCode
  }
});

/** 简称列配置 */
export const shortNameOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ShortName,
  header: '简称',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ShortName,
    sortedField: sort && QuoteSortedField.FieldBondShortName
  }
});

/** Bid 列配置 */
export const bidOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Bid,
  header: 'Bid',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Bid,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldBid
  }
});

/** Ofr 列配置 */
export const ofrOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Ofr,
  header: 'Ofr',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Ofr,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldOfr
  }
});

/** 主体评级列配置 */
export const issuerRatingOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.IssuerRatingVal,
  header: '主体评级',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.IssuerRatingVal,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldIssuerRatingVal,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 债券评级列配置 */
export const bondRatingOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.BondRatingVal,
  header: '债券评级',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.BondRatingVal,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldBondRatingVal,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 中债净价列配置 */
export const valCleanPriceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ValCleanPrice,
  header: '中债净价',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ValCleanPrice,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldValCleanPrice,
    tdCls: valuationCellCls
  }
});

/** 中债YTM(%)列配置 */
export const valYieldOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ValYield,
  header: '中债YTM(%)',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ValYield,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldValYield,
    tdCls: valuationCellCls
  }
});

/** 中证净价列配置 */
export const csiCleanPriceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CsiCleanPrice,
  header: '中证净价',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CsiCleanPrice,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldCsiCleanPrice,
    tdCls: valuationCellCls
  }
});

/** 中证全价列配置 */
export const csiFullPriceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CsiFullPrice,
  header: '中证全价',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CsiFullPrice,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldCsiFullPrice,
    tdCls: valuationCellCls
  }
});

/** 中证YTM(%)列配置 */
export const csiYieldOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CsiYield,
  header: '中证YTM(%)',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CsiYield,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldCsiYield,
    tdCls: valuationCellCls
  }
});

/** CP 列配置 */
export const cpOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Cp,
  header: 'CP',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Cp,
    align: 'left',
    sortedField: sort && QuoteSortedField.FieldTrader,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** Vol 列配置 */
export const volOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Volume,
  header: 'Vol',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Volume,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldVolume,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** Broker 列配置 */
export const brokerOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Broker,
  header: 'Broker',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Broker,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldBroker,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 全价列配置 */
export const fullPriceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.FullPrice,
  header: '全价',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.FullPrice,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldFullPrice,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 净价列配置 */
export const cleanPriceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CleanPrice,
  header: '净价',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CleanPrice,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldCleanPrice,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 利差列配置 */
export const spreadOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Spread,
  header: '利差',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Spread,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldSpread,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 含权类型列配置 */
export const optionTypeOpts = <T>(): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.OptionType,
  header: '含权类型',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.OptionType,
    align: 'center',
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 上市日列配置 */
export const listedDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ListedDate,
  header: '上市日',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ListedDate,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldListedDate,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 提前还本列配置 */
export const repaymentMethodOpts = <T>(): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.RepaymentMethod,
  header: '提前还本',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.RepaymentMethod,
    align: 'center',
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 久期列配置 */
export const valModifiedDurationOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ValModifiedDuration,
  header: '久期',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ValModifiedDuration,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldValModifiedDuration,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 备注列配置 */
export const commentOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Comment,
  header: '备注',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Comment,
    sortedField: sort && QuoteSortedField.FieldComment,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** 操作人列配置 */
export const operatorOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Operator,
  header: '操作人',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Operator,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldOperator,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 质押率列配置 */
export const conversionRateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ConversionRate,
  header: '质押率',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ConversionRate,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldConversionRate,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 中债资信评级列配置 */
export const cbcRatingOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CbcRatingVal,
  header: '中债资信评级',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CbcRatingVal,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldCbcRatingVal,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** 到期日列配置 */
export const maturityDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.MaturityDate,
  header: '到期日',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.MaturityDate,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldMaturityDate,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 撤销列配置 */
export const referTypeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ReferType,
  header: '撤销',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ReferType,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldRefType,
    tdCls: alignCenterCls
  }
});

/** Update Time 列配置 */
export const updateTimeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.UpdateTime,
  header: 'Time',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.UpdateTime,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldUpdateTime,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** PVBP 列配置 */
export const pvbpOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ValBasisPointValue,
  header: 'PVBP',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ValBasisPointValue,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldValBasisPointValue,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 隐含评级列配置 */
export const impliedRatingOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.ImpliedRating,
  header: '隐含评级',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ImpliedRating,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldImpliedRating,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** Broker(B) 列配置 */
export const bidBrokerOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.BrokerB,
  header: 'Broker(B)',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.BrokerB,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldBrokerBid,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** Broker(O) 列配置 */
export const ofrBrokerOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.BrokerO,
  header: 'Broker(O)',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.BrokerO,
    align: 'center',
    sortedField: sort && QuoteSortedField.FieldBrokerOfr,
    tdCls: `${alignCenterCls} truncate-clip`
  }
});

/** CP.Bid 列配置 */
export const bidCpOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CpBid,
  header: 'CP.Bid',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CpBid,
    sortedField: sort && QuoteSortedField.FieldCPBid
  }
});

/** CP.Ofr 列配置 */
export const ofrCpOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CpOfr,
  header: 'CP.Ofr',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CpOfr,
    sortedField: sort && QuoteSortedField.FieldCPOfr
  }
});

/** Px 列配置 */
export const pxOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Px,
  header: 'Px',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Px,
    sortedField: sort && QuoteSortedField.FieldDealPrice,
    align: 'right'
  }
});

/** 交易日列配置 */
export const tradedDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.TradedDate,
  header: '交易日',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.TradedDate,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldTradedDate,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 交割日列配置 */
export const deliveryDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.DeliveryDate,
  header: '交割日',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.DeliveryDate,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldDeliveryDate,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 成交日列配置 */
export const dealTimeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.DealTime,
  header: '成交日',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.DealTime,
    align: 'right',
    sortedField: sort && QuoteSortedField.FieldDealTime,
    tdCls: `${alignRightCls} truncate-clip`
  }
});

/** 清算速度列配置 */
export const liqSpeedOpts = <T>(): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.LiquidationSpeed,
  header: '清算速度',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.LiquidationSpeed,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** 操作时间列配置 */
export const createTimeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.CreateTime,
  header: '操作时间',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CreateTime,
    sortedField: sort && QuoteSortedField.FieldCreateTime,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** 操作类型列配置 */
export const operationTypeOpts = <T>(): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.OperationType,
  header: '操作类型',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.OperationType,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});
