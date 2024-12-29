import { ReactNode, createContext, useContext } from 'react';
import { ShortcutSidebarProps } from './types';

const ShortcutSidebarPropsCtx = createContext<ShortcutSidebarProps | null>(null);

export const useShortcutSidebarProps = () => {
  const ctx = useContext(ShortcutSidebarPropsCtx);
  if (!ctx) throw new Error('Please use ShortcutSidebarPropsProvider.');
  return ctx;
};

export const ShortcutSidebarPropsProvider = ({
  children,
  ...props
}: ShortcutSidebarProps & { children: ReactNode }) => {
  return <ShortcutSidebarPropsCtx.Provider value={props}>{children}</ShortcutSidebarPropsCtx.Provider>;
};
