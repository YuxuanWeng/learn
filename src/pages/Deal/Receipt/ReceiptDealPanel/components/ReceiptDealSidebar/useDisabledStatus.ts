import { useMemo } from 'react';
import { ReceiptDealStatus } from '@fepkg/services/types/enum';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { validationReceiptDeal } from '@/pages/Deal/Receipt/ReceiptDealForm/utils/validation/validationReceiptDeal';
import { useReceiptDealPanel } from '../../providers/ReceiptDealPanelProvider';
import { checkReceiptDealCanSubmit } from '../../utils';
import { ReceiptDealAction } from './constants';

export const useDisabledStatus = () => {
  const { access } = useAccess();
  const { productType } = useProductParams();
  const { selectedList, getReceiptDealByParent } = useReceiptDealPanel();

  const disabledStatus = useMemo(() => {
    const first = selectedList.at(0)?.original;
    const noSelected = !selectedList.length;
    const onlyOneSelected = selectedList.length === 1;

    const isMultiSelected = selectedList.length > 1 && selectedList.length < 10;

    const hasOrderNo = selectedList.some(item => item.original.order_no); // 选中的单子中存在订单号
    /** 选中的单子中或含桥兄弟单存在订单号 */
    const hasOrderNoWithBridge = selectedList.some(item => {
      if (!item.original.parent_deal_id) {
        return item.original.order_no;
      }
      const siblingsList = getReceiptDealByParent([item.original.parent_deal_id]);
      return siblingsList.some(i => i.order_no);
    });

    const allDestroyedDeleted = selectedList.every(
      item =>
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDestroyed ||
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDeleted
    );
    const hasDestroyedDeleted = selectedList.some(
      item =>
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDestroyed ||
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDeleted
    );

    /*
      提交规则：Ï
      1. 若未选择成交单，则按钮不可点击
      2. 若选择的成交单中均不满足(待提交状态 且 交易日为当日或当日之前 且 加桥提醒按钮为点灭状态)的单子，则按钮不可点击
    */
    const isSubmitDisabled = noSelected || selectedList.every(obj => !checkReceiptDealCanSubmit(obj.original));
    /*
      编辑/Join规则：
      1. 若非单选一条成交单，则按钮不可点击
    */
    const isEditBridgeDisabled = !onlyOneSelected;

    const isJoinBridgeDisabled = !onlyOneSelected;

    /*
      紧急规则：
      1. 若未选择成交单，则按钮不可点击
      2. 若成交单状态均为已毁单、已删除，则按钮不可点击
    */
    const isUrgentDisabled = noSelected || allDestroyedDeleted;

    /*
      毁单规则：
      1. 若非选择单条的，按钮不可点击
      2. 若无订单号的，按钮不可点击（含桥单只要同一过桥码下有一单存在无订单号即可毁单）
      3. 若成交单状态有已毁单、已删除，则按钮不可点击
      4. 若成交单状态有毁单中的（送审中有毁单原因），则按钮不可点击
    */
    const hasDestroying = selectedList.some(
      item =>
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealSubmitApproval &&
        item.original.destroy_reason
    );
    const isDestroyDisabled = !onlyOneSelected || !hasOrderNoWithBridge || hasDestroyedDeleted || hasDestroying;

    /*
      删除规则：
      1. 若未选择成交单，则按钮不可点击
      2. 若选择的成交单中已有订单号的，按钮不可点击（含桥单需保证同一过桥码下所有单均无订单号才可提交）
    */
    const isDeleteDisabled = noSelected || hasOrderNoWithBridge || hasDestroyedDeleted;

    /*
      删桥规则：
      1. 若未选择超过一条成交单，则按钮不可点击
      2. 若选择的成交单中包含已有订单号的，按钮不可点击
      3. 存在不同过桥码或没有过桥码的单子，按钮不可点击
      4. 当成交单状态为已毁单/已删除时，按钮不可点击
    */
    const areBridgeCodeSame =
      first?.bridge_code && selectedList.every(obj => obj.original.bridge_code === first?.bridge_code);
    const hasDeletedOrDestroyed = selectedList.some(
      item =>
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDestroyed ||
        item.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealDeleted
    );
    const isDeleteBridgeDisabled = !isMultiSelected || hasOrderNo || !areBridgeCodeSame || hasDeletedOrDestroyed;

    const accessCache = {
      edit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealEdit)),
      submit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealSubmit))
    };

    /**
     * 1. 无权限，则不可点击
     * 2. 需要加桥，则不可点击
     * 3. 缺少元素，则不可点击
     * 4. 状态为待确认，并且有一方为我的成交单，才可点击
     */
    const isConfirmDisabled = !selectedList.some(
      row =>
        !row.original.flag_need_bridge &&
        validationReceiptDeal(row.original) &&
        row.original.receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeConfirmed &&
        ((row.isBidMine && !row.original.flag_bid_broker_confirmed) ||
          (row.isOfrMine && !row.original.flag_ofr_broker_confirmed))
    );

    return {
      [ReceiptDealAction.Trade]: !accessCache.edit,
      [ReceiptDealAction.Submit]: isSubmitDisabled || !accessCache.submit,
      [ReceiptDealAction.Edit]: isEditBridgeDisabled || !accessCache.edit,
      [ReceiptDealAction.Join]: isJoinBridgeDisabled || !accessCache.edit,
      [ReceiptDealAction.Urgent]: isUrgentDisabled || !accessCache.edit,
      [ReceiptDealAction.Destroy]: isDestroyDisabled || !accessCache.submit,
      [ReceiptDealAction.Delete]: isDeleteDisabled || !accessCache.edit,
      [ReceiptDealAction.DeleteBridge]: isDeleteBridgeDisabled || !accessCache.edit,
      [ReceiptDealAction.Confirm]: isConfirmDisabled || !accessCache.submit
    };
  }, [access, selectedList, productType, getReceiptDealByParent]);

  return { disabledStatus };
};
