import { DealDetailLog, DealDetailLogChild, DealDetailOperationLog, SendOrderInst } from '@fepkg/services/types/common';
import { DealDetailUpdateType, DealOperationType, ProductType, TradeDirection } from '@fepkg/services/types/enum';
import { isEqual, sum } from 'lodash-es';
import { BridgeChannelMap } from '../../constants/map';
import { CP_NONE, getCP } from '../../utils/get-name';
import { DealDetailLogTableRowData } from './types';

export const DealDetailOperationTypeMap = {
  [DealOperationType.DealOperationTypeNone]: { text: '', cls: '' },
  [DealOperationType.DOTSpotPricing]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerAConfirm]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerAReject]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerBConfirm]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerBPartiallyFilled]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerBReject]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTOfflineConfirm]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTCreateByClone]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTCloned]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealInput]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealJoin]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTAssociateBridge]: { text: '桥关联', cls: 'text-yellow-100' },
  [DealOperationType.DOTModifyDeal]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTModifySendOrderInfo]: { text: '发单编辑', cls: 'text-primary-100' },
  [DealOperationType.DOTPrint]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTApprovalRuleReset]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealSubmit]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealDestroy]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealApprove]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealReturn]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTAddBridge]: { text: '加桥', cls: 'text-orange-100' },
  [DealOperationType.DOTDeleteBridge]: { text: '删桥', cls: 'text-danger-100' },
  [DealOperationType.DOTResetBridge]: { text: '重置桥', cls: 'text-orange-100' },
  [DealOperationType.DOTChangeBridge]: { text: '换桥', cls: 'text-secondary-100' },
  [DealOperationType.DOTModifyBridgeInfo]: { text: '编辑桥', cls: 'text-primary-100' },
  [DealOperationType.DOTSend]: { text: '发送', cls: 'text-yellow-100' },
  [DealOperationType.DOTRemindOrder]: { text: '催单', cls: 'text-purple-100' },
  [DealOperationType.DOTHandOver]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealDelete]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealBidConfirm]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTReceiptDealOfrConfirm]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTNewDeal]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerAAsking]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerBAsking]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTDeleteDealRecord]: { text: '修改', cls: 'text-primary-100' },
  [DealOperationType.DOTAddDoubleBridge]: { text: '加多桥', cls: 'text-orange-100' }
};

const getBridgeDirectionText = (
  direction: TradeDirection | undefined,
  isBidTrueOpponent: boolean,
  isOfrTrueOpponent: boolean
) => {
  if (direction == null) return '';
  if (isBidTrueOpponent) return direction === TradeDirection.TradeDirectionOfr2Bid ? '指向本方机构' : '指向桥';
  if (isOfrTrueOpponent) return direction === TradeDirection.TradeDirectionBid2Ofr ? '指向本方机构' : '指向桥';

  return (
    {
      [TradeDirection.TradeDirectionOfr2Bid]: '指向Bid',
      [TradeDirection.TradeDirectionBid2Ofr]: '指向Ofr'
    }[direction] ?? ''
  );
};

const FlagHidden = {
  true: '隐藏',
  false: '显示'
};

const subChildrenFields: { field: keyof DealDetailLogChild; label: string }[] = [
  { field: 'bridge_direction', label: '发给方向' },
  { field: 'send_msg', label: '发给' },
  { field: 'bridge_channel', label: '渠道' },
  { field: 'fee', label: '费用' },
  { field: 'send_order_comment', label: '发单备注' },
  { field: 'flag_hide_comment', label: '隐藏备注' },
  { field: 'send_order_inst_info', label: '发单机构' }
];

const getSendOrderInstStr = (list?: SendOrderInst[]) => {
  return (list ?? []).map(orderInst => `${orderInst.inst?.short_name_zh ?? ''}(${orderInst.volume})`).join(' ');
};

const numberConvert = (num?: number) => {
  if (typeof num === 'number') {
    if (num === -1 || num === 0) {
      return '';
    }
    return String(num);
  }
  return '';
};

const getSendOrderMsg = (snapshot?: DealDetailLog, isBidTrueOpponent?: boolean, isOfrTrueOpponent?: boolean) => {
  if (isBidTrueOpponent) {
    return snapshot?.bid_send_order_msg ?? '';
  }
  if (isOfrTrueOpponent) {
    return snapshot?.ofr_send_order_msg ?? '';
  }

  return '';
};

const getDetailsKeyString = (detail: DealDetailLogChild) => {
  return [
    detail.bid_inst_id,
    detail.ofr_inst_id,
    detail.bid_trader_id,
    detail.ofr_trader_id,
    detail.child_deal_id
  ].join('__');
};

