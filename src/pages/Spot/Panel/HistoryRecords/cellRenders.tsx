import cx from 'classnames';
import { PXCellPrice } from '@fepkg/business/components/QuoteTableCell';
import { BondQuoteTypeMap, ExerciseTypeMap, HistDealStatusMap } from '@fepkg/business/constants/map';
import { getInstName } from '@fepkg/business/utils/get-name';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconTime } from '@fepkg/icon-park-react';
import { InstitutionTiny, Trader } from '@fepkg/services/types/common';
import { Direction, HistDealStatus, ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealSearchRealParentDeal } from '@fepkg/services/types/receipt-deal/search-real-parent-deal';
import { isEqual } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import UserName from '@/components/IDCSpot/UserName';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getSettlementStrWithFlagExchange } from '@/pages/Deal/Bridge/utils';
import { CellRender } from '../../types';
import { getOperRecordDialogConfig } from '../../utils/openDialog';
import { getSpotPricingProp } from '../../utils/table';

type HistoryCellRender = CellRender<ReceiptDealSearchRealParentDeal.RealReceiptDealInfo>;
const textCls = 'font-medium text-sm';
const toolTipCls = 'truncate';

export const HistDealStatusTextColorMap = {
  [HistDealStatus.HistDealToBeHandOver]: 'text-gray-100',
  [HistDealStatus.HistDealHasHandOver]: 'text-primary-100',
  [HistDealStatus.HistDealDeleted]: 'text-gray-300',
  [HistDealStatus.HistDealToBeConfirm]: 'text-orange-100',
  [HistDealStatus.HistDealRefused]: 'text-danger-100'
};
// 注意哦 出给 是克隆过来的
export const directionMap = {
  [Direction.DirectionGvn]: { label: 'GVN', bgCls: 'bg-orange-100', disabledBgCls: 'bg-orange-400' },
  [Direction.DirectionTkn]: { label: 'TKN', bgCls: 'bg-secondary-100', disabledBgCls: 'bg-secondary-400' },
  [Direction.DirectionTrd]: { label: '出给', bgCls: 'bg-orange-100', disabledBgCls: 'bg-purple-400' }
};

export const getLiquidationStr = (info: ReceiptDealSearchRealParentDeal.RealReceiptDealInfo) => {
  const {
    bid_liquidation_speed_list,
    ofr_liquidation_speed_list,
    bid_traded_date,
    bid_delivery_date,
    ofr_traded_date,
    ofr_delivery_date,
    flag_stock_exchange
  } = info;
  if (flag_stock_exchange) {
    return `${formatDate(bid_traded_date, 'MM.DD')}交易所`;
  }

  const bidSettlementType = getSettlementStrWithFlagExchange(
    bid_liquidation_speed_list?.at(0) ?? getSettlement(bid_traded_date ?? '', bid_delivery_date ?? ''),
    bid_traded_date,
    flag_stock_exchange
  );
  const ofrSettlementType = getSettlementStrWithFlagExchange(
    ofr_liquidation_speed_list?.at(0) ?? getSettlement(ofr_traded_date ?? '', ofr_delivery_date ?? ''),
    ofr_traded_date,
    flag_stock_exchange
  );
  if (isEqual(bidSettlementType, ofrSettlementType)) {
    return ofrSettlementType;
  }
  return `${ofrSettlementType}/${bidSettlementType}`;
};

const getInstTrader = (inst?: InstitutionTiny, trader?: Trader, productType?: ProductType) => {
  if (trader && inst) {
    return `${getInstName({ inst, productType })}(${trader.name_zh})`;
  }
  return '--';
};
export const createTimeRender: HistoryCellRender = ({ row }) => getSpotPricingProp(row.original, 'create_time');

export const updateTimeRender: HistoryCellRender = ({ row }) => getSpotPricingProp(row.original, 'update_time');

export const internalCodeRender: HistoryCellRender = ({ row }) => {
  const { internal_code } = row.original;
  if (internal_code === '0') return '--';
  return internal_code;
};

