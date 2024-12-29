import { useMemo, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { fetchUserInfo } from '@fepkg/services/api/user/get-info';
import { APIs } from '@fepkg/services/apis';
import { User } from '@fepkg/services/types/common';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { cloneDeep, isArray } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { BrokerGroup } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { saveUserSettingsByProductType } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { DEFAULT_GROUP } from '../../constants';
import { useTableState } from '../../providers/TableStateProvider';
import { addBrokerMdlCancelTimestampAtom } from './atoms';
import { QuoteDraftSettingsGroupsType } from './types';
import { useBrokerData } from './useBrokerData';
import { getGroupParams } from './utils';

export const MAX_BROKERS = 20;

const GroupSettingContainer = createContainer(() => {
  const { productType } = useProductParams();
  const { updateKeepingTimestamp } = useTableState();
  const setAddBrokerMdlCancelTimestamp = useSetAtom(addBrokerMdlCancelTimestampAtom);

  const { getSetting } = useUserSetting<QuoteDraftSettingsGroupsType>([
    UserSettingFunction.UserSettingQuoteDraftBrokerGroups
  ]);

  const defaultGroups = getSetting<BrokerGroup[]>(UserSettingFunction.UserSettingQuoteDraftBrokerGroups);

  const DEFAULT_GROUPS = isArray(defaultGroups) ? defaultGroups ?? [] : [DEFAULT_GROUP];

  const { brokerGroupId, updateSettingSelectedGroup } = useBrokerData({ productType });

  // 分组列表
  const [groups, setGroups] = useImmer<BrokerGroup[]>(DEFAULT_GROUPS);

  // 请求新的broker数据
  const usersQuery = useQuery({
    queryKey: [APIs.user.getInfo, groups],
    queryFn: async ({ signal }) => {
      const user_ids = [...new Set(groups.flatMap(i => i?.brokers?.map(j => j.user_id)).filter(Boolean))];
      const { user_list = [] } = await fetchUserInfo({ user_ids }, { signal });

      const res = groups.map(i => {
        const curBroker = user_list.filter(
          u => i?.brokers?.some(b => b.user_id === u.user_id) && u.user_id !== miscStorage.userInfo?.user_id
        );

        return {
          ...i,
          brokers: [miscStorage.userInfo, ...curBroker]
        };
      });
      return res as BrokerGroup[];
    },
    keepPreviousData: true
  });

  /** 面板内选中的分组 */
  const panelBrokerGroupId = useMemo(() => {
    const exist = groups.some(v => v.id === brokerGroupId);
    if (brokerGroupId && exist) return brokerGroupId;
    return groups[0].id;
  }, [brokerGroupId, groups]);

  // 当前选中的分组Id
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(panelBrokerGroupId);

  const [addBrokerModalVisible, setAddBrokerModalVisible] = useState(false); // 新增经纪人弹窗

  /** 当前选中的分组 */
  const selectedGroup = useMemo(
    () => groups.find(v => v.id === (selectedGroupId ?? panelBrokerGroupId)),
    [groups, panelBrokerGroupId, selectedGroupId]
  );

  /** 更新用户设置和localStorage */
  const updateSettingGroups = (groupList?: BrokerGroup[]) => {
    const newValue = {
      [UserSettingFunction.UserSettingQuoteDraftBrokerGroups]: groupList ?? groups
    };
    return saveUserSettingsByProductType(newValue, [productType]);
  };

  /** 实时保存分组 */
  const updateGroups = async (val: BrokerGroup[]) => {
    const prevGroups = cloneDeep(groups);
    // 简化请求入参
    setGroups(getGroupParams(val));
    try {
      await updateSettingGroups(getGroupParams(val));
    } catch {
      // 出错回滚
      setGroups(prevGroups);
    }
  };

  /**
   * 选中某个分组
   * @param groupId 分组ID
   */
  const handleGroupSelected = (groupId: string) => {
    // 重置截止实时监听的时间戳
    updateKeepingTimestamp({ reset: true });

    updateSettingSelectedGroup(groupId);
    setSelectedGroupId(groupId);
  };

  /** 删除经纪人 */
  const handleDeleteBroker = async (userId: string) => {
    if (!selectedGroupId) return;

    // 重置截止实时监听的时间戳
    if (brokerGroupId && brokerGroupId === selectedGroupId) {
      updateKeepingTimestamp({ reset: true });
    }

    const currentBrokers = selectedGroup?.brokers?.filter(v => v.user_id !== userId);
    const updateGroupsVal = groups.map(v => {
      if (v.id === selectedGroupId) return { ...v, brokers: currentBrokers };
      return v;
    });
    await updateGroups(updateGroupsVal);
  };

  /**
   * 校验分组名是否合法
   * @param name 分组名
   * @param isAdd 当前校验是否为新增分组的校验
   * @returns 合法为true，否则为false
   */
  const checkValid = (name?: string, isAdd = false): boolean => {
    if (!name) {
      message.error('分组名称不能为空!');
      return false;
    }

    const renamed = groups
      // 新增分组不需要过滤掉当前已选项分组
      .filter(v => (isAdd ? v : v.id !== selectedGroup?.id))
      .map(v => v.name)
      .includes(name);
    if (renamed) {
      message.error('当前分组名已存在');
      return false;
    }
    return !renamed;
  };

  /**
   * 新增分组
   * @param group 分组内容
   */
  const handleAddGroup = async (group: BrokerGroup) => {
    try {
      await Promise.all([
        updateGroups([...groups, { ...group, brokers: miscStorage.userInfo ? [{ ...miscStorage.userInfo }] : [] }]),
        setSelectedGroupId(group.id)
      ]);
      return true;
    } catch (error) {
      console.error(error, '请求新增失败');
      return false;
    }
  };

  /**
   * 修改分组名
   * @param groupId 分组ID
   * @param name 新分组名
   */
  const updateGroupName = (groupId: string, name?: string) => {
    if (!name) return false;

    const valid = checkValid(name);
    if (!valid) return false;

    /** 更新分组列表中的分组名 */
    const updateGroupsVal = groups.map(v => (v.id === groupId ? { ...v, name } : v));
    updateGroups(updateGroupsVal);
    return true;
  };

  /**
   * 删除某个分组
   * @param groupId 分组ID
   */
  const handleDeleteGroup = async (groupId: string) => {
    // 重置截止实时监听的时间戳
    if (brokerGroupId && brokerGroupId === groupId) {
      updateKeepingTimestamp({ reset: true });
    }

    const currentGroupIndex = groups.findIndex(v => v.id === groupId);
    const updateGroupsVal = groups.filter(v => v.id !== groupId);

    await updateGroups(updateGroupsVal);

    if (groupId === selectedGroupId) {
      let nextGroupId = '';
      if (currentGroupIndex < updateGroupsVal.length) {
        nextGroupId = updateGroupsVal[currentGroupIndex].id;
      } else if (currentGroupIndex === updateGroupsVal.length && currentGroupIndex > 0) {
        nextGroupId = updateGroupsVal[currentGroupIndex - 1].id;
      }
      setSelectedGroupId(nextGroupId);
    }

    if (groupId === brokerGroupId) {
      updateSettingSelectedGroup(updateGroupsVal[0].id);
    }
  };

  /** 当前选中分组下的broker */
  const brokers = useMemo(
    () => usersQuery.data?.find(v => v.id === selectedGroup?.id)?.brokers,
    [selectedGroup?.id, usersQuery.data]
  );

  /** 打开新增经纪人弹窗 */
  const handleOpenAddBrokerModal = () => {
    setAddBrokerModalVisible(true);
  };

  /** 关闭新增经纪人弹窗 */
  const handleCloseAddBrokerModal = () => {
    setAddBrokerModalVisible(false);
    setAddBrokerMdlCancelTimestamp(Date.now());
  };

  /** 保存选中的经纪人 */
  const updateBrokers = async (users?: User[]) => {
    if (!selectedGroup) return;

    if ((users?.length || 0) > MAX_BROKERS) {
      message.error(`经纪人最多允许添加${MAX_BROKERS}个`);
      return;
    }

    // 重置截止实时监听的时间戳
    if (brokerGroupId && brokerGroupId === selectedGroupId) {
      updateKeepingTimestamp({ reset: true });
    }

    const updateGroupsVal = groups.map(v => {
      if (v.id === selectedGroup.id) return { ...v, brokers: users };
      return v;
    });
    await updateGroups(updateGroupsVal);
  };

  return {
    groups,
    brokers,
    productType,
    selectedGroup,
    selectedGroupId,
    addBrokerModalVisible,
    panelBrokerGroupId,

    updateBrokers,
    checkValid,
    handleAddGroup,
    updateGroupName,
    handleDeleteGroup,
    handleDeleteBroker,

    handleGroupSelected,
    setSelectedGroupId,
    handleOpenAddBrokerModal,
    handleCloseAddBrokerModal
  };
});

export const GroupSettingProvider = GroupSettingContainer.Provider;
export const useGroupSetting = GroupSettingContainer.useContainer;