/** 获取更新的内容 */
const getDealDetailUpdatedInfo = (productType: ProductType, original: DealDetailOperationLog) => {
  const children: DealDetailLogTableRowData[] = [];
  const bridgeCommentChildren: DealDetailLogTableRowData[] = [];

  if (
    original.after_deal_snapshot?.details == null ||
    // 若前后成交单id不一致则不比较成交单更改
    !isEqual(
      original.after_deal_snapshot?.details?.map(getDetailsKeyString),
      original.before_deal_snapshot?.details?.map(getDetailsKeyString)
    )
  )
    return children;

  for (const [index] of (original.before_deal_snapshot?.details ?? []).entries()) {
    const before = (original.before_deal_snapshot?.details ?? [])[index];
    const after = (original.after_deal_snapshot?.details ?? [])[index];

    const isBidTrueOpponent = index === 0;
    const isOfrTrueOpponent = index === (original.before_deal_snapshot?.details ?? []).length - 1;

    const subChildren: DealDetailLogTableRowData[] = [];

    const beforeSendOrderMsg = getSendOrderMsg(original.before_deal_snapshot, isBidTrueOpponent, isOfrTrueOpponent);
    const afterSendOrderMsg = getSendOrderMsg(original.after_deal_snapshot, isBidTrueOpponent, isOfrTrueOpponent);

    if (beforeSendOrderMsg !== afterSendOrderMsg) {
      subChildren.push({
        id: `${original.log_id}_${before.child_deal_id}_send_order_msg`,
        original,
        updated: {
          label: '发单信息',
          before: beforeSendOrderMsg,
          after: afterSendOrderMsg
        }
      });
    }

    for (const val of subChildrenFields) {
      let beforeUpdate = '';
      let afterUpdate = '';

      const id = `${original.log_id}_${before.child_deal_id}_${val.field}`;

      if (val.field === 'bridge_direction') {
        const beforeVal = before[val.field];
        const afterVal = after[val.field];

        beforeUpdate = getBridgeDirectionText(beforeVal, isBidTrueOpponent, isOfrTrueOpponent);
        afterUpdate = getBridgeDirectionText(afterVal, isBidTrueOpponent, isOfrTrueOpponent);
      }

      if (val.field === 'send_msg' || val.field === 'send_order_comment') {
        beforeUpdate = before[val.field] ?? '';
        afterUpdate = after[val.field] ?? '';
      }

      if (val.field === 'bridge_channel') {
        beforeUpdate = BridgeChannelMap[before[val.field] ?? ''] ?? '';
        afterUpdate = BridgeChannelMap[after[val.field] ?? ''] ?? '';
      }

      if (val.field === 'fee') {
        beforeUpdate = numberConvert(before[val.field]);
        afterUpdate = numberConvert(after[val.field]);
      }

      if (val.field === 'flag_hide_comment') {
        beforeUpdate = FlagHidden[before[val.field]?.toString() ?? ''] ?? '';
        afterUpdate = FlagHidden[after[val.field]?.toString() ?? ''] ?? '';
      }

      if (val.field === 'send_order_inst_info') {
        beforeUpdate = getSendOrderInstStr(before[val.field]);
        afterUpdate = getSendOrderInstStr(after[val.field]);
      }

      if (beforeUpdate !== afterUpdate) {
        subChildren.push({
          id,
          original,
          subRowDeal: before,
          updated: {
            label: val.label,
            before: beforeUpdate,
            after: afterUpdate
          }
        });
      }
    }

    if (subChildren.length !== 0) {
      children.push({
        id: `${original.log_id}_${before.child_deal_id}`,
        original,
        children: subChildren,
        subRowDeal: before,
        subAmount: subChildren.length
      });
    }

    // 处理桥备注，桥备注属于上级children
    const beforeBridgeComment = before.bridge_comment ?? '';
    const afterBridgeComment = after.bridge_comment ?? '';

    if (beforeBridgeComment !== afterBridgeComment) {
      bridgeCommentChildren.push({
        id: `${original.log_id}_${before.bid_inst_id}`,
        original,
        updated: {
          label: '桥备注',
          before: beforeBridgeComment,
          after: afterBridgeComment
        },
        bridgeCommentTag: getCP({
          productType,
          inst: before.bid_inst_snapshot,
          trader: before.bid_trader_snapshot,
          placeholder: CP_NONE
        })
      });
    }
  }

  return [...children, ...bridgeCommentChildren];
};

export const transform2DealLogTableRowData = (
  productType: ProductType,
  original: DealDetailOperationLog
): DealDetailLogTableRowData => {
  const children: DealDetailLogTableRowData[] = [];
  if (original.update_types?.includes(DealDetailUpdateType.DealDetailUpdateCP)) {
    children.push({
      id: `${original.log_id}_cp_info`,
      original,
      updated: { label: 'CP信息', type: DealDetailUpdateType.DealDetailUpdateCP }
    });
  }

  children.push(...getDealDetailUpdatedInfo(productType, original));

  if (children.length === 0) return { id: original.log_id, original };

  return children.length > 1 &&
    ![DealOperationType.DOTSend, DealOperationType.DOTRemindOrder].includes(original.operation_type)
    ? { id: original.log_id, original, children, subAmount: sum(children.map(i => i.children?.length ?? 1)) }
    : { ...children[0], id: original.log_id };
};
