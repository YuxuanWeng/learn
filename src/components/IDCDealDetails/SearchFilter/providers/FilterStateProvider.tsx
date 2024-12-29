import { useMemo, useRef, useState } from 'react';
import { isNCD } from '@fepkg/business/utils/product';
import { UserLite } from '@fepkg/services/types/bdm-common';
import { UserAccessGrantType } from '@fepkg/services/types/bds-enum';
import { isEqual, omit } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { DealBrokerArea, DealContainerData, TypeSearchFilter } from '@/components/IDCDealDetails/type';
import { getDealContentList, initSearchFilter } from '@/components/IDCDealDetails/utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { useAccessGrant } from '@/pages/Base/SystemSetting/components/TradeSettings/useAccessGrant';
import useBridge from '@/pages/Deal/Bridge/hooks/useBridge';
import { useGroupConfig } from '@/pages/Deal/Detail/components/GroupSettingModal/provider';
import { useDealPanel } from '@/pages/Deal/Detail/provider';
import { DetailReturnType, useFetchData } from '../../hooks/useFetchData';
import { useMultiSelectedHook } from '../../hooks/useMultiSelectedHook';
import { useIDCDetailPreference } from '../../hooks/usePreference';

const FilterStateContainer = createContainer(() => {
  // 筛选项状态
  const [filterData, updateFilterData] = useImmer<TypeSearchFilter>(initSearchFilter);
  // 是否禁用筛选
  const [disabled, setDisabled] = useState(false);

  const { productType } = useProductParams();
  // useQuery查询结果
  const queryResult = useFetchData(filterData, productType);
  const resultData = queryResult.data as DetailReturnType;
  // 当前换桥/删除选中的桥id
  const selectBridgeId = useRef<string | undefined>();

  // 合并分组list
  const { groups } = useGroupConfig();

  // 指定授权人数据(包括当前登录用户)
  const { granterUsers } = useAccessGrant(UserAccessGrantType.UserAccessGrantTypeDealDetailBridge);

  const prevFilterData = useRef<TypeSearchFilter>();
  const prevGranterUsers = useRef<UserLite[]>();

  const [openBrokers, updateOpenBrokers] = useImmer<{ userId: string; isOpen: boolean }[]>([]);

  // 轮询数据和显示设置数据整合
  const contentList: DealBrokerArea[] = useMemo(() => {
    /** 过桥标识是否点亮权限 */
    const renderData = resultData?.details || [];
    /** 是否有其他人的权限 */
    const hasOtherGrant = !!granterUsers?.length && granterUsers.length > 1;
    const userList: UserLite[] = [
      miscStorage.userInfo as UserLite,
      ...(granterUsers?.filter(user => user.user_id != miscStorage.userInfo?.user_id) || [])
    ];
    const returnList = getDealContentList(
      productType,
      renderData,
      groups,
      filterData.include_history === true,
      hasOtherGrant,
      userList
    );

    // 要求只要筛选条件一变化，如果某经纪人下有符合要求的明细，则该经纪人条目自动展开
    if (
      resultData?.details &&
      (!isEqual(prevFilterData.current, resultData?.inputParams) || !isEqual(prevGranterUsers.current, granterUsers))
    ) {
      prevFilterData.current = resultData?.inputParams;
      prevGranterUsers.current = granterUsers;
      const newOpenBrokers = returnList
        .filter(item => item.groups.length > 0)
        .map(item => {
          return { userId: item.broker.user_id, isOpen: true };
        });
      updateOpenBrokers(newOpenBrokers);
    }
    return returnList;
  }, [
    resultData?.details,
    resultData?.inputParams,
    granterUsers,
    productType,
    groups,
    filterData.include_history,
    updateOpenBrokers
  ]);

  const { btnPreferenceMap, onChangePreference, getPreferenceValue } = useIDCDetailPreference();

  // 构造一个拍平的一维数组，用于虚拟列表的实现
  const virtualList: DealContainerData[] = useMemo(() => {
    const list: DealContainerData[] = [];

    for (const content of contentList) {
      list.push({
        broker: content.broker,
        category: 'brokerHead',
        isEmpty: false
      } as DealContainerData);
      // 如果当前经纪人的展示状态是收起，则不渲染它所包含的内容
      const isClosed = !openBrokers.find(item => item.userId === content.broker.user_id)?.isOpen;

      // 头部数据有三类-机构交易员/分组名/机构待定
      for (const [index, group] of content.groups.entries()) {
        const value = {
          broker: content.broker,
          ...group,
          showHead: group.showHead,
          isClosed,
          isFirst: index === 0,
          category: 'groupHead'
        };
        list.push(value as DealContainerData);
        const showConfig = getPreferenceValue(group.groupId);
        // 大组由各个小组构成
        // 小组由分组标题和数据区构成
        // 数据区 区分当日成交/历史成交/汇总
        // 除却单条数据外，数据区为最小组单元，是否为isLastGroup由
        const isLastGroup = index === content.groups.length - 1;
        // 当日成交--start
        if (group.deals.length) {
          // 设置他人成交的头部区域
          list.push({
            category: 'otherTitle',
            isHistory: false,
            isClosed
          } as DealContainerData);
        }

        for (const [dealIndex, deal] of group.deals.entries()) {
          // 没有汇总区，没有历史成交时，deals的最后一条isLast为true
          const isLast = !showConfig.showSum && dealIndex === group.deals.length - 1 && group.historyDeals.length === 0;
          // 当日成交
          list.push({
            category: 'deals',
            broker: content.broker,
            ...omit(group, 'deals', 'historyDeals'),
            isLast,
            isLastGroup,
            ...deal,
            isClosed
          } as DealContainerData);
        }

        // 当日成交-汇总区的数据 没有历史成交时 isLast为true
        list.push({
          ...group,
          category: 'groupFooter',
          isLast: group.historyDeals.length === 0,
          isHistory: false,
          isLastGroup,
          isClosed
        } as DealContainerData);
        // 当日成交---end

        // 历史成交---start
        if (group.historyDeals.length) {
          // 设置他人成交的头部区域
          list.push({
            category: 'otherTitle',
            isHistory: true,
            isClosed
          } as DealContainerData);
        }

        // 历史成交数据整理
        for (const [dealIndex, deal] of group.historyDeals.entries()) {
          // 当没有汇总区的时候，历史成交的最后一条isLast为true
          const isLast = !showConfig.showSum && dealIndex === group.historyDeals.length - 1;
          list.push({
            category: 'deals',
            ...omit(content, 'groups'),
            ...omit(group, 'deals', 'historyDeals'),
            isLast,
            isLastGroup,
            isClosed,
            ...deal
          } as DealContainerData);
        }
        // 历史成交---end

        // 历史成交-汇总区的数据一定是isLast
        list.push({
          ...group,
          category: 'groupFooter',
          isLast: true,
          isHistory: true,
          isLastGroup,
          isClosed
        } as DealContainerData);
      }
    }
    return list;
  }, [contentList, getPreferenceValue, openBrokers]);

  const { visibleBridgeModal } = useBridge();
  const { agentVisible } = useDealPanel();

  const {
    selectedIds,
    setSelectedIds,
    selectedDeals,
    handleMouseDown,
    activeRowKey,
    setActiveRowKey,
    itemRef,
    containerRef,
    getShowConfigByDeals
  } = useMultiSelectedHook(virtualList, !visibleBridgeModal && !agentVisible);

  const parentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const resetFilter = (resetOnly = false) => {
    updateFilterData(initSearchFilter);
    // 重置后禁用筛选
    if (!resetOnly) setDisabled(true);
  };

  return {
    containerRef,
    itemRef,
    parentRef,
    wrapperRef,

    disabled,
    btnPreferenceMap,

    selectedIds,
    activeRowKey,
    selectedDeals,
    queryResult,
    filterData,
    contentList,
    virtualList,
    // flatList,

    setDisabled,
    resetFilter,
    setActiveRowKey,
    setSelectedIds,
    // onFilterSeqNum,
    handleMouseDown,
    updateFilterData,
    onChangePreference,
    getPreferenceValue,
    getShowConfigByDeals,
    granterUsers,
    selectBridgeId,
    openBrokers,
    updateOpenBrokers,
    isNCD: isNCD(productType)
  };
});

export const FilterStateProvider = FilterStateContainer.Provider;
export const useFilter = FilterStateContainer.useContainer;
