import {
  FirstMaturityDateCell,
  PXCell,
  ShortNameCell,
  ValuationCell,
  alignCenterCls,
  alignLeftCls,
  alignRightCls,
  basicCls,
  valuationCellCls
} from '@fepkg/business/components/QuoteTableCell';
import { OrderNoCell, ReceiptDealStatusCell } from '@fepkg/business/components/ReceiptDealTableCell';
import { ParentCell } from '@fepkg/business/components/ReceiptDealTableCell/ParentCell';
import { SendStatusCell } from '@fepkg/business/components/ReceiptDealTableCell/SendStatusCell';
import { GROUP_HEADER_ID } from '@fepkg/components/Table/constants';
import { isExpandParentNode, isParentNode } from '@fepkg/components/Table/utils';
import { ReceiptDealSortedField, ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { NeedBridgeCell, ReceiptBrokerCell, ReceiptDealCPCell } from '@/components/ReceiptTableCell';
import {
  ReceiptDealTableColumnKey,
  ReceiptDealTableColumnSettingItem
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';
import { ReceiptDealRowData } from './types';
import { isBridgeParentData } from './utils';

export const columnHelper = createColumnHelper<ReceiptDealRowData>();

const expanderCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.Expander,
  minSize: 48,
  meta: {
    columnKey: ReceiptDealTableColumnKey.Expander,
    tdCls: alignCenterCls,
    resizable: false,
    reorderable: false
  },
  cell: ({ row }) => {
    if (!isParentNode(row)) {
      return <div className="component-dashed-y-400 h-full" />;
    }
    return null;
  }
});

const parentCol = columnHelper.display({
  id: GROUP_HEADER_ID,
  meta: {
    columnKey: GROUP_HEADER_ID,
    expandable: true,
    tdCls: row => (isExpandParentNode(row) ? `flex-1 ${basicCls}` : alignCenterCls)
  },
  cell: ({ row }) => <ParentCell row={row} />
});

/** 加桥列 */
const flagNeedBridgeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.FlagNeedBridge,
  header: '加桥',
  minSize: 40,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.FlagNeedBridge,
    tdCls: alignCenterCls
  },
  cell: ({ row }) => {
    const { original } = row;
    if (!isBridgeParentData(original)) {
      const { editable } = original;
      return (
        <NeedBridgeCell
          receiptDeal={original.original}
          editable={editable}
        />
      );
    }
    return null;
  }
});

/** 内码列 */
const internalCodeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.InternalCode,
  header: '内码',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.InternalCode,
    sortedField: ReceiptDealSortedField.RDSortInternalCode,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.internal_code ?? '-';
    }
    return null;
  }
});

/** 序列号列 */
const seqNumberCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.SeqNumber,
  header: '序列号',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.SeqNumber,
    sortedField: ReceiptDealSortedField.RDSortSeqNumber,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.seqNum;
    }
    return null;
  }
});

/** 订单号 */
const orderNoCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.OrderNo,
  header: '订单号',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.OrderNo,
    sortedField: ReceiptDealSortedField.RDSortOrderNo,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { disabledStyle, original } = row.original;
      const { order_no, flag_urgent, bridge_code, receipt_deal_status } = original;
      return (
        <OrderNoCell
          orderNo={order_no}
          flagUrgent={flag_urgent}
          disabledStyle={disabledStyle}
          hasBridgeCode={!!bridge_code && receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted}
        />
      );
    }
    return null;
  }
});

/** 过桥码 */
const bridgeCodeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.BridgeCode,
  header: '过桥码',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.BridgeCode,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bridge_code;
    }
    return null;
  }
});

