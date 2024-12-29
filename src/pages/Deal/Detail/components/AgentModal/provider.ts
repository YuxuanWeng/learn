import { useEffect, useMemo, useRef, useState } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { APIs } from '@fepkg/services/apis';
import { PayForInst, PayForInstFee } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { useEventListener } from 'ahooks';
import { difference, every, intersection } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { fetchPayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee';
import { updatePayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee-update';
import { fetchPayForInstList } from '@/common/services/api/deal/pay-for-inst-get';
import { updatePayForInstState } from '@/common/services/api/deal/pay-for-inst-update';
import { useDealPanel } from '../../provider';
import { checkDayIsValid, checkYearIsValid, formatTermWithYD, getGapNumbers } from '../../utils';

export type FeeType = Omit<PayForInstFee, 'fee'> & {
  fee: string | number;
  key: string;
  idx?: number;
};

const formatFee = (val?: string | number) => {
  if (val === undefined || val === '') return undefined;
  return Number(val);
};

export const AgencyContainer = createContainer(() => {
  const [agencyOptions, setAgencyOptions] = useState<PayForInst[]>(); // 代付机构列表
  const [selectId, setSelectId] = useState<string | undefined>(); // 当前选中的代付机构信息

  const instMapRef = useRef<Record<string, HTMLDivElement>>({});

  const [changeAgentModalVisible, setChangeAgentModalVisible] = useState(false); // 变更代付机构Modal

  const { agentVisible } = useDealPanel();

  const [costIsEditing, setCostIsEditing] = useState(false); // 费用列表编辑状态

  const [costList, setCostList] = useImmer<FeeType[] | undefined>([]); // 费用列表

  const [errorIdx, setErrorIdx] = useState<number>();
  const [errorType, setErrorType] = useState<'term' | 'rate'>();

  const agentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCostIsEditing(false);
  }, [selectId]);

  /** 构造一个提交费用的数据 */
  const formatCostList = useMemo(() => {
    return costList
      ?.map((cost, idx) => ({ ...cost, fee: formatFee(cost.fee), idx }))
      .filter(cost => !!cost.start || !!cost.end || cost.fee !== undefined);
  }, [costList]);

  /** 获取代付机构 */
  const agent = useQuery({
    queryKey: [APIs.deal.payForInstGet, agentVisible] as const,
    queryFn: async ({ signal }) => {
      const result = await fetchPayForInstList(
        {
          product_type: ProductType.BNC,
          // 当前offset和count服务端都是忽略的，根据产品的描述，代付机构数量不需要分页
          offset: SERVER_NIL,
          count: SERVER_NIL
        },
        { signal }
      );
      return result.pay_for_inst_list;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    onSuccess: data => {
      setAgencyOptions(data);
      if (data?.length && (!selectId || !data?.some(v => v.inst_id === selectId))) {
        setSelectId(data[0].inst_id);
      }
    }
  });

  /** 获取代付机构的费用信息 */
  const costs = useQuery({
    queryKey: [APIs.deal.payForInstFeeGet, selectId, agentVisible] as const,
    queryFn: async ({ signal }) => {
      if (!selectId) return [];
      const res = await fetchPayForInstFee({ inst_id_list: [selectId] }, { signal });
      return res.pay_for_inst_with_fee_list?.[0]?.fee_list ?? [];
    },
    enabled: !!selectId && agentVisible,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: Infinity,
    onSuccess: data => {
      if (!data) return;
      setCostList(data.map(v => ({ ...v, key: uuidv4() })));
    }
  });

  /** 新增/删除代付机构 */
  const batchUpdate = async (instIds: string[]) => {
    const prevIds = agencyOptions?.map(v => v.inst_id) ?? [];
    const notChanged = intersection(instIds, prevIds ?? []);
    const addIds = difference(instIds, notChanged);
    const removeIds = difference(prevIds, notChanged);

    // 乐观更新
    const newOptions = agencyOptions?.filter(v => !removeIds.includes(v.inst_id));
    if (!newOptions?.length) setCostList([]);
    setAgencyOptions(newOptions);

    // 更新选中的值
    if (selectId && removeIds.includes(selectId)) {
      setSelectId(newOptions?.[0]?.inst_id);
    }

    await updatePayForInstState({
      update_structs: [
        ...addIds.map(v => ({ inst_id: v, is_pay_for_status: true })),
        ...removeIds.map(v => ({ inst_id: v, is_pay_for_status: false }))
      ]
    });

    agent.refetch();
    setChangeAgentModalVisible(false);
  };

  /** 删除一条代付机构 */
  const deleteInst = async (instId: string) => {
    if (instId === selectId) {
      const index = agencyOptions?.findIndex(v => v.inst_id === instId);
      if (index && index >= 1) setSelectId(agencyOptions?.[index - 1].inst_id);
      else setSelectId(agencyOptions?.filter(v => v.inst_id !== instId)?.[0]?.inst_id);
    }
    await updatePayForInstState({ update_structs: [{ inst_id: instId, is_pay_for_status: false }] });

    agent.refetch();
  };

  /** 删除 */
  const del = (idx: number) => {
    setCostList(draft => {
      return draft?.filter((_, i) => i !== idx);
    });
  };

  /** 更新 */
  const update = (idx: number, type: 'start' | 'end' | 'fee', val: string) => {
    if (type === 'start' || type === 'end') setErrorIdx(void 0);
    else setErrorType(void 0);
    setCostList(draft => {
      if (!draft) return;
      draft[idx][type] = val;
    });
  };

  /** 新增 */
  const add = () => {
    setCostList(draft => {
      const patch = { start: '', end: '', fee: '', key: uuidv4() };
      if (!draft) draft = [patch];
      else draft.push(patch);
    });
  };

  /** 判断期限倒挂 */
  const check = () => {
    if (!formatCostList?.length) return true;

    let terms: number[] = [];

    let idx = 0;
    let type: 'term' | 'rate' = 'term';

    const isValid = every(formatCostList, cost => {
      const { start, end, fee } = cost;

      idx = cost.idx;
      type = 'term';

      // case 1: 判断期限为空
      if (!start || !end) {
        message.error(`保存失败，第${idx + 1}行期限为空`);
        return false;
      }

      // case 2: 判断费用为空
      if ((start || end) && fee === undefined) {
        type = 'rate';
        message.error(`保存失败，第${idx + 1}行费用为空`);
        return false;
      }

      // case 3: 判断期限输入格式 天: 整数 && <= 365, 年: xx.xx * 365（四舍五入）
      if (!checkYearIsValid(start) || !checkYearIsValid(end) || !checkDayIsValid(start) || !checkDayIsValid(end)) {
        message.error(`保存失败，第${idx + 1}行期限输入格式有误`);
        return false;
      }

      // case 4: 判断期限倒挂
      const prev = formatTermWithYD(start);
      const next = formatTermWithYD(end);

      const gap = getGapNumbers(prev, next);
      const isOverlap = gap.some(item => terms.includes(item)); // 是否有重叠

      if (prev >= next) {
        message.error(`保存失败，第${idx + 1}行期限倒挂`);
        return false;
      }

      // case 5: 判断区间是否有重叠
      if (isOverlap) {
        message.error('保存失败，条目区间有重叠');
        return false;
      }
      terms = [...terms, ...gap];
      return true;
    });

    setErrorIdx(!isValid ? idx : void 0);
    setErrorType(!isValid ? type : void 0);

    return isValid;
  };

  /** 重新排序 */
  const reSort = () => {
    setCostList(draft => {
      draft?.sort((a, b) => {
        return formatTermWithYD(a.start) - formatTermWithYD(b.start);
      });
    });
  };

  /** 保存 */
  const save = async () => {
    if (!check()) return;
    if (!selectId) return;
    await updatePayForInstFee({
      inst_id: selectId,
      pay_for_inst_fee_list: (formatCostList || []) as PayForInstFee[]
    });
    setCostIsEditing(false);
    agent.refetch();
    costs.refetch();
    reSort();
  };

  const handleSelectInstId = (instId: string) => {
    if (selectId !== instId && costIsEditing) {
      const instName = agencyOptions?.find(v => v.inst_id === selectId)?.short_name;
      ModalUtils.warning({
        title: '编辑未保存',
        content: `${instName ?? ''}的费率设置未保存，确认离开吗？`,
        className: 'rounded-xl',
        getContainer: () => document.querySelector('.approval-detail-drawer') ?? document.body,
        keyboard: false,
        onOk: () => {
          setSelectId(instId);
        }
      });
      return;
    }
    setSelectId(instId);
  };

  const handleKeydown = (evt: KeyboardEvent) => {
    if (evt.key !== KeyboardKeys.ArrowDown && evt.key !== KeyboardKeys.ArrowUp) return;
    evt.stopPropagation();

    if (!agencyOptions?.length) return;

    const currentIdx = agencyOptions?.findIndex(v => v.inst_id === selectId);
    if (currentIdx === undefined) {
      setSelectId(agencyOptions?.[0]?.inst_id);
      return;
    }

    let index = 0;

    // 选中下一个
    if (evt.key === KeyboardKeys.ArrowDown) index = Math.min(currentIdx + 1, agencyOptions.length - 1);

    // 选中上一个
    if (evt.key === KeyboardKeys.ArrowUp) index = Math.max(currentIdx - 1, 0);

    const current = agencyOptions.find((_, i) => i === index);

    if (current?.inst_id) {
      const currentTrader = instMapRef.current[current.inst_id];
      if (currentTrader) currentTrader.scrollIntoView({ block: 'nearest' });
    }

    setSelectId(current?.inst_id);
  };

  useEventListener('keydown', handleKeydown);

  return {
    instMapRef,
    agentContainerRef,

    /** 代付机构列表 */
    agencyOptions,

    /** 变更需代付机构Modal visible */
    changeAgentModalVisible,
    setChangeAgentModalVisible,

    selectId,

    /** 代付机构操作 */
    batchUpdate,
    deleteInst,

    /** 费用列表编辑状态 */
    costIsEditing,
    setCostIsEditing,

    /** 费用列表 */
    costList,
    errorIdx,
    errorType,
    setErrorIdx,
    setErrorType,

    /** 费率操作 */
    costs,
    del,
    add,
    save,
    reSort,
    update,
    setCostList,
    setAgencyOptions,

    handleSelectInstId
  };
});

export const AgencyProvider = AgencyContainer.Provider;
export const useAgency = AgencyContainer.useContainer;
