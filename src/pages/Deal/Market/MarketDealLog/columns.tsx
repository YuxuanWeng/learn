import {
  CPCell,
  FirstMaturityDateCell,
  PXCell,
  ShortNameCell,
  ValuationCell
} from '@fepkg/business/components/QuoteTableCell';
import {
  alignCenterCls,
  alignLeftCls,
  basicCls,
  bidBrokerOpts,
  bidCpOpts,
  bondCodeOpts,
  bondRatingOpts,
  commentOpts,
  createTimeOpts,
  dealTimeOpts,
  firstMaturityDateOpts,
  issuerRatingOpts,
  listedDateOpts,
  ofrBrokerOpts,
  ofrCpOpts,
  operationTypeOpts,
  operatorOpts,
  optionTypeOpts,
  pxOpts,
  repaymentMethodOpts,
  shortNameOpts,
  valCleanPriceOpts,
  valModifiedDurationOpts,
  valYieldOpts,
  volOpts
} from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { formatDate } from '@fepkg/common/utils/date';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DealLogColumn } from './types';

const columnHelper = createColumnHelper<DealLogColumn>();

export const dealLogColumns: ColumnDef<DealLogColumn>[] = [
  /** 操作时间列 */
  columnHelper.display({
    ...createTimeOpts(false),
    cell: ({ row }) => formatDate(row.original.original.create_time, 'YYYY-MM-DD HH:mm:ss.SSS')
  }),
  /** 操作人列 */
  columnHelper.display({
    ...operatorOpts(false),
    cell: ({ row }) => row.original.original.operator
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
    cell: ({ row }) => row.original.operationSource
  }),
  /** 操作类型列 */
  columnHelper.display({
    ...operationTypeOpts(),
    cell: ({ row }) => row.original.original.operation_type
  }),
  /** 剩余期限列 */
  columnHelper.display({
    ...firstMaturityDateOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.FirstMaturityDate,
      tdCls: `${basicCls} gap-1 px-3`
    },
    cell: ({ row }) => {
      const { bond_basic_info: bond_info } = row.original.original.market_deal_snapshot;
      const { time_to_maturity } = bond_info;
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
    ...bondCodeOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.BondCode,
      tdCls: `${alignLeftCls} truncate-clip`
    },
    cell: ({ row }) => row.original.bondCode
  }),
  /** 简称列 */
  columnHelper.display({
    ...shortNameOpts(false),
    meta: {
      columnKey: BondQuoteTableColumnKey.ShortName,
      tdCls: `${alignLeftCls} overflow-hidden`
    },
    cell: ({ row }) => {
      const { bond_basic_info: bond_info } = row.original.original.market_deal_snapshot;
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
  }),
  /** Px 列 */
  columnHelper.display({
    ...pxOpts(),
    cell: ({ row }) => {
      const { price, flag_internal, flag_rebate, return_point, direction, with_active_quote, nothing_done } =
        row.original.original.market_deal_snapshot;
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
  }),
  /** Vol 列 */
  columnHelper.display({
    ...volOpts(false),
    cell: ({ row }) => row.original.volume
  }),
  /** Broker(B) 列 */
  columnHelper.display({
    ...bidBrokerOpts(false),
    cell: ({ row }) => row.original.original.market_deal_snapshot.bid_broker_name
  }),
  /** Broker(O) 列 */
  columnHelper.display({
    ...ofrBrokerOpts(false),
    cell: ({ row }) => row.original.original.market_deal_snapshot.ofr_broker_name
  }),
  /** 主体评级列 */
  columnHelper.display({
    ...issuerRatingOpts(),
    cell: ({ row }) => row.original.original.market_deal_snapshot.bond_basic_info?.issuer_rating
  }),
  /** 成交日列 */
  columnHelper.display({
    ...dealTimeOpts(),
    cell: ({ row }) => row.original.dealTime
  }),
  /** 债券评级列 */
  columnHelper.display({
    ...bondRatingOpts(false),
    cell: ({ row }) => row.original.original.market_deal_snapshot.bond_basic_info?.rating
  }),
  /** 中债净价列 */
  columnHelper.display({
    ...valCleanPriceOpts(false),
    cell: ({ row }) => {
      const { bond_basic_info: bond_info } = row.original.original.market_deal_snapshot;
      const { val_clean_price_exe, val_clean_price_mat } = bond_info;
      return (
        <ValuationCell
          first={val_clean_price_exe}
          last={val_clean_price_mat}
        />
      );
    }
  }),
  /** 中债YTM(%)列 */
  columnHelper.display({
    ...valYieldOpts(false),
    cell: ({ row }) => {
      const { bond_basic_info: bond_info } = row.original.original.market_deal_snapshot;
      const { val_yield_exe, val_yield_mat } = bond_info;
      return (
        <ValuationCell
          first={val_yield_exe}
          last={val_yield_mat}
        />
      );
    }
  }),
  /** CP.Bid 列 */
  columnHelper.display({
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
  }),
  /** CP.Ofr 列 */
  columnHelper.display({
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
  }),
  /** 含权类型列 */
  columnHelper.display({
    ...optionTypeOpts(),
    cell: ({ row }) => row.original.optionType
  }),
  /** 上市日列 */
  columnHelper.display({
    ...listedDateOpts(),
    cell: ({ row }) => row.original.listedDate
  }),
  /** 提前还本列 */
  columnHelper.display({
    ...repaymentMethodOpts(),
    cell: ({ row }) => row.original.repaymentMethod
  }),
  /** 久期列 */
  columnHelper.display({
    ...valModifiedDurationOpts(false),
    cell: ({ row }) => row.original.valModifiedDuration || '--'
  }),
  /** 备注列 */
  columnHelper.display({
    ...commentOpts(false),
    cell: ({ row }) => row.original.comment
  }),
  /** 成交状态列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.DealStatus,
    header: '成交状态',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.DealStatus,
      align: 'center',
      tdCls: `${alignCenterCls} truncate-clip`
    },
    cell: ({ row }) => row.original.dealStatus
  })
];