/** 剩余期限 */
const timeToMaturityCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.TimeToMaturity,
  header: '剩余期限',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.TimeToMaturity,
    sortedField: ReceiptDealSortedField.RDSortFirstMaturityDate,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { time_to_maturity } = bond_basic_info ?? {};
      const { restDayNum, disabledStyle } = row.original;
      return (
        <FirstMaturityDateCell
          content={time_to_maturity}
          restDayNum={restDayNum}
          disabled={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** 代码 */
const displayCodeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.DisplayCode,
  header: '代码',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.DisplayCode,
    sortedField: ReceiptDealSortedField.RDSortBondCode,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bond_basic_info?.display_code;
    }
    return null;
  }
});

/** 简称 */
const shortNameCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ShortName,
  header: '简称',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.ShortName,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { short_name, maturity_is_holiday } = bond_basic_info ?? {};
      const { listed, frType, weekendDay, restDayNum, disabledStyle } = row.original;
      return (
        <ShortNameCell
          content={short_name}
          listed={listed}
          frType={frType}
          weekendDay={weekendDay}
          restDayNum={restDayNum}
          maturityIsHoliday={maturity_is_holiday}
          disabled={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** 状态 */
const receiptDealStatusCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ReceiptDealStatus,
  header: '状态',
  minSize: 88,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.ReceiptDealStatus,
    tdCls: alignCenterCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return (
        <ReceiptDealStatusCell
          status={row.original.original.receipt_deal_status}
          flagUrge={row.original.isMyUrge}
        />
      );
    }
    return null;
  }
});

/** 推送状态 */
const sendStatusCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.SendStatus,
  header: '推送状态',
  minSize: 88,
  meta: {
    columnKey: ReceiptDealTableColumnKey.SendStatus,
    sortedField: ReceiptDealSortedField.RDSortSendStatus,
    tdCls: `${alignLeftCls} overflow-hidden`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { disabledStyle } = row.original;
      return (
        <SendStatusCell
          sendStatus={row.original.original.deal_sor_send_status}
          flagChange={row.original.original.flag_change_after_sor_execution}
          disabled={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** Px */
const pxCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.Px,
  header: 'Px',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.Px,
    sortedField: ReceiptDealSortedField.RDSortPrice
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { disabledStyle } = row.original;
      const { price, flag_internal, flag_rebate, return_point, direction, bridge_code } = row.original.original;
      return (
        <PXCell
          price={price}
          internal={flag_internal}
          rebate={flag_rebate}
          returnPoint={return_point}
          comment=""
          placeholderCls={!isParentNode(row) && bridge_code ? 'bg-placeholder-700' : void 0}
          direction={direction}
          nothingDone={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** Vol */
const volumeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.Volume,
  header: 'Vol',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.Volume,
    sortedField: ReceiptDealSortedField.RDSortVolume,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.volume;
    }
    return null;
  }
});

/** BrokerB */
const bidBrokerCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.BrokerB,
  header: 'Broker(B)',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.BrokerB,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { isBidMine, bidBrokerContent, original, disabledStyle } = row.original;
      return (
        <ReceiptBrokerCell
          receiptDeal={original}
          side={Side.SideBid}
          isMine={isBidMine}
          brokerContent={bidBrokerContent}
          disabledStyle={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** BrokerO */
const ofrBrokerCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.BrokerO,
  header: 'Broker(O)',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.BrokerO,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { isOfrMine, ofrBrokerContent, original, disabledStyle } = row.original;
      return (
        <ReceiptBrokerCell
          receiptDeal={original}
          side={Side.SideOfr}
          isMine={isOfrMine}
          brokerContent={ofrBrokerContent}
          disabledStyle={disabledStyle}
        />
      );
    }
    return null;
  }
});

/** CP.Bid 列 */
const bidCpCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.CpBid,
  header: 'CP.Bid',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.CpBid,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { cpBidContent, disabledStyle } = row.original;
      const { bid_trade_info, receipt_deal_status } = row.original.original;
      return (
        <ReceiptDealCPCell
          flagInBridgeInstList={bid_trade_info.flag_in_bridge_inst_list}
          flagBridge={bid_trade_info.flag_bridge}
          content={cpBidContent}
          disabledStyle={disabledStyle}
          flagPayForInst={
            receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted && bid_trade_info.flag_pay_for_inst
          }
        />
      );
    }
    return null;
  }
});

