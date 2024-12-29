import { useMemo, useRef, useState } from 'react';
import { parseJSON } from '@fepkg/common/utils';
import { formatDate } from '@fepkg/common/utils/date';
import { TableInstance } from '@fepkg/components/Table';
import { User } from '@fepkg/services/types/common';
import { QuoteDraftMessageStatus, UserSettingFunction } from '@fepkg/services/types/enum';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { LocalQuoteDraftDetail, LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';
import { useQuoteDraftMessageQuery } from '@/common/services/hooks/local-server/quote-draft/useQuoteDraftMessageQuery';
import { QuoteDraftMessageListQueryResult } from '@/common/services/hooks/useLiveQuery/type';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { useProductParams } from '@/layouts/Home/hooks';
import { BrokerGroup } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import {
  DraftGroupTableDetailData,
  DraftGroupTableMessageData,
  DraftGroupTableRowData,
  DraftGroupTableRowType
} from '@/pages/Quote/Collaborative/types/table';
import { QuoteDraftSettingsGroupsType } from '../components/SettingModal/types';
import { useBrokerData } from '../components/SettingModal/useBrokerData';
import { DEFAULT_GROUP, DRAFT_TABLE_PAGE_SIZE, REPEATED_PREFIX_LIST } from '../constants';
import { getGroupDetailData, hasPendingStatus } from '../utils';

const TableStateContainer = createContainer(() => {
  const queryClient = useQueryClient();
  const { productType } = useProductParams();

  const tableRef = useRef<TableInstance>(null);

  const [activeTableKey, setActiveTableKey] = useState(QuoteDraftMessageStatus.QuoteDraftMessageStatusPending);
  const [selectedMessageKey, setSelectedMessageKey] = useState<string>();
  const [selectedDetailKeys, setSelectedDetailKeys] = useState(new Set<string>());
  /** 需要截止实时监听的时间戳（创建时间比该时间戳大的 message 不会被实时监听） */
  const [keepingTimestamp, setKeepingTimestamp] = useState(0);
  const [keepPrevious, setKeepPrevious] = useState(true);
  const { brokerGroupId } = useBrokerData({ productType });

  const { getSetting } = useUserSetting<QuoteDraftSettingsGroupsType>([
    UserSettingFunction.UserSettingQuoteDraftBrokerGroups,
    UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup
  ]);

  const followingBroker = useMemo(() => {
    try {
      const brokerGroups = getSetting<BrokerGroup[]>(UserSettingFunction.UserSettingQuoteDraftBrokerGroups) || [
        DEFAULT_GROUP
      ];
      // 如果不是数组，这里就返回默认数组中的brokers
      if (!Array.isArray(brokerGroups)) {
        return JSON.stringify(DEFAULT_GROUP.brokers);
      }

      let brokerId = brokerGroupId;
      if (!brokerGroups.some(v => v.id === brokerGroupId)) brokerId = brokerGroups[0].id;

      // 序列化
      return JSON.stringify(brokerGroups?.find(item => item.id === brokerId)?.brokers);
    } catch (e) {
      console.error(e, '这个错误不能忽略，别忘了检查');
      return '[]';
    }
  }, [brokerGroupId, getSetting]);

  const followingBrokerIds = useMemo(
    () => parseJSON<User[]>(followingBroker)?.map(user => user.user_id) ?? [],
    [followingBroker]
  );

  const [page, setPage] = useState(1);

  // const commonQueryParams = {
  //   status: activeTableKey,
  //   creatorIdList: followingBrokerIds,
  //   productType,
  //   offset: (page - 1) * DRAFT_TABLE_PAGE_SIZE,
  //   count: DRAFT_TABLE_PAGE_SIZE
  // };

  // const messagesQuery = useQuoteDraftMessageListQuery({
  //   ...commonQueryParams,
  //   disabled: !!keepingTimestamp,
  //   keepPrevious,
  //   onSuccess: () => setKeepPrevious(true)
  // });

  // const keepingMessagesQuery = useQuoteDraftMessageListQuery({
  //   ...commonQueryParams,
  //   timestamp: keepingTimestamp,
  //   disabled: !keepingTimestamp
  // });

  const localServerCommonParams = {
    product_type: productType,
    broker_id_list: followingBrokerIds,
    message_status: activeTableKey,
    offset: (page - 1) * DRAFT_TABLE_PAGE_SIZE,
    count: DRAFT_TABLE_PAGE_SIZE
  };

  const localServerMessagesQuery = useQuoteDraftMessageQuery({
    params: { ...localServerCommonParams, end_time: keepingTimestamp ? String(keepingTimestamp) : undefined },
    // enable: !keepingTimestamp,
    enable: true,
    keepPreviousData: keepPrevious,
    onSuccess: () => setKeepPrevious(true)
  });

  // const localServerKeepingMessagesQuery = useQuoteDraftMessageQuery({
  //   params: { ...localServerCommonParams, end_time: String(keepingTimestamp) },
  //   enable: !!keepingTimestamp
  // });

  // const { messages: queryMessages = [], total: queryTotal = 0, latestCreateTime } = messagesQuery?.data ?? {};
  // const { messages: keepingMessages = [], total: keepingTotal = 0, hasMore } = keepingMessagesQuery?.data ?? {};
  const { list: queryMessages = [], total: queryTotal = 0, last_create_time } = localServerMessagesQuery?.data ?? {};
  // const { list: keepingMessages = [], total: keepingTotal = 0 } = localServerKeepingMessagesQuery?.data ?? {};

  const hasMore = Boolean(last_create_time && keepingTimestamp && +last_create_time > keepingTimestamp);

  // const usingKeepingData = Boolean(keepingTimestamp && !localServerKeepingMessagesQuery.isLoading);

  // const tableTotal = usingKeepingData ? keepingTotal : queryTotal;
  // const renderMessages = usingKeepingData ? keepingMessages : queryMessages;
  const tableTotal = queryTotal;
  const renderMessages = queryMessages;

  const tableData = useMemo(() => {
    const data: DraftGroupTableRowData[] = [];

    try {
      for (let i = 0, len = renderMessages.length; i < len; i++) {
        const message = renderMessages[i];

        const groupHeaderRowKey = `message_header_${message.message_id}`;
        const groupFooterRowKey = `message_footer_${message.message_id}`;
        const groupItemRowKeys: string[] = [];
        if (message?.detail_order_list)
          for (const item of message.detail_order_list) {
            if (item.detail_id_list?.length)
              for (const id of item.detail_id_list) groupItemRowKeys.push(`detail_${id}`);
          }

        /** 需要渲染在列表的 orders（无法识别的 order，即 detail_order_list 为空的不需要渲染在列表中）  */
        const orders = message?.detail_order_list?.filter(order => order.detail_id_list?.length) ?? [];
        const ordersLen = orders.length;

        const details = message?.detail_list ?? [];
        const detailsLen = details.length;

        const messageData: DraftGroupTableMessageData = {
          id: groupHeaderRowKey,
          type: DraftGroupTableRowType.Message,
          original: message,
          createTime: formatDate(message?.create_time, 'HH:mm:ss')
        };

        const messageRowData = { ...messageData, groupHeaderRowKey, groupItemRowKeys };
        data.push({ ...messageRowData, isGroupHeader: true });

        // 如果没有识别出来报价详情，直接把 footer 填入列表，并 continue
        if (!detailsLen) {
          data.push({ ...messageRowData, id: groupFooterRowKey, isGroupFooter: true });
          continue;
        }

        /** 该债券为第几个重复债券 */
        let repeatIdx = -1;
        /** 详情缓存 */
        const detailCache = new Map<string, LocalQuoteDraftDetail>();
        /** 重复债券与对应为第几个重复债券的缓存 */
        const bondRepeatedCache = new Map<string, number>();
        // 计算详情内债券是否有重复
        for (let j = 0; j < detailsLen; j++) {
          const detail = details[j];
          detailCache.set(detail.detail_id, detail);

          if (detail?.bond_info?.key_market) {
            const repeatNum = bondRepeatedCache.get(detail.bond_info.key_market);

            if (repeatNum !== void 0) {
              if (repeatNum === -1) {
                repeatIdx += 1;
                bondRepeatedCache.set(detail.bond_info.key_market, repeatIdx);
              }
            } else {
              bondRepeatedCache.set(detail.bond_info.key_market, -1);
            }
          }
        }

        let idOrder = 0;

        for (let j = 0; j < ordersLen; j++) {
          let isGroupFirst = false;
          let isGroupLast = false;

          if (j === 0) isGroupFirst = true;

          const order = orders[j];
          const { corresponding_line, detail_id_list = [] } = order;
          const detailIdsLen = detail_id_list.length;

          let text = message?.text_list?.[corresponding_line] ?? '';

          for (let k = 0; k < detailIdsLen; k++) {
            if (j === 0 && k !== 0) isGroupFirst = false;
            if (j === ordersLen - 1 && k == detailIdsLen - 1) isGroupLast = true;

            const detailId = detail_id_list[k];
            const detail = detailCache.get(detailId);

            if (k > 0) text = '';

            const detailData: DraftGroupTableDetailData = {
              id: groupItemRowKeys[idOrder],
              type: DraftGroupTableRowType.Detail,
              original: detail,
              correspondingLine: corresponding_line,
              text,
              bondRepeatedPrefix: REPEATED_PREFIX_LIST[bondRepeatedCache.get(detail?.bond_info?.key_market ?? '') ?? -1]
            };

            idOrder += 1;
            data.push({ ...detailData, isGroupFirst, isGroupLast, groupHeaderRowKey, groupItemRowKeys });
          }
        }
      }

      return data;
    } catch {
      return data;
    }
  }, [renderMessages]);

  const indexCache = useMemo(() => {
    const cache = new Map<string, number>();

    for (let i = 0, len = tableData.length; i < len; i++) {
      const item = tableData[i];
      cache.set(item.id, i);
    }

    return cache;
  }, [tableData]);

  const selectedCache = useMemo(() => {
    /** 已选中的消息 */
    let message: DraftGroupTableMessageData | undefined = void 0;
    /** 已选中的详情的数组 */
    const details: DraftGroupTableDetailData[] = [];
    /** 已选中的消息分组下所有详情的数组 */
    let group: DraftGroupTableDetailData[] = [];

    if (selectedMessageKey) {
      const selectedMessageIdx = indexCache.get(selectedMessageKey);
      if (selectedMessageIdx !== void 0) {
        message = tableData[selectedMessageIdx] as DraftGroupTableMessageData;

        group = getGroupDetailData(message, tableData, indexCache, detail => {
          if (selectedDetailKeys.has(detail.id)) details.push(detail);
        });
      }
    }

    return { message, details, group };
  }, [selectedMessageKey, selectedDetailKeys, indexCache, tableData]);

  const selectedDetails = useMemo(
    () => selectedCache.details.map(item => item?.original).filter(Boolean),
    [selectedCache.details]
  );

  const showIgnore = useMemo(() => {
    const statuses = new Set(selectedDetails.map(item => item?.status).filter(Boolean));
    if (!statuses.size) return false;
    if (hasPendingStatus(statuses)) return true;
    return false;
  }, [selectedDetails]);

  /** 是否能够操作 */
  const operable = activeTableKey !== QuoteDraftMessageStatus.QuoteDraftMessageStatusProcessed;

  const updateKeepingTimestamp = useMemoizedFn((params?: { reset?: boolean }) => {
    if (params?.reset) {
      setKeepingTimestamp(0);
      setPage(1);
      return;
    }

    if (last_create_time && !keepingTimestamp) setKeepingTimestamp(+last_create_time);
  });

  const updateActiveTableKey = (key: QuoteDraftMessageStatus) => {
    setActiveTableKey(key);
    updateKeepingTimestamp({ reset: true });
    setKeepPrevious(false);
    setPage(1);
  };

  const optimisticUpdate = (target: LocalQuoteDraftMessage) => {
    // const queryKey = usingKeepingData ? localServerKeepingMessagesQuery.queryKey : localServerMessagesQuery.queryKey;
    const { queryKey } = localServerMessagesQuery;

    queryClient.setQueryData<QuoteDraftMessageListQueryResult | undefined>(queryKey, prev => {
      return {
        ...prev,
        messages:
          prev?.messages?.map(message => {
            if (message.message_id === target.message_id && Date.now() > Number(message.update_time)) {
              return { ...message, ...target };
            }
            return message;
          }) ?? []
      };
    });
  };

  return {
    tableRef,

    activeTableKey,
    selectedMessageKey,
    setSelectedMessageKey,
    selectedDetailKeys,
    setSelectedDetailKeys,

    updateKeepingTimestamp,
    updateActiveTableKey,
    optimisticUpdate,

    followingBroker,
    followingBrokerIds,
    page,
    setPage,

    queryMessages,
    renderMessages,
    tableData,
    tableTotal,
    hasMore,

    indexCache,
    selectedCache,

    selectedDetails,
    showIgnore,
    operable
  };
});

export const TableStateProvider = TableStateContainer.Provider;
export const useTableState = TableStateContainer.useContainer;
