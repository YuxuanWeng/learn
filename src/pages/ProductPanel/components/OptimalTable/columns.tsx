import { CPCell, FirstMaturityDateCell, ShortNameCell, ValuationCell } from '@fepkg/business/components/QuoteTableCell';
import {
  alignCenterCls,
  alignLeftCls,
  alignRightCls,
  basicCls,
  bidBrokerOpts,
  bidCpOpts,
  bidOpts,
  bondCodeOpts,
  bondRatingOpts,
  cbcRatingOpts,
  conversionRateOpts,
  csiCleanPriceOpts,
  csiFullPriceOpts,
  csiYieldOpts,
  firstMaturityDateOpts,
  impliedRatingOpts,
  issuerRatingOpts,
  listedDateOpts,
  maturityDateOpts,
  ofrBrokerOpts,
  ofrCpOpts,
  ofrOpts,
  optionTypeOpts,
  pvbpOpts,
  repaymentMethodOpts,
  shortNameOpts,
  updateTimeOpts,
  valCleanPriceOpts,
  valModifiedDurationOpts,
  valYieldOpts
} from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Tooltip } from '@fepkg/components/Tooltip';
import { ProductType, QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SideCell } from './SideCell';
import { SideVolCell } from './SideVolCell';
import { OptimalTableColumn } from './types';

export const columnHelper = createColumnHelper<OptimalTableColumn>();

