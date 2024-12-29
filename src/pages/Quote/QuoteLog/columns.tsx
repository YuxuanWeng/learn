import {
  CPCell,
  FirstMaturityDateCell,
  ReferTypeCell,
  ShortNameCell,
  ValuationCell
} from '@fepkg/business/components/QuoteTableCell';
import {
  alignCenterCls,
  alignLeftCls,
  basicCls,
  bidOpts,
  bondCodeOpts,
  bondRatingOpts,
  brokerOpts,
  cleanPriceOpts,
  cpOpts,
  createTimeOpts,
  firstMaturityDateOpts,
  fullPriceOpts,
  issuerRatingOpts,
  listedDateOpts,
  ofrOpts,
  operationTypeOpts,
  operatorOpts,
  optionTypeOpts,
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
import { OperationSourceMap } from '@fepkg/business/constants/map';
import { BondQuote } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SideCell } from '@/components/QuoteTableCell';
import { OperationLogColumn } from './types';

const columnHelper = createColumnHelper<OperationLogColumn>();

const renderSideCell = (displaySide: Side, quote: BondQuote, comment: string) => {
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
    liquidation_speed_list
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
      />
    )
  );
};

export const operationLogColumns: ColumnDef<OperationLogColumn>[] = [
  /** 操作时间列 */
  columnHelper.display({
    ...createTimeOpts(false),
    cell: ({ row }) => row.original.createTime
  }),
  /** 操作人列 */
  columnHelper.display({
    ...operatorOpts(false),
    cell: ({ row }) => row.original.original.operator
  }),
  /** 操作类型列 */
  columnHelper.display({
    ...operationTypeOpts(),
    cell: ({ row }) => row.original.original.operation_type
  }),
  /** 操作源列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.OperationSource,
    header: '操作源',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.OperationSource,
      align: 'center',
      tdCls: `${alignCenterCls} truncate-clip`
    },
    cell: ({ row }) => OperationSourceMap[row.original.original.operation_source]
  }),
  /** 剩余期限列 */
  columnHelper.display({
    ...firstMaturityDateOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.FirstMaturityDate,
      tdCls: row => `${basicCls} gap-1 px-3 ${row.original.recommendCls}`
    },
    cell: ({ row }) => {
      const { time_to_maturity } = row.original.original.quote_snapshot;
      const { restDayNum } = row.original;
      return (
        <FirstMaturityDateCell
          content={time_to_maturity}
          restDayNum={restDayNum}
        />
      );
    }
  }),
  /** 代码列 */
  columnHelper.display({
    ...bondCodeOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.BondCode,
      tdCls: row => `${alignLeftCls} ${row.original.recommendCls}`
    },
    cell: ({ row }) => row.original.codeMarket
  }),
  /** 简称列 */
  columnHelper.display({
    ...shortNameOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.ShortName,
      tdCls: row => `${alignLeftCls} overflow-hidden ${row.original.recommendCls}`
    },
    cell: ({ row }) => {
      const { bond_short_name, maturity_is_holiday } = row.original.original.quote_snapshot;
      const { listed, frType, weekendDay, restDayNum } = row.original;

      return (
        <ShortNameCell
          content={bond_short_name}
          listed={listed}
          frType={frType}
          weekendDay={weekendDay}
          restDayNum={restDayNum}
          maturityIsHoliday={maturity_is_holiday}
        />
      );
    }
  }),
  /** Bid 列 */
  columnHelper.display({
    ...bidOpts(false),
    cell: ({ row }) => renderSideCell(Side.SideBid, row.original.original.quote_snapshot, row.original.comment)
  }),
  /** Ofr 列 */
  columnHelper.display({
    ...ofrOpts(false),
    cell: ({ row }) => renderSideCell(Side.SideOfr, row.original.original.quote_snapshot, row.original.comment)
  }),
  /** Vol 列 */
  columnHelper.display({
    ...volOpts(false),
    cell: ({ row }) => row.original.volume
  }),
  /** Broker 列 */
  columnHelper.display({
    ...brokerOpts(false),
    cell: ({ row }) => row.original.brokerName
  }),
  /** 主体评级列 */
  columnHelper.display({
    ...issuerRatingOpts(false),
    cell: ({ row }) => row.original.original.quote_snapshot.issuer_rating_str
  }),
  /** Update Time 列 */
  columnHelper.display({
    ...updateTimeOpts(),
    cell: ({ row }) => row.original.updateTime
  }),
  /** 债券评级列 */
  columnHelper.display({
    ...bondRatingOpts(false),
    cell: ({ row }) => row.original.original.quote_snapshot.bond_rating_str
  }),
  /** 中债净价列 */
  columnHelper.display({
    ...valCleanPriceOpts(false),
    cell: ({ row }) => {
      const { val_clean_price_exe, val_clean_price_mat } = row.original.original.quote_snapshot;
      return (
        <ValuationCell
          first={val_clean_price_exe}
          last={val_clean_price_mat}
        />
      );
    }
  }),
  /** 中债YTM(%) 列 */
  columnHelper.display({
    ...valYieldOpts(false),
    cell: ({ row }) => {
      const { val_yield_exe, val_yield_mat } = row.original.original.quote_snapshot;
      return (
        <ValuationCell
          first={val_yield_exe}
          last={val_yield_mat}
        />
      );
    }
  }),
  /** CP 列 */
  columnHelper.display({
    ...cpOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.Cp,
      tdCls: row =>
        `${basicCls} justify-start flex-row pl-0 ${
          row.original?.original?.quote_snapshot?.flag_recommend ? 'bg-auxiliary-400' : ''
        }`
    },
    cell: ({ row }) => {
      const { flag_urgent, flag_stc, is_vip } = row.original.original.quote_snapshot;
      const { cp } = row.original;

      const contentCls = is_vip ? 'text-yellow-100' : '';

      return (
        <CPCell
          content={cp}
          urgent={flag_urgent}
          // stc={flag_stc}
          contentCls={contentCls}
        />
      );
    }
  }),
  /** 全价列 */
  columnHelper.display({
    ...fullPriceOpts(false),
    cell: ({ row }) => row.original.fullPrice
  }),
  /** 净价列 */
  columnHelper.display({
    ...cleanPriceOpts(false),
    cell: ({ row }) => row.original.cleanPrice
  }),
  /** 利差列 */
  columnHelper.display({
    ...spreadOpts(false),
    cell: ({ row }) => row.original.spread
  }),
  /** 含权类型列 */
  columnHelper.display({
    ...optionTypeOpts(),
    cell: ({ row }) => row.original?.optionType
  }),
  /** 上市日列 */
  columnHelper.display({
    ...listedDateOpts(false),
    cell: ({ row }) => row.original?.listedDate
  }),
  /** 提前还本列 */
  columnHelper.display({
    ...repaymentMethodOpts(),
    cell: ({ row }) => row.original?.repaymentMethod
  }),
  /** 久期列 */
  columnHelper.display({
    ...valModifiedDurationOpts(false),
    cell: ({ row }) => row.original?.valModifiedDuration || '--'
  }),
  /** 撤销列 */
  columnHelper.display({
    ...referTypeOpts(false),
    cell: ({ row }) => {
      const { refer_type } = row.original.original.quote_snapshot;
      return <ReferTypeCell type={refer_type} />;
    }
  })
];
