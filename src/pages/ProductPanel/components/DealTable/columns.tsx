import {
  CPCell,
  FirstMaturityDateCell,
  PXCell,
  ShortNameCell,
  ValuationCell
} from '@fepkg/business/components/QuoteTableCell';
import {
  alignLeftCls,
  basicCls,
  bidBrokerOpts,
  bidCpOpts,
  bondCodeOpts,
  bondRatingOpts,
  commentOpts,
  csiCleanPriceOpts,
  csiFullPriceOpts,
  csiYieldOpts,
  dealTimeOpts,
  deliveryDateOpts,
  firstMaturityDateOpts,
  impliedRatingOpts,
  issuerRatingOpts,
  liqSpeedOpts,
  listedDateOpts,
  ofrBrokerOpts,
  ofrCpOpts,
  operatorOpts,
  optionTypeOpts,
  pvbpOpts,
  pxOpts,
  repaymentMethodOpts,
  shortNameOpts,
  tradedDateOpts,
  valCleanPriceOpts,
  valModifiedDurationOpts,
  valYieldOpts,
  volOpts
} from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { QuoteSortedField } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DealTableColumn } from './types';

export const columnHelper = createColumnHelper<DealTableColumn>();

/** 剩余期限列 */
export const firstMaturityDateCol = columnHelper.display({
  ...firstMaturityDateOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.FirstMaturityDate,
    sortedField: QuoteSortedField.FieldFirstMaturityDate,
    tdCls: `${alignLeftCls} gap-1`
  },
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { time_to_maturity } = bond_info;
    const { restDayNum } = row.original;
    return (
      <FirstMaturityDateCell
        content={time_to_maturity}
        restDayNum={restDayNum}
      />
    );
  }
});

/** 代码列 */
export const bondCodeCol = columnHelper.display({
  ...bondCodeOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.BondCode,
    sortedField: QuoteSortedField.FieldBondCode,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => row.original.bondCode
});

/** 简称列 */
export const shortNameCol = columnHelper.display({
  ...shortNameOpts(false),
  meta: {
    columnKey: BondQuoteTableColumnKey.ShortName,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { short_name, maturity_is_holiday } = bond_info;
    const { listed, frType, weekendDay, restDayNum } = row.original;
    return (
      <ShortNameCell
        content={short_name}
        listed={listed}
        frType={frType}
        weekendDay={weekendDay}
        restDayNum={restDayNum}
        maturityIsHoliday={maturity_is_holiday}
      />
    );
  }
});

/** Px 列 */
export const pxCol = columnHelper.display({
  ...pxOpts(),
  cell: ({ row }) => {
    const { price, flag_internal, flag_rebate, return_point, direction, with_active_quote, nothing_done } =
      row.original.original;
    const { comment } = row.original;
    return (
      <PXCell
        price={price}
        internal={flag_internal}
        rebate={flag_rebate}
        returnPoint={return_point}
        comment={comment}
        direction={direction}
        nothingDone={nothing_done}
        withActiveQuote={with_active_quote}
      />
    );
  }
});

/** Vol 列 */
export const volCol = columnHelper.display({
  ...volOpts(false),
  cell: ({ row }) => row.original.volume
});

/** Broker(B) 列 */
export const bidBrokerCol = columnHelper.display({
  ...bidBrokerOpts(false),
  cell: ({ row }) => row.original.original?.bid_broker_name
});

/** Broker(O) 列 */
export const ofrBrokerCol = columnHelper.display({
  ...ofrBrokerOpts(false),
  cell: ({ row }) => row.original.original?.ofr_broker_name
});

/** 主体评级列 */
export const issuerRatingCol = columnHelper.display({
  ...issuerRatingOpts(),
  cell: ({ row }) => row.original.original.bond_basic_info?.issuer_rating
});

/** 交易日列 */
export const tradedDateCol = columnHelper.display({
  ...tradedDateOpts(),
  cell: ({ row }) => row.original.tradedDate
});

/** 交割日列 */
export const deliveryDateCol = columnHelper.display({
  ...deliveryDateOpts(),
  cell: ({ row }) => row.original.deliveryDate
});

/** 成交日列 */
export const dealTimeCol = columnHelper.display({
  ...dealTimeOpts(),
  cell: ({ row }) => row.original.dealTime
});

/** 债券评级列 */
export const bondRatingCol = columnHelper.display({
  ...bondRatingOpts(false),
  cell: ({ row }) => row.original.original.bond_basic_info?.rating
});

/** 中债净价列 */
export const valCleanPriceCol = columnHelper.display({
  ...valCleanPriceOpts(false),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { val_clean_price_exe, val_clean_price_mat } = bond_info;
    return (
      <ValuationCell
        first={val_clean_price_exe}
        last={val_clean_price_mat}
      />
    );
  }
});

