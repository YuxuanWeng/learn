import { Icon, IconDtmDisposition, IconDtmFull, IconDtmReceipt, IconDtmTransaction } from '@fepkg/icon-park-react';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { RouteUrl } from '@/router/constants';

export type NavigateMenuItem = {
  /** Id */
  url?: string;
  /** 文案内容 */
  label: string;
  /** 是否选中 */
  checked?: boolean;
  /** Icon */
  icon?: Icon;
  subMenu?: NavigateMenuItem[];
};

const backendSettingList = [
  {
    productType: ProductType.BNC,
    label: '利率债'
  },
  {
    productType: ProductType.BCO,
    label: '信用债'
  },
  {
    productType: ProductType.NCD,
    label: '存单'
  }
];

const getNavigateMenuItemMap = (productTypeList?: ProductType[]) => {
  const backendSettingMenu: NavigateMenuItem = {
    label: '后台配置',
    icon: IconDtmDisposition,
    subMenu: []
  };
  for (const item of backendSettingList) {
    if (productTypeList?.includes(item.productType)) {
      backendSettingMenu.subMenu?.push({ url: `${RouteUrl.BackendSetting}/${item.productType}`, label: item.label });
    }
  }

  return [
    [AccessCode.CodeDTMApprovalPage, { url: RouteUrl.ApprovalList, label: '审核列表', icon: IconDtmReceipt }],
    [AccessCode.CodeDTMHistoryPage, { url: RouteUrl.ApprovalHistoryList, label: '全量查询', icon: IconDtmFull }],
    [
      AccessCode.CodeDTMCompletedHistoryPage,
      { url: RouteUrl.ApprovalDealList, label: '成交查询', icon: IconDtmTransaction }
    ],
    [AccessCode.CodeDTMSettingRole, backendSettingMenu],
    [AccessCode.CodeDTMSettingRule, backendSettingMenu]
  ] as [AccessCode, NavigateMenuItem][];
};

export const getNavigateMenu = (access?: Set<AccessCode>, productTypeList?: ProductType[]) => {
  const menuList: NavigateMenuItem[] = [];

  const navigateMenuItemMap = getNavigateMenuItemMap(productTypeList);

  for (const [accessCode, item] of Object.values(navigateMenuItemMap)) {
    // 如果有权限，往导航栏里塞
    if (access?.has(Number(accessCode) as AccessCode)) {
      // 如果 label 已经有了，不塞
      if (menuList.some(m => m.label === item.label)) continue;
      else menuList.push(item);
    }
  }

  return menuList;
};

export const getActiveLabel = (menu: NavigateMenuItem[], isActiveUrl: (url?: string) => boolean): string => {
  for (const item of menu) {
    if (isActiveUrl(item.url)) {
      return item.label;
    }
    if (item.subMenu) {
      return getActiveLabel(item.subMenu, isActiveUrl);
    }
  }
  return '';
};
