import { PropsWithChildren, ReactNode } from 'react';

export declare namespace SettingLayoutProps {
  type Layout = PropsWithChildren<{
    /** className */
    className?: string;
    /** container className */
    containerCls?: string;
    /** aside */
    aside?: ReactNode;
    /** header */
    header?: ReactNode;
  }>;

  type Aside = PropsWithChildren<{
    /** className */
    className?: string;
    /** 文案内容 */
    label: string;
    /** 后缀内容 */
    suffix?: ReactNode;
  }>;

  type Header = PropsWithChildren<{
    /** className */
    className?: string;
  }>;
}
