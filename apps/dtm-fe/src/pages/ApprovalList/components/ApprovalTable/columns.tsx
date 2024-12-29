import cx from 'classnames';
import {
  PXCellPrice,
  alignCenterCls,
  alignLeftCls,
  alignRightCls,
  basicCls
} from '@fepkg/business/components/QuoteTableCell';
import { OrderNoCell, ReceiptDealStatusCell } from '@fepkg/business/components/ReceiptDealTableCell';
import { Button } from '@fepkg/components/Button';
import { isExpandParentNode, isParentNode } from '@fepkg/components/Table/utils';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRightSmall } from '@fepkg/icon-park-react';
import { ApprovalSortedField, ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionCell } from '@/components/ApprovalTableCell/ActionCell';
import { AdvancedTagsCell } from '@/components/ApprovalTableCell/AdvancedTagsCell';
import { BrokerCell } from '@/components/ApprovalTableCell/BrokerCell';
import { CommentCell } from '@/components/ApprovalTableCell/CommentCell';
import { CpCell } from '@/components/ApprovalTableCell/CpCell';
import { ParentCell } from '@/components/ApprovalTableCell/ParentCell';
import { ParentHeader } from '@/components/ApprovalTableCell/ParentHeader';
import { PrintTimesCell } from '@/components/ApprovalTableCell/PrintTimesCell';
import { ApprovalListType, ApprovalTableColumnKey, ApprovalTableRowData } from '@/pages/ApprovalList/types';
import { isBridgeParentData } from './utils';

export const columnHelper = createColumnHelper<ApprovalTableRowData>();

const Shadow = () => {
  return (
    <div className="absolute -left-10 top-0 bottom-0 w-10 h-auto blur-[32] bg-gradient-to-l from-[rgba(0,0,0,0.3)] to-transparent bg-transparent pointer-events-none" />
  );
};

const expanderCol = columnHelper.display({
  id: ApprovalTableColumnKey.Expander,
  minSize: 32,
  meta: {
    columnKey: ApprovalTableColumnKey.Expander,
    align: 'center',
    tdCls: alignCenterCls,
    expandable: true
  },
  cell: ({ row }) => {
    if (isExpandParentNode(row)) {
      return (
        <Button.Icon
          className="!bg-transparent !border-transparent"
          icon={<IconRightSmall className={row.getIsExpanded() ? 'rotate-90' : ''} />}
        />
      );
    }
    if (!isParentNode(row)) {
      return <div className="component-dashed-y-400 h-full" />;
    }
    return null;
  }
});

const parentCol = (clickable?: boolean, flagSearchChild?: boolean) =>
  columnHelper.display({
    id: ApprovalTableColumnKey.Parent,
    minSize: flagSearchChild ? 48 : 32,
    meta: {
      columnKey: ApprovalTableColumnKey.Parent,
      thCls: clickable ? `${flagSearchChild ? '!p-0 !pl-[15px]' : '!p-0'} justify-center` : void 0,
      tdCls: row =>
        isExpandParentNode(row) ? `flex-1 ${basicCls}` : `${alignCenterCls} ${flagSearchChild ? '!pl-4' : ''}`
    },
    header: () => (clickable ? <ParentHeader /> : null),
    cell: ({ row }) => <ParentCell row={row} />
  });

const statusCol = columnHelper.display({
  id: ApprovalTableColumnKey.Status,
  header: '状态',
  minSize: 120,
  meta: {
    align: 'center',
    columnKey: ApprovalTableColumnKey.Status,
    thCls: 'pl-[31px]',
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignCenterCls} pl-8 relative`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return (
        <ReceiptDealStatusCell
          status={row.original.original.receipt_deal_status}
          flagHistoryPass={row.original.original.flag_history_pass}
          flagPrinted={!!row.original.original.print_operator_list?.length}
          flagUrge={row.original.original.flag_urge}
          urgeText="已发起催单"
        />
      );
    }
    return null;
  }
});

const orderNoCol = columnHelper.display({
  id: ApprovalTableColumnKey.OrderNo,
  header: '订单号',
  minSize: 120,
  meta: {
    columnKey: ApprovalTableColumnKey.OrderNo,
    sortedField: ApprovalSortedField.SortOrderNo,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} overflow-hidden relative`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { order_no, flag_urgent, bridge_code, receipt_deal_status } = row.original.original;
      return (
        <OrderNoCell
          orderNo={order_no}
          flagUrgent={flag_urgent}
          hasBridgeCode={!!bridge_code && receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted}
        />
      );
    }
    return null;
  }
});

