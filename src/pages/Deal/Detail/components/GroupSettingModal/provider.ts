import { useMemo, useRef, useState } from 'react';
import { getCP } from '@fepkg/business/utils/get-name';
import { message } from '@fepkg/components/Message';
import { APIs } from '@fepkg/services/apis';
import { Trader } from '@fepkg/services/types/bdm-common';
import {
  Enable,
  InstStatus,
  JobStatus,
  ProductType,
  TraderUsageStatus,
  UsageStatus
} from '@fepkg/services/types/bdm-enum';
import { DealGroupCombinationList } from '@fepkg/services/types/deal/group-combination-list';
import { useQuery } from '@tanstack/react-query';
import { difference, groupBy, intersection, trim } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { fetchGroupCombinationAdd } from '@/common/services/api/deal/group-combination-add';
import { fetchGroupCombinationList } from '@/common/services/api/deal/group-combination-list';
import { fetchGroupCombinationUpdate } from '@/common/services/api/deal/group-combination-update';
import { TraderTinyWithInst } from '@/components/business/SearchInstTrader/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { useDealPanel } from '../../provider';

/** 根据交易员和机构的各个状态判断该数据是否为有效状态 */
const getCPInvalid = (trader?: Trader, productType?: ProductType): boolean => {
  const traderProducts = trader?.biz_product_list?.map(i => i.product_type) ?? [];
  const instProducts = trader?.inst_info?.product_list?.map(i => i.product_type) ?? [];

  // 满足以下任一条件则视为无效
  const invalid =
    // 没有交易员
    !trader ||
    // 交易员为启用状态
    trader.usage_status !== TraderUsageStatus.TraderEnable ||
    // 交易员为在职状态
    trader.job_status !== JobStatus.OnJob ||
    // 有业务产品
    !productType ||
    // 交易员有当前业务产品
    !traderProducts.includes(productType) ||
    // 机构有当前业务产品
    !instProducts.includes(productType) ||
    // 机构为在业
    trader.inst_info?.usage_status !== UsageStatus.Using ||
    // 机构为启用
    trader.inst_info.inst_status !== InstStatus.StartBiz;

  return invalid;
};

export type GroupsType = Omit<DealGroupCombinationList.GroupCombination, 'trader_info_list'> & {
  trader_info_list?: TraderTinyWithInst[];
};

