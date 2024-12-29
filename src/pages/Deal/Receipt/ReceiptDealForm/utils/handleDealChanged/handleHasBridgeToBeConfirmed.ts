import { checkBridgeFlagChange, getWarningModalOptions } from '..';
import { ModalOptionsType } from '../../constants';
import { ReceiptDealTradeFlag } from '../../types';
import { checkFee, checkNoPayfor } from './checkPayfor';
import { getSeqNumNodeByParent } from './getSeqNumNodeByParent';
import { handleDealChangedParams } from './type';

/** 处理含桥、待确认情况 */
export const handleHasBridgeToBeConfirmed = async ({
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
    // console.log('联动取消');
    const showNode = await getSeqNumNodeByParent(initialRowData?.parent_deal_id);

    return getWarningModalOptions(ModalOptionsType.Unlink, showNode);
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
      // console.log('有代付费用则代付费用清空+同步编辑，无则同步编辑');
      const modalOptionsType = needClearPayFor ? ModalOptionsType.ClearPayForSyncEdit : ModalOptionsType.SyncEdit;
      return getWarningModalOptions(modalOptionsType);
    }

    // console.log('有代付费用则同步编辑，无弹窗');
    const modalOptionsType = needClearPayFor ? ModalOptionsType.ClearPayFor : ModalOptionsType.NoNeedModal;
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
      // console.log('同步编辑');
      return getWarningModalOptions(ModalOptionsType.SyncEdit);
    }

    // console.log('无弹窗');
    return getWarningModalOptions(ModalOptionsType.NoNeedModal);
  }

  // 仅其他信息变更
  if (hasSyncEditDiff) {
    // console.log('同步编辑');
    return getWarningModalOptions(ModalOptionsType.SyncEdit);
  }

  // console.log('无弹窗');
  return getWarningModalOptions(ModalOptionsType.NoNeedModal);
};