const bridgeCodeCol = columnHelper.display({
  id: ApprovalTableColumnKey.BridgeCode,
  header: '过桥码',
  minSize: 96,
  meta: {
    columnKey: ApprovalTableColumnKey.BridgeCode,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.original.bridge_code;
    }
    return null;
  }
});

const bondCol = columnHelper.display({
  id: ApprovalTableColumnKey.BondCode,
  header: '代码',
  minSize: 128,
  meta: {
    columnKey: ApprovalTableColumnKey.BondCode,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const content = row.original.original?.bond_basic_info?.display_code ?? '';
      return (
        <Tooltip
          truncate
          content={content}
        >
          <span className="truncate-clip">{content}</span>
        </Tooltip>
      );
    }
    return null;
  }
});

const priceCol = columnHelper.display({
  id: ApprovalTableColumnKey.Price,
  header: '成交价',
  minSize: 128,
  meta: {
    align: 'right',
    columnKey: ApprovalTableColumnKey.Price,
    sortedField: ApprovalSortedField.SortPrice,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : 'relative')
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { price, flag_internal, flag_rebate, return_point } = row.original.original;
      return (
        <PXCellPrice
          price={price}
          internal={flag_internal}
          rebate={flag_rebate}
          returnPoint={return_point}
          className={cx('bg-transparent flex flex-col justify-center pr-4', flag_rebate ? '!top-px' : '!top-0.5')}
        />
      );
    }
    return null;
  }
});

const volumeCol = columnHelper.display({
  id: ApprovalTableColumnKey.Volume,
  header: '券面总额',
  minSize: 96,
  meta: {
    align: 'right',
    columnKey: ApprovalTableColumnKey.Volume,
    sortedField: ApprovalSortedField.SortVolume,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignRightCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return row.original.amount;
    }
    return null;
  }
});

const cpBidCol = columnHelper.display({
  id: ApprovalTableColumnKey.CpBid,
  header: '买入方',
  minSize: 160,
  meta: {
    columnKey: ApprovalTableColumnKey.CpBid,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { bid_trade_info, receipt_deal_status } = row.original.original;
      return (
        <CpCell
          cpContent={row.original.cpBidContent}
          flagPayForInst={
            receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted && bid_trade_info.flag_pay_for_inst
          }
        />
      );
    }
    return null;
  }
});

const cpOfrCol = columnHelper.display({
  id: ApprovalTableColumnKey.CpOfr,
  header: '卖出方',
  minSize: 160,
  meta: {
    columnKey: ApprovalTableColumnKey.CpOfr,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      const { ofr_trade_info, receipt_deal_status } = row.original.original;
      return (
        <CpCell
          cpContent={row.original.cpOfrContent}
          flagPayForInst={
            receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted && ofr_trade_info.flag_pay_for_inst
          }
        />
      );
    }
    return null;
  }
});

const commentCol = columnHelper.display({
  id: ApprovalTableColumnKey.Comment,
  header: '备注',
  minSize: 120,
  meta: {
    columnKey: ApprovalTableColumnKey.Comment,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return <CommentCell comment={row.original.comment} />;
    }
    return null;
  }
});

const tagsCol = columnHelper.display({
  id: ApprovalTableColumnKey.Tags,
  header: '高级审核标签',
  minSize: 200,
  meta: {
    columnKey: ApprovalTableColumnKey.Tags,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : `${alignLeftCls} truncate-clip gap-x-2`)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return <AdvancedTagsCell advancedApprovalTags={row.original.advancedApprovalTags} />;
    }
    return null;
  }
});

const dealTimeCol = columnHelper.display({
  id: ApprovalTableColumnKey.DealTime,
  header: '交易日',
  minSize: 120,
  meta: {
    align: 'right',
    columnKey: ApprovalTableColumnKey.DealTime,
    sortedField: ApprovalSortedField.SortTradedDate,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : '')
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return (
        <div
          className={cx(
            !row.original.isTradeDayToday && 'bg-orange-700',
            alignRightCls,
            ' truncate-clip h-full w-full'
          )}
        >
          {row.original.tradedDate}
        </div>
      );
    }
    return null;
  }
});

