import { useRef } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource, Side } from '@fepkg/services/types/bds-enum';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { ReceiptDealUpdateBridgeV2 } from '@fepkg/services/types/receipt-deal/update-bridge-v2';
import { useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { groupBy, last } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useLogger } from '@/common/providers/LoggerProvider';
import { updateBridges } from '@/common/services/api/bridge/bridges-update';
import { fetchPayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee';
import { logger } from '@/common/utils/logger';
import { miscStorage } from '@/localdb/miscStorage';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { SingBridgeFormState, SingleModalInitialStateV2, Source } from '../types';
import {
  checkBridgeUpdate,
  checkReceiptDealStatus,
  getFee,
  getSingleBridgeSubmitDiffParams,
  transformSingleParamsV2
} from '../utils';

export const MAX_SEND_INST_GROUP = 10;

type SendInstType = { inst?: InstitutionTiny; volume?: string };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const EditBridgeContainer = createContainer((initialState: SingleModalInitialStateV2) => {
  const { defaultValue, defaultSendMsg, firstMaturityDate } = initialState;
  const { bidDealTime, ofrDealTime } = defaultValue;

  const sendInstContainerRef = useRef<HTMLDivElement>(null);

  const bidCost = useRef<number>();
  const ofrCost = useRef<number>();

  const fromDetail = initialState?.source === Source.Detail;

  const { getLogContext, wrapperSubmit } = useLogger();

  const spanName = TraceName.BRIDGE_EDIT_WITH_SINGLE_ONE;

  const ctx = () => getLogContext(spanName);

  const [formState, setFormState] = useImmer<SingBridgeFormState>(transformSingleParamsV2(defaultValue));

  /** 更新单个字段 */
  const updateFormState = useMemoizedFn(<T extends keyof SingBridgeFormState>(key: T, val: SingBridgeFormState[T]) => {
    setFormState(draft => {
      draft[key] = val;
    });
  });

  // 发单机构组错误状态
  const [error, setError] = useImmer<{ [Side.SideBid]: boolean[][]; [Side.SideOfr]: boolean[][] }>({
    [Side.SideBid]: new Array(10).fill(1).map(_ => [false, false]),
    [Side.SideOfr]: new Array(10).fill(1).map(_ => [false, false])
  });

  /** 获取代付机构的费用信息 */
  useQuery({
    queryKey: [APIs.deal.payForInstFeeGet, formState.bidInst?.inst_id, formState.ofrInst?.inst_id] as const,
    queryFn: async ({ signal }) => {
      const res = await fetchPayForInstFee(
        { inst_id_list: [formState.bidInst?.inst_id, formState.ofrInst?.inst_id].filter(Boolean) },
        { signal }
      );
      return res.pay_for_inst_with_fee_list;
    },
    enabled: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: Infinity,
    onSuccess: data => {
      const feeGroupByInstId = groupBy(data, 'inst_id');

      if (formState.bidInst?.inst_id) {
        bidCost.current = getFee(
          feeGroupByInstId[formState.bidInst.inst_id]?.[0]?.fee_list,
          firstMaturityDate,
          bidDealTime
        );
      }
      if (formState.ofrInst?.inst_id) {
        ofrCost.current = getFee(
          feeGroupByInstId[formState.ofrInst.inst_id]?.[0]?.fee_list,
          firstMaturityDate,
          ofrDealTime
        );
      }
    }
  });

  /** 提交编辑 */
  const submit = async () => {
    if (!initialState?.parentDealId) return false;
    logger.ctxInfo(ctx(), `[bridgeUpdate] start submit, parentDealId=${initialState.parentDealId}`);

    const buildParams: ReceiptDealUpdateBridgeV2.Request = {
      parent_deal_id: initialState.parentDealId,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyBridgeInfo,
        operation_source: fromDetail
          ? OperationSource.OperationSourceReceiptDealDetail
          : OperationSource.OperationSourceReceiptDealBridge
      }
    };

    const result = checkBridgeUpdate(
      formState.bidSendOrderInstList,
      formState.ofrSendOrderInstList,
      initialState.volume
    );

    if (result !== true) {
      logger.ctxInfo(ctx(), '[bridgeUpdate] check failed');
      setError(result);
      return false;
    }

    if (initialState.defaultValue.bidIsPaid !== formState.bidIsPaid) {
      buildParams.flag_bid_pay_for_inst = formState.bidIsPaid;
    }

    if (initialState.defaultValue.ofrIsPaid !== formState.ofrIsPaid) {
      buildParams.flag_ofr_pay_for_inst = formState.ofrIsPaid;
    }

    const diffParams = getSingleBridgeSubmitDiffParams(initialState, formState);

    const mergeParams = { ...buildParams, update_bridge_info_list: diffParams };

    logger.ctxInfo(ctx(), `[bridgeUpdate] request to server, req=${JSON.stringify(mergeParams)}`);

    const flagPayForInstChanged = 'flag_bid_pay_for_inst' in buildParams || 'flag_ofr_pay_for_inst' in buildParams;

    if (flagPayForInstChanged) {
      const checkReceiptDealIds: string[] = [];
      if ('flag_ofr_pay_for_inst' in buildParams) checkReceiptDealIds.push(last(diffParams)?.receipt_deal_id ?? '');
      if ('flag_bid_pay_for_inst' in buildParams) checkReceiptDealIds.push(diffParams[0]?.receipt_deal_id ?? '');
      const pass = await checkReceiptDealStatus([initialState.parentDealId], checkReceiptDealIds);
      if (!pass) return false;
    }

    const res = await updateBridges(mergeParams, { traceCtx: ctx() });

    checkIllegalList(res.receipt_deal_operate_illegal_list ?? []);

    return true;
  };

  // 更新发单机构
  const updateSendInst = useMemoizedFn((side: Side, value: SendInstType, index: number) => {
    const field = side === Side.SideBid ? 'bidSendOrderInstList' : 'ofrSendOrderInstList';
    const prev = formState[field][index];

    setFormState(draft => {
      // 防止数组越界
      if (draft[field].length > index) draft[field][index] = { ...prev, ...value };
    });
  });

  /** 添加发单机构 */
  const addSendInst = (side: Side) => {
    const field = side === Side.SideBid ? 'bidSendOrderInstList' : 'ofrSendOrderInstList';
    if (formState[field].length >= MAX_SEND_INST_GROUP) return;
    setFormState(draft => {
      draft[field] = [...formState[field], {}];
    });
    requestIdleCallback(() => {
      sendInstContainerRef.current?.scrollTo({ top: sendInstContainerRef.current.scrollHeight, behavior: 'auto' });
    });
  };

  /** 删除发单机构 */
  const deleteSendInst = (side: Side, index: number) => {
    const field = side === Side.SideBid ? 'bidSendOrderInstList' : 'ofrSendOrderInstList';
    const updateData = formState[field].filter((_, i) => i !== index);
    setFormState(draft => {
      draft[field] = updateData;
    });

    const prevError: boolean[][] = error[side];
    const currentError = prevError.map((v, i) => (i === index ? [false, false] : [v[0], false]));
    setError(draft => {
      draft[side] = currentError;
    });
  };

  const updateCost = (side: Side) => {
    const sendPayFiled = side === Side.SideBid ? 'bidSendPay' : 'ofrSendPay';

    const isPaidFiled = side === Side.SideBid ? 'bidIsPaid' : 'ofrIsPaid';
    const cost = side === Side.SideBid ? bidCost.current : ofrCost.current;

    /** 联动点亮代 */
    if (cost) updateFormState(isPaidFiled, true);

    updateFormState(sendPayFiled, cost);
  };

  /** 计算费用 */
  const handleRateClick = async (side: Side) => {
    updateCost(side);
  };

  const handleSubmit = async () => {
    const response = await wrapperSubmit(spanName, submit);
    return response;
  };

  return {
    defaultSendMsg,
    formState,
    sendInstContainerRef,

    error,
    setError,

    updateFormState,
    submit: handleSubmit,
    updateSendInst,
    addSendInst,
    deleteSendInst,
    updateCost,
    handleRateClick
  };
});

export const EditBridgeProvider = EditBridgeContainer.Provider;
export const useEditBridge = EditBridgeContainer.useContainer;
