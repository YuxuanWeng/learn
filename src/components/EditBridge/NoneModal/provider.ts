import { useRef } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message } from '@fepkg/components/Message';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource, Side } from '@fepkg/services/types/bds-enum';
import { InstitutionTiny, SendOrderInstInfo } from '@fepkg/services/types/common';
import { ReceiptDealUpdateNonBridge } from '@fepkg/services/types/receipt-deal/update-non-bridge';
import { useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { groupBy } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { updateNoneBridge } from '@/common/services/api/bridge/none-bridge-update';
import { fetchPayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { NoneModalInitialState, Source } from '../types';
import { checkReceiptDealStatus, getFee, getNoneBridgeSubmitDiffParams, transformNoneParams } from '../utils';

export const MAX_SEND_INST_GROUP = 10;

type SendInstType = { inst?: InstitutionTiny; volume?: string };

type Params = Omit<NoneModalInitialState, 'sendOrderInst'> & {
  sendOrderInst: SendInstType[];
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const NoneBridgeContainer = createContainer((initialState: NoneModalInitialState) => {
  const { productType } = useProductParams();
  const defaultValue = transformNoneParams(productType, initialState);
  const [formState, setFormState] = useImmer<Params>(defaultValue);

  const { firstMaturityDate, dealTime } = defaultValue;

  const sendMsgChanged = useRef(false);

  const sendInstContainerRef = useRef<HTMLDivElement>(null);
  const fromDetail = initialState.source === Source.Detail;

  const bidCost = useRef<number>();
  const ofrCost = useRef<number>();

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
          dealTime
        );
      }
      if (formState.ofrInst?.inst_id) {
        ofrCost.current = getFee(
          feeGroupByInstId[formState.ofrInst.inst_id]?.[0]?.fee_list,
          firstMaturityDate,
          dealTime
        );
      }
    }
  });

  // 发单机构组错误状态
  const [error, setError] = useImmer<boolean[][]>(new Array(10).fill(1).map(_ => [false, false]));

  /** 更新单个字段 */
  const updateFormState = useMemoizedFn(<T extends keyof Params>(key: T, val: Params[T]) => {
    setFormState(draft => {
      draft[key] = val;
    });
  });

  const updateCost = (side: Side) => {
    const cost = side === Side.SideBid ? ofrCost.current : bidCost.current;
    updateFormState('cost', cost);
  };

  /** 单条编辑校验 */
  const check = (sendOrderInstList?: SendInstType[]) => {
    if (initialState?.volume === undefined) return true;

    const validList =
      sendOrderInstList?.filter(v => !!v.inst?.inst_id || (v.volume !== undefined && v.volume !== '')) ?? [];

    let countError = false;
    const count = validList.reduce((acc, cur) => acc + Number(cur.volume ?? 0) * 1000, 0);
    if (validList.length && count !== initialState.volume) {
      const currError = error.map((v, i) => [v[0], validList[i]?.volume !== undefined]);
      setError(currError);
      countError = true;
    }

    // 检查是否有空值
    let instError = false;
    let volumeError = false;
    for (const [i, v] of validList.entries()) {
      if (!v.inst?.inst_id) {
        setError(draft => {
          draft[i][0] = true;
        });
        instError = true;
      }
      if (v.volume === undefined) {
        setError(draft => {
          draft[i][1] = true;
        });
        volumeError = true;
      }
    }

    const isPass = !(countError || instError || volumeError);
    if (!isPass) {
      const errorMsg: string[] = [];
      if (countError) errorMsg.push('发单量合计与成交量不一致！');
      else if (volumeError) errorMsg.push('发单量不可为空！');
      if (instError) errorMsg.push('发单机构不可为空！');
      message.error(errorMsg.join(' '));
    }
    return isPass;
  };

  /** 添加发单机构 */
  const addSendInst = () => {
    if ((formState.sendOrderInst?.length || 0) >= MAX_SEND_INST_GROUP) return;
    setFormState(draft => {
      draft.sendOrderInst = [...(draft.sendOrderInst ?? []), {}];
    });
    requestIdleCallback(() => {
      sendInstContainerRef.current?.scrollTo({ top: sendInstContainerRef.current.scrollHeight, behavior: 'auto' });
    });
  };

  /** 删除发单机构 */
  const deleteSendInst = (index: number) => {
    const updateData = formState.sendOrderInst?.filter((_, i) => i !== index);
    setFormState(draft => {
      draft.sendOrderInst = updateData;
    });
    const currentError = error.map((v, i) => (i === index ? [false, false] : [v[0], false]));
    setError(currentError);
  };

  /** 提交编辑 */
  const submit = async () => {
    if (!check(formState.sendOrderInst)) return false;
    const params: ReceiptDealUpdateNonBridge.Request = {
      parent_deal_id: initialState.parentDealId,
      send_msg: formState.sendMsg,
      channel: formState.channel,
      hide_comment: formState.hideComment,
      fee: formState.cost ? Number(formState.cost) : SERVER_NIL,
      send_msg_comment: formState.sendMsgComment,
      send_order_inst_info_list: formState.sendOrderInst
        ?.filter(v => !!v.inst?.inst_id || !!v.volume)
        .map(
          v => ({ inst_id: v.inst?.inst_id, volume: (v.volume ? Number(v.volume) : 0) * 1000 }) as SendOrderInstInfo
        ),

      direction: formState.direction,

      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyBridgeInfo,
        operation_source: fromDetail
          ? OperationSource.OperationSourceReceiptDealDetail
          : OperationSource.OperationSourceReceiptDealBridge
      }
    };
    const diffData = getNoneBridgeSubmitDiffParams(initialState, params);

    diffData.flag_bid_pay_for_inst = formState.bidIsPaid;
    diffData.flag_ofr_pay_for_inst = formState.ofrIsPaid;
    diffData.flag_bridge_info_changed = true;

    const bidPayForInstFlagChanged = defaultValue.bidIsPaid !== formState.bidIsPaid;
    const ofrPayForInstFlagChanged = defaultValue.ofrIsPaid !== formState.ofrIsPaid;
    const flagPayForInstChanged = bidPayForInstFlagChanged || ofrPayForInstFlagChanged;

    if (bidPayForInstFlagChanged || ofrPayForInstFlagChanged) {
      if (formState.bidIsPaid === false && formState.ofrIsPaid === false) diffData.fee = SERVER_NIL;
    }

    if (flagPayForInstChanged) {
      const checkReceiptDealIds: string[] = [initialState.receiptDealId];
      const pass = await checkReceiptDealStatus([initialState.parentDealId], checkReceiptDealIds);
      if (!pass) return false;
    }

    await updateNoneBridge(diffData);
    return true;
  };

  // 更新发单机构
  const updateSendInst = useMemoizedFn((value: SendInstType, index: number) => {
    const prev = formState.sendOrderInst?.[index];
    setFormState(draft => {
      if (draft.sendOrderInst?.[index]) draft.sendOrderInst[index] = { ...prev, ...value };
    });
  });

  return {
    formState,
    updateSendInst,
    updateCost,

    sendInstContainerRef,
    error,
    setError,

    sendMsgChanged,

    submit,
    updateFormState,
    addSendInst,
    deleteSendInst
  };
});

export const NoneBridgeProvider = NoneBridgeContainer.Provider;
export const useNoneBridge = NoneBridgeContainer.useContainer;
