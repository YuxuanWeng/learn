import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { getActiveLabel, getNavigateMenu } from './utils';

export const HomeLayoutContainer = createContainer(() => {
  const { pathname } = useLocation();
  const { access, productTypeList } = useAuth();

  const [navigatorOpen, setNavigatorOpen] = useState(true);

  const menu = useMemo(() => getNavigateMenu(access, productTypeList), [access, productTypeList]);

  const isActiveUrl = useMemoizedFn((url?: string) => Boolean(url && pathname.startsWith(url)));

  const activeLabel = getActiveLabel(menu, isActiveUrl);

  const toggleNavigatorOpen = () => setNavigatorOpen(prev => !prev);

  return {
    access,
    menu,
    navigatorOpen,
    isActiveUrl,
    activeLabel,
    toggleNavigatorOpen
  };
});

export const HomeLayoutProvider = HomeLayoutContainer.Provider;
export const useHomeLayout = HomeLayoutContainer.useContainer;