/** CP.Ofr 列 */
const ofrCpCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.CpOfr,
  header: 'CP.Ofr',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.CpOfr,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { cpOfrContent, disabledStyle } = row.original;
      const { ofr_trade_info, receipt_deal_status } = row.original.original;
      return (
        <ReceiptDealCPCell
          flagInBridgeInstList={ofr_trade_info.flag_in_bridge_inst_list}
          flagBridge={ofr_trade_info.flag_bridge}
          content={cpOfrContent}
          disabledStyle={disabledStyle}
          flagPayForInst={
            receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted && ofr_trade_info.flag_pay_for_inst
          }
        />
      );
    }
    return null;
  }
});

/** 交易日列 */
const tradedDateCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.TradedDate,
  header: '交易日',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.TradedDate,
    sortedField: ReceiptDealSortedField.RDSortTradedDate,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.tradedDate;
    }
    return null;
  }
});

/** 交割日列 */
const deliveryDateCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.DeliveryDate,
  header: '交割日',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.DeliveryDate,
    sortedField: ReceiptDealSortedField.RDSortDeliveryDate,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.deliveryDate;
    }
    return null;
  }
});

/** 成交日列 */
const dealTimeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.DealTime,
  header: '成交日',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.DealTime,
    sortedField: ReceiptDealSortedField.RDSortDealDate,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.dealTime;
    }
    return null;
  }
});

/** 中债净价列 */
const valCleanPriceCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ValCleanPrice,
  header: '中债净价',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.ValCleanPrice,
    sortedField: ReceiptDealSortedField.RDSortValCleanPrice,
    tdCls: valuationCellCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { val_clean_price_exe, val_clean_price_mat } = bond_basic_info ?? {};
      return (
        <ValuationCell
          first={val_clean_price_exe}
          last={val_clean_price_mat}
        />
      );
    }
    return null;
  }
});

/** 中债YTM(%)列 */
const valYieldCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ValYield,
  header: '中债YTM(%)',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.ValYield,
    sortedField: ReceiptDealSortedField.RDSortValYield,
    tdCls: valuationCellCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { val_yield_exe, val_yield_mat } = bond_basic_info ?? {};
      return (
        <ValuationCell
          first={val_yield_exe}
          last={val_yield_mat}
        />
      );
    }
    return null;
  }
});

/** 中证净价列 */
const csiCleanPriceCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.CsiCleanPrice,
  header: '中证净价',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.CsiCleanPrice,
    sortedField: ReceiptDealSortedField.RDSortCsiCleanPrice,
    tdCls: valuationCellCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { csi_clean_price_exe, csi_clean_price_mat } = bond_basic_info ?? {};
      return (
        <ValuationCell
          first={csi_clean_price_exe}
          last={csi_clean_price_mat}
        />
      );
    }
    return null;
  }
});

/** 更新时间 */
const updateTimeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.UpdateTime,
  header: '更新时间',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.UpdateTime,
    sortedField: ReceiptDealSortedField.RDSortUpdateTime,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.updateTime;
    }
    return null;
  }
});

/** 主体评级列 */
const issuerRatingCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.IssuerRatingVal,
  header: '主体评级',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.IssuerRatingVal,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bond_basic_info?.issuer_rating;
    }
    return null;
  }
});

/** 债券评级列 */
const bondRatingCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.BondRatingVal,
  header: '债券评级',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.BondRatingVal,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bond_basic_info?.rating;
    }
    return null;
  }
});

/** 中证全价列 */
const csiFullPriceCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.CsiFullPrice,
  header: '中证全价',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.CsiFullPrice,
    sortedField: ReceiptDealSortedField.RDSortCsiFullPrice,
    tdCls: valuationCellCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { csi_full_price_exe, csi_full_price_mat } = bond_basic_info ?? {};
      return (
        <ValuationCell
          first={csi_full_price_exe}
          last={csi_full_price_mat}
        />
      );
    }
    return null;
  }
});

