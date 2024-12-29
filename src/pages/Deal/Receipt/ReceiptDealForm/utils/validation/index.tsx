import { Side } from '@fepkg/services/types/enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import { IUpsertReceiptDeal, ReceiptDealFormErrorStateType } from '../../types';
import { validationCPInfo } from './validationCPInfo';
import { validationDealBridgeInfo } from './validationDealBridgeInfo';
import { validationDealElement } from './validationDealElement';
import { validationDealInfo } from './validationDealInfo';
import { validationDealSettlement } from './validationDealSettlement';
import { validationDealTradeInfo } from './validationDealTradeInfo';

type CommonValidationDealParams = {
  receiptDealInfo: IUpsertReceiptDeal;
  errorState: ReceiptDealFormErrorStateType;
};
/**
 * @description 成交单录入与修改通用的校验
 */
export const commonValidationDeal = ({ receiptDealInfo, errorState }: CommonValidationDealParams) => {
  return (
    validationDealInfo(receiptDealInfo) &&
    validationDealElement(receiptDealInfo, errorState) &&
    validationDealTradeInfo(receiptDealInfo.bid_trade_info, Side.SideBid, errorState) &&
    validationDealBridgeInfo(receiptDealInfo, errorState) &&
    validationDealTradeInfo(receiptDealInfo.ofr_trade_info, Side.SideOfr, errorState) &&
    validationDealSettlement(receiptDealInfo)
  );
};

/**
 * @description 成交单修改的校验
 */
type ValidationUpdateDealParams = {
  receiptDealInfo: IUpsertReceiptDeal;
  formattedRawData?: ReceiptDealMulAdd.CreateReceiptDeal;
  errorState: ReceiptDealFormErrorStateType;
};
export const validationUpdateDeal = ({ receiptDealInfo, formattedRawData, errorState }: ValidationUpdateDealParams) => {
  return validationCPInfo(errorState, receiptDealInfo, formattedRawData);
};
