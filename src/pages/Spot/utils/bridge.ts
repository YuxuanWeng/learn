import { message } from '@fepkg/components/Message';
import { StatusCode } from '@fepkg/request/types';
import { Post, ProductType } from '@fepkg/services/types/bdm-enum';
import {
  BridgeInstInfo,
  ReceiptDeal,
  ReceiptDealDetail,
  ReceiptDealOperateIllegal
} from '@fepkg/services/types/bds-common';
import {
  CheckBridge,
  DealOperationType,
  OperationSource,
  ReceiptDealStatus,
  Side
} from '@fepkg/services/types/bds-enum';
import { ReceiptDealAddBridge } from '@fepkg/services/types/receipt-deal/add-bridge';
import { ReceiptDealBridgeDelete } from '@fepkg/services/types/receipt-deal/bridge-delete';
import { ReceiptDealChangeBridge } from '@fepkg/services/types/receipt-deal/change-bridge';
import { isEmpty } from 'lodash-es';
import { mulReceiptBridgeAdd } from '@/common/services/api/receipt-deal/add-bridge';
import { deleteBridgeReceiptDealFromDealDetails } from '@/common/services/api/receipt-deal/bridge-delete';
import { mulReceiptBridgeChange } from '@/common/services/api/receipt-deal/change-bridge';
import { miscStorage } from '@/localdb/miscStorage';
import { toastRequestError } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { getRelatedBridgeInstIds } from '../../Deal/Bridge/utils';
import {
  showAlreadyHasBridgeModal,
  showCRMChangedModal,
  showConcurrentCheckModal,
  showHasPaidModal,
  showHasSubmitModal,
  showResetCheckModal,
  showReverseCheckModal,
  showSorSendModal
} from './editBridgeCheckModal';
import { ReceiptDealDetailForAdd } from './type';

// 当前是否已提交
const dealHasBeSubmitted = (
  deal: ReceiptDealDetailForAdd | undefined,
  filter: {
    curInstId?: string;
    childIds?: string[];
  }
) => {
  return deal?.details?.some(d => {
    const fitInstId =
      !isEmpty(filter.curInstId) &&
      (d.bid_trade_info.inst?.inst_id === filter.curInstId || d.ofr_trade_info.inst?.inst_id === filter.curInstId);

    const fitChildIds = !isEmpty(filter.childIds) && filter.childIds?.includes(d.receipt_deal_id ?? '');

    return (fitInstId || fitChildIds) && Boolean(d.order_no);
  });
};

export const dealHasBridge = (deal?: ReceiptDealDetailForAdd) => {
  return (deal?.details?.length ?? 0) > 1;
};

const getReceiptDealOperateIllegalFromDeals = (
  failList: ReceiptDealDetailForAdd[],
  checkBridgeType: CheckBridge
): ReceiptDealOperateIllegal | undefined => {
  const internal_code_list: string[] = [];
  const bridge_code_list: string[] = [];
  const order_no_list: string[] = [];
  const seq_no_list: string[] = [];

  if (!failList.length) return undefined;
  for (const item of failList) {
    if (item.parent_deal.internal_code) {
      internal_code_list.push(item.parent_deal.internal_code);
    } else if (item.parent_deal.bridge_code) {
      bridge_code_list.push(item.parent_deal.bridge_code);
    } else if (item.parent_deal.order_no) {
      order_no_list.push(item.parent_deal.order_no);
    } else if (item.parent_deal.seq_number) {
      seq_no_list.push(item.parent_deal.seq_number);
    }
  }
  return {
    check_bridge: checkBridgeType,
    bridge_code_list,
    internal_code_list,
    order_no_list,
    seq_no_list
  };
};

// （请求前）检测当前选中的记录是否非待移交待确认
const preCheckReset = (
  dealList: ReceiptDealDetailForAdd[],
  filter: {
    curInstId?: string;
    childIds?: string[];
  }
) => {
  const checkResult = {
    internal_code_list: [],
    check_bridge: CheckBridge.CheckBridgeEnumNone
  } as ReceiptDealOperateIllegal;

  for (const parent of dealList) {
    if (parent.details)
      for (const d of parent.details) {
        const fitInstId =
          !isEmpty(filter.curInstId) &&
          (d.bid_trade_info.inst?.inst_id === filter.curInstId || d.ofr_trade_info.inst?.inst_id === filter.curInstId);

        const fitChildIds = !isEmpty(filter.childIds) && filter.childIds?.includes(d.receipt_deal_id ?? '');

        if (
          d.receipt_deal_id &&
          (fitInstId || fitChildIds) &&
          d.receipt_deal_status &&
          d.receipt_deal_status > ReceiptDealStatus.ReceiptDealToBeConfirmed
        ) {
          checkResult.internal_code_list?.push(parent.parent_deal.internal_code ?? '');
        }
      }
  }

  return new Promise(resolve => {
    if ((checkResult.internal_code_list?.length ?? 0) > 0) {
      showResetCheckModal(resolve);
    } else {
      resolve(true);
    }
  });
};