/** 中证YTM(%)列 */
const csiYieldCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.CsiYield,
  header: '中证YTM(%)',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.CsiYield,
    sortedField: ReceiptDealSortedField.RDSortCsiYield,
    tdCls: valuationCellCls
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bond_basic_info } = row.original.original;
      const { csi_yield_exe, csi_yield_mat } = bond_basic_info ?? {};
      return (
        <ValuationCell
          first={csi_yield_exe}
          last={csi_yield_mat}
        />
      );
    }
    return null;
  }
});

/** 清算速度列 */
const liquidationSpeedCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.LiquidationSpeed,
  header: '清算速度',
  minSize: 64,
  meta: {
    columnKey: ReceiptDealTableColumnKey.LiquidationSpeed,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.liquidationSpeedContent;
    }
    return null;
  }
});

/** 含权类型列 */
const optionTypeCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.OptionType,
  header: '含权类型',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.OptionType,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.optionType;
    }
    return null;
  }
});

/** 上市日列 */
const listedDateCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ListedDate,
  header: '上市日',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.ListedDate,
    sortedField: ReceiptDealSortedField.RDSortListedDate,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.listedDate;
    }
    return null;
  }
});

/** 提前还本列 */
const repaymentMethodCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.RepaymentMethod,
  header: '提前还本',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.RepaymentMethod,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.repaymentMethod;
    }
    return null;
  }
});

/** PVBP 列 */
const pvbpCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.PVBP,
  header: 'PVBP',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.PVBP,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.pvbp;
    }
    return null;
  }
});

/** 操作人列 */
const operatorCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.Operator,
  header: '操作人',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.Operator,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.operatorName;
    }
    return null;
  }
});

/** 到期日列 */
const maturityDateCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.MaturityDate,
  header: '到期日',
  minSize: 64,
  meta: {
    align: 'right',
    columnKey: ReceiptDealTableColumnKey.MaturityDate,
    sortedField: ReceiptDealSortedField.RDSortMaturityDate,
    tdCls: `${alignRightCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.maturityDate;
    }
    return null;
  }
});

/** 隐含评级列 */
const impliedRatingCol = columnHelper.display({
  id: ReceiptDealTableColumnKey.ImpliedRating,
  header: '隐含评级',
  minSize: 64,
  meta: {
    align: 'center',
    columnKey: ReceiptDealTableColumnKey.ImpliedRating,
    tdCls: `${alignCenterCls} truncate-clip`
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bond_basic_info?.implied_rating;
    }
    return null;
  }
});

export const getExpanderColumnSetting = (visible = true): ReceiptDealTableColumnSettingItem => ({
  key: ReceiptDealTableColumnKey.Expander,
  label: '',
  visible,
  width: 48
});

export const columns: ColumnDef<ReceiptDealRowData>[] = [
  expanderCol,
  parentCol,
  flagNeedBridgeCol,
  internalCodeCol,
  seqNumberCol,
  orderNoCol,
  bridgeCodeCol,
  timeToMaturityCol,
  displayCodeCol,
  shortNameCol,
  receiptDealStatusCol,
  sendStatusCol,
  pxCol,
  volumeCol,
  bidBrokerCol,
  ofrBrokerCol,
  bidCpCol,
  ofrCpCol,
  tradedDateCol,
  deliveryDateCol,
  dealTimeCol,
  valCleanPriceCol,
  valYieldCol,
  csiCleanPriceCol,
  updateTimeCol,
  issuerRatingCol,
  bondRatingCol,
  csiFullPriceCol,
  csiYieldCol,
  liquidationSpeedCol,
  optionTypeCol,
  listedDateCol,
  repaymentMethodCol,
  pvbpCol,
  operatorCol,
  maturityDateCol,
  impliedRatingCol
];
