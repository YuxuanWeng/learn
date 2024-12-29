import { ReceiptDealSearchRealParentDeal } from '@fepkg/services/types/receipt-deal/search-real-parent-deal';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { MIN_HEIGHT, MIN_WIDTH } from '@/pages/Deal/Receipt/ReceiptDealLog/utils';
import { ColSettingDef, ColumnAlign } from '../../types';
import {
  BidTraderRender,
  LogRender,
  OfrTraderRender,
  StatusRender,
  bidBrokerRender,
  bondInfoRender,
  createTimeRender,
  internalCodeRender,
  ofrBrokerRender,
  priceRender,
  pricingRender,
  updateTimeRender
} from './cellRenders';

export const PAGE_SIZE = 30;

export const columnSettings = [
  { key: 'create_time', label: '创建时间', width: 200, align: ColumnAlign.RIGHT, cellRender: createTimeRender },
  { key: 'internal_code', label: '内码', width: 64, align: ColumnAlign.CENTER, cellRender: internalCodeRender },
  { key: 'log', label: '操作日志', width: 72, align: ColumnAlign.CENTER, cellRender: LogRender },
  { key: 'hist_deal_status', label: '状态', width: 72, align: ColumnAlign.CENTER, cellRender: StatusRender },
  { key: 'time_to_maturity', label: '剩余期限', width: 100, cellRender: bondInfoRender('time_to_maturity') },
  { key: 'display_code', label: '债券代码', width: 120, cellRender: bondInfoRender('display_code') },
  { key: 'bond_short_name', label: '债券简称', width: 160, cellRender: bondInfoRender('bond_short_name') },
  { key: 'price', label: 'Px', width: 188, align: ColumnAlign.RIGHT, cellRender: pricingRender('price') },
  { key: 'price_type', label: '价格备注', width: 80, cellRender: priceRender },
  {
    key: 'volume',
    label: 'Vol',
    width: 120,
    align: ColumnAlign.RIGHT,
    cellRender: bondInfoRender('volume')
  },
  {
    key: 'liquidation_speed_list',
    label: '交割方式',
    width: 120,
    cellRender: bondInfoRender('liquidation_speed_list')
  },
  {
    key: 'ofr_trader_info',
    label: '点价方/出券(克隆)',
    width: 160,
    cellRender: OfrTraderRender
  },
  {
    key: 'ofr_broker_info',
    label: 'Broker(O)',
    width: 120,
    align: ColumnAlign.CENTER,
    cellRender: ofrBrokerRender
  },
  {
    key: 'bid_trader_info',
    label: '被点价方/入券(克隆)',
    width: 160,
    cellRender: BidTraderRender
  },
  {
    key: 'bid_broker_info',
    label: 'Broker(B)',
    width: 120,
    align: ColumnAlign.CENTER,
    cellRender: bidBrokerRender
  },
  { key: 'update_time', label: '更新时间', width: 200, align: ColumnAlign.RIGHT, cellRender: updateTimeRender }
].map(col => ({ ...col, visible: true })) as ColSettingDef<ReceiptDealSearchRealParentDeal.RealReceiptDealInfo>[];

export const getSpotHistoryRecordsConfig = () => ({
  name: WindowName.SpotHistoryRecords,
  custom: { route: CommonRoute.SpotHistoryRecords, routePathParams: [] },
  options: { width: MIN_WIDTH, height: MIN_HEIGHT, resizable: true, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }
});