const noBridgeAndHasPaid = (deal: ReceiptDealDetailForAdd) => {
  return (
    (deal.details?.length || 0) === 1 &&
    (deal.parent_deal.bid_trade_info.flag_pay_for_inst || deal.parent_deal.ofr_trade_info.flag_pay_for_inst)
  );
};

const asyncSubmitModal = (failInfo: ReceiptDealOperateIllegal) =>
  new Promise<void>(resolve => {
    showHasSubmitModal(failInfo, resolve);
  });

const asyncPaidModal = (failInfo: ReceiptDealOperateIllegal) =>
  new Promise<void>(resolve => {
    showHasPaidModal(failInfo, resolve);
  });

const asyncHasBridgeModal = (failInfo: ReceiptDealOperateIllegal) =>
  new Promise<void>(resolve => {
    showAlreadyHasBridgeModal(failInfo, resolve);
  });

const preCheckForAddBridge = (
  dealList: ReceiptDealDetailForAdd[],
  needPreCheckHasBridge: boolean,
  childIds: string[]
) => {
  let list = [...dealList];

  const submittedOrderNos = list
    .filter(i => dealHasBeSubmitted(i, { childIds }))
    .map(i => i.details?.filter(d => Boolean(d.order_no) && childIds.includes(d.receipt_deal_id ?? '')))
    .reduce((cur, next) => {
      return [...cur, ...(next ?? []).map(i => i.order_no ?? '')];
    }, [] as string[]);

  const submitFailInfo =
    submittedOrderNos.length === 0
      ? undefined
      : {
          check_bridge: CheckBridge.Submitted,
          order_no_list: submittedOrderNos
        };

  list = list.filter(item => !dealHasBeSubmitted(item, { childIds }));

  const noBridgeAlreadyPaidDeals = list.filter(noBridgeAndHasPaid);
  const noBridgeAlreadyPaidfailInfo = getReceiptDealOperateIllegalFromDeals(noBridgeAlreadyPaidDeals, CheckBridge.Paid);

  list = list.filter(item => !noBridgeAndHasPaid(item));

  const hasBridgeDeals = list.filter(item => needPreCheckHasBridge && dealHasBridge(item));
  const hasBridgeFailInfo = getReceiptDealOperateIllegalFromDeals(hasBridgeDeals, CheckBridge.HasBridge);

  list = list.filter(item => !(needPreCheckHasBridge && dealHasBridge(item)));

  (async () => {
    if (submitFailInfo) {
      await asyncSubmitModal(submitFailInfo);
    }
    if (noBridgeAlreadyPaidfailInfo) {
      await asyncPaidModal(noBridgeAlreadyPaidfailInfo);
    }
    if (hasBridgeFailInfo) {
      await asyncHasBridgeModal(hasBridgeFailInfo);
    }
  })();

  return list;
};

const showPaidModalAndContinue = (illegalInfo: ReceiptDealOperateIllegal) =>
  new Promise(resolve => {
    showHasPaidModal(illegalInfo, () => resolve(undefined));
  });

const showSubmitModalAndContinue = (illegalInfo: ReceiptDealOperateIllegal) =>
  new Promise(resolve => {
    showHasSubmitModal(
      {
        ...illegalInfo,
        check_bridge: CheckBridge.CheckBridgeEnumNone
      },
      () => resolve(undefined)
    );
  });

const showAlreadyHasBridgeModalAndContinue = (illegalInfo: ReceiptDealOperateIllegal) =>
  new Promise(resolve => {
    showAlreadyHasBridgeModal(
      {
        ...illegalInfo,
        check_bridge: CheckBridge.HasBridge
      },
      () => resolve(undefined)
    );
  });

const showSorSendModalAndContinue = (illegalInfo: ReceiptDealOperateIllegal) =>
  new Promise(resolve => {
    showSorSendModal(
      {
        ...illegalInfo,
        check_bridge: CheckBridge.SorSentModified
      },
      () => resolve(undefined)
    );
  });

