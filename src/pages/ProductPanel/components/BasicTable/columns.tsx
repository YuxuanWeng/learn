import {
  CPCell,
  FirstMaturityDateCell,
  ReferTypeCell,
  ShortNameCell,
  ValuationCell
} from '@fepkg/business/components/QuoteTableCell';
import {
  alignLeftCls,
  alignRightCls,
  basicCls,
  bidOpts,
  bondCodeOpts,
  bondRatingOpts,
  brokerOpts,
  cbcRatingOpts,
  cleanPriceOpts,
  commentOpts,
  conversionRateOpts,
  cpOpts,
  csiCleanPriceOpts,
  csiFullPriceOpts,
  csiYieldOpts,
  firstMaturityDateOpts,
  fullPriceOpts,
  impliedRatingOpts,
  issuerRatingOpts,
  listedDateOpts,
  maturityDateOpts,
  ofrOpts,
  operatorOpts,
  optionTypeOpts,
  pvbpOpts,
  referTypeOpts,
  repaymentMethodOpts,
  shortNameOpts,
  spreadOpts,
  updateTimeOpts,
  valCleanPriceOpts,
  valModifiedDurationOpts,
  valYieldOpts,
  volOpts
} from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { QuoteLite } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SideCell } from '@/components/QuoteTableCell';
import type { BasicTableColumn } from './types';

export const columnHelper = createColumnHelper<BasicTableColumn>();

/** 剩余期限列 */
export const firstMaturityDateCol = columnHelper.display({
  ...firstMaturityDateOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.FirstMaturityDate,
    sortedField: QuoteSortedField.FieldFirstMaturityDate,
    tdCls: row => `${alignLeftCls} gap-1 ${row.original.recommendCls}`
  },
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { restDayNum } = row.original;
    return (
      <FirstMaturityDateCell
        content={bond_info?.time_to_maturity}
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
    tdCls: row => `${alignLeftCls} ${row.original.recommendCls}`
  },
  cell: ({ row }) => row.original?.bondCode
});

/** 简称列 */
export const shortNameCol = columnHelper.display({
  ...shortNameOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.ShortName,
    sortedField: QuoteSortedField.FieldBondShortName,
    tdCls: row => `${alignLeftCls} overflow-hidden ${row.original?.recommendCls}`
  },
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    const { listed, frType, weekendDay, restDayNum } = row.original;
    return (
      <ShortNameCell
        content={bond_info?.short_name}
        listed={listed}
        frType={frType}
        weekendDay={weekendDay}
        restDayNum={restDayNum}
        maturityIsHoliday={bond_info?.maturity_is_holiday}
      />
    );
  }
});

export const renderSideCell = (displaySide: Side, quote: QuoteLite, comment: string, other?: boolean) => {
  const {
    side,
    quote_type,
    quote_price,
    return_point,
    almost_done,
    flag_internal,
    flag_rebate,
    flag_intention,
    flag_star,
    flag_oco,
    flag_exchange,
    flag_package,
    liquidation_speed_list,
    exercise_manual,
    bond_basic_info: bond_info
  } = quote;

  return (
    side === displaySide && (
      <SideCell
        side={displaySide}
        quote={quote}
        price={quote_price}
        quoteType={quote_type}
        returnPoint={return_point}
        comment={comment}
        almostDone={almost_done}
        internal={flag_internal}
        rebate={flag_rebate}
        intention={flag_intention}
        star={flag_star}
        oco={flag_oco}
        exchange={flag_exchange}
        packAge={flag_package}
        liquidationSpeedList={liquidation_speed_list}
        extrabold={!other}
        exerciseManual={exercise_manual}
        bondInfo={bond_info}
      />
    )
  );
};

/** Bid 列 */
export const bidCol = columnHelper.display({
  ...bidOpts(),
  cell: ({ row }) => renderSideCell(Side.SideBid, row.original.original, row.original.comment)
});

/** Ofr 列 */
export const ofrCol = columnHelper.display({
  ...ofrOpts(),
  cell: ({ row }) => renderSideCell(Side.SideOfr, row.original.original, row.original.comment)
});

/** 主体评级列 */
export const issuerRatingCol = columnHelper.display({
  ...issuerRatingOpts(),
  cell: ({ row }) => row.original.original?.bond_basic_info?.issuer_rating
});

/** 债券评级列 */
export const bondRatingCol = columnHelper.display({
  ...bondRatingOpts(),
  cell: ({ row }) => row.original.original?.bond_basic_info?.rating
});

/** 中债净价列 */
export const valCleanPriceCol = columnHelper.display({
  ...valCleanPriceOpts(),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    return (
      <ValuationCell
        first={bond_info?.val_clean_price_exe}
        last={bond_info?.val_clean_price_mat}
      />
    );
  }
});

/** 中债YTM(%)列 */
export const valYieldCol = columnHelper.display({
  ...valYieldOpts(),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    return (
      <ValuationCell
        first={bond_info?.val_yield_exe}
        last={bond_info?.val_yield_mat}
      />
    );
  }
});

/** 中证净价列 */
export const csiCleanPriceCol = columnHelper.display({
  ...csiCleanPriceOpts(),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    return (
      <ValuationCell
        first={bond_info?.csi_clean_price_exe}
        last={bond_info?.csi_clean_price_mat}
      />
    );
  }
});

/** 中证全价列 */
export const csiFullPriceCol = columnHelper.display({
  ...csiFullPriceOpts(),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    return (
      <ValuationCell
        first={bond_info?.csi_full_price_exe}
        last={bond_info?.csi_full_price_mat}
      />
    );
  }
});

