import {
  BrokerageCommentMap,
  BrokerageTypeMap,
  DealMarketTypeMap,
  ExerciseTypeMap,
  ReceiptDealStatusMap,
  SettlementModeMap,
  TradeModeMap
} from '@fepkg/business/constants/map';
import { formatDate } from '@fepkg/common/utils/date';
import {
  FiccBondBasic,
  LiquidationSpeed,
  ReceiptDeal,
  ReceiptDealOperationLog,
  ReceiptDealTrade
} from '@fepkg/services/types/common';
import {
  BondQuoteType,
  BrokerageType,
  DealMarketType,
  DealSorSendStatus,
  ExerciseType,
  OperationSource,
  ReceiptDealOperationType,
  ReceiptDealStatus,
  ReceiptDealUpdateType,
  SettlementMode
} from '@fepkg/services/types/enum';
import moment from 'moment';
import { getSettlement, liquidationSpeedToString } from '../../utils/liq-speed';
import { dealSorSendStatusMap } from '../ReceiptDealTableCell';
import { ReceiptDealLogTableRowData, ReceiptDealUpdatedBadgeType, ReceiptDealUpdatedInfo } from './types';

export const ReceiptDealOperationTypeMap: Record<ReceiptDealOperationType, { text: string; cls: string }> = {
  [ReceiptDealOperationType.ReceiptDealOperationTypeNone]: { text: '', cls: '' },
  [ReceiptDealOperationType.ReceiptDealAdd]: { text: '新增', cls: 'text-orange-100' },
  [ReceiptDealOperationType.ReceiptDealBidConfirm]: { text: 'Bid确认', cls: 'text-orange-100' },
  [ReceiptDealOperationType.ReceiptDealOfrConfirm]: { text: 'Ofr确认', cls: 'text-secondary-100' },
  [ReceiptDealOperationType.ReceiptDealModify]: { text: '修改', cls: 'text-primary-100' },
  [ReceiptDealOperationType.ReceiptDealDelete]: { text: '删除', cls: 'text-danger-100' },
  [ReceiptDealOperationType.ReceiptDealSubmit]: { text: '提交', cls: 'text-primary-100' },
  [ReceiptDealOperationType.ReceiptDealDestroy]: { text: '毁单', cls: 'text-gray-100' },
  [ReceiptDealOperationType.ReceiptDealApprove]: { text: '审核确认', cls: 'text-purple-100' },
  [ReceiptDealOperationType.ReceiptDealReturn]: { text: '退回', cls: 'text-danger-100' },
  [ReceiptDealOperationType.ReceiptDealPrint]: { text: '打印', cls: 'text-primary-100' },
  [ReceiptDealOperationType.ReceiptDealRuleReset]: { text: '重置', cls: 'text-orange-100' },
  [ReceiptDealOperationType.ReceiptDealHandOver]: { text: '移交', cls: 'text-yellow-100' },
  [ReceiptDealOperationType.ReceiptDealAssociateBridge]: { text: '桥关联', cls: 'text-yellow-100' },
  [ReceiptDealOperationType.ReceiptDealBrokerAAsking]: { text: '点价方点击在问', cls: 'text-yellow-100' },
  [ReceiptDealOperationType.ReceiptDealBrokerBAsking]: { text: '被点价方点击在问', cls: 'text-yellow-100' },
  [ReceiptDealOperationType.ReceiptDealMulConfirm]: { text: '批量确认', cls: 'text-primary-100' }
};

export const updateMap: Record<
  Exclude<
    ReceiptDealUpdateType,
    | ReceiptDealUpdateType.ReceiptDealDelUpdateTypeEnumNone
    | ReceiptDealUpdateType.RDUpdateDelBridge
    | ReceiptDealUpdateType.RDUpdateAddBridge
  >,
  { field: keyof ReceiptDeal; label: string }