const showInverseAndContinue = (illegalInfo: ReceiptDealOperateIllegal) =>
  new Promise<boolean>(resolve => {
    showReverseCheckModal(
      {
        ...illegalInfo,
        check_bridge: CheckBridge.Inverse
      },
      next => resolve(next === true)
    );
  });

const illegalIsNotEmpty = (illegal: ReceiptDealOperateIllegal | undefined) => {
  return (
    illegal?.bridge_code_list?.length ||
    illegal?.internal_code_list?.length ||
    illegal?.order_no_list?.length ||
    illegal?.seq_no_list?.length
  );
};

export const checkIllegalList = async (illegalList: ReceiptDealOperateIllegal[]) => {
  const submitFailInfo: ReceiptDealOperateIllegal | undefined = illegalList.find(
    illegal => illegal.check_bridge === CheckBridge.Submitted && illegalIsNotEmpty(illegal)
  );
  const paidFailInfo: ReceiptDealOperateIllegal | undefined = illegalList.find(
    illegal => illegal.check_bridge === CheckBridge.Paid && illegalIsNotEmpty(illegal)
  );
  const bridgeFailInfo: ReceiptDealOperateIllegal | undefined = illegalList.find(
    illegal => illegal.check_bridge === CheckBridge.HasBridge && illegalIsNotEmpty(illegal)
  );
  const inverseFailInfo: ReceiptDealOperateIllegal | undefined = illegalList.find(
    illegal => illegal.check_bridge === CheckBridge.Inverse && illegalIsNotEmpty(illegal)
  );

  const sorSendFailInfo: ReceiptDealOperateIllegal | undefined = illegalList.find(
    illegal => illegal.check_bridge === CheckBridge.SorSentModified && illegalIsNotEmpty(illegal)
  );

  if (paidFailInfo != null) {
    await showPaidModalAndContinue(paidFailInfo);
  }

  if (submitFailInfo != null) {
    await showSubmitModalAndContinue(submitFailInfo);
  }

  if (bridgeFailInfo != null) {
    await showAlreadyHasBridgeModalAndContinue(bridgeFailInfo);
  }

  if (sorSendFailInfo != null) {
    await showSorSendModalAndContinue(sorSendFailInfo);
  }

  let needContinue = false;

  if (inverseFailInfo != null) {
    needContinue = await showInverseAndContinue(inverseFailInfo);
  }

  return {
    submitFailInfo,
    paidFailInfo,
    bridgeFailInfo,
    inverseFailInfo,
    needContinue,
    hasError: submitFailInfo != null || bridgeFailInfo != null || inverseFailInfo != null
  };
};

export const deleteCheckSubmitted = (dealList: ReceiptDealDetailForAdd[], curInstId?: string) => {
  const submittedDeals = dealList.filter(deal => dealHasBeSubmitted(deal, { curInstId }));

  const submittedOrderNos = submittedDeals
    .map(
      i =>
        i.details?.filter(
          d =>
            Boolean(d.order_no) &&
            (d.bid_trade_info.inst?.inst_id === curInstId || d.ofr_trade_info.inst?.inst_id === curInstId)
        )
    )
    .reduce((cur, next) => {
      return [...cur, ...(next ?? []).map(i => i.order_no ?? '')];
    }, [] as string[]);

  const submitFailInfo =
    submittedOrderNos.length === 0
      ? undefined
      : {
          check_bridge: CheckBridge.Submitted,
          order_no_list: submittedOrderNos
        };

  if (submitFailInfo != null) {
    showHasSubmitModal(submitFailInfo);
  }

  return submittedDeals.length === dealList.length;
};

