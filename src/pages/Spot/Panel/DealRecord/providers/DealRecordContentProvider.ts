import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ExerciseTypeMap } from '@fepkg/business/constants/map';
import { DealRecord } from '@fepkg/services/types/bds-common';
import {
  BondDealStatus,
  BondQuoteType,
  DealHandOverStatus,
  DealOperationType,
  OperationSource,
  ReceiverSide
} from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { idcDealConfirm } from '@/common/services/api/deal/confirm';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get-by-parent';
import { BuySold } from '@/components/IDCHistory/types';
import { miscStorage } from '@/localdb/miscStorage';
import { useDealRecordModify } from '../hooks/useDealRecordModify';
import { confirmedStatus, getBuySold, getSettlementType, getViewDiffState } from '../utils';
import { useDealRecord } from './DealRecordProvider';

type InitialState = {
  historyInfo: DealRecord;
};

const DealRecordContentContainer = createContainer((initialState?: InitialState) => {
  const historyInfo = initialState?.historyInfo;
  const { ourSideIds } = useDealRecord();
  const { onDealRecordModify } = useDealRecordModify();

  const [showDeleteBridgeConfirm, setShowDeleteBridgeConfirm] = useState(false);

  /* 前提: 存在编辑权限。 case 1: 存在<全部数据权限> case 2: 存在<过桥标志点亮数据权限>且不存在<本人撮合数据权限>.用户拥有全部编辑权限 */
  // let userEditPermission = true;

  /** 用户是否有数据权限 */
  // const dataPermission = bridgeRecordPermission || recordSelfPermission;

  // 是否可以编辑
  const canModify =
    !!historyInfo?.deal_status &&
    confirmedStatus.includes(historyInfo?.deal_status) &&
    // 如果已经移交，则不能编辑
    historyInfo.hand_over_status !== DealHandOverStatus.HandOver;

  // (bid)发给input只读逻辑
  const inputReadonly = () => {
    // 没有过桥，第一个input不用禁用
    if (!historyInfo?.flag_bridge) return !canModify;

    const type = getBuySold(historyInfo, ourSideIds);
    switch (type) {
      case BuySold.All:
      case BuySold.Buy:
        // 我是买方bid发给可修改
        return !canModify;
      // 我是卖方，bid不可修改
      case BuySold.Sold:
        return true;
      default:
        return !canModify;
    }
  };

  // ofr发给input只读逻辑
  const ofrInputReadonly = () => {
    const type = getBuySold(historyInfo, ourSideIds);
    switch (type) {
      case BuySold.All:
      case BuySold.Sold:
        // 我是卖方，ofr可以修改
        return !canModify;
      // 我是买方，ofr不可修改
      case BuySold.Buy:
        return true;
      default:
        return true;
    }
  };

  const remark = useMemo(() => {
    return [
      getSettlementType(
        historyInfo?.bid_settlement_type?.at(0),
        historyInfo?.ofr_settlement_type?.at(0),
        historyInfo?.bid_traded_date,
        historyInfo?.ofr_traded_date,
        historyInfo?.flag_exchange
      ),
      historyInfo?.price_type === BondQuoteType.Yield &&
        historyInfo?.exercise_type &&
        ExerciseTypeMap[historyInfo?.exercise_type]
    ]
      .filter(Boolean)
      .join('，');
  }, [historyInfo]);

  const onDeleteBridge = () => {
    if (!historyInfo) return;
    const extraParams = { bid_send_order_msg: '', ofr_send_order_msg: '' };
    const bridgeMark = !historyInfo?.flag_bridge;

    onDealRecordModify({
      payload: { deal_id: historyInfo?.deal_id ?? '', flag_bridge: bridgeMark, ...extraParams },
      operationType: DealOperationType.DOTDeleteBridge,
      showIllegal: true
    });
  };

  /** 过桥标志变更 */
  const handleBridgeChange = async (cb: Dispatch<SetStateAction<boolean>>) => {
    if (!historyInfo) return;
    const bridgeMark = !historyInfo?.flag_bridge;

    const hasBridge =
      ((await fetchReceiptDealByParent({ parent_deal_ids: [historyInfo.deal_id] })).receipt_deal_info?.length ?? 0) > 1;
    // 无论是点亮还是熄灭bid/ofr发给都需要被清空
    const extraParams = { bid_send_order_msg: '', ofr_send_order_msg: '' };

    // 点亮过桥
    if (bridgeMark) {
      cb(bridgeMark);
      onDealRecordModify({
        payload: { deal_id: historyInfo?.deal_id ?? '', flag_bridge: bridgeMark, ...extraParams },
        operationType: DealOperationType.DOTModifyDeal
      });
    }
    // 有桥就弹出二次确认
    else if (hasBridge) {
      setShowDeleteBridgeConfirm(true);
      // 没有桥就直接熄灭过桥标志
    } else {
      cb(bridgeMark);
      onDealRecordModify({
        payload: { deal_id: historyInfo?.deal_id ?? '', flag_bridge: bridgeMark, ...extraParams },
        operationType: DealOperationType.DOTModifyDeal
      });
    }
  };

  // 对方部分确认，我方快捷全部确认
  const handleConfirmPrice = () => {
    idcDealConfirm({
      deal_id: historyInfo?.deal_id ?? '',
      confirm_status: BondDealStatus.DealConfirmed,
      operator: miscStorage.userInfo?.user_id,
      confirm_side: ReceiverSide.SpotPricinger,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTBrokerAConfirm,
        operation_source: OperationSource.OperationSourceDealRecord
      }
    });
  };

  return {
    inputReadonly: inputReadonly(),
    ofrInputReadonly: ofrInputReadonly(),
    canModify,
    remark,
    handleConfirmPrice,
    handleBridgeChange,
    showDeleteBridgeConfirm,
    setShowDeleteBridgeConfirm,
    onDeleteBridge,
    ourSideIds
  };
});

export const RecordContentProvider = DealRecordContentContainer.Provider;
export const useRecordContent = DealRecordContentContainer.useContainer;
