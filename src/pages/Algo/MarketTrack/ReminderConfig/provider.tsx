import { useMemo, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { createContainer } from 'unstated-next';
import { miscStorage } from '@/localdb/miscStorage';
import { EXPANDED_STATE } from './constants';
import { useQuerySetting } from './hooks/useQuerySetting';
import { OppositePriceNotifyLogicTable } from './types';

const ReminderConfigContainer = createContainer(() => {
  // 需要记住每次展开/收起的状态
  const user_id = miscStorage.userInfo?.user_id;
  const [expanded, setExpanded] = useLocalStorage(`${EXPANDED_STATE}-${user_id}`, false);
  const [modalOpen, setModalOpen] = useState(false);

  const query = useQuerySetting();

  const notifyLogics = useMemo<OppositePriceNotifyLogicTable[]>(
    () =>
      (query.data?.notify_logic ?? []).map(i => ({
        ...i,
        id: `${i.notify_logic_name}-${i.notify_logic_type}`
      })),
    [query.data]
  );

  return {
    expanded,
    modalOpen,
    setModalOpen,
    setExpanded,
    setting: query.data,
    settingRefetch: query.refetch,
    notifyLogics
  };
});

export const ReminderConfigProvider = ReminderConfigContainer.Provider;
export const useReminderConfig = ReminderConfigContainer.useContainer;
