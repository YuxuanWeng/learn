import { ReceiptDealBridgeOp, ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import { Side } from '@fepkg/services/types/bds-enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { ReceiptDealStatusCode } from '../../constants';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType, ReceiptDealTradeInfoErrorState } from '../../types';

type IValidateByErrorCode = {
  receiptDealInfo: IUpsertReceiptDeal;
  errorState: ReceiptDealFormErrorStateType;
  response: ReceiptDealMulAdd.Response;
};

type IValidateBrokerByErrorCode = {
  tradeInfo?: ReceiptDealTradeOp;
  response: ReceiptDealMulAdd.Response;
  side: Side;
};

type IValidateBridgeByErrorCode = {
  bridgeInfo?: ReceiptDealBridgeOp[];
  response: ReceiptDealMulAdd.Response;
};
type IValidateCommonByErrorCode = {
  receiptDealInfo: IUpsertReceiptDeal;
  errorState: ReceiptDealFormErrorStateType;
  response: ReceiptDealMulAdd.Response;
};

const checkListIncluded = (list?: string[], item?: string) => {
  if (!item) return false;
  return list?.includes(item);
};

const validateBrokerByErrorCode = ({
  response,
  tradeInfo,
  side
}: IValidateBrokerByErrorCode): ReceiptDealTradeInfoErrorState => {
  const { illegal_broker_list } = response;
  if (checkListIncluded(illegal_broker_list, tradeInfo?.broker_id)) {
    return { [side]: { broker: true } };
  }
  if (checkListIncluded(illegal_broker_list, tradeInfo?.broker_id_b)) {
    return { [side]: { broker_b: true } };
  }
  if (checkListIncluded(illegal_broker_list, tradeInfo?.broker_id_c)) {
    return { [side]: { broker_c: true } };
  }
  if (checkListIncluded(illegal_broker_list, tradeInfo?.broker_id_d)) {
    return { [side]: { broker_d: true } };
  }
  return {};
};

const validateBridgeByErrorCode = ({ response, bridgeInfo }: IValidateBridgeByErrorCode) => {
  const { illegal_broker_list, illegal_inst_list, illegal_trader_list } = response;
  for (const [bridgeIndex, bridgeItem] of (bridgeInfo ?? []).entries()) {
    if (checkListIncluded(illegal_inst_list, bridgeItem?.inst_id)) {
      return {
        bridgeIndex,
        instError: true
      };
    }
    if (checkListIncluded(illegal_trader_list, bridgeItem?.trader_id)) {
      return {
        bridgeIndex,
        traderError: true
      };
    }
    if (checkListIncluded(illegal_broker_list, bridgeItem?.broker_id)) {
      return {
        bridgeIndex,
        brokerError: true
      };
    }
  }
  return undefined;
};

/** 适合所有case通用的校验逻辑，但开销略大 */
const validateCommonByErrorCode = ({ response, receiptDealInfo, errorState }: IValidateCommonByErrorCode) => {
  const { illegal_inst_list, illegal_trader_list } = response;
  if (checkListIncluded(illegal_inst_list, receiptDealInfo.bid_trade_info?.inst_id)) {
    errorState.traderErrorState = { [Side.SideBid]: { inst: true } };
    return;
  }
  if (checkListIncluded(illegal_trader_list, receiptDealInfo.bid_trade_info?.trader_id)) {
    errorState.traderErrorState = { [Side.SideBid]: { trader: true } };
    return;
  }
  if (checkListIncluded(illegal_inst_list, receiptDealInfo.bid_trade_info?.pay_for_info?.pay_for_inst_id)) {
    errorState.traderErrorState = { [Side.SideBid]: { payForInst: true } };
    return;
  }
  if (checkListIncluded(illegal_trader_list, receiptDealInfo.bid_trade_info?.pay_for_info?.pay_for_trader_id)) {
    errorState.traderErrorState = { [Side.SideBid]: { payForTrader: true } };
    return;
  }
  errorState.traderErrorState = validateBrokerByErrorCode({
    response,
    tradeInfo: receiptDealInfo.bid_trade_info,
    side: Side.SideBid
  });
  if (Object.keys(errorState.traderErrorState).length) {
    return;
  }
  errorState.bridgeErrorState = validateBridgeByErrorCode({
    response,
    bridgeInfo: receiptDealInfo.bridge_info
  });
  if (Object.keys(errorState.bridgeErrorState ?? {}).length) {
    return;
  }
  if (checkListIncluded(illegal_inst_list, receiptDealInfo.ofr_trade_info?.inst_id)) {
    errorState.traderErrorState = { [Side.SideOfr]: { inst: true } };
    return;
  }
  if (checkListIncluded(illegal_trader_list, receiptDealInfo.ofr_trade_info?.trader_id)) {
    errorState.traderErrorState = { [Side.SideOfr]: { trader: true } };
  }
  if (checkListIncluded(illegal_inst_list, receiptDealInfo.ofr_trade_info?.pay_for_info?.pay_for_inst_id)) {
    errorState.traderErrorState = { [Side.SideOfr]: { payForInst: true } };
    return;
  }
  if (checkListIncluded(illegal_trader_list, receiptDealInfo.ofr_trade_info?.pay_for_info?.pay_for_trader_id)) {
    errorState.traderErrorState = { [Side.SideOfr]: { payForTrader: true } };
  }
};

/**
 * @title 根据后端的错误码把对应输入框标红
 * @description ReceiptDealStatusCode对应的错误含义可参考ReceiptDealErrorMsgMap的文案或咨询后端
 */
export function validateByErrorCode({ response, receiptDealInfo, errorState }: IValidateByErrorCode) {
  const code = response.base_response?.code;

  switch (code) {
    case ReceiptDealStatusCode.BIDInstInvalid:
      errorState.traderErrorState = { [Side.SideBid]: { inst: true } };
      break;
    case ReceiptDealStatusCode.BIDTraderInvalid:
      errorState.traderErrorState = { [Side.SideBid]: { trader: true } };
      break;
    case ReceiptDealStatusCode.BIDBrokerInvalid:
      errorState.traderErrorState = validateBrokerByErrorCode({
        response,
        tradeInfo: receiptDealInfo.bid_trade_info,
        side: Side.SideBid
      });
      break;
    case ReceiptDealStatusCode.BIDPayForInstInvalid:
      errorState.traderErrorState = { [Side.SideBid]: { payForInst: true } };
      break;
    case ReceiptDealStatusCode.BIDPayForTraderInvalid:
      errorState.traderErrorState = { [Side.SideBid]: { payForTrader: true } };
      break;
    case ReceiptDealStatusCode.BridgeInstInvalid:
    case ReceiptDealStatusCode.BridgeTraderInvalid:
    case ReceiptDealStatusCode.BridgeBrokerInvalid:
      errorState.bridgeErrorState = validateBridgeByErrorCode({
        response,
        bridgeInfo: receiptDealInfo.bridge_info
      });
      break;
    case ReceiptDealStatusCode.OFRTraderInvalid:
      errorState.traderErrorState = { [Side.SideOfr]: { trader: true } };
      break;
    case ReceiptDealStatusCode.OFRBrokerInvalid:
      errorState.traderErrorState = validateBrokerByErrorCode({
        response,
        tradeInfo: receiptDealInfo.ofr_trade_info,
        side: Side.SideOfr
      });
      break;
    case ReceiptDealStatusCode.OFRPayForInstInvalid:
      errorState.traderErrorState = { [Side.SideOfr]: { payForInst: true } };
      break;
    case ReceiptDealStatusCode.OFRPayForTraderInvalid:
      errorState.traderErrorState = { [Side.SideOfr]: { payForTrader: true } };
      break;
    case ReceiptDealStatusCode.OFRInstInvalid:
      errorState.traderErrorState = { [Side.SideOfr]: { inst: true } };
      break;
    case ReceiptDealStatusCode.SameInstInfoOfSubmitError:
    case ReceiptDealStatusCode.SameTraderInfoOfSubmitError:
      validateCommonByErrorCode({ response, receiptDealInfo, errorState });
      break;
    case ReceiptDealStatusCode.BIDInstTraderNotMatch:
      errorState.traderErrorState = { [Side.SideBid]: { inst: true, trader: true } };
      break;
    case ReceiptDealStatusCode.BIDPayforInstTraderNotMatch:
      errorState.traderErrorState = { [Side.SideOfr]: { payForInst: true, payForTrader: true } };
      break;
    case ReceiptDealStatusCode.OFRInstTraderNotMatch:
      errorState.traderErrorState = { [Side.SideOfr]: { inst: true, trader: true } };
      break;
    case ReceiptDealStatusCode.OFRPayforInstTraderNotMatch:
      errorState.traderErrorState = { [Side.SideOfr]: { payForInst: true, payForTrader: true } };
      break;
    case ReceiptDealStatusCode.BridgeInstTraderNotMatch: {
      const bridgeError = validateBridgeByErrorCode({
        response,
        bridgeInfo: receiptDealInfo.bridge_info
      });
      if (bridgeError) {
        errorState.bridgeErrorState = { bridgeIndex: bridgeError.bridgeIndex, instError: true, traderError: true };
      }
      break;
    }
    default:
      break;
  }
  return true;
}
