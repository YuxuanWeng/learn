import { message } from '@fepkg/components/Message';
import { ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import { Side } from '@fepkg/services/types/bds-enum';
import { getBroker } from '..';
import { ReceiptDealFormErrorStateType } from '../../types';
import { validateBroker } from './validateBroker';

type IBrokerFields = 'broker' | 'broker_b' | 'broker_c' | 'broker_d';
type IBrokerFieldsObject = { [k in IBrokerFields]: boolean };

export function getDuplicateBroker(allBroker: string[]): IBrokerFieldsObject | undefined {
  const duplicates = new Map();
  const brokerMap = {
    0: 'broker',
    1: 'broker_b',
    2: 'broker_c',
    3: 'broker_d'
  };

  for (const item of allBroker) {
    // 重复则返回所有重复的BrokerFields
    if (duplicates.get(item) !== undefined) {
      return allBroker.reduce((prev, cur, index) => {
        if (cur && cur === item) {
          return { ...prev, [brokerMap[index]]: true };
        }
        return { ...prev, [brokerMap[index]]: false };
      }, {} as IBrokerFieldsObject);
    }

    duplicates.set(item, item);
  }
  return undefined;
}

/**
 * @description 成交单Broker校验是否重复
 */
function validateBrokerDuplicate(
  trade_info: ReceiptDealTradeOp | undefined,
  side?: Side.SideBid | Side.SideOfr,
  errorState?: ReceiptDealFormErrorStateType
) {
  const allBroker = getBroker(trade_info);
  const duplicates = getDuplicateBroker(allBroker.filter(Boolean));

  if (duplicates) {
    if (errorState && side) {
      for (const [key, value] of Object.entries(duplicates)) {
        errorState.traderErrorState = {
          [side]: { [key]: value }
        };
      }
    }

    return false;
  }
  return true;
}

/**
 * @description 成交单Broker佣金校验，有broker，则一定要有显性填写的比例
 */
function validateBrokerPercent(
  trade_info: ReceiptDealTradeOp | undefined,
  side: Side.SideBid | Side.SideOfr,
  errorState: ReceiptDealFormErrorStateType
) {
  if (!trade_info) return false;
  const { broker_id, broker_id_b, broker_id_c, broker_id_d } = trade_info;
  const { broker_percent, broker_percent_b, broker_percent_c, broker_percent_d } = trade_info;
  if (broker_id && !broker_percent) {
    errorState.traderErrorState = {
      [side]: { brokeragePercent: true }
    };
    return false;
  }
  if (broker_id_b && !broker_percent_b) {
    errorState.traderErrorState = {
      [side]: { brokeragePercent: true }
    };
    return false;
  }
  if (broker_id_c && !broker_percent_c) {
    errorState.traderErrorState = {
      [side]: { brokeragePercent: true }
    };
    return false;
  }
  if (broker_id_d && !broker_percent_d) {
    errorState.traderErrorState = {
      [side]: { brokeragePercent: true }
    };
    return false;
  }
  return true;
}

/**
 * @description 成交单交易双方信息校验
 */
export const validationDealTradeInfo = (
  tradeInfo: ReceiptDealTradeOp | undefined,
  side: Side.SideBid | Side.SideOfr,
  errorState: ReceiptDealFormErrorStateType
) => {
  const tradeDirection = side === Side.SideBid ? 'B' : 'O';
  if (!tradeInfo) {
    message.error(`${tradeDirection}方信息无效！请重新输入！`);
    return false;
  }

  if (!tradeInfo.brokerage) {
    message.error(`佣金（${tradeDirection}）有误！请重新输入！`);
    return false;
  }
  if (!tradeInfo.trade_mode) {
    message.error(`交易方式（${tradeDirection}）有误！请重新输入！`);
    return false;
  }

  if (!validateBrokerDuplicate(tradeInfo, side, errorState)) {
    message.error(`经纪人（${tradeDirection}）重复！请重新输入！`);
    return false;
  }

  if (!validateBroker(tradeInfo, side, errorState)) {
    message.error(`经纪人（${tradeDirection}）无效！请重新输入！`);
    return false;
  }

  if (!validateBrokerPercent(tradeInfo, side, errorState)) {
    message.error(`经纪人（${tradeDirection}）无效！请重新输入！`);
    return false;
  }
  // 佣金比例输入框中数值之和相加为100
  const { broker_percent = 0, broker_percent_b = 0, broker_percent_c = 0, broker_percent_d = 0 } = tradeInfo;
  if (broker_percent + broker_percent_b + broker_percent_c + broker_percent_d !== 100) {
    message.error(`经纪人（${tradeDirection}）佣金比例无效！请重新输入！`);
    errorState.traderErrorState = {
      [side]: { brokeragePercent: true }
    };
    return false;
  }
  if (tradeInfo.flag_nc && !tradeInfo.nc?.trim()) {
    message.error(`${tradeDirection}方NC理由未填写！`);
    errorState.traderErrorState = {
      [side]: { nc: true }
    };
    return false;
  }
  // 若勾选被代付信息，则机构交易员必填
  if (tradeInfo.pay_for_info?.flag_pay_for && !tradeInfo.pay_for_info?.pay_for_inst_id) {
    message.error(`代付机构（${tradeDirection}）无效！请重新输入！`);
    errorState.traderErrorState = {
      [side]: { payForInst: true }
    };
    return false;
  }

  if (tradeInfo.pay_for_info?.flag_pay_for && !tradeInfo.pay_for_info?.pay_for_trader_id) {
    message.error(`代付交易员（${tradeDirection}）无效！请重新输入！`);
    errorState.traderErrorState = {
      [side]: { payForTrader: true }
    };
    return false;
  }
  if (
    tradeInfo.pay_for_info?.flag_pay_for &&
    tradeInfo.pay_for_info?.flag_pay_for_nc &&
    !tradeInfo.pay_for_info?.pay_for_nc?.trim()
  ) {
    message.error(`${tradeDirection}方代付NC理由未填写！`);
    errorState.traderErrorState = {
      [side]: { payForNc: true }
    };
    return false;
  }

  return true;
};