const bidBrokerCol = columnHelper.display({
  id: ApprovalTableColumnKey.BidBroker,
  header: '买方经纪人',
  minSize: 120,
  meta: {
    columnKey: ApprovalTableColumnKey.BridgeCode,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : alignLeftCls)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return <BrokerCell content={row.original.bidBrokerContent} />;
    }
    return null;
  }
});

const ofrBrokerCol = columnHelper.display({
  id: ApprovalTableColumnKey.OfrBroker,
  header: '卖方经纪人',
  minSize: 120,
  meta: {
    columnKey: ApprovalTableColumnKey.OfrBroker,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : alignLeftCls)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return <BrokerCell content={row.original.ofrBrokerContent} />;
    }
    return null;
  }
});

const printCol = columnHelper.display({
  id: ApprovalTableColumnKey.Print,
  header: '打印次数',
  minSize: 88,
  meta: {
    align: 'center',
    columnKey: ApprovalTableColumnKey.Print,
    tdCls: row => (isExpandParentNode(row) ? 'hidden' : alignCenterCls)
  },
  cell: ({ row }) => {
    if (!isBridgeParentData(row.original)) {
      return <PrintTimesCell operators={row.original.original.print_operator_list} />;
    }
    return null;
  }
});

const actionCol = (isActionButtonSingle: boolean) =>
  columnHelper.display({
    id: ApprovalTableColumnKey.Action,
    header: '操作',
    minSize: isActionButtonSingle ? 104 : 192,
    meta: {
      align: 'center',
      columnKey: ApprovalTableColumnKey.Action,
      thCls: 'pinned-right',
      tdCls: row =>
        isParentNode(row) && !isBridgeParentData(row.original)
          ? `pinned-right ${basicCls} justify-center bg-gray-800 px-4`
          : `pinned-right ${basicCls} justify-center bg-gray-700 px-4`
    },
    cell: ({ row }) => {
      return (
        <>
          <ActionCell rowData={row.original} />
          <Shadow />
        </>
      );
    }
  });

const historyActionCol = (isActionButtonSingle: boolean) =>
  columnHelper.display({
    id: ApprovalTableColumnKey.Action,
    header: '操作',
    minSize: isActionButtonSingle ? 84 : 128,
    meta: {
      align: 'center',
      columnKey: ApprovalTableColumnKey.Action,
      thCls: 'pinned-right',
      tdCls: row =>
        isParentNode(row) && !isBridgeParentData(row.original)
          ? `pinned-right ${basicCls} justify-center bg-gray-800 px-4`
          : `pinned-right ${basicCls} justify-center bg-gray-700 px-4`
    },
    cell: ({ row }) => {
      return (
        <>
          <ActionCell rowData={row.original} />
          <Shadow />
        </>
      );
    }
  });

const dealActionCol = columnHelper.display({
  id: ApprovalTableColumnKey.Action,
  header: '操作',
  minSize: 56,
  meta: {
    align: 'center',
    columnKey: ApprovalTableColumnKey.Action,
    thCls: 'pinned-right',
    tdCls: row =>
      isParentNode(row) && !isBridgeParentData(row.original)
        ? `pinned-right ${basicCls} justify-center bg-gray-800 px-4`
        : `pinned-right ${basicCls} justify-center bg-gray-700 px-4`
  },
  cell: ({ row }) => {
    return (
      <>
        <ActionCell rowData={row.original} />
        <Shadow />
      </>
    );
  }
});

const blankCol = columnHelper.display({
  id: ApprovalTableColumnKey.Blank,
  minSize: 0,
  meta: {
    columnKey: ApprovalTableColumnKey.Blank,
    thCls: 'flex-1',
    tdCls: 'flex-1'
  }
});

export const approvalListColumn = (isActionButtonSingle: boolean) => [
  expanderCol,
  parentCol(),
  statusCol,
  orderNoCol,
  bridgeCodeCol,
  bondCol,
  priceCol,
  volumeCol,
  cpBidCol,
  cpOfrCol,
  commentCol,
  tagsCol,
  dealTimeCol,
  bidBrokerCol,
  ofrBrokerCol,
  blankCol,
  actionCol(isActionButtonSingle)
];

