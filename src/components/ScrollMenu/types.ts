import { ReactNode } from 'react';

export enum ScrollMenuIDType {
  AccountSafe = 'AccountSafe',
  QuoteSettings = 'QuoteSettings',
  ShowSettings = 'ShowSettings',
  TradeSettings = 'TradeSettings',
  ShortCut = 'ShortCut',
  SystemManage = 'SystemManage'
}

export type ScrollMenuItem = {
  /** id */
  id: ScrollMenuIDType;
  /** 名称 */
  label: string;
  /** 渲染内容 */
  item: React.ReactNode;
};

export type OptionsProps = {
  /** 监听锚点的区域dom的id */
  anchorId: string;
  /** options列表 */
  data?: ScrollMenuItem[];
  /** 当前选中的option的value */
  activeKey?: string;
  /** 点击事件 */
  onClick?: (
    link: {
      title: React.ReactNode;
      href: string;
    },
    e: React.MouseEvent<HTMLElement>
  ) => void;
  /** change事件 */
  onChange?: (val: string) => void;
};

export type QuotationGroupProps = {
  /** 监听锚点的区域dom的id */
  anchorId: string;
  /** 组件图标 */
  icon?: ReactNode;
  /** 组件标题 */
  title: string;
  /** 额外的样式 */
  className?: string;
  /** 当前选中的分组 */
  activeKey?: string;
  /** 分组列表 */
  options?: ScrollMenuItem[];
  /** 点击事件 */
  onClick?: (
    link: {
      title: React.ReactNode;
      href: string;
    },
    e: React.MouseEvent<HTMLElement>
  ) => void;
  /** change事件 */
  onChange?: (val: string) => void;
};
