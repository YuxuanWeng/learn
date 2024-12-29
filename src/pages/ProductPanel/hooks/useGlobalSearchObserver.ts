import { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import { DialogChannelAction, DialogChannelData } from 'app/types/dialog-v2';
import { WindowName } from 'app/types/window-v2';
import { useChildPorts } from '@/common/atoms';
import { useProductParams } from '@/layouts/Home/hooks';
import { useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { useMainGroupData } from '../providers/MainGroupProvider';
import { useResetTablePage } from './useResetTablePage';

export const useGlobalSearchObserver = (names: Set<WindowName>) => {
  const { panelId } = useProductParams();
  const { setActiveTableKey, groupStoreKey } = useProductPanel();
  const { activeGroupState } = useMainGroupData();

  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);
  const { ports } = useChildPorts(names);

  const handleMessage = useMemoizedFn((evt: MessageEvent<DialogChannelData>) => {
    const groupId = activeGroupState.activeGroup?.groupId;

    if (evt.data && evt.data?.action === DialogChannelAction.UpdateGlobalSearch) {
      const { action, panelId: dataPanelId, tableKey, ...inputFilter } = evt.data;

      if (dataPanelId === panelId) {
        setActiveTableKey(prev => {
          if (tableKey && prev !== tableKey) return tableKey;
          return prev;
        });

        updateGlobalSearch({ groupId, inputFilter });
      }
    }
  });

  useEffect(() => {
    for (const port of ports) port?.addEventListener('message', handleMessage);
    return () => {
      for (const port of ports) port?.removeEventListener('message', handleMessage);
    };
  }, [ports, handleMessage]);
};
