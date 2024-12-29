import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { isNCD } from '@fepkg/business/utils/product';
import { parseJSON } from '@fepkg/common/utils';
import { ProductType } from '@fepkg/services/types/enum';
import { DialogEvent } from 'app/types/IPCEvents';
import { includes } from 'lodash-es';
import { CacheProductType, getLSKey, LSKeys } from '@/common/constants/ls-keys';
import { fetchFilterGroup } from '@/common/services/api/filter-group/get';
import { QuoteFilterGroupItem } from '@/common/services/hooks/useFilterGroupQuery';
import { getNCDAccess } from '@/common/utils/access';
import {
  getGroupStructsFromLocalForage,
  getTableCache
} from '@/pages/ProductPanel/providers/MainGroupProvider/storage';
import { GroupManageItem, ManageQueryResult } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { transToGroupManageItem } from '@/pages/ProductPanel/providers/MainGroupProvider/utils';

export const preloadGroupManageItems = async (productTypeList: ProductType[], cacheProductType: ProductType) => {
  try {
    const groups = ((
      await fetchFilterGroup({ product_type_list: productTypeList }, { skipTrace: true })
    )?.quote_filter_group_list?.map(item => ({
      ...item,
      desc: parseJSON<ManageQueryResult>(item.desc)
    })) ?? []) as QuoteFilterGroupItem[];
    const groupStoreKey = getLSKey(LSKeys.MainGroup, cacheProductType);
    const localGroupList = (await getGroupStructsFromLocalForage(groupStoreKey)) || [];
    return (
      groups
        .map(group => {
          const oldLocalGroup = localGroupList?.find(item => item.groupId === group.group_id);
          return transToGroupManageItem(group, oldLocalGroup);
        })
        .filter(Boolean) ?? []
    );
  } catch {
    return [];
  }
};

export const getPreloadActiveGroupId = async (
  preloadItems: GroupManageItem[] | undefined,
  singleGroupId: string,
  ncdMode: boolean
): Promise<string | undefined> => {
  if (!preloadItems?.length) return undefined;
  if (singleGroupId) return preloadItems.find(item => item.groupId === singleGroupId)?.groupId;
  const cachedProductIds = await window.Main?.invoke?.<string[]>(DialogEvent.GetProductPanelCacheWindows);
  if (cachedProductIds?.length || ncdMode) {
    if (ncdMode) {
      const ncdAccess = getNCDAccess();
      if (ncdAccess.ncd) {
        const targetId = preloadItems.find(
          item => item.productType === ProductType.NCD && !includes(cachedProductIds, item.groupId)
        )?.groupId;
        if (targetId) return targetId;
      }
      if (ncdAccess.ncdP) {
        return preloadItems.find(
          item => item.productType === ProductType.NCDP && !includes(cachedProductIds, item.groupId)
        )?.groupId;
      }
      return undefined;
    }
    const targetId = preloadItems.find(item => !includes(cachedProductIds, item.groupId))?.groupId;
    return targetId || preloadItems[0].groupId;
  }
  return preloadItems[0].groupId;
};

export const productPanelLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // 这里是下次要恢复的groupId，主页没有值，新的行情看板有值
  const singleGroupId = url.searchParams.get('groupId');
  const isShared = url.searchParams.get('isSharedGroup') === 'true';

  // 是否是单券模式
  const isSingleMode = !!singleGroupId;

  const productType = Number(params.productType) || ProductType.BNC;
  let productTypeList = [productType];
  let cacheProductType = productType;
  if (isNCD(productType)) {
    // NCD/NCDP数据用同一个列表进行缓存
    cacheProductType = CacheProductType.NCDALL;
    productTypeList = [ProductType.NCD, ProductType.NCDP];
  }
  const groups = await preloadGroupManageItems(productTypeList, cacheProductType);
  const groupStoreKey = getLSKey(LSKeys.MainGroup, cacheProductType);
  const activeGroupId = await getPreloadActiveGroupId(groups, singleGroupId || '', isNCD(productType));

  let activeProductType: ProductType | undefined;
  if (isNCD(productType)) {
    if (!activeGroupId) activeProductType = getNCDAccess().ncd ? ProductType.NCD : ProductType.NCDP;
    const ncdActiveGroup = groups?.find(group => group?.groupId === activeGroupId);
    activeProductType = ncdActiveGroup?.productType;
  }

  const activeGroupTableCache = (await getTableCache(groupStoreKey, activeGroupId)).tableCache;

  return {
    singleGroupId,
    isShared,
    isSingleMode,
    groupStoreKey,
    groups,
    activeGroupId,
    activeGroupTableCache,
    productTypeList,
    // cacheProductType是指LS缓存中的productType标签，因为NCD一二级在首页中一致，因此为NCDALL，其它的与productType一致
    cacheProductType,
    activeProductType
  };
};

export const useProductPanelLoader = () => useLoaderData() as Awaited<ReturnType<typeof productPanelLoader>>;