export const GroupConfigContainer = createContainer(() => {
  const [groups, setGroups] = useState<GroupsType[]>([]);
  const [selected, setSelected] = useState<string | undefined>();

  const [instTraderSearchModalVisible, setInstTraderSearchModalVisible] = useState(false); // 变更机构交易员Modal

  const groupContainerRef = useRef<HTMLDivElement>(null);

  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);

  const { groupSettingVisible } = useDealPanel();
  const { productType } = useProductParams();

  const traders = useMemo(
    () => groups.find(v => v.group_combination_id === selected)?.trader_info_list,
    [groups, selected]
  );

  const selectedGroup = useMemo(() => groups.find(v => v.group_combination_id === selected), [groups, selected]);

  /** 获取用户分组 */
  const { refetch } = useQuery({
    queryKey: [APIs.deal.groupCombinationList, groupSettingVisible] as const,
    queryFn: async ({ signal }) => {
      const result = await fetchGroupCombinationList({}, { signal });
      return result;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    onSuccess: data => {
      setGroups(
        data?.group_combination_list?.map(v => ({
          ...v,
          trader_info_list: v.trader_info_list?.map(trader => {
            const res: TraderTinyWithInst = {
              ...trader,
              instId: trader.inst_info?.inst_id,
              invalid: getCPInvalid(trader, productType),
              cp: getCP({ trader, productType })
            };
            return res;
          })
        })) ?? []
      );
      if (!selected && data?.group_combination_list?.length) {
        setSelected(data?.group_combination_list?.[0].group_combination_id);
      }
    }
  });

  /** 删除分组 */
  const deleteGroup = async (groupId: string) => {
    if (groupId === selected) {
      const index = groups?.findIndex(v => v.group_combination_id === groupId);
      if (index && index >= 1) setSelected(groups?.[index - 1].group_combination_id);
      else setSelected(groups?.[0].group_combination_id);
    }

    // 乐观更新
    const newGroups = groups.filter(v => v.group_combination_id !== groupId);
    setGroups(newGroups);

    await fetchGroupCombinationUpdate({ group_combination_id: groupId, enable: Enable.DataDisable });
    refetch();
  };

  /** 命名校验 */
  const check = (val?: string, isAdd = false) => {
    if (!val) {
      message.error('分组名不能为空');
      return false;
    }
    if (
      groups
        ?.filter(i => (isAdd ? i : i.group_combination_id !== selectedGroup?.group_combination_id))
        ?.find(v => v.group_combination_name === val)
    ) {
      message.error('当前分组名已存在');
      return false;
    }
    return true;
  };

  /** 新增分组 */
  const addGroup = async (val?: string) => {
    const trimVal = trim(val);
    if (!check(trimVal, true)) return false;

    await fetchGroupCombinationAdd({ group_combination_name: trimVal });
    refetch();

    return true;
  };

  /** 更新分组名 */
  const updateGroupName = async (groupId: string, name?: string) => {
    const trimVal = trim(name);
    if (!check(trimVal)) return false;

    // 乐观更新
    const newGroups = groups.map(v => {
      if (v.group_combination_id === groupId) return { ...v, group_combination_name: trimVal };
      return v;
    });
    setGroups(newGroups);

    await fetchGroupCombinationUpdate({ group_combination_id: groupId, group_combination_name: name });
    refetch();

    return true;
  };

  /** 删除交易员 */
  const deleteTraders = async (ids: string[]) => {
    const updateGroup = groups.find(v => v.group_combination_id === selected);
    if (!updateGroup) return;
    const traderIds = updateGroup.trader_info_list?.map(v => v.trader_id).filter(v => !ids.includes(v));

    // 乐观更新
    const newGroups = groups.map(v => {
      if (v.group_combination_id === selected)
        return { ...v, trader_info_list: v.trader_info_list?.filter(trader => !ids.includes(trader.trader_id)) };
      return v;
    });
    setGroups(newGroups);

    await fetchGroupCombinationUpdate({ ...updateGroup, trader_id_list: traderIds });
    refetch();
  };

  const addTraders = async (traderList: TraderTinyWithInst[]) => {
    const updateGroup = groups.find(v => v.group_combination_id === selected);
    if (!updateGroup) return;

    /** 判断重复 */
    const traderIds = traderList.map(v => v.trader_id);
    const otherGroups = groups.filter(v => v.group_combination_id !== selected);
    const otherTraderIds = otherGroups.flatMap(v => v.trader_info_list?.map(trader => trader.trader_id));
    const repeatTraderIds = intersection(traderIds, otherTraderIds).filter(Boolean);

    const traderGroupById = groupBy(traderList, 'trader_id');
    if (repeatTraderIds.length) {
      let msg = '';
      for (const v of repeatTraderIds) {
        msg += traderGroupById[v]?.[0]?.name_zh ?? '';
        msg += ',';
      }
      if (msg) msg = msg.slice(0, Math.max(0, msg.length - 1));
      message.warn(`交易员${msg}已添加分组，不可重复添加`);
    }

    const updateTraderIds = difference(traderIds, repeatTraderIds);

    // 乐观更新
    const newGroups = groups.map(v => {
      if (v.group_combination_id === selected) {
        return { ...v, trader_info_list: traderList.filter(trader => !repeatTraderIds.includes(trader.trader_id)) };
      }
      return v;
    });
    setGroups(newGroups);

    await fetchGroupCombinationUpdate({ ...updateGroup, trader_id_list: updateTraderIds });
    setInstTraderSearchModalVisible(false);
    refetch();
  };

  return {
    groupContainerRef,

    groups,
    selected,
    selectedGroup,

    instTraderSearchModalVisible,
    setInstTraderSearchModalVisible,
    addGroupModalVisible,
    setAddGroupModalVisible,

    setSelected,
    deleteGroup,
    check,
    addGroup,
    updateGroupName,

    traders,
    deleteTraders,
    addTraders
  };
});

/** 分组配置上下文 */
export const GroupConfigProvider = GroupConfigContainer.Provider;
export const useGroupConfig = GroupConfigContainer.useContainer;