export const approvalHistoryListColumn = (isActionButtonSingle: boolean, flagSearchChild: boolean) => [
  expanderCol,
  parentCol(true, flagSearchChild),
  statusCol,
  orderNoCol,
  bridgeCodeCol,
  bondCol,
  priceCol,
  volumeCol,
  cpBidCol,
  cpOfrCol,
  bidBrokerCol,
  ofrBrokerCol,
  commentCol,
  dealTimeCol,
  printCol,
  blankCol,
  historyActionCol(isActionButtonSingle)
];

export const approvalDealListColumn = [
  expanderCol,
  parentCol(true, true),
  statusCol,
  orderNoCol,
  bridgeCodeCol,
  bondCol,
  priceCol,
  volumeCol,
  cpBidCol,
  cpOfrCol,
  bidBrokerCol,
  ofrBrokerCol,
  commentCol,
  dealTimeCol,
  printCol,
  blankCol,
  dealActionCol
];

export const approvalColumnVisibleKeys = (flagSearchChild: boolean) => {
  const column = [
    ApprovalTableColumnKey.Expander,
    ApprovalTableColumnKey.Parent,
    ApprovalTableColumnKey.Status,
    ApprovalTableColumnKey.OrderNo,
    ApprovalTableColumnKey.BridgeCode,
    ApprovalTableColumnKey.BondCode,
    ApprovalTableColumnKey.Price,
    ApprovalTableColumnKey.Volume,
    ApprovalTableColumnKey.CpBid,
    ApprovalTableColumnKey.CpOfr,
    ApprovalTableColumnKey.Comment,
    ApprovalTableColumnKey.Tags,
    ApprovalTableColumnKey.DealTime,
    ApprovalTableColumnKey.BidBroker,
    ApprovalTableColumnKey.OfrBroker,
    ApprovalTableColumnKey.Blank,
    ApprovalTableColumnKey.Action
  ];
  if (flagSearchChild) {
    column.splice(0, 2);
  }
  return column;
};

export const historyColumnVisibleKeys = (flagSearchChild: boolean) => {
  const column = [
    ApprovalTableColumnKey.Expander,
    ApprovalTableColumnKey.Parent,
    ApprovalTableColumnKey.Status,
    ApprovalTableColumnKey.OrderNo,
    ApprovalTableColumnKey.BridgeCode,
    ApprovalTableColumnKey.BondCode,
    ApprovalTableColumnKey.Price,
    ApprovalTableColumnKey.Volume,
    ApprovalTableColumnKey.CpBid,
    ApprovalTableColumnKey.CpOfr,
    ApprovalTableColumnKey.BidBroker,
    ApprovalTableColumnKey.OfrBroker,
    ApprovalTableColumnKey.Comment,
    ApprovalTableColumnKey.DealTime,
    ApprovalTableColumnKey.Print,
    ApprovalTableColumnKey.Blank,
    ApprovalTableColumnKey.Action
  ];
  if (flagSearchChild) {
    column.splice(0, 1);
  }
  return column;
};

export const dealColumnVisibleKeys = (historyLogAccess?: boolean) => {
  const column = [
    ApprovalTableColumnKey.Parent,
    ApprovalTableColumnKey.Status,
    ApprovalTableColumnKey.OrderNo,
    ApprovalTableColumnKey.BridgeCode,
    ApprovalTableColumnKey.BondCode,
    ApprovalTableColumnKey.Price,
    ApprovalTableColumnKey.Volume,
    ApprovalTableColumnKey.CpBid,
    ApprovalTableColumnKey.CpOfr,
    ApprovalTableColumnKey.BidBroker,
    ApprovalTableColumnKey.OfrBroker,
    ApprovalTableColumnKey.Comment,
    ApprovalTableColumnKey.DealTime,
    ApprovalTableColumnKey.Print,
    ApprovalTableColumnKey.Blank
  ];
  if (historyLogAccess) {
    column.push(ApprovalTableColumnKey.Action);
    return column;
  }
  return column;
};

export const approvalColumnVisibleKeysMap = (flagSearchChild: boolean, dealLogAccess?: boolean) => ({
  [ApprovalListType.Approval]: approvalColumnVisibleKeys(flagSearchChild),
  [ApprovalListType.History]: historyColumnVisibleKeys(flagSearchChild),
  [ApprovalListType.Deal]: dealColumnVisibleKeys(dealLogAccess)
});