export const columns: ColumnDef<OptimalTableColumn>[] = [
  /** 剩余期限列 */
  columnHelper.display({
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
  }),
  /** 代码列 */
  columnHelper.display({
    ...bondCodeOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.BondCode,
      sortedField: QuoteSortedField.FieldBondCode,
      tdCls: row => `${alignLeftCls} truncate-clip ${row.original?.recommendCls}`
    },
    cell: ({ row }) => row.original?.bondCode
  }),
  /** 简称列 */
  columnHelper.display({
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
  }),
  /** Bid 列 */
  columnHelper.display({
    ...bidOpts(),
    cell: ({ row }) => (
      <SideCell
        side={Side.SideBid}
        column={row.original}
      />
    )
  }),
  /** N.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.NBid,
    header: 'N.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.NBid,
      align: 'right',
      sortedField: QuoteSortedField.FieldNBid
    },
    cell: ({ row }) => {
      const { n_bid } = row.original.original;
      const { bidInfo } = row.original;
      return (
        <Tooltip
          placement="top-end"
          content={bidInfo?.comment}
          destroyOnClose
        >
          <div className={`${alignRightCls} bid-side-cell truncate-clip ${n_bid > 1 ? 'text-primary-100' : ''}`}>
            {n_bid > 0 ? n_bid : ''}
          </div>
        </Tooltip>
      );
    }
  }),
  /** Vol.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.VolumeBid,
    header: 'Vol.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.VolumeBid,
      align: 'right',
      sortedField: QuoteSortedField.FieldVolBid
    },
    cell: ({ row }) => {
      const { volume_int_bid, volume_ext_bid } = row.original.original;
      const { bidInfo } = row.original;
      const { intShowOptimal, intBatter, extBatter, priceBothEqual } = bidInfo;

      return (
        <Tooltip
          placement="top-end"
          content={bidInfo?.comment}
          destroyOnClose
        >
          <div className={`bid-side-cell ${alignRightCls} truncate-clip`}>
            <SideVolCell
              intShowOptimal={intShowOptimal}
              intBatter={intBatter}
              extBatter={extBatter}
              bothEqual={priceBothEqual}
              intVolume={volume_int_bid}
              extVolume={volume_ext_bid}
            />
          </div>
        </Tooltip>
      );
    }
  }),
  /** CP.Bid 列 */
  columnHelper.display({
    ...bidCpOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.CpBid,
      sortedField: QuoteSortedField.FieldCPBid,
      tdCls: row => `bid-side-cell ${basicCls} justify-start flex-row pl-0 ${row.original?.bidInfo?.recommendCls}`
    },
    cell: ({ row }) => {
      const { bidInfo } = row.original;
      const { cpHighlightCls, cp, isUrgent, isSTC } = bidInfo;
      return (
        <CPCell
          content={cp}
          urgent={isUrgent}
          // stc={isSTC}
          contentCls={cpHighlightCls}
        />
      );
    }
  }),
  /** Ofr 列 */
  columnHelper.display({
    ...ofrOpts(),
    cell: ({ row }) => (
      <SideCell
        side={Side.SideOfr}
        column={row.original}
      />
    )
  }),
  /** N.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.NOfr,
    header: 'N.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.NOfr,
      align: 'right',
      sortedField: QuoteSortedField.FieldNOfr
    },
    cell: ({ row }) => {
      const { n_ofr } = row.original.original;
      const { ofrInfo } = row.original;

      return (
        <Tooltip
          placement="top-end"
          content={ofrInfo?.comment}
          destroyOnClose
        >
          <div className={`${alignRightCls} ofr-side-cell truncate-clip ${n_ofr > 1 ? 'text-primary-100' : ''}`}>
            {n_ofr > 0 ? n_ofr : ''}
          </div>
        </Tooltip>
      );
    }
  }),
  /** Vol.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.VolumeOfr,
    header: 'Vol.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.VolumeOfr,
      align: 'right',
      sortedField: QuoteSortedField.FieldVolOfr
    },
    cell: ({ row }) => {
      const { volume_int_ofr, volume_ext_ofr } = row.original.original;
      const { ofrInfo } = row.original;
      const { intShowOptimal, intBatter, extBatter, priceBothEqual: bothEqual } = ofrInfo;

      return (
        <Tooltip
          placement="top-end"
          content={ofrInfo?.comment}
          destroyOnClose
        >
          <div className={`ofr-side-cell ${alignRightCls} truncate-clip`}>
            <SideVolCell
              intShowOptimal={intShowOptimal}
              intBatter={intBatter}
              extBatter={extBatter}
              bothEqual={bothEqual}
              intVolume={volume_int_ofr}
              extVolume={volume_ext_ofr}
            />
          </div>
        </Tooltip>
      );
    }
  }),
  /** CP.Ofr 列 */
  columnHelper.display({
    ...ofrCpOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.CpOfr,
      sortedField: QuoteSortedField.FieldCPOfr,
      tdCls: row => `ofr-side-cell ${basicCls} justify-start flex-row pl-0 ${row.original?.ofrInfo?.recommendCls}`
    },
    cell: ({ row }) => {
      const { ofrInfo } = row.original;
      const { cpHighlightCls, cp, isUrgent, isSTC } = ofrInfo;
      return (
        <CPCell
          content={cp}
          urgent={isUrgent}
          // stc={isSTC}
          contentCls={cpHighlightCls}
        />
      );
    }
  }),
  /** Broker(B) 列 */
  columnHelper.display({
    ...bidBrokerOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.BrokerB,
      align: 'center',
      sortedField: QuoteSortedField.FieldBrokerBid,
      tdCls: row => `${alignCenterCls} truncate-clip ${row.original?.bidInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.bidInfo?.brokerName
  }),
  /** Broker(O) 列 */
  columnHelper.display({
    ...ofrBrokerOpts(),
    meta: {
      columnKey: BondQuoteTableColumnKey.BrokerO,
      align: 'center',
      sortedField: QuoteSortedField.FieldBrokerOfr,
      tdCls: row => `${alignCenterCls} truncate-clip ${row.original?.ofrInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.ofrInfo?.brokerName
  }),
  /** 主体评级列 */
  columnHelper.display({
    ...issuerRatingOpts(),
    cell: ({ row }) => row.original.original?.bond_basic_info?.issuer_rating
  }),
  /** Time 列 */
  columnHelper.display({
    ...updateTimeOpts(),
    cell: ({ row }) => row.original?.updateTime
  }),
  /** 债券评级列 */
  columnHelper.display({
    ...bondRatingOpts(),
    cell: ({ row }) => row.original.original?.bond_basic_info?.rating
  }),
  /** 中债净价列 */
  columnHelper.display({
    ...valCleanPriceOpts(),
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
  }),
  /** 中债YTM(%) 列 */
  columnHelper.display({
    ...valYieldOpts(),
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
  }),
  /** 中证净价列 */
  columnHelper.display({
    ...csiCleanPriceOpts(),
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
  }),
  /** 中证全价列 */
  columnHelper.display({
    ...csiFullPriceOpts(),
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
  }),
  /** 中证YTM(%) 列 */
  columnHelper.display({
    ...csiYieldOpts(),
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
  }),
  /** 偏离.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.OffsetBid,
    header: '偏离.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.OffsetBid,
      align: 'right',
      sortedField: QuoteSortedField.FiledOffsetBid,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.bidInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.bidInfo?.offset
  }),
  /** 偏离.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.OffsetOfr,
    header: '偏离.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.OffsetOfr,
      align: 'right',
      sortedField: QuoteSortedField.FiledOffsetOfr,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.ofrInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.ofrInfo?.offset
  }),
  /** 含权类型列 */
  columnHelper.display({
    ...optionTypeOpts(),
    cell: ({ row }) => row.original?.optionType
  }),
  /** 全价.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.FullPriceBid,
    header: '全价.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.FullPriceBid,
      align: 'right',
      sortedField: QuoteSortedField.FieldFullPriceBid,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.bidInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.bidInfo?.fullPrice
  }),
  /** 净价.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.CleanPriceBid,
    header: '净价.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.CleanPriceBid,
      align: 'right',
      sortedField: QuoteSortedField.FieldCleanPriceBid,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.bidInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.bidInfo?.cleanPrice
  }),
  /** 利差.Bid 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.SpreadBid,
    header: '利差.Bid',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.SpreadBid,
      align: 'right',
      sortedField: QuoteSortedField.FieldSpreadBid,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.bidInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.bidInfo?.spread
  }),
  /** 全价.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.FullPriceOfr,
    header: '全价.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.FullPriceOfr,
      align: 'right',
      sortedField: QuoteSortedField.FieldFullPriceOfr,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.ofrInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.ofrInfo?.fullPrice
  }),
  /** 净价.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.CleanPriceOfr,
    header: '净价.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.CleanPriceOfr,
      align: 'right',
      sortedField: QuoteSortedField.FieldCleanPriceOfr,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.ofrInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.ofrInfo?.cleanPrice
  }),
  /** 利差.Ofr 列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.SpreadOfr,
    header: '利差.Ofr',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.SpreadOfr,
      align: 'right',
      sortedField: QuoteSortedField.FieldSpreadOfr,
      tdCls: row => `${alignRightCls} truncate-clip ${row.original?.ofrInfo?.textHighlighCls}`
    },
    cell: ({ row }) => row.original?.ofrInfo?.spread
  }),
  /** 上市日列 */
  columnHelper.display({
    ...listedDateOpts(),
    cell: ({ row }) => row.original?.listedDate
  }),
  /** 提前还本列 */
  columnHelper.display({
    ...repaymentMethodOpts(),
    cell: ({ row }) => row.original?.repaymentMethod
  }),
  /** 久期列 */
  columnHelper.display({
    ...valModifiedDurationOpts(),
    cell: ({ row }) => row.original?.valModifiedDuration || '--'
  }),
  /** 票面利率列 */
  columnHelper.display({
    id: BondQuoteTableColumnKey.CouponRateCurrent,
    header: '票面利率',
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.CouponRateCurrent,
      align: 'right',
      sortedField: QuoteSortedField.FieldCouponRateCurrent,
      tdCls: `${alignRightCls} truncate-clip`
    },
    cell: ({ row }) => row.original.couponRateCurrent
  }),
  /** 到期日列 */
  columnHelper.display({
    ...maturityDateOpts(),
    cell: ({ row }) => row.original?.maturityDate
  }),
  /** 质押率列 */
  columnHelper.display({
    ...conversionRateOpts(),
    cell: ({ row }) => row.original?.conversionRate
  }),
  /** 中债资信评级列 */
  columnHelper.display({
    ...cbcRatingOpts(),
    cell: ({ row }) => row.original.original.bond_basic_info?.cbc_rating
  }),
  /** PVBP 列 */
  columnHelper.display({
    ...pvbpOpts(),
    cell: ({ row }) => row.original.pvbp
  })
];

export const getColumns = (productType: ProductType) => {
  if ([ProductType.BCO, ProductType.NCD].includes(productType)) {
    return [
      ...columns,
      columnHelper.display({
        ...impliedRatingOpts(),
        cell: ({ row }) => row.original.original?.bond_basic_info?.implied_rating
      })
    ];
  }

  return columns;
};
