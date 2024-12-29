import { isNCD } from '@fepkg/business/utils/product';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { uniqBy } from 'lodash-es';
import { isProd } from '@/common/utils';
import { getNCDAccess } from '@/common/utils/access';
import { miscStorage } from '@/localdb/miscStorage';
import { SortablePosition } from '@/types/sortable';
import { DEFAULT_NAVIGATOR_MENU, getNavigatorInfoMap } from './constants';
import { NavigatorItemId, NavigatorMenuItem, NavigatorSortableData } from './types';

export const getCRMBaseLink = () => {
  if (isProd()) return window.appConfig.crmURL;
  const env = miscStorage.apiEnv;
  if (env === 'test') return 'https://crm-oms-test.zoople.cn/';
  return `https://crm-${env}.zoople.cn/`;
};

export const openCRM = () => {
  window.Main.invoke(
    UtilEventEnum.OpenExternal,
    `${getCRMBaseLink()}login?loginToken=${miscStorage.token}&apiEnv=${miscStorage.apiEnv}`
  );
};

export const getReceiptDealApprovalLink = () => {
  if (isProd()) return window.appConfig.dtmURL;
  return `https://dtm-${miscStorage.apiEnv}.zoople.cn/`;
};

export const openReceiptDealApproval = () => {
  const url = `${getReceiptDealApprovalLink()}login?loginToken=${miscStorage.token}&apiEnv=${miscStorage.apiEnv}`;
  window.Main.invoke(UtilEventEnum.OpenExternal, url);
};

/** 获取插入排序的位置 */
export const getInsertPosition = (id: UniqueIdentifier, over: Over | null, active: Active | null) => {
  let position: SortablePosition | undefined;

  if (over?.disabled) return position;

  if (over && over.id === id && over.id !== active?.id) {
    const translated = active?.rect.current.translated;

    if (translated) {
      const overHalfHeight = over.rect.height / 2;
      const overCenter = over.rect.top + overHalfHeight;
      const dragCenter = translated.top + translated.height / 2;

      // 如果 drag 的中心比 over 的中心在 y 轴上要大，说明要往下插入排序，反之则往上插入排序
      position = dragCenter >= overCenter ? SortablePosition.After : SortablePosition.Before;

      const overData = over?.data.current?.sortable as NavigatorSortableData | undefined;
      const activeData = active?.data.current?.sortable as NavigatorSortableData | undefined;

      // 如果是同一个 SortableContext 内
      if (overData?.containerId === activeData?.containerId) {
        const overIndex = overData?.index;
        const activeIndex = activeData?.index;

        if (overIndex !== undefined && activeIndex !== undefined) {
          // 如果为相邻项，并且满足：
          if (
            // active 在 over 下面，并且插入 over after
            (activeIndex - overIndex === 1 && position === SortablePosition.After) ||
            // active 在 over 上面，并且插入 over before
            (activeIndex - overIndex === -1 && position === SortablePosition.Before)
          ) {
            // 此时无须重新排序
            position = undefined;
          }
        }
      }
    } else {
      position = undefined;
    }
  } else {
    position = undefined;
  }

  return position;
};

export const getNavigatorMenu = (
  productType: ProductType,
  remoteMenu: NavigatorMenuItem[],
  access: Set<AccessCode>
) => {
  const all: NavigatorMenuItem[] = uniqBy([...remoteMenu, ...DEFAULT_NAVIGATOR_MENU], 'id');
  let filtered = all.filter(item => access.has(getNavigatorInfoMap(productType)[item?.id]?.accessCode));

  const ncdAccess = getNCDAccess();
  // 如果当前处于存单台中，且只有 ncd 一级的权限，但没有 ncd 二级的权限，仅保留 Market，CRM，Setting，More 项
  if (isNCD(productType) && ncdAccess.ncdP && !ncdAccess.ncd) {
    const ncdPItems = new Set([
      NavigatorItemId.Market,
      NavigatorItemId.CRM,
      NavigatorItemId.Setting,
      NavigatorItemId.More
    ]);
    filtered = filtered.filter(item => ncdPItems.has(item.id));
  } else if (isNCD(productType) && miscStorage.apiEnv === 'prod') {
    const ncdOnlineItems = new Set([
      NavigatorItemId.Market,
      NavigatorItemId.CoordinatedQuotation,
      NavigatorItemId.Calculator,
      NavigatorItemId.ReceiptDeal,
      NavigatorItemId.CRM,
      NavigatorItemId.Setting,
      NavigatorItemId.More,
      NavigatorItemId.IQuote
    ]);
    filtered = filtered.filter(item => ncdOnlineItems.has(item.id));
  }

  // 信用需要隐藏这些入口
  if (productType === ProductType.BCO) {
    const BCOHiddenItems = new Set([
      NavigatorItemId.BNCTrade,
      NavigatorItemId.Bridge,
      NavigatorItemId.TransactionDetails,
      NavigatorItemId.ReceiptDealApproval
    ]);
    filtered = filtered.filter(item => !BCOHiddenItems.has(item.id));
  }

  const res: NavigatorMenuItem[] = [];

  for (const item of filtered) {
    // 行情项始终置顶
    if (item.id === NavigatorItemId.Market) res.unshift(item);
    else res.push(item);
  }

  return res;
};