const addBridge = async ({
  bridgeInst,
  internalCodeList = [],
  dealList = [],
  refetch,
  fromDetail,
  productType,
  targetDealIds,
  operationType = DealOperationType.DOTAddBridge,
  needPreCheckHasBridge = false
}: {
  bridgeInst?: BridgeInstInfo;
  internalCodeList?: string[];
  // 父成交单仅用于前置校验
  dealList?: ReceiptDealDetailForAdd[];
  refetch?: VoidFunction;
  fromDetail?: boolean;
  productType: ProductType;
  // 指定拆单的子成交单
  targetDealIds?: string[];
  operationType?: DealOperationType;
  needPreCheckHasBridge?: boolean;
}) => {
  if (miscStorage.userInfo?.post === Post.Post_DI) {
    message.error('当前岗位无加桥权限！');
    return;
  }
  if (bridgeInst?.is_valid === false) {
    showCRMChangedModal();
    return;
  }
  let filteredDealList = dealList.filter(d => {
    const related = getRelatedBridgeInstIds(d);

    return bridgeInst == null || !related?.includes(bridgeInst?.contact_inst.inst_id ?? '');
  });
  // 若:1.选中包含无桥但真实对手方已点亮代付机构标识;2.选中成交单中有已提交的，则跳过此条明细，并弹窗提示
  filteredDealList = preCheckForAddBridge(filteredDealList, needPreCheckHasBridge, targetDealIds ?? []);

  if (filteredDealList.length === 0 && (internalCodeList ?? []).length === 0) return;

  if (!(await preCheckReset(filteredDealList, { childIds: targetDealIds ?? [] }))) return;

  const params: ReceiptDealAddBridge.Request = {
    internal_code_list: internalCodeList,
    bridge_inst_id: bridgeInst?.bridge_inst_id ?? '0',
    receipt_deal_id_list: targetDealIds?.filter(i =>
      filteredDealList.some(parent => parent.details?.some(child => child.receipt_deal_id === i))
    ),
    is_skip_check: false,
    product_type: productType,
    operation_info: {
      operator: miscStorage.userInfo?.user_id ?? '',
      operation_type: operationType,
      operation_source: fromDetail
        ? OperationSource.OperationSourceReceiptDealDetail
        : OperationSource.OperationSourceReceiptDealBridge
    }
  };
  try {
    const response = await mulReceiptBridgeAdd(params);
    const { paidFailInfo, submitFailInfo, bridgeFailInfo, needContinue, hasError } = await checkIllegalList(
      response.receipt_deal_operate_illegal_list ?? []
    );

    const filteredInternalCodeList = internalCodeList.filter(
      code =>
        !bridgeFailInfo?.internal_code_list?.includes(code) &&
        !paidFailInfo?.internal_code_list?.includes(code) &&
        !submitFailInfo?.internal_code_list?.includes(code)
    );

    if (needContinue && hasError && ((targetDealIds ?? []).length > 0 || filteredInternalCodeList.length > 0)) {
      const filteredParams: ReceiptDealAddBridge.Request = {
        internal_code_list: filteredInternalCodeList,
        bridge_inst_id: bridgeInst?.bridge_inst_id ?? '0',
        is_skip_check: true,
        product_type: productType,
        receipt_deal_id_list: targetDealIds,
        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type: operationType,
          operation_source: fromDetail
            ? OperationSource.OperationSourceReceiptDealDetail
            : OperationSource.OperationSourceReceiptDealBridge
        }
      };

      await mulReceiptBridgeAdd(filteredParams);
    }
    refetch?.();
  } catch (e: any) {
    if (e?.data?.base_response?.code === StatusCode.ConcurrentCheckError) {
      showConcurrentCheckModal();
    }
    if (e?.data?.base_response?.code === 24046) {
      message.error('当前岗位无加桥权限！');
    }
  }
};

export const addBridgeByInternalCode = async ({
  bridgeInst,
  internalCodeList = [],
  refetch,
  productType
}: {
  bridgeInst: BridgeInstInfo;
  internalCodeList?: string[];
  refetch?: VoidFunction;
  productType: ProductType;
}) => {
  addBridge({
    bridgeInst,
    internalCodeList,
    refetch,
    fromDetail: false,
    productType
  });
};

export const addSingleBridge = async ({
  bridgeInst,
  dealList = [],
  refetch,
  fromDetail,
  productType
}: {
  bridgeInst?: BridgeInstInfo;
  dealList?: ReceiptDealDetailForAdd[];
  refetch?: VoidFunction;
  fromDetail?: boolean;
  productType: ProductType;
}) => {
  addBridge({
    bridgeInst,
    dealList,
    refetch,
    fromDetail,
    targetDealIds: dealList.map(d => d.details?.[0].receipt_deal_id ?? ''),
    productType,
    needPreCheckHasBridge: true
  });
};

export const addBridgeByChildDealId = async ({
  bridgeInst,
  parentDeal,
  refetch,
  targetDealIds,
  fromDetail,
  productType
}: {
  bridgeInst?: BridgeInstInfo;
  parentDeal: ReceiptDealDetailForAdd;
  refetch?: VoidFunction;
  targetDealIds: string[];
  fromDetail?: boolean;
  productType: ProductType;
}) => {
  if ((parentDeal.details ?? []).length >= 9) {
    message.error('加桥已达上限，不可提交');
    return;
  }
  addBridge({
    bridgeInst,
    dealList: [parentDeal],
    refetch,
    fromDetail,
    targetDealIds,
    productType,
    operationType: DealOperationType.DOTAddDoubleBridge
  });
};

