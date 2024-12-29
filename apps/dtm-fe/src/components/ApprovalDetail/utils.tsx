import {
  BrokerageCommentMap,
  ExerciseTypeMap,
  TradeModeMap,
  transformProductType
} from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { getExerciseType } from '@fepkg/business/utils/exercise-type';
import { formatDate } from '@fepkg/common/utils/date';
import { IconChecked } from '@fepkg/icon-park-react';
import { ReceiptDeal, Trader } from '@fepkg/services/types/common';
import { AdvancedApprovalType, BrokerageType, ExerciseType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { StatusImageMap } from '@/components/ApprovalDetail/constants';
import { ApprovalController, ReceiptDealDisplay } from './types';

const formatTraderContent = (trader?: Trader) => {
  if (!trader) return '';
  return trader?.name_zh ?? '';

  // 稳一手，万一将来又需要把标签加回来
  // const [tag] = trader?.tags ?? [];
  // let res = trader?.name_zh ?? '';
  // if (tag) res += ` ${tag}`;
  // return res;
};

const formatBrokerage = (type?: BrokerageType, brokerage?: string) => {
  switch (type) {
    case BrokerageType.BrokerageTypeC:
      return <IconChecked size={24} />;
    case BrokerageType.BrokerageTypeN:
    case BrokerageType.BrokerageTypeR:
      return brokerage ?? '';
    case BrokerageType.BrokerageTypeB:
      return 'Bridge';
    default:
      return '';
  }
};

export const transform2ReceiptDealDisplay = (deal: ReceiptDeal) => {
  const { bond_basic_info, bid_trade_info, ofr_trade_info } = deal ?? {};
  const { product_type, listed_market } = bond_basic_info ?? {};

  const exerciseType = getExerciseType({
    bondHasOption: hasOption(deal.bond_basic_info),
    exercise: deal.is_exercise,
    exerciseManual: true,
    productType: product_type,
    price_type: deal.price_type
  });

  const display: ReceiptDealDisplay = {
    productType: transformProductType(product_type, listed_market).en,
    tradeDate: formatDate(deal?.traded_date),
    orderNo: deal?.order_no ?? '',
    bridgeCode: deal?.bridge_code ?? '',
    internalCode: deal?.internal_code ?? '',

    bidInstName: bid_trade_info?.inst?.short_name_zh ?? '',
    bidInstNc: !!bid_trade_info?.flag_nc,
    bidInstCity: bid_trade_info?.inst?.district_name ?? '',
    bidTradeMode: TradeModeMap[bid_trade_info?.trade_mode ?? 0],
    bidTrader: formatTraderContent(bid_trade_info?.trader),
    ofrInstName: ofr_trade_info?.inst?.short_name_zh ?? '',
    ofrInstNc: !!ofr_trade_info?.flag_nc,
    ofrInstCity: ofr_trade_info?.inst?.district_name ?? '',
    ofrTradeMode: TradeModeMap[ofr_trade_info?.trade_mode ?? 0],
    ofrTrader: formatTraderContent(ofr_trade_info?.trader),

    bidFlagPayfor: !!bid_trade_info.flag_pay_for_inst,
    bidPayforInstName: bid_trade_info?.pay_for_info?.pay_for_inst?.short_name_zh ?? '',
    bidPayforInstNc: !!bid_trade_info?.pay_for_info?.flag_pay_for_nc,
    bidPayforInstCity: bid_trade_info?.pay_for_info?.pay_for_city ?? '',
    bidPayforTrader: formatTraderContent(bid_trade_info?.pay_for_info?.pay_for_trader),
    ofrFlagPayfor: !!ofr_trade_info.flag_pay_for_inst,
    ofrPayforInstName: ofr_trade_info?.pay_for_info?.pay_for_inst?.short_name_zh ?? '',
    ofrPayforInstNc: !!ofr_trade_info?.pay_for_info?.flag_pay_for_nc,
    ofrPayforInstCity: ofr_trade_info?.pay_for_info?.pay_for_city ?? '',
    ofrPayforTrader: formatTraderContent(ofr_trade_info?.pay_for_info?.pay_for_trader),

    currency: 'CNY',
    volume: ((deal?.volume ?? 0) / 100).toString(),
    yield:
      exerciseType === ExerciseType.Expiration
        ? deal?.yield?.toFixed(4) ?? ''
        : deal?.yield_to_execution?.toFixed(4) ?? '',
    fullPrice: deal?.full_price?.toFixed(4) ?? '',
    clearPrice: deal?.clean_price?.toFixed(4) ?? '',
    exerciseType: ExerciseTypeMap[exerciseType],
    settlementDate: formatDate(deal?.delivery_date),
    settlementAmount: deal?.settlement_amount?.toFixed(4) ?? '',
    optionDate: formatDate(bond_basic_info?.option_date),
    maturityDate: formatDate(bond_basic_info?.maturity_date),

    bondCode: bond_basic_info?.display_code ?? '',
    bondName: bond_basic_info?.short_name ?? '',
    settlementMode: 'DVP',

    bidBrokerageComment: BrokerageCommentMap[bid_trade_info?.inst_brokerage_comment ?? 0],
    backendMessage: deal?.backend_msg ?? '',
    ofrBrokerageComment: BrokerageCommentMap[ofr_trade_info?.inst_brokerage_comment ?? 0],

    bidInstSpecial: bid_trade_info?.inst_special ?? '',
    otherDetail: deal?.other_detail ?? '',
    ofrInstSpecial: ofr_trade_info?.inst_special ?? '',

    bidBrokerage: formatBrokerage(bid_trade_info?.brokerage_type, bid_trade_info?.brokerage),
    ofrBrokerage: formatBrokerage(ofr_trade_info?.brokerage_type, ofr_trade_info?.brokerage),

    bidBrokerAName: bid_trade_info?.broker?.name_cn ?? '',
    bidBrokerAPercent: String(bid_trade_info?.broker_percent || ''),
    bidBrokerBName: bid_trade_info?.broker_b?.name_cn ?? '',
    bidBrokerBPercent: String(bid_trade_info?.broker_percent_b || ''),
    bidBrokerCName: bid_trade_info?.broker_c?.name_cn ?? '',
    bidBrokerCPercent: String(bid_trade_info?.broker_percent_c || ''),
    bidBrokerDName: bid_trade_info?.broker_d?.name_cn ?? '',
    bidBrokerDPercent: String(bid_trade_info?.broker_percent_d || ''),

    ofrBrokerAName: ofr_trade_info?.broker?.name_cn ?? '',
    ofrBrokerAPercent: String(ofr_trade_info?.broker_percent || ''),
    ofrBrokerBName: ofr_trade_info?.broker_b?.name_cn ?? '',
    ofrBrokerBPercent: String(ofr_trade_info?.broker_percent_b || ''),
    ofrBrokerCName: ofr_trade_info?.broker_c?.name_cn ?? '',
    ofrBrokerCPercent: String(ofr_trade_info?.broker_percent_c || ''),
    ofrBrokerDName: ofr_trade_info?.broker_d?.name_cn ?? '',
    ofrBrokerDPercent: String(ofr_trade_info?.broker_percent_d || '')
  };
  return display;
};

export const diffDisplay = (target: ReceiptDealDisplay, snapshot?: ReceiptDealDisplay) => {
  const diffKeys = new Set<keyof ReceiptDealDisplay>();

  if (!target || !snapshot) return diffKeys;

  for (const key in target) {
    if (snapshot[key] !== target[key]) {
      diffKeys.add(key as keyof ReceiptDealDisplay);

      if (key === 'bidBrokerage' || key === 'ofrBrokerage') {
        // 这两个可能是 ReactNode，只要不是字符串，都是相等的
        if (typeof snapshot[key] !== 'string' && typeof target[key] !== 'string') {
          diffKeys.delete(key);
        }
      }
    }
  }

  return diffKeys;
};

export const transform2RenderValue = (target: ReceiptDeal, snapshot?: ReceiptDeal, statusImageMap = StatusImageMap) => {
  const display = transform2ReceiptDealDisplay(target);
  let diffKeys = new Set<keyof ReceiptDealDisplay>();

  if (snapshot) {
    const snapshotDisplay = transform2ReceiptDealDisplay(snapshot);
    diffKeys = diffDisplay(display, snapshotDisplay);
  }

  const statusImage = statusImageMap[target?.receipt_deal_status ?? ReceiptDealStatus.ReceiptDealStatusNone];

  return { display, statusImage, diffKeys };
};

export const getActionControllers = ({
  receipt_deal_status,
  cur_approval_role,
  cur_role_list
}: {
  receipt_deal_status?: ReceiptDealStatus;
  cur_approval_role?: string;
  cur_role_list?: string[];
}) => {
  const controllers = new Set<ApprovalController>([]);

  switch (receipt_deal_status) {
    case ReceiptDealStatus.ReceiptDealPass:
      // 如果处于已通过状态中，并且如果最后一个是我所处角色通过的
      if (cur_role_list?.includes(cur_approval_role ?? '')) {
        controllers.add('no-pass');
      }
      break;
    case ReceiptDealStatus.ReceiptDealSubmitApproval:
    case ReceiptDealStatus.ReceiptDealToBeExamined:
      // 待我处理
      if (cur_role_list?.includes(cur_approval_role ?? '')) {
        controllers.add('pass');
        controllers.add('no-pass');
      }
      break;
    default:
      break;
  }

  return { controllers };
};

export const copy = (text: string) => {
  navigator.clipboard.writeText(text);
};

/** 是否为毁单审核申请 */
export const isDestroyApproval = (types: AdvancedApprovalType[] = []) => {
  if (types.length !== 1) return false;

  const [type] = types;
  return type === AdvancedApprovalType.AdvancedApprovalTypeDestroy;
};

export const isApproval = (receiptDeal: ReceiptDeal, curRoleList?: string[]) => {
  return (
    ![ReceiptDealStatus.ReceiptDealNoPass, ReceiptDealStatus.ReceiptDealDestroyed].includes(
      receiptDeal.receipt_deal_status
    ) && curRoleList?.includes(receiptDeal.cur_approval_role ?? '')
  );
};