/** 中债YTM(%)列 */
export const valYieldCol = columnHelper.display({
  ...valYieldOpts(false),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { val_yield_exe, val_yield_mat } = bond_info;
    return (
      <ValuationCell
        first={val_yield_exe}
        last={val_yield_mat}
      />
    );
  }
});

/** 中证净价列 */
export const csiCleanPriceCol = columnHelper.display({
  ...csiCleanPriceOpts(false),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { csi_clean_price_exe, csi_clean_price_mat } = bond_info;
    return (
      <ValuationCell
        first={csi_clean_price_exe}
        last={csi_clean_price_mat}
      />
    );
  }
});

/** 中证全价列 */
export const csiFullPriceCol = columnHelper.display({
  ...csiFullPriceOpts(false),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { csi_full_price_exe, csi_full_price_mat } = bond_info;
    return (
      <ValuationCell
        first={csi_full_price_exe}
        last={csi_full_price_mat}
      />
    );
  }
});

/** 中证YTM(%)列 */
export const csiYieldCol = columnHelper.display({
  ...csiYieldOpts(false),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { csi_yield_exe, csi_yield_mat } = bond_info;
    return (
      <ValuationCell
        first={csi_yield_exe}
        last={csi_yield_mat}
      />
    );
  }
});

/** 清算速度列 */
export const liquidationSpeedCol = columnHelper.display({
  ...liqSpeedOpts(),
  cell: ({ row }) => row.original.liquidationSpeedContent
});

/** CP.Bid 列 */
export const bidCpCol = columnHelper.display({
  ...bidCpOpts(false),
  meta: {
    columnKey: BondQuoteTableColumnKey.CpBid,
    tdCls: `${basicCls} justify-start flex-row pl-0`
  },
  cell: ({ row }) => {
    const { bidInfo } = row.original;
    const { cp, cpHighlightCls } = bidInfo;
    return (
      <CPCell
        content={cp}
        contentCls={cpHighlightCls}
      />
    );
  }
});

/** CP.Ofr 列 */
export const ofrCpCol = columnHelper.display({
  ...ofrCpOpts(false),
  meta: {
    columnKey: BondQuoteTableColumnKey.CpOfr,
    tdCls: `${basicCls} justify-start flex-row pl-0`
  },
  cell: ({ row }) => {
    const { ofrInfo } = row.original;
    const { cp, cpHighlightCls } = ofrInfo;
    return (
      <CPCell
        content={cp}
        contentCls={cpHighlightCls}
      />
    );
  }
});

/** 含权类型列 */
export const optionTypeCol = columnHelper.display({
  ...optionTypeOpts(),
  cell: ({ row }) => row.original.optionType
});

/** 上市日列 */
export const listedDateCol = columnHelper.display({
  ...listedDateOpts(false),
  cell: ({ row }) => row.original.listedDate
});

/** 提前还本列 */
export const repaymentMethodCol = columnHelper.display({
  ...repaymentMethodOpts(),
  cell: ({ row }) => row.original.repaymentMethod
});

/** 久期列 */
export const valModifiedDurationCol = columnHelper.display({
  ...valModifiedDurationOpts(false),
  cell: ({ row }) => row.original.valModifiedDuration || '--'
});

/** PVBP 列 */
export const pvbpCol = columnHelper.display({
  ...pvbpOpts(false),
  cell: ({ row }) => row.original.pvbp
});

/** 操作人列 */
export const operatorCol = columnHelper.display({
  ...operatorOpts(false),
  cell: ({ row }) => row.original.operatorName
});

/** 备注列 */
export const commentCol = columnHelper.display({
  ...commentOpts(false),
  cell: ({ row }) => row.original.comment
});

/** 隐含评级列 */
export const impliedRatingCol = columnHelper.display({
  ...impliedRatingOpts(false),
  cell: ({ row }) => row.original.original.bond_basic_info?.implied_rating
});

export const columns: ColumnDef<DealTableColumn>[] = [
  firstMaturityDateCol,
  bondCodeCol,
  shortNameCol,
  pxCol,
  volCol,
  bidBrokerCol,
  ofrBrokerCol,
  issuerRatingCol,
  tradedDateCol,
  deliveryDateCol,
  dealTimeCol,
  bondRatingCol,
  valCleanPriceCol,
  valYieldCol,
  csiCleanPriceCol,
  csiFullPriceCol,
  csiYieldCol,
  liquidationSpeedCol,
  bidCpCol,
  ofrCpCol,
  optionTypeCol,
  listedDateCol,
  repaymentMethodCol,
  valModifiedDurationCol,
  pvbpCol,
  operatorCol,
  commentCol,
  impliedRatingCol
];
