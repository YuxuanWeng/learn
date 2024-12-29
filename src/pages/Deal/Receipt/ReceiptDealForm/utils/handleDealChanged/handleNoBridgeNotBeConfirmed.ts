import { checkBridgeFlagChange, getWarningModalOptions } from '..';
import { ModalOptionsType } from '../../constants';
import { ReceiptDealTradeFlag } from '../../types';
import { checkFee } from './checkPayfor';
import { handleDealChangedParams } from './type';

/** 处理非含桥、非待确认情况 */
export const handleNoBridgeNotBeConfirmed = ({ initialRowData, receiptDealInfo }: handleDealChangedParams) => {
  // 桥标志变更(灭-代)
  if (
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Real,
      curFlag: ReceiptDealTradeFlag.Payfor
    })
  ) {
    // console.log('重置状态');
    return getWarningModalOptions(ModalOptionsType.ResetStatus);
  }

  // 桥标志变更(代-灭)
  if (
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Payfor,
      curFlag: ReceiptDealTradeFlag.Real
    })
  ) {
    const needClearPayFor = checkFee(initialRowData?.fee);

    if (!needClearPayFor) {
      // console.log('重置状态');
      return getWarningModalOptions(ModalOptionsType.ResetStatus);
    }
    // console.log('重置状态+代付机构费用清空');
    return getWarningModalOptions(ModalOptionsType.ResetStatusClearPayFor);
  }

  // console.log('重置状态');
  return getWarningModalOptions(ModalOptionsType.ResetStatus);
};
