import { useEffect, useMemo, useRef, useState } from 'react';
import { parseJSON } from '@fepkg/common/utils';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { StatusCode } from '@fepkg/request/types';
import { UpdatedQuoteFilterGroup } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { cloneDeep, flatten, groupBy, includes } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_CUSTOM_SORTING_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { deleteFilterGroup } from '@/common/services/api/filter-group/delete';
import { orderUpdateGroup } from '@/common/services/api/filter-group/order-update';
import { updateFilterGroup } from '@/common/services/api/filter-group/update';
import { FilterGroupsStruct, useAdvanceGroupQuery } from '@/common/services/hooks/useAdvanceGroupQuery';
import { QuoteFilterGroupItem, useFilterGroupQuery } from '@/common/services/hooks/useFilterGroupQuery';
import { useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';
import { getNCDAccess } from '@/common/utils/access';
import { CustomSortFieldOptions } from '@/components/BondFilter/CustomSorting/types';
import { BondFilterInstance } from '@/components/BondFilter/types';
import { useDialogHandler } from '@/layouts/Dialog/hooks';
import { useActiveProductType } from '@/layouts/Home/hooks/useActiveProductType';
import { miscStorage } from '@/localdb/miscStorage';
import { useProductPanelWindows } from '@/pages/ProductPanel/hooks/useProductPanelWindows';
import { useProductPanelLoader } from '@/pages/ProductPanel/providers/MainGroupProvider/preload';
import {
  getGroupStructsFromLocalForage,
  getTableCache,
  getTableStructsFromLocalForage,
  removeGroupsFromLocalForageIfNeeded,
  removeTablesFromLocalForageIfNeeded,
  setSingleGroupStructToLocalForage,
  updateWholeTableCache
} from '@/pages/ProductPanel/providers/MainGroupProvider/storage';
import {
  GroupManageItem,
  GroupStruct,
  ManageQueryResult,
  TableParams
} from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import {
  clearPartOfGroupStruct,
  combineGroupManageItem,
  getNewName,
  judgeHasModified,
  rollbackPartOfGroupStruct,
  transToGroupManageItem,
  transToUpdatedQuoteFilterGroup
} from '@/pages/ProductPanel/providers/MainGroupProvider/utils';
import { useUpdateGlobalSearchValue } from '../../atoms/global-search';
import { useGlobalSearchingBond } from '../../hooks/useGlobalSearchingBond';
import { useResetTableColumnSettings } from '../../hooks/useResetTableColumnSettings';
import { useResetTablePage } from '../../hooks/useResetTablePage';
import { useResetTableQuoteFilter } from '../../hooks/useResetTableQuoteFilter';
import { useResetTableSorter } from '../../hooks/useResetTableSorter';
import { ProductPanelTableKey } from '../../types';
import { useProductPanel } from '../PanelProvider';

const MAX_PANEL_NUM = 20;

/**
 * 判读当前是不是分享看板
 * @param creatorId 需要判断的创建人id
 */
const isSharedGroup = (creatorId?: string) => {
  return creatorId !== miscStorage.userInfo?.user_id;
};

export const MainGroupContainer = createContainer(() => {
  const loader = useProductPanelLoader();
  const { data: advanceGroupData } = useAdvanceGroupQuery();
  const ncdAccess = getNCDAccess();

  const { handleDialogCancel } = useDialogHandler();
  const bondFilterRef = useRef<BondFilterInstance>(null);

  const { setActiveTableKey, groupStoreKey, activeTableKey } = useProductPanel();
  const { activeProductType, changeActiveProductType } = useActiveProductType() ?? {};

  // 为了应对NCD的特殊情况，如果由于窗口恢复的原因，当前二级页签都被占满了，则一进来就要立即设置activeProductType为一级
  useEffect(() => {
    if (loader.activeProductType) {
      changeActiveProductType?.(loader.activeProductType);
    }
  }, [changeActiveProductType, loader.activeProductType]);

  const { data: issuerList } = useIssuerInstConfigQuery();

  // 看板状态
  const [groupState, updateGroupState] = useImmer<{ activeGroupId: string | undefined; groupList: GroupManageItem[] }>(
    () => ({ activeGroupId: loader.activeGroupId, groupList: loader.groups })
  );

  const getProductTypeByGroupId = (groupId?: string) => {
    return groupState.groupList.find(item => item.groupId === groupId)?.productType || ProductType.ProductTypeNone;
  };

  // 当前看板数据是否已经被删除了，仅在单券模式下生效
  const [deleted, setDeleted] = useState(false);

  // 为了表格渲染与筛选项渲染解绑，先响应用户的点击，再渲染表格
  const [delayedActiveGroupState, setDelayedActiveGroupState] = useState<GroupStruct | undefined>();

  // 外部直接使用的状态
  const activeGroupState = useMemo(() => {
    // 如果没有 activeId，默认第一位是 active
    const activeId = groupState.activeGroupId ?? groupState.groupList?.at(0)?.groupId;
    const activeGroupManageItem = groupState.groupList.find(currentState => {
      return currentState?.groupId === activeId;
    });
    const activeGroup = activeGroupManageItem?.localGroup || activeGroupManageItem?.serverGroup;
    // 如果本地修改的记录存在，且跟远端不一致，那么认为修改过
    const hasModified = activeGroup && judgeHasModified(activeGroupManageItem, activeGroup.isAdvanceMode);
    return { activeGroupManageItem, activeGroup, hasModified };
  }, [groupState.activeGroupId, groupState.groupList]);

  useEffect(() => {
    // 如果没有 activeId，默认第一位是 active
    const activeId = groupState.activeGroupId ?? groupState.groupList?.at(0)?.groupId;

    const groupManageItem = groupState.groupList.find(currentState => {
      return currentState?.groupId === activeId;
    });
    const activeGroup = groupManageItem?.localGroup || groupManageItem?.serverGroup;

    setDelayedActiveGroupState(activeGroup);
  }, [groupState.activeGroupId, groupState.groupList]);

  // 是否已经从localForage读到筛选项的本地变化
  const loadedFromLocalForage = useRef(false);
  // 当行情看板页面关闭时，把主进程内存中的localGroups重新读一下，因为有可能已经在新打开的行情看板中改变了
  const onPanelCancel = useMemoizedFn(async (groupId: string) => {
    const localGroupList = (await getGroupStructsFromLocalForage(groupStoreKey)) || [];
    const localGroup = localGroupList?.find(item => item?.groupId === groupId);
    updateGroupState(draft => {
      const groupStruct = draft.groupList.find(item => item.groupId === groupId);
      if (groupStruct) {
        groupStruct.localGroup = localGroup;
      }
    });
  });
  const { openProductPanelWindow, productPanelWindowIds } = useProductPanelWindows(onPanelCancel);
  // 是否已经展示过被删除弹窗了
  const hasShowDeletedModel = useRef(false);
  // Rename窗口是否该呈现错误形态
  const [renameError, setRenameError] = useState(false);

  const [, resetGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const resetTableColumnSettings = useResetTableColumnSettings();
  const resetTableQuoteFilter = useResetTableQuoteFilter();
  const resetTableSorter = useResetTableSorter();
  const resetTablePage = useResetTablePage();

  const { clearSearchingBond } = useGlobalSearchingBond();

  /** 重置表格查询参数 */
  const resetTableParams = (targetProductType: ProductType, groupId?: string) => {
    if (groupState.activeGroupId === groupId) return;
    changeActiveProductType?.(targetProductType);
    setActiveTableKey(ProductPanelTableKey.Basic);
    resetGlobalSearch(groupId, true);
    resetTableColumnSettings(targetProductType, groupId);
    resetTableQuoteFilter(groupId);
    resetTableSorter(groupId, true);
    resetTablePage();
  };

  /**
   * 找到下一个活跃看板
   * @param groupStructIndex 当前看板的排序
   * @param groupId 当前看板id
   * @returns
   */
  const findNextActiveGroupId = (groupStructIndex: number, groupId: string) => {
    let nextActiveGroupId = '';
    const nowProductType = getProductTypeByGroupId(groupId);
    if (groupState?.activeGroupId === groupId) {
      /* 如果跳过的是正在显示的看板：
        1.优先展示同productType下一个合法的
        2.再展示同productType上一个合法的
        3.最后展示不同productType第一个合法的
       */
      if (groupStructIndex > -1) {
        const nextValidGroup = groupState.groupList?.find((item, index) => {
          return (
            index > groupStructIndex &&
            !includes(productPanelWindowIds, item.groupId) &&
            item.productType === nowProductType
          );
        });

        if (nextValidGroup?.groupId) {
          nextActiveGroupId = nextValidGroup.groupId;
        } else {
          const prevValidGroup = groupState.groupList?.findLast((item, index) => {
            return (
              index < groupStructIndex &&
              !includes(productPanelWindowIds, item.groupId) &&
              item.productType === nowProductType
            );
          });

          if (prevValidGroup?.groupId) {
            nextActiveGroupId = prevValidGroup.groupId;
          } else {
            const firstValidGroup = groupState.groupList
              ?.filter(item => item.productType !== nowProductType)
              .find(item => {
                return item.groupId != groupId && !includes(productPanelWindowIds, item.groupId);
              });
            if (firstValidGroup?.groupId) {
              nextActiveGroupId = firstValidGroup.groupId;
            }
          }
        }
      }
    } else {
      nextActiveGroupId = groupState.activeGroupId || '';
    }
    return nextActiveGroupId;
  };

  const updateNewGroupToServer = async (newGroup: UpdatedQuoteFilterGroup, originId?: string) => {
    const result = await updateFilterGroup({ quote_filter_group_item: newGroup });
    if (result?.quote_filter_group_item) {
      const group = result?.quote_filter_group_item;
      const descStruct = JSON.parse(group.desc || '') as ManageQueryResult;
      const addedGroup: GroupManageItem = {
        groupId: group.group_id,
        groupName: group.group_name,
        productType: group.product_type,
        creatorId: group.creator_id,
        creatorName: group.creator_name,
        sharedBrokerList: group.shared_broker_list,
        serverGroup: {
          groupId: group.group_id,
          quickFilter: descStruct.quick_filter,
          generalFilter: descStruct.general_filter,
          bondIssueInfoFilter: descStruct.bond_issue_info_filter,
          bondIdList: descStruct.bond_id_list
        }
      };
      updateGroupState(draft => {
        draft.groupList.push(addedGroup);
        draft.activeGroupId = addedGroup.groupId;
      });

      if (originId) {
        const tableParamsCache = (await getTableCache(groupStoreKey, originId)).tableCache?.tableParamsCache;
        if (tableParamsCache && addedGroup.groupId) {
          const newMap = new Map<ProductPanelTableKey, TableParams>();
          // 复制时需要同样复制行情看板的全部表格的columnSettings，其他的内容不复制
          if (tableParamsCache)
            for (const [key, value] of tableParamsCache.entries()) {
              newMap.set(key, { columnSettings: value.columnSettings });
            }
          await updateWholeTableCache(groupStoreKey, addedGroup.groupId, newMap);
        }
      }

      resetTableParams(group.product_type, addedGroup.groupId);
    }
  };

  // 创建看板是否达到上限
  const isGroupReachLimit = (productType: ProductType) => {
    const myPanelList = groupState.groupList.filter(
      item => !isSharedGroup(item.creatorId) && item.productType === productType
    );
    if (myPanelList && myPanelList.length >= MAX_PANEL_NUM) {
      // message.error('已达看板数量上限！请删除后再新增！');
      return true;
    }
    return false;
  };

  // 创建新的看板
  const createNewGroup = useMemoizedFn(async (productType: ProductType) => {
    if (isGroupReachLimit(productType)) {
      return;
    }
    const name = getNewName(
      '新看板',
      groupState.groupList
        .filter(item => item.productType === productType)
        .map(item => item.groupName)
        .filter(Boolean)
    );
    const newManageQueryResult = {
      quick_filter: DEFAULT_QUICK_FILTER_VALUE,
      general_filter: DEFAULT_GENERAL_FILTER_VALUE,
      bond_issue_info_filter: DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
      bond_id_list: [],
      custom_sorting: DEFAULT_CUSTOM_SORTING_VALUE,
      advance_outer_quick_filter: DEFAULT_QUICK_FILTER_VALUE
    };

    const newGroup: UpdatedQuoteFilterGroup = {
      product_type: productType,
      group_name: name,
      creator_name: miscStorage.userInfo?.name_cn,
      shared_broker_id_list: [],
      desc: JSON.stringify(newManageQueryResult)
    };
    try {
      await updateNewGroupToServer(newGroup);
    } catch {
      message.error('创建失败');
    }
  });

  // 复制看板
  const copyGroup = async (groupId: string) => {
    if (isGroupReachLimit(getProductTypeByGroupId(groupId))) {
      message.error('已达看板数量上限！请删除后再复制！');
      return;
    }
    const sourceGroup = groupState.groupList.find(item => item.groupId === groupId);
    if (!sourceGroup) return;
    const name = getNewName(
      sourceGroup?.groupName || '',
      groupState.groupList
        .filter(item => item.productType === sourceGroup.productType)
        .map(item => item.groupName)
        .filter(Boolean)
    );
    // 复制是以当前的本地修改作为数据源进行复制，不管是否保存过，因此先取本地再取服务端分组数据
    const uploadGroup = sourceGroup?.localGroup || sourceGroup.serverGroup;
    const newManageQueryResult = {
      quick_filter: uploadGroup?.quickFilter,
      general_filter: uploadGroup?.generalFilter,
      bond_issue_info_filter: uploadGroup?.bondIssueInfoFilter,
      bond_id_list: uploadGroup?.bondIdList,
      custom_sorting: uploadGroup?.customSorting,
      advance_outer_quick_filter: uploadGroup?.advanceOuterQuickFilter,
      advance_group_ids: uploadGroup?.advanceGroupIds
    };
    const newGroup: UpdatedQuoteFilterGroup = {
      product_type: getProductTypeByGroupId(groupId),
      group_name: name,
      creator_name: miscStorage.userInfo?.name_cn,
      shared_broker_id_list: [],
      desc: JSON.stringify(newManageQueryResult)
    };
    try {
      await updateNewGroupToServer(newGroup, groupId);
    } catch (e: any) {
      if (e?.data?.status_code === 21106) {
        message.error('看板名称长度已达上限');
      } else {
        message.error('创建失败');
      }
    }
  };

  const saveClose = () => handleDialogCancel();

  /**
   * 行情看板页的数据处理模式
   * @param groups 返回的数据
   */
  const singleModeDataProcess = async (groups: QuoteFilterGroupItem[]) => {
    const targetGroupItem = groups.find(item => item.group_id === loader.singleGroupId);
    if (
      (targetGroupItem?.product_type === ProductType.NCD && !ncdAccess.ncd) ||
      (targetGroupItem?.product_type === ProductType.NCDP && !ncdAccess.ncdP)
    ) {
      ModalUtils.warning({
        title: '您无权限查看此看板！',
        content: '请点击关闭看板！',
        okText: '关闭',
        showCancel: false,
        onOk: async () => {
          // 点击确认直接关闭
          saveClose();
        }
      });
      return;
    }
    const localGroupList = (await getGroupStructsFromLocalForage(groupStoreKey)) || [];
    const updateList = groups
      ?.map(group => {
        let oldLocalGroup = groupState?.groupList?.find(item => item.groupId === group.group_id)?.localGroup;
        if (!loadedFromLocalForage.current) {
          oldLocalGroup = localGroupList?.find(item => item.groupId === group.group_id);
        }
        return transToGroupManageItem(group, oldLocalGroup);
      })
      .filter(Boolean);
    if (targetGroupItem) {
      document.title = targetGroupItem.group_name || '行情看板';
      // console.log('groupStateChange 情况2', updateList);
      updateGroupState(draft => {
        draft.groupList = updateList;
        draft.activeGroupId = targetGroupItem?.group_id;
      });

      resetTableParams(targetGroupItem.product_type, targetGroupItem?.group_id);
    } else {
      const { isShared } = loader;
      setDeleted(true);
      if (hasShowDeletedModel.current) return;
      hasShowDeletedModel.current = true;
      if (isShared) {
        ModalUtils.warning({
          title: '分享者已删除此看板！',
          content: '当前看板窗口将被关闭，您可选择复制看板以保留当前筛选项！',
          okText: '复制看板',
          cancelText: '关闭看板',
          onOk: async () => {
            await copyGroup(loader.singleGroupId || '');
            window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_PANEL_GROUP_REFETCH, '');
            // 点击确认直接关闭
            saveClose();
          },
          onCancel: () => {
            // 点击确认直接关闭
            saveClose();
          }
        });
      } else {
        ModalUtils.warning({
          title: '看板已被删除',
          content: '您已删除此看板，当前窗口将被关闭！',
          showOk: false,
          cancelText: '我知道了',
          onCancel: saveClose,
          titleCentered: false
        });
      }
    }
  };

  /**
   * 主页的数据处理模式
   * @param groups 返回的数据
   */
  const mainModeDataProcess = async (groups: QuoteFilterGroupItem[]) => {
    // 先反向过一遍，找到服务端不存在的id，意味着这些id已经被分享者删掉了，此时删除本地数据缓存
    const localGroupList = (await getGroupStructsFromLocalForage(groupStoreKey)) || [];
    const localTableList = (await getTableStructsFromLocalForage(groupStoreKey)) || [];
    removeGroupsFromLocalForageIfNeeded(groupStoreKey, localGroupList, groups);
    removeTablesFromLocalForageIfNeeded(groupStoreKey, localTableList, groups);
    // 再正向过一遍，根据远端数据全盘照抄除localGroup外的其他数据，localGroup优先从本地内存中获取
    const updateList = groups
      ?.map(group => {
        let oldLocalGroup = groupState?.groupList?.find(item => item.groupId === group.group_id)?.localGroup;
        if (!loadedFromLocalForage.current) {
          oldLocalGroup = localGroupList?.find(item => item.groupId === group.group_id);
        }
        return transToGroupManageItem(group, oldLocalGroup);
      })
      .filter(Boolean);
    let nextActiveGroupId = '';
    const newGroupList = updateList;
    if (!loadedFromLocalForage.current && updateList?.length) {
      nextActiveGroupId = loader.activeGroupId || '';
    } else if (!newGroupList?.find(item => item.groupId === groupState.activeGroupId)) {
      nextActiveGroupId =
        newGroupList?.find(item => {
          return !includes(productPanelWindowIds, item.groupId);
        })?.groupId || '';
    }
    updateGroupState(draft => {
      draft.groupList = newGroupList;
      if (nextActiveGroupId) {
        draft.activeGroupId = nextActiveGroupId;
      }
    });

    if (nextActiveGroupId) resetTableParams(getProductTypeByGroupId(nextActiveGroupId), nextActiveGroupId);

    // 如果相应的productType下没有默认值，则直接走新增逻辑
    for (const productType of loader.productTypeList) {
      if (!groups.some(item => item.product_type === productType)) {
        createNewGroup(productType);
      }
    }
  };

  /** 获取看板列表 */
  const { refetch } = useFilterGroupQuery(loader.productTypeList || [], {
    enabled: !deleted,
    refetchOnWindowFocus: false,
    onSuccess: async groups => {
      if (loader.isSingleMode) await singleModeDataProcess(groups);
      else await mainModeDataProcess(groups);
      loadedFromLocalForage.current = true;
    }
  });

  useEffect(() => {
    const refetchOff = window.Broadcast.on(
      BroadcastChannelEnum.BROADCAST_PANEL_GROUP_REFETCH,
      (updatedPanelId: string) => {
        if (!updatedPanelId && !loader.isSingleMode) {
          refetch();
        } else if (loader.singleGroupId === updatedPanelId) {
          refetch();
        }
      }
    );

    return () => {
      refetchOff();
    };
  }, [refetch, loader.singleGroupId, loader.isSingleMode, loader.productTypeList]);

  /** 修改当前的看板(本地改)，把修改的内容放入相应id的localGroup结构中 */
  const modifyLocalGroup = async (modifiedGroupStruct: GroupStruct) => {
    await setSingleGroupStructToLocalForage(groupStoreKey, modifiedGroupStruct);
    updateGroupState(draft => {
      const groupStruct = draft.groupList.find(item => item.groupId === modifiedGroupStruct.groupId);
      if (groupStruct) {
        groupStruct.localGroup = modifiedGroupStruct;
      }
    });
  };

  /** 自定义排序比较特殊，需要实时向远端进行变更，因此需要本地和服务端同时改 */
  const autoSaveCustomSorting = async (val: CustomSortFieldOptions) => {
    if (activeGroupState.activeGroup) {
      const newLocalStruct = {
        ...activeGroupState.activeGroup,
        groupId: activeGroupState.activeGroup?.groupId || '',
        customSorting: val
      };
      await modifyLocalGroup(newLocalStruct);
    }
    const oldServerGroup = activeGroupState.activeGroupManageItem?.serverGroup;
    const newServerGroup: GroupStruct = {
      ...oldServerGroup,
      groupId: oldServerGroup?.groupId || '',
      customSorting: val
    };
    if (activeGroupState.activeGroupManageItem) {
      const updateQuoteFilterGroup = transToUpdatedQuoteFilterGroup(
        activeGroupState.activeGroupManageItem,
        newServerGroup,
        activeGroupState.activeGroupManageItem?.sharedBrokerList?.map(item => item.broker_id)
      );
      try {
        await updateFilterGroup({ quote_filter_group_item: updateQuoteFilterGroup });
      } catch (e) {
        console.log(e);
      }
    }
  };

  /**
   * 保存某一看板
   * @param groupId 看板id
   */
  const saveGroup = async (groupId: string): Promise<GroupManageItem | undefined> => {
    const isAdvance = activeGroupState?.activeGroup?.isAdvanceMode === true;
    const targetGroup = groupState?.groupList.find(item => item.groupId === groupId);
    if (!targetGroup?.localGroup || !targetGroup.serverGroup) return void 0;
    const updateGroup = combineGroupManageItem(targetGroup.localGroup, targetGroup.serverGroup, isAdvance);
    const updateQuoteFilterGroup = transToUpdatedQuoteFilterGroup(
      targetGroup,
      updateGroup,
      targetGroup.sharedBrokerList?.map(item => item.broker_id)
    );
    try {
      const result = await updateFilterGroup({ quote_filter_group_item: updateQuoteFilterGroup });
      if (result != null && result.base_response?.code === StatusCode.Success) {
        const mergeResult = {
          ...result.quote_filter_group_item,
          desc: parseJSON<ManageQueryResult>(result.quote_filter_group_item?.desc || '')
        } as QuoteFilterGroupItem;
        const returnValue = transToGroupManageItem(mergeResult);
        if (returnValue) {
          const newLocalStruct = { ...updateGroup, isAdvanceMode: targetGroup.localGroup.isAdvanceMode };
          await setSingleGroupStructToLocalForage(groupStoreKey, newLocalStruct);
          returnValue.localGroup = newLocalStruct;
          message.success('保存成功');
          updateGroupState(draft => {
            const targetIndex = draft.groupList.findIndex(item => item.groupId === groupId);
            if (targetIndex > -1) {
              if (returnValue) draft.groupList[targetIndex] = returnValue;
            }
          });
        }
        return returnValue;
      }
    } catch {
      message.error('保存失败');
    }
    return undefined;
  };

  /** 检查是否重名 */
  const checkValid = (groupId: string, groupName: string): boolean => {
    if (!groupName) {
      message.error('看板名称不能为空!');
      return false;
    }

    const { groupList } = groupState;
    const currentGroup = groupList.find(v => v.groupId === groupId);
    if (!currentGroup) return !!void message.error('看板不存在！');
    const groupNameIsExist = groupList
      .filter(item => item.groupId != groupId)
      .some(
        v => v?.groupName === groupName && !isSharedGroup(v?.creatorId) && currentGroup.productType === v?.productType
      );
    if (groupNameIsExist) message.error('当前看板名称与已有看板名称重复，保存失败！');
    return !groupNameIsExist;
  };

  /**
   * 看板重命名
   * @param groupId 看板id
   * @param groupName 看板名称
   * @param byBlur 是否由input失焦触发
   */
  const rename = async (groupId: string, groupName: string) => {
    const { groupList } = groupState;
    const currentGroup = groupList.find(v => v.groupId === groupId);
    if (!currentGroup) return !!void message.error('看板不存在！');

    const { serverGroup, localGroup } = currentGroup;

    if (!serverGroup) return false;

    const updateGroup = transToUpdatedQuoteFilterGroup(
      { ...currentGroup, groupName },
      { ...serverGroup },
      currentGroup.sharedBrokerList?.map(item => item.broker_id)
    );
    try {
      const result = await updateFilterGroup({ quote_filter_group_item: updateGroup });
      if (result.base_response?.code !== StatusCode.Success) return false;

      const mergeResult = {
        ...result.quote_filter_group_item,
        desc: parseJSON<ManageQueryResult>(result.quote_filter_group_item?.desc || '')
      };
      const returnValue = transToGroupManageItem(mergeResult as QuoteFilterGroupItem, localGroup);
      updateGroupState(draft => {
        const targetIndex = draft.groupList.findIndex(item => item.groupId === groupId);
        if (targetIndex > -1 && returnValue) draft.groupList[targetIndex] = returnValue;
      });
      window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_PANEL_GROUP_REFETCH, '');
      return true;
    } catch {
      setRenameError(true);
      message.error('重命名失败');
    }
    return false;
  };

  // 还原某一看板，将其localGroup置空
  const rollbackGroup = async () => {
    const isAdvance = activeGroupState?.activeGroup?.isAdvanceMode === true;
    const groupStruct = groupState.groupList.find(item => item.groupId === activeGroupState.activeGroup?.groupId);
    if (groupStruct?.localGroup && groupStruct.serverGroup) {
      const rollbackModifyGroup = rollbackPartOfGroupStruct(groupStruct.localGroup, groupStruct.serverGroup, isAdvance);
      await modifyLocalGroup(rollbackModifyGroup);
      bondFilterRef.current?.resetFilter?.(cloneDeep(rollbackModifyGroup));
    }
  };

  /**
   * 修改分享接口（分享或取消分享）
   * @param groupManageItem
   * @param isAdd
   * @param groupStruct
   * @param sharedBrokerIdList
   */
  const doShare = async (
    groupManageItem: GroupManageItem,
    isAdd: boolean,
    groupStruct?: GroupStruct,
    sharedBrokerIdList?: string[]
  ) => {
    const newGroup = transToUpdatedQuoteFilterGroup(groupManageItem, groupStruct, sharedBrokerIdList);
    try {
      const result = await updateFilterGroup({ quote_filter_group_item: newGroup });
      if (result.base_response?.code === StatusCode.Success) {
        await refetch();
        if (isAdd) message.success('分享成功!');
        else message.success('删除成功!');
      }
    } catch {
      if (isAdd) message.error('分享失败!');
      else message.error('删除失败!');
    }
  };

  // 分享的看板是否修改过
  const isShareGroupModified = (groupId: string) => {
    const groupManageItem = groupState?.groupList.find(item => item.groupId === groupId);
    if (!groupManageItem) return false;
    return judgeHasModified(groupManageItem, activeGroupState.activeGroup?.isAdvanceMode);
  };

  // 修改情况下分享看板
  const continueShare = async (groupId: string, sharedBrokerIdList: string[]) => {
    if (isShareGroupModified(groupId)) {
      const groupManageItem = groupState?.groupList.find(item => item.groupId === groupId);
      const savedGroupManageItem = await saveGroup(groupManageItem?.groupId || '');
      if (savedGroupManageItem) {
        doShare(savedGroupManageItem, true, savedGroupManageItem?.serverGroup, sharedBrokerIdList);
      }
    } else {
      const groupManageItem = groupState?.groupList.find(item => item.groupId === groupId);
      if (groupManageItem) doShare(groupManageItem, true, groupManageItem.serverGroup, sharedBrokerIdList);
    }
  };

  const removeMyGroup = async (groupId: string, productType?: ProductType, nextActiveGroupId?: string) => {
    try {
      const result = await deleteFilterGroup({ group_id: groupId });
      if (!result || result?.base_response?.code != StatusCode.Success) return;
      message.success('删除成功');
      updateGroupState(draft => {
        draft.groupList = draft.groupList.filter(item => item.groupId != groupId);
        draft.activeGroupId = nextActiveGroupId;
      });
      resetTableParams(productType || ProductType.ProductTypeNone, nextActiveGroupId);
      // 清除正在搜索债券的缓存
      clearSearchingBond(groupId);

      await refetch();
    } catch {
      message.error('删除失败');
    }
  };

  /**
   * 删除分享看板
   * @param groupId 看板id
   * @param nextActiveGroupId 下一个活跃的看板id
   */
  const removeSharedGroup = async (groupId: string, nextActiveGroupId?: string) => {
    const groupManageItem = groupState?.groupList.find(item => item.groupId === groupId);
    const sharedBrokerIdList = groupManageItem?.sharedBrokerList
      ?.filter(item => item.broker_id != miscStorage.userInfo?.user_id)
      ?.map(v => v.broker_id);

    if (groupManageItem) {
      await doShare(groupManageItem, false, groupManageItem?.serverGroup, sharedBrokerIdList);
      updateGroupState(draft => {
        draft.groupList = draft.groupList.filter(item => item.groupId != groupId);
        draft.activeGroupId = nextActiveGroupId;
      });

      resetTableParams(getProductTypeByGroupId(groupId), nextActiveGroupId);
    }
  };

  /**
   * 删除某一看板
   * @param groupId 看板id
   */
  const deleteGroup = (groupId: string) => {
    const groupStructIndex = groupState.groupList.findIndex(item => item.groupId === groupId);
    if (groupStructIndex > -1) {
      const nextActiveGroupId = findNextActiveGroupId(groupStructIndex, groupId);
      const groupStruct = groupState.groupList[groupStructIndex];
      const showSharedHint = !isSharedGroup(groupStruct.creatorId) && groupStruct.sharedBrokerList?.length;
      ModalUtils.error({
        title: '删除看板',
        content: showSharedHint
          ? '此看板存在分享用户，删除后，被分享者的看板将被同步删除！'
          : '看板删除后将不可恢复，请谨慎操作！',
        onOk: async () => {
          if (isSharedGroup(groupStruct.creatorId)) await removeSharedGroup(groupId, nextActiveGroupId);
          else await removeMyGroup(groupId, groupStruct.productType, nextActiveGroupId);
          window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_PANEL_GROUP_REFETCH, groupId);
        }
      });
    }
  };

  /**
   * 看板拖拽，targetId是拖动中的看板id，destId是放在谁的前面，传空代表放在最后面
   * @param targetId 被拖拽元素id
   * @param destId 被放置元素id
   */
  const replaceGroup = useMemoizedFn(async (targetId: string, destId?: string) => {
    const groupIdList = groupState.groupList.map(item => item.groupId);
    if (!groupIdList.includes(targetId) || targetId === destId) return;

    let settings: string[] = [];
    const noTargetIdList = groupIdList.filter(id => id !== targetId).filter(Boolean);

    if (destId) {
      for (const id of noTargetIdList) {
        if (id === destId) {
          settings.push(targetId);
        }
        settings.push(id || '');
      }
    } else {
      settings = [...noTargetIdList, targetId];
    }

    // 乐观跟新看板顺序
    const groupReSort = [...groupState.groupList];
    groupReSort.sort((prev, next) => settings.indexOf(prev.groupId || '') - settings.indexOf(next.groupId || ''));

    updateGroupState(draft => {
      draft.groupList = groupReSort;
    });
    const productType = getProductTypeByGroupId(targetId);
    const result = await orderUpdateGroup({ product_type: productType, group_id_list: settings });
    if (result && result.base_response?.code === 0) refetch();
  });

  /**
   * 以某看板为数据源打开一个新窗口
   * @param groupId 看板id
   */
  const openNewDialog = (groupId: string) => {
    const groupStructIndex = groupState.groupList.findIndex(item => item.groupId === groupId);
    if (groupStructIndex > -1) {
      const productType = groupState.groupList[groupStructIndex].productType || ProductType.ProductTypeNone;
      // 是否真正触发了open的动作
      const isOpen = openProductPanelWindow(
        productType.toString(),
        groupId,
        isSharedGroup(groupState.groupList[groupStructIndex].creatorId)
      );
      if (isOpen) {
        const nextActiveGroupId = findNextActiveGroupId(groupStructIndex, groupId);
        const nextProductType = getProductTypeByGroupId(nextActiveGroupId);
        updateGroupState(draft => {
          draft.activeGroupId = nextActiveGroupId;
        });
        resetTableParams(nextProductType, nextActiveGroupId);
      }
    }
  };

  /**
   * 更改当前活跃的看板
   * @param groupId 看板id
   */
  const changeActiveGroup = (groupId: string) => {
    if (productPanelWindowIds.includes(groupId)) {
      // 当前被选中的看板已经被打开，则重新聚焦当前被打开的看板
      const groupNameList = productPanelWindowIds.map(
        id => groupState.groupList.find(v => v.groupId === id)?.groupName
      );
      console.log('调用唤醒看板功能,目前认为单独打开的窗口是:', groupNameList, groupId);
      openNewDialog(groupId);
    } else if (groupState.groupList.some(item => item.groupId === groupId)) {
      // 切换选中的看板
      updateGroupState(draft => {
        draft.activeGroupId = groupId;
      });

      resetTableParams(getProductTypeByGroupId(groupId), groupId);
    }
  };

  /** 清空所有筛选条件 */
  const resetFilter = () => {
    const { activeGroup } = activeGroupState;
    if (activeGroup) {
      const clearedLocalGroup = clearPartOfGroupStruct(activeGroup, activeGroup?.isAdvanceMode === true);
      modifyLocalGroup(clearedLocalGroup);
    }
  };

  /** 将选中的发行人一级列表的id转换成其对应的子项 */
  const transformIssuerIdList = useMemoizedFn((issuerIdList: string[]) => {
    // TODO: 下个版本要挪到getBondOptimalQuoteDynamicFilterParams中去
    const issuerGroupByBankType = groupBy(issuerList?.nodes, 'value');
    const bank_type_list: string[] = [];
    let issuer_id_list: string[] = [];

    if (activeProductType !== ProductType.NCD && activeProductType !== ProductType.NCDP) {
      return { issuer_id_list: issuerIdList, bank_type_list };
    }

    if (activeTableKey === ProductPanelTableKey.Bond || activeTableKey === ProductPanelTableKey.Optimal) {
      // 只有table是<债券列表>时，全选发行人需要传bank_type_list，其余均传issuer_id_list
      for (const v of issuerIdList) {
        if (issuerGroupByBankType[v]) bank_type_list.push(v);
        else issuer_id_list.push(v);
      }
    } else {
      // 其他table下，选中发行人父节点时，枚举出其所有子集
      issuer_id_list = flatten(
        issuerIdList.map(v => {
          if (issuerGroupByBankType[v]) {
            return flatten(
              issuerGroupByBankType[v].map(item => item.children?.map(cli => cli.value as unknown as string))
            );
          }
          return v;
        })
      ).filter(Boolean);
    }

    return { bank_type_list, issuer_id_list };
  });

  /** 高级分组的筛选条件 */
  const advanceGroupStructs = useMemo(() => {
    const filteredGroup: FilterGroupsStruct[] | undefined = advanceGroupData?.filter(
      item => activeGroupState.activeGroup?.advanceGroupIds?.includes(item?.groupId || '') === true
    );

    return filteredGroup?.map(v => {
      const { issuer_id_list, bank_type_list } = transformIssuerIdList(
        v.bondIssueInfoFilterValue?.issuer_id_list ?? []
      );
      return {
        ...v,
        generalFilterValue: { ...v.generalFilterValue, bank_type_list },
        bondIssueInfoFilterValue: { ...v.bondIssueInfoFilterValue, issuer_id_list }
      };
    });
  }, [activeGroupState.activeGroup, advanceGroupData]);

  const { issuer_id_list, bank_type_list } = transformIssuerIdList(
    delayedActiveGroupState?.bondIssueInfoFilter?.issuer_id_list ?? []
  );

  return {
    // --- 基础数据
    groupState,
    bondFilterRef,
    activeGroupState,
    delayedActiveGroupState: delayedActiveGroupState
      ? {
          ...delayedActiveGroupState,
          generalFilter: { ...delayedActiveGroupState.generalFilter, bank_type_list },
          bondIssueInfoFilter: { ...delayedActiveGroupState.bondIssueInfoFilter, issuer_id_list }
        }
      : undefined,
    openedGroupIdList: productPanelWindowIds,
    // --- 给行情看板组件使用
    changeActiveGroup,
    createNewGroup,
    isGroupReachLimit,
    copyGroup,
    openNewDialog,
    replaceGroup,
    isShareGroupModified,
    continueShare,
    deleteGroup,
    // --- 给筛选条件组件使用
    rename,
    checkValid,
    renameError,
    setRenameError,
    resetFilter,
    modifyLocalGroup,
    autoSaveCustomSorting,
    saveGroup,
    rollbackGroup,
    advanceGroupStructs
  };
});

export const MainGroupProvider = MainGroupContainer.Provider;
export const useMainGroupData = MainGroupContainer.useContainer;
