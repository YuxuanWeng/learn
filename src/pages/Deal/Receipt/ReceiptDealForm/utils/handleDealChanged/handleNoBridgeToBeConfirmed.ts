import { checkBridgeFlagChange, getWarningModalOptions } from '..';
import { ModalOptionsType } from '../../constants';
import { ReceiptDealTradeFlag } from '../../types';
import { checkFee } from './checkPayfor';
import { handleDealChangedParams } from './type';

/** 处理非含桥、待确认情况 */
export const handleNoBridgeToBeConfirmed = ({ initialRowData, receiptDealInfo }: handleDealChangedParams) => {
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

    if (needClearPayFor) {
      // console.log('代付机构费用清空');
      return getWarningModalOptions(ModalOptionsType.ClearPayFor);
    }
  }
  // console.log('无弹窗');
  return getWarningModalOptions(ModalOptionsType.NoNeedModal);
};
