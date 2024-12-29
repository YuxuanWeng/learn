import { useRef } from 'react';
import { UserAccessGrantType } from '@fepkg/services/types/enum';
import { groupBy, sortBy } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { miscStorage } from '@/localdb/miscStorage';
import { useAccessGrant } from '@/pages/Base/SystemSetting/components/TradeSettings/useAccessGrant';

export type InitialStateData = { brokerId: string; count: number; needBridge: boolean };

type InitialState = { /** 明细列表数据 */ data?: InitialStateData[] };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DealBrokersContainer = createContainer((initialState: InitialState) => {
  const { data } = initialState;
  const brokerGroupById = groupBy(data, 'brokerId');
  const { granterUsers } = useAccessGrant(UserAccessGrantType.UserAccessGrantTypeDealDetailBridge);

  const brokerMapRef = useRef<Record<string, HTMLDivElement>>({});

  const mergeGranterUsers = granterUsers?.map(v => ({ ...v, ...brokerGroupById[v.user_id]?.[0] }));

  return {
    granterUsers: sortBy(mergeGranterUsers, a => (a.user_id === miscStorage.userInfo?.user_id ? -1 : 1)),
    brokerMapRef
  };
});

/** 明细面板的一些全局状态 */
export const DealBrokersProvider = DealBrokersContainer.Provider;
export const useDealBrokers = DealBrokersContainer.useContainer;