export const StatusRender: HistoryCellRender = ({ row }) => {
  const { hist_deal_status } = row.original;
  const cls = HistDealStatusTextColorMap[hist_deal_status];
  return <div className={cx(textCls, cls)}>{HistDealStatusMap[hist_deal_status]}</div>;
};

export const LogRender: HistoryCellRender = ({ row }) => {
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  return (
    <Button.Icon
      className="bg-transparent"
      icon={<IconTime />}
      onClick={() => openDialog(getOperRecordDialogConfig(productType, { deal_id: row.original.parent_id }))}
    />
  );
};

export const priceRender: HistoryCellRender = ({ row }) => {
  const { is_exercise, price_type } = row.original;
  const exerciseType = ExerciseTypeMap[is_exercise];
  const priceType = BondQuoteTypeMap[price_type];
  if (exerciseType.length > 0) {
    return exerciseType;
  }
  if (priceType === '净价' || priceType === '全价') {
    return priceType;
  }
  return '--';
};

export const bondInfoRender: (prop: string) => HistoryCellRender =
  prop =>
  ({ row }) => {
    let renderStr: string = row.original[prop];
    if (prop === 'price_type') {
      renderStr = BondQuoteTypeMap[row.original[prop]];
    }
    if (prop === 'liquidation_speed_list') {
      renderStr = getLiquidationStr(row.original);
    }
    return (
      <Tooltip
        truncate
        content={renderStr}
      >
        <div className={toolTipCls}>{renderStr}</div>
      </Tooltip>
    );
  };

export const DirectionTag = ({ direction, disabled }: { direction: Direction; disabled?: boolean }) => {
  const directionStyle = directionMap[direction];
  return (
    <div
      className={cx(
        'flex-center w-12 h-5 rounded-lg font-bold text-xs',
        disabled ? directionStyle?.disabledBgCls : directionStyle?.bgCls,
        disabled ? 'text-gray-300' : 'text-gray-000'
      )}
    >
      {directionStyle?.label}
    </div>
  );
};

export const pricingRender: (prop: string) => HistoryCellRender =
  () =>
  ({ row }) => {
    const { price, return_point, direction, flag_rebate, flag_internal } = row.original;
    return (
      <div className={cx('relative flex justify-between items-center w-full h-full ')}>
        <DirectionTag direction={direction} />
        <PXCellPrice
          price={price}
          internal={flag_internal}
          rebate={flag_rebate}
          returnPoint={return_point}
          className="bg-placeholder !pr-0"
        />
      </div>
    );
  };

export const OfrTraderRender: HistoryCellRender = ({ row }) => {
  const { ofr_trade_info } = row.original;
  const { productType } = useProductParams();
  const user = getInstTrader(ofr_trade_info.inst, ofr_trade_info.trader, productType);

  return (
    <Tooltip
      truncate
      content={user}
    >
      <div className={toolTipCls}>{user}</div>
    </Tooltip>
  );
};

export const BidTraderRender: HistoryCellRender = ({ row }) => {
  const { bid_trade_info } = row.original;
  const { productType } = useProductParams();
  const user = getInstTrader(bid_trade_info.inst, bid_trade_info.trader, productType);
  return (
    <Tooltip
      truncate
      content={user}
    >
      <div className={toolTipCls}>{user}</div>
    </Tooltip>
  );
};

export const ofrBrokerRender: HistoryCellRender = ({ row }) => {
  const { ofr_trade_info } = row.original;
  const user = ofr_trade_info.broker?.name_cn ?? '--';
  return (
    <UserName
      isSelf={miscStorage.userInfo?.user_id === ofr_trade_info?.broker?.user_id}
      name={user}
    />
  );
};

export const bidBrokerRender: HistoryCellRender = ({ row }) => {
  const { bid_trade_info } = row.original;
  const user = bid_trade_info.broker?.name_cn ?? '--';
  return (
    <UserName
      isSelf={miscStorage.userInfo?.user_id === bid_trade_info?.broker?.user_id}
      name={user}
    />
  );
};
