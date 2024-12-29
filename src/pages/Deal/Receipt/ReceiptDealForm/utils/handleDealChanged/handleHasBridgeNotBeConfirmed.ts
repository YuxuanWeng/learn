import { checkBridgeFlagChange, getWarningModalOptions } from '..';
import { ModalOptionsType } from '../../constants';
import { ReceiptDealTradeFlag } from '../../types';
import { checkFee, checkNoPayfor } from './checkPayfor';
import { getSeqNumNodeByParent } from './getSeqNumNodeByParent';
import { handleDealChangedParams } from './type';

/** 处理含桥、非待确认情况 */
export const handleHasBridgeNotBeConfirmed = async ({
  initialRowData,
  receiptDealInfo,
  hasSyncEditDiff
}: handleDealChangedParams) => {
  // 桥标志变更(桥-灭/代-灭)
  if (
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Bridge,
      curFlag: ReceiptDealTradeFlag.Real
    }) ||
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Payfor,
      curFlag: ReceiptDealTradeFlag.Real
    })
  ) {
    // console.log('重置状态+联动取消');
    const showNode = await getSeqNumNodeByParent(initialRowData?.parent_deal_id);
    return getWarningModalOptions(ModalOptionsType.ResetStatusUnlink, showNode);
  }

  // 桥标志变更(代-桥)
  if (
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Payfor,
      curFlag: ReceiptDealTradeFlag.Bridge
    })
  ) {
    const needClearPayFor = checkNoPayfor(receiptDealInfo) && checkFee(initialRowData?.fee);

    // 有无其他信息变更
    if (hasSyncEditDiff) {
      // console.log('有代付费用则重置状态+代付费用清空+同步编辑，无则重置状态+同步编辑');
      const modalOptionsType = needClearPayFor
        ? ModalOptionsType.ResetStatusClearPayForSyncEdit
        : ModalOptionsType.ResetStatusSyncEdit;
      return getWarningModalOptions(modalOptionsType);
    }

    // console.log('有代付费用则重置状态+代付费用清空，无则重置状态');
    const modalOptionsType = needClearPayFor ? ModalOptionsType.ResetStatusClearPayFor : ModalOptionsType.ResetStatus;
    return getWarningModalOptions(modalOptionsType);
  }

  // 桥标志变更(桥-代)
  if (
    checkBridgeFlagChange({
      oldData: initialRowData,
      curData: receiptDealInfo,
      prevFlag: ReceiptDealTradeFlag.Bridge,
      curFlag: ReceiptDealTradeFlag.Payfor
    })
  ) {
    // 有其他信息变更
    if (hasSyncEditDiff) {
      // console.log('重置状态+同步编辑');
      return getWarningModalOptions(ModalOptionsType.ResetStatusSyncEdit);
    }
    // console.log('重置状态');
    return getWarningModalOptions(ModalOptionsType.ResetStatus);
  }

  // 仅其他信息变更
  if (hasSyncEditDiff) {
    // console.log('重置状态+同步编辑');
    return getWarningModalOptions(ModalOptionsType.ResetStatusSyncEdit);
  }

  // console.log('重置状态');
  return getWarningModalOptions(ModalOptionsType.ResetStatus);
};