> = {
  [ReceiptDealUpdateType.RDUpdateBridgeFlag]: { field: 'flag_need_bridge', label: '桥提醒' }, // boolean
  [ReceiptDealUpdateType.RDUpdateUrgentFlag]: { field: 'flag_urgent', label: '紧急' }, // boolean
  [ReceiptDealUpdateType.RDUpdateStatus]: { field: 'receipt_deal_status', label: '状态' }, // ReceiptDealStatus
  [ReceiptDealUpdateType.RDUpdatePrice]: { field: 'price', label: 'Px' }, // number
  [ReceiptDealUpdateType.RDUpdateInternalFlag]: { field: 'flag_internal', label: '明暗盘' }, // boolean
  [ReceiptDealUpdateType.RDUpdateVol]: { field: 'volume', label: '券面总额' }, // number
  [ReceiptDealUpdateType.RDUpdateBidBroker]: { field: 'bid_trade_info', label: 'Broker(B)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrBroker]: { field: 'ofr_trade_info', label: 'Broker(O)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateCPBid]: { field: 'bid_trade_info', label: 'CP.Bid' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateCPOfr]: { field: 'ofr_trade_info', label: 'CP.Ofr' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateTradedDate]: { field: 'traded_date', label: '交易日' }, // string
  [ReceiptDealUpdateType.RDUpdateDeliveryDate]: { field: 'delivery_date', label: '交割日' }, // string
  [ReceiptDealUpdateType.RDUpdateDealDate]: { field: 'deal_time', label: '成交日' }, // string
  [ReceiptDealUpdateType.RDUpdateLiquidationSpeed]: { field: 'liquidation_speed_list', label: '清算速度' }, // LiquidationSpeed
  [ReceiptDealUpdateType.RDUpdateBidPayFor]: { field: 'bid_trade_info', label: '代付信息B' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrPayFor]: { field: 'ofr_trade_info', label: '代付信息O' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateBidPayForNC]: { field: 'bid_trade_info', label: '代付NC(B)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrPayForNC]: { field: 'ofr_trade_info', label: '代付NC(O)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateSettlementMode]: { field: 'settlement_mode', label: '结算模式' }, // SettlementMode
  [ReceiptDealUpdateType.RDUpdateExercise]: { field: 'is_exercise', label: '行权方式' }, // boolean
  [ReceiptDealUpdateType.RDUpdateDealDirection]: { field: 'direction', label: '交易方向' }, // Direction
  [ReceiptDealUpdateType.RDUpdateOrderNo]: { field: 'order_no', label: '订单号' }, // string
  [ReceiptDealUpdateType.RDUpdateYield]: { field: 'yield', label: '到期收益率' }, // number
  [ReceiptDealUpdateType.RDUpdateSpread]: { field: 'spread', label: '利差' }, // number
  [ReceiptDealUpdateType.RDUpdateCleanPrice]: { field: 'clean_price', label: '净价' }, // number
  [ReceiptDealUpdateType.RDUpdateFullPrice]: { field: 'full_price', label: '全价' }, // number
  [ReceiptDealUpdateType.RDUpdateMktType]: { field: 'deal_market_type', label: '市场' }, // DealMarketType
  [ReceiptDealUpdateType.RDUpdateBidBrokerageType]: { field: 'bid_trade_info', label: '佣金B' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrBrokerageType]: { field: 'ofr_trade_info', label: '佣金O' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateBidTradeMode]: { field: 'bid_trade_info', label: '交易方式B' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrTradeMode]: { field: 'ofr_trade_info', label: '交易方式O' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateBidNC]: { field: 'bid_trade_info', label: 'NC(B)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrNC]: { field: 'ofr_trade_info', label: 'NC(O)' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateBackendMsg]: { field: 'backend_msg', label: '后台信息' }, // string
  [ReceiptDealUpdateType.RDUpdateBidInstSpecial]: { field: 'bid_trade_info', label: '特别细节B' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateOfrInstSpecial]: { field: 'ofr_trade_info', label: '特别细节O' }, // ReceiptDealTrade
  [ReceiptDealUpdateType.RDUpdateBridgeCode]: { field: 'bridge_code', label: '过桥码' }, // string
  [ReceiptDealUpdateType.RDUpdateBondCode]: { field: 'bond_basic_info', label: '产品' }, // FiccBondBasic
  [ReceiptDealUpdateType.RDUpdateOtherDetail]: { field: 'other_detail', label: '其他细节' }, // string
  [ReceiptDealUpdateType.RDUpdateUpdateTime]: { field: 'update_time', label: '更新时间' }, // string
  [ReceiptDealUpdateType.RDUpdateSettlementAmount]: { field: 'settlement_amount', label: '结算金额' }, // string,
  [ReceiptDealUpdateType.RDInternalCode]: { field: 'internal_code', label: '内码' }, // string
  [ReceiptDealUpdateType.RDSeqNumber]: { field: 'seq_number', label: '序列号' }, // string
  [ReceiptDealUpdateType.RDUpdateSorSendStatus]: { field: 'deal_sor_send_status', label: '推送状态' }, // string
  [ReceiptDealUpdateType.RDUpdateYieldToExecution]: { field: 'yield_to_execution', label: '行权收益率' } // number
};

type ReceiptDealFieldType = ReceiptDeal[keyof ReceiptDeal];

const today = moment();

const formatBoolean = (val: ReceiptDealFieldType, trueText: string, falseText: string, defaultText = '') => {
  if (typeof val === 'boolean') return val ? trueText : falseText;
  return defaultText;
};

const formatBrokerContent = (trade?: ReceiptDealTrade) => {
  if (!trade) return '';

  const { broker, broker_b, broker_c, broker_d } = trade;
  const { broker_percent, broker_percent_b, broker_percent_c, broker_percent_d } = trade;

  let res = '';

  if (broker?.name_cn) res += `${broker.name_cn}(${broker_percent ?? 0}%)`;
  if (broker_b?.name_cn) res += ` ${broker_b.name_cn}(${broker_percent_b ?? 0}%)`;
  if (broker_c?.name_cn) res += ` ${broker_c.name_cn}(${broker_percent_c ?? 0}%)`;
  if (broker_d?.name_cn) res += ` ${broker_d.name_cn}(${broker_percent_d ?? 0}%)`;
  return res;
};

const getDealTimeFormat = (dealTime?: string) => {
  let format: string | undefined;

  const dealTimeMoment = moment(Number(dealTime ?? 0));

  if (dealTimeMoment.isSame(today, 'day')) format = 'HH:mm:ss';
  else if (dealTimeMoment.isSame(today, 'year')) format = 'MM-DD HH:mm:ss';
  else format = 'YYYY-MM-DD HH:mm:ss';

  return format;
};

const formatTimestamp = (val: ReceiptDealFieldType, format = 'yyyy-MM-DD') => {
  if (typeof val === 'string') return formatDate(val, format);
  return '';
};

const formatCpBadgeType = (trade?: ReceiptDealTrade): ReceiptDealUpdatedBadgeType | undefined => {
  if (!trade) return undefined;
  const { flag_pay_for_inst, flag_bridge, flag_in_bridge_inst_list } = trade;
  if (flag_pay_for_inst) return 'danger-payfor';
  if (flag_bridge) return flag_in_bridge_inst_list ? 'purple-bridge' : 'orange-bridge';
  return undefined;
};

const formatCpContent = (trade?: ReceiptDealTrade) => {
  if (!trade) return '';

  const { inst, trader } = trade;
  const [tag] = trader?.tags ?? [];
  const traderContent = trader?.name_zh ? `(${trader.name_zh}${tag ?? ''})` : '';
  let res = inst?.short_name_zh ?? '';
  if (traderContent) res += traderContent;
  return res;
};

const formatPayForContent = (payFor?: boolean, trade?: ReceiptDealTrade) => {
  if (!payFor) return '';
  if (!trade?.pay_for_info) return '';

  const { pay_for_inst, pay_for_trader } = trade.pay_for_info;
  let res = pay_for_inst?.short_name_zh ?? '';
  if (pay_for_trader?.name_zh) res += ` ${pay_for_trader.name_zh}`;
  return res;
};

const formatNcContent = (flagNc?: boolean, nc?: string) => {
  if (!flagNc) return '';

  let res = 'NC';
  if (nc) res += `(${nc})`;
  return res;
};

const formatBrokerageContent = (trade?: ReceiptDealTrade) => {
  let content = '';

  switch (trade?.brokerage_type) {
    case BrokerageType.BrokerageTypeC:
      content = '(CNY)';
      break;
    case BrokerageType.BrokerageTypeN:
      content = `(${trade?.brokerage ?? 'N0'})`;
      break;
    case BrokerageType.BrokerageTypeB:
      content = '(Bridge)';
      break;
    case BrokerageType.BrokerageTypeR:
      content = `(${trade?.brokerage ?? '双倍'})`;
      break;
    default:
      break;
  }

  return `${BrokerageTypeMap[trade?.brokerage_type ?? 0]}${content}`;
};

const formatLiqSpeedContent = (source?: OperationSource, liqSpeeds?: LiquidationSpeed[]) => {
  if (!liqSpeeds?.length) return '';
  if (liqSpeeds.length > 1) return '+1';

  const [first] = liqSpeeds;
  // 点价界面来源的点价报价，则此处会展示报价的结算方式（明天+0等）
  if (source === OperationSource.OperationSourceSpotPricing) return liquidationSpeedToString(first);
  // 系统 OMS 手工录入或在面板中修改后保存，则会展示 T+N 的格式
  return `T+${first.offset}`;
};

/** 根据 ReceiptDealUpdateType 获取对应更新的内容 */
export const getReceiptDealUpdatedInfo = (
  original: ReceiptDealOperationLog,
  type: ReceiptDealUpdateType,
  comment?: string
) => {
  const updated: ReceiptDealUpdatedInfo = { type, comment };

  const { before_receipt_deal_snapshot: beforeSnapshot, after_receipt_deal_snapshot: afterSnapshot } = original;

  switch (type) {
    case ReceiptDealUpdateType.ReceiptDealDelUpdateTypeEnumNone:
      break;
    case ReceiptDealUpdateType.RDUpdateDelBridge:
    case ReceiptDealUpdateType.RDUpdateAddBridge:
      updated.message = type === ReceiptDealUpdateType.RDUpdateDelBridge ? '成交单合单新增' : '成交单加桥新增';
      break;
    default:
      {
        const { field, label } = updateMap[type] ?? {};
        let before = beforeSnapshot?.[field];
        let after = afterSnapshot?.[field];

        updated.label = label;

        switch (type) {
          case ReceiptDealUpdateType.RDUpdateBridgeFlag:
            updated.before = { value: formatBoolean(before, '点亮', '点灭') };
            updated.after = { value: formatBoolean(after, '点亮', '点灭') };
            break;
          case ReceiptDealUpdateType.RDUpdateUrgentFlag:
            updated.before = { value: formatBoolean(before, '紧急', '非紧急') };
            updated.after = { value: formatBoolean(after, '紧急', '非紧急') };
            break;
          case ReceiptDealUpdateType.RDUpdateStatus:
            updated.before = { value: ReceiptDealStatusMap[before as ReceiptDealStatus] };
            updated.after = { value: ReceiptDealStatusMap[after as ReceiptDealStatus] };
            break;
          case ReceiptDealUpdateType.RDUpdateInternalFlag:
            updated.before = { value: formatBoolean(before, '暗盘', '明盘') };
            updated.after = { value: formatBoolean(after, '暗盘', '明盘') };
            break;
          case ReceiptDealUpdateType.RDUpdatePrice: {
            let beforePrice = typeof before === 'number' ? before.toFixed(4) : '';
            let afterPrice = typeof after === 'number' ? after.toFixed(4) : '';

            // 如果有返点，需要展示返点
            if (beforeSnapshot?.return_point) beforePrice += `F${beforeSnapshot.return_point}`;
            if (afterSnapshot?.return_point) afterPrice += `F${afterSnapshot.return_point}`;

            // 如果价格类型不一样，需要展示价格类型变更
            if (beforeSnapshot?.price_type !== afterSnapshot?.price_type) {
              if (beforeSnapshot?.price_type === BondQuoteType.CleanPrice) beforePrice += '(净价)';
              if (afterSnapshot?.price_type === BondQuoteType.CleanPrice) afterPrice += '(净价)';
            }

            updated.before = { value: beforePrice };
            updated.after = { value: afterPrice };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateYield:
          case ReceiptDealUpdateType.RDUpdateYieldToExecution:
          case ReceiptDealUpdateType.RDUpdateSpread:
          case ReceiptDealUpdateType.RDUpdateFullPrice:
          case ReceiptDealUpdateType.RDUpdateCleanPrice:
          case ReceiptDealUpdateType.RDUpdateSettlementAmount:
            updated.before = { value: typeof before === 'number' ? before.toFixed(4) : '' };
            updated.after = { value: typeof after === 'number' ? after.toFixed(4) : '' };
            break;
          case ReceiptDealUpdateType.RDUpdateBidBroker:
          case ReceiptDealUpdateType.RDUpdateOfrBroker: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = { value: formatBrokerContent(before) };
            updated.after = { value: formatBrokerContent(after) };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateCPBid:
          case ReceiptDealUpdateType.RDUpdateCPOfr: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = { badgeType: formatCpBadgeType(before), value: formatCpContent(before) };
            updated.after = { badgeType: formatCpBadgeType(after), value: formatCpContent(after) };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateTradedDate:
          case ReceiptDealUpdateType.RDUpdateDeliveryDate:
          case ReceiptDealUpdateType.RDUpdateDealDate:
          case ReceiptDealUpdateType.RDUpdateUpdateTime: {
            let beforeFormat: string | undefined;
            let afterFormat: string | undefined;

            before = before as string;
            after = after as string;

            if (type === ReceiptDealUpdateType.RDUpdateDealDate || type === ReceiptDealUpdateType.RDUpdateUpdateTime) {
              beforeFormat = getDealTimeFormat(before);
              afterFormat = getDealTimeFormat(after);
            }

            updated.before = { value: formatTimestamp(before, beforeFormat) };
            updated.after = { value: formatTimestamp(after, afterFormat) };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateLiquidationSpeed:
            updated.before = {
              value: formatLiqSpeedContent(
                beforeSnapshot?.source,
                beforeSnapshot?.liquidation_speed_list ?? [
                  getSettlement(beforeSnapshot?.traded_date ?? '', beforeSnapshot?.delivery_date ?? '')
                ]
              )
            };
            updated.after = {
              value: formatLiqSpeedContent(
                afterSnapshot?.source,
                afterSnapshot?.liquidation_speed_list ?? [
                  getSettlement(afterSnapshot?.traded_date ?? '', afterSnapshot?.delivery_date ?? '')
                ]
              )
            };
            // 都为 T+0 时不展示该行
            updated.hidden = updated?.before?.value === updated?.after?.value;
            break;
          case ReceiptDealUpdateType.RDUpdateBidPayFor:
          case ReceiptDealUpdateType.RDUpdateOfrPayFor: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = { value: formatPayForContent(before?.pay_for_info?.flag_pay_for, before) };
            updated.after = { value: formatPayForContent(after?.pay_for_info?.flag_pay_for, after) };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateBidPayForNC:
          case ReceiptDealUpdateType.RDUpdateOfrPayForNC: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = {
              value: formatNcContent(before?.pay_for_info?.flag_pay_for_nc, before?.pay_for_info?.pay_for_nc)
            };
            updated.after = {
              value: formatNcContent(after?.pay_for_info?.flag_pay_for_nc, after?.pay_for_info?.pay_for_nc)
            };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateSettlementMode:
            updated.before = { value: SettlementModeMap[before as SettlementMode] };
            updated.after = { value: SettlementModeMap[after as SettlementMode] };
            break;
          case ReceiptDealUpdateType.RDUpdateExercise:
            updated.before = { value: ExerciseTypeMap[before as ExerciseType] || '默认' };
            updated.after = { value: ExerciseTypeMap[after as ExerciseType] || '默认' };
            break;
          case ReceiptDealUpdateType.RDUpdateDealDirection:
            updated.before = { value: before as string };
            updated.after = { value: after as string };
            break;
          case ReceiptDealUpdateType.RDUpdateMktType:
            updated.before = { value: DealMarketTypeMap[before as DealMarketType] };
            updated.after = { value: DealMarketTypeMap[after as DealMarketType] };
            break;
          case ReceiptDealUpdateType.RDUpdateBidBrokerageType:
          case ReceiptDealUpdateType.RDUpdateOfrBrokerageType: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = { value: formatBrokerageContent(before) };
            updated.after = { value: formatBrokerageContent(after) };
            updated.comment = BrokerageCommentMap[after?.inst_brokerage_comment ?? 0];
            break;
          }
          case ReceiptDealUpdateType.RDUpdateBidTradeMode:
          case ReceiptDealUpdateType.RDUpdateOfrTradeMode: {
            updated.before = { value: TradeModeMap[(before as ReceiptDealTrade)?.trade_mode ?? 0] };
            updated.after = { value: TradeModeMap[(after as ReceiptDealTrade)?.trade_mode ?? 0] };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateBidNC:
          case ReceiptDealUpdateType.RDUpdateOfrNC: {
            before = before as ReceiptDealTrade;
            after = after as ReceiptDealTrade;

            updated.before = {
              value: formatNcContent(before?.flag_nc, before?.nc)
            };
            updated.after = {
              value: formatNcContent(after?.flag_nc, after?.nc)
            };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateBidInstSpecial:
          case ReceiptDealUpdateType.RDUpdateOfrInstSpecial: {
            updated.before = { value: (before as ReceiptDealTrade)?.inst_special ?? '' };
            updated.after = { value: (after as ReceiptDealTrade)?.inst_special ?? '' };
            break;
          }
          case ReceiptDealUpdateType.RDUpdateBondCode:
            updated.before = { value: (before as FiccBondBasic)?.display_code ?? '' };
            updated.after = { value: (after as FiccBondBasic)?.display_code ?? '' };
            break;
          case ReceiptDealUpdateType.RDUpdateSorSendStatus:
            updated.before = { value: dealSorSendStatusMap.get(before as DealSorSendStatus) ?? '' };
            updated.after = { value: dealSorSendStatusMap.get(after as DealSorSendStatus) ?? '' };
            break;
          default:
            updated.before = { value: before?.toString() || '' };
            updated.after = { value: after?.toString() || '' };
            break;
        }
      }
      break;
  }

  return updated;
};

export const transform2ReceiptDealLogTableRowData = (original: ReceiptDealOperationLog): ReceiptDealLogTableRowData => {
  const { operation_type, update_types = [] } = original ?? {};

  const children: ReceiptDealLogTableRowData[] = [];
  let updated: ReceiptDealUpdatedInfo | undefined;

  // 如果是规则重置，比较特殊，只需要展示固定备注文案
  if (operation_type === ReceiptDealOperationType.ReceiptDealRuleReset) {
    updated = { type: ReceiptDealUpdateType.ReceiptDealDelUpdateTypeEnumNone, comment: '规则配置更新，重置审核流程' };
  }

  for (const item of update_types) {
    const { update_type: type, update_field_comment } = item;
    updated = getReceiptDealUpdatedInfo(original, type, update_field_comment);

    if (update_types.length > 1) {
      const id = `${original.log_id}-children-${type}`;
      if (!updated?.hidden) children.push({ id, original: { ...original, updated } });
    }
  }

  return { id: original.log_id, original: { ...original, updated }, children };
};