export enum DelBridgeType {
  Single,
  Bid,
  Ofr
}

// 判断当前成交明细有几个桥
export const getBridgeNumber = (details?: ReceiptDeal[]) => {
  if (!details?.length) return 0;
  return (details.length || 1) - 1;
};

export const deleteBridge = async ({
  type,
  curInstId,
  dealList,
  refetch,
  fromDetail
}: {
  // 直接指定删桥操作类型，或给定当前机构id来计算
  type?: DelBridgeType;
  curInstId?: string;
  dealList: ReceiptDealDetail[];
  refetch?: VoidFunction;
  fromDetail?: boolean;
}) => {
  if (deleteCheckSubmitted(dealList, curInstId)) return;
  const params: ReceiptDealBridgeDelete.Request = {
    receipt_deal_ids_list: dealList.map(dealDetail => {
      if (type != null) {
        if (getBridgeNumber(dealDetail.details) === 1 && type === DelBridgeType.Single) {
          const receiptDealList = dealDetail.details?.map(item => item.receipt_deal_id);
          return { receipt_deal_id: receiptDealList };
        }

        let receiptDealList: string[];
        if (type === DelBridgeType.Bid) {
          receiptDealList = dealDetail.details?.map(item => item.receipt_deal_id).slice(0, 2) || [];
        } else {
          receiptDealList = dealDetail.details?.map(item => item.receipt_deal_id).slice(-2) || [];
        }
        return {
          receipt_deal_id: receiptDealList
        };
      }

      return {
        receipt_deal_id: (dealDetail.details ?? [])
          .filter(i => [i.bid_trade_info.inst?.inst_id, i.ofr_trade_info.inst?.inst_id].includes(curInstId))
          .map(i => i.receipt_deal_id)
      };
    }),
    operation_info: {
      operator: miscStorage.userInfo?.user_id ?? '',
      operation_type: DealOperationType.DOTDeleteBridge,
      operation_source: fromDetail
        ? OperationSource.OperationSourceReceiptDealDetail
        : OperationSource.OperationSourceReceiptDealBridge
    }
  };
  try {
    const response = await deleteBridgeReceiptDealFromDealDetails(params, {
      hideErrorMessage: true
    });

    await checkIllegalList(response.receipt_deal_operate_illegal_list ?? []);
  } catch (error: any) {
    if (error?.data?.base_response?.code === StatusCode.ConcurrentCheckError) {
      showConcurrentCheckModal();
    } else toastRequestError(error);
  }
  refetch?.();
};

export const changeBridge = async ({
  dealList,
  bridgeInst,
  currentInstId,
  refetch,
  fromDetail
}: {
  dealList: ReceiptDealDetail[];
  bridgeInst: BridgeInstInfo;
  currentInstId: string;
  side?: Side;
  refetch?: VoidFunction;
  fromDetail?: boolean;
}) => {
  if (!bridgeInst.is_valid) {
    showCRMChangedModal();
    return;
  }
  const filteredList = dealList.filter(d => {
    const related = getRelatedBridgeInstIds(d);

    return !related?.includes(bridgeInst.contact_inst.inst_id);
  });

  if (filteredList.length === 0) return;

  if (!(await preCheckReset(filteredList, { curInstId: currentInstId }))) return;

  const params: ReceiptDealChangeBridge.Request = {
    parent_deal_ids: filteredList.map(item => item.parent_deal.parent_deal_id || ''),
    bridge_inst_id: bridgeInst.bridge_inst_id,
    is_skip_check: false,
    current_inst_id: currentInstId,
    operation_info: {
      operator: miscStorage.userInfo?.user_id ?? '',
      operation_type: DealOperationType.DOTChangeBridge,
      operation_source: fromDetail
        ? OperationSource.OperationSourceReceiptDealDetail
        : OperationSource.OperationSourceReceiptDealBridge
    }
  };

  try {
    const response = await mulReceiptBridgeChange(params);

    const { needContinue } = await checkIllegalList(response.receipt_deal_operate_illegal_list ?? []);

    if (needContinue) {
      await mulReceiptBridgeChange({ ...params, is_skip_check: true });
    }

    refetch?.();
  } catch (e: any) {
    if (e?.data?.base_response?.code === 24046) {
      message.error('当前岗位无换桥权限！');
    }
  }
};

export enum BridgeErrorCode {
  AddBridgeInstDuplicatedContact = 24045
}