/** 中证YTM(%)列 */
export const csiYieldCol = columnHelper.display({
  ...csiYieldOpts(),
  cell: ({ row }) => {
    const { bond_basic_info: bond_info } = row.original.original;
    return (
      <ValuationCell
        first={bond_info?.csi_yield_exe}
        last={bond_info?.csi_yield_mat}
      />
    );
  }
});

/** CP 列 */
export const cpCol = columnHelper.display({
  ...cpOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.Cp,
    sortedField: QuoteSortedField.FieldTrader,
    tdCls: row => `${basicCls} justify-start flex-row ${row.original?.recommendCls}`
  },
  cell: ({ row }) => {
    const { flag_urgent, flag_stc, trader_info } = row.original.original;
    const { cp } = row.original;

    const contentCls = trader_info?.is_vip ? 'text-yellow-100' : '';

    return (
      <CPCell
        content={cp}
        urgent={flag_urgent}
        // stc={flag_stc}
        contentCls={contentCls}
      />
    );
  }
});

/** Vol 列 */
export const volCol = columnHelper.display({
  ...volOpts(),
  cell: ({ row }) => row.original.volume
});

/** Broker 列 */
export const brokerCol = columnHelper.display({
  ...brokerOpts(),
  cell: ({ row }) => row.original.brokerName
});

/** 全价列 */
export const fullPriceCol = columnHelper.display({
  ...fullPriceOpts(),
  cell: ({ row }) => row.original.fullPrice
});

/** 净价列 */
export const cleanPriceCol = columnHelper.display({
  ...cleanPriceOpts(),
  cell: ({ row }) => row.original.cleanPrice
});

/** 利差列 */
export const spreadCol = columnHelper.display({
  ...spreadOpts(),
  cell: ({ row }) => row.original.spread
});

/** 含权类型列 */
export const optionTypeCol = columnHelper.display({
  ...optionTypeOpts(),
  cell: ({ row }) => row.original.optionType
});

/** 上市日列 */
export const listedDateCol = columnHelper.display({
  ...listedDateOpts(),
  cell: ({ row }) => row.original.listedDate
});

/** 提前还本列 */
export const repaymentMethodCol = columnHelper.display({
  ...repaymentMethodOpts(),
  cell: ({ row }) => row.original.repaymentMethod
});

/** 久期列 */
export const valModifiedDurationCol = columnHelper.display({
  ...valModifiedDurationOpts(),
  // 久期为空时展示--
  cell: ({ row }) => row.original.valModifiedDuration || '--'
});

/** 备注列 */
export const commentCol = columnHelper.display({
  ...commentOpts(),
  cell: ({ row }) => row.original.comment
});

/** 操作人列 */
export const operatorCol = columnHelper.display({
  ...operatorOpts(),
  cell: ({ row }) => row.original.operatorName
});

/** 创建日期列 */
export const createTimeCol = columnHelper.display({
  id: BondQuoteTableColumnKey.CreateTime,
  header: '创建日期',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.CreateTime,
    align: 'right',
    sortedField: QuoteSortedField.FieldCreateTime,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => row.original.createTime
});

/** 质押率列 */
export const conversionRateCol = columnHelper.display({
  ...conversionRateOpts(),
  cell: ({ row }) => row.original?.conversionRate
});

/** 中债资信评级列 */
export const cbcRatingCol = columnHelper.display({
  ...cbcRatingOpts(),
  cell: ({ row }) => row.original.original?.bond_basic_info?.cbc_rating
});

/** 到期日列 */
export const maturityDateCol = columnHelper.display({
  ...maturityDateOpts(),
  cell: ({ row }) => row.original.maturityDate
});

/** Refer Time 列 */
export const referTimeCol = columnHelper.display({
  id: BondQuoteTableColumnKey.ReferTime,
  header: 'Time',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.ReferTime,
    align: 'right',
    sortedField: QuoteSortedField.ReferTime,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => row.original.referTime
});

/** 撤销列 */
export const referTypeCol = columnHelper.display({
  ...referTypeOpts(),
  cell: ({ row }) => {
    const { refer_type } = row.original.original;
    return <ReferTypeCell type={refer_type} />;
  }
});

/** Update Time 列 */
export const updateTimeCol = columnHelper.display({
  ...updateTimeOpts(),
  cell: ({ row }) => row.original.updateTime
});

/** PVBP 列 */
export const pvbpCol = columnHelper.display({
  ...pvbpOpts(),
  cell: ({ row }) => row.original.pvbp
});

/** 隐含评级列 */
export const impliedRatingCol = columnHelper.display({
  ...impliedRatingOpts(),
  cell: ({ row }) => row.original.original?.bond_basic_info?.implied_rating
});

const columns: ColumnDef<BasicTableColumn>[] = [
  firstMaturityDateCol,
  bondCodeCol,
  shortNameCol,
  bidCol,
  ofrCol,
  volCol,
  brokerCol,
  issuerRatingCol,
  bondRatingCol,
  valCleanPriceCol,
  valYieldCol,
  csiCleanPriceCol,
  csiFullPriceCol,
  csiYieldCol,
  cpCol,
  fullPriceCol,
  cleanPriceCol,
  spreadCol,
  optionTypeCol,
  listedDateCol,
  repaymentMethodCol,
  valModifiedDurationCol,
  commentCol,
  operatorCol,
  createTimeCol,
  conversionRateCol,
  cbcRatingCol,
  maturityDateCol,
  pvbpCol
];

export const getColumns = (productType: ProductType, isReferred?: boolean) => {
  let res = columns;

  if ([ProductType.BCO, ProductType.NCD].includes(productType)) res = [...res, impliedRatingCol];

  if (isReferred) {
    res = [...res, referTimeCol, referTypeCol];
  } else {
    res = [...res, updateTimeCol];
  }

  return res;
};
