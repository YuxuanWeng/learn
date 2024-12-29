import { parseJSON } from '@fepkg/common/utils';
import { UserSetting } from '@fepkg/services/types/common';
import { ProductType, UserSettingFunction } from '@fepkg/services/types/enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mulUpsertUserSetting } from '@/common/services/api/user/setting-mul-upsert';
import { getSettingsQueryKey, useSettings } from '@/common/services/hooks/useSettings';
import { BondQuoteTableColumnSetting, BondQuoteTableColumnSettingItem } from '@/pages/ProductPanel/types';
import { BondDetailTableType, getDefaultTableSettingItem } from './data';

export type SingleBondDetailTableColumnSettingParams = {
  productType: ProductType;
  type: BondDetailTableType;
};

const functionList = [
  UserSettingFunction.UserSettingBCOBondDetailColumn,
  UserSettingFunction.UserSettingBNCBondDetailColumn,
  UserSettingFunction.UserSettingABSBondDetailColumn
];

// TODO: 暂时使用原来的ABS UserSetting暂存NCD的列设置，亟待重构
const formatSettingFunction = (func: UserSettingFunction): ProductType => {
  return {
    [UserSettingFunction.UserSettingBCOBondDetailColumn]: ProductType.BCO,
    [UserSettingFunction.UserSettingBNCBondDetailColumn]: ProductType.BNC,
    [UserSettingFunction.UserSettingABSBondDetailColumn]: ProductType.NCD
  }[func];
};

const formatProductType = (productType: ProductType): UserSettingFunction => {
  return {
    [ProductType.BCO]: UserSettingFunction.UserSettingBCOBondDetailColumn,
    [ProductType.BNC]: UserSettingFunction.UserSettingBNCBondDetailColumn,
    [ProductType.NCD]: UserSettingFunction.UserSettingABSBondDetailColumn
  }[productType];
};

export type singleBondDetailMap = Record<ProductType, BondQuoteTableColumnSetting>;

/**
 * @deprecated 等债券详情表格设置改版后下线
 */
export const useTableColumnSetting = ({ productType, type }: SingleBondDetailTableColumnSettingParams) => {
  const { data: columnSettings, ...rest } = useSettings(functionList, {
    select(data) {
      const map = data?.setting_list?.reduce((prev, cur) => {
        const curProductType = formatSettingFunction(cur.function);
        /** 服务端存储对应的 UserSettingFunction 的配置项 */
        const remoteSetting = parseJSON<BondQuoteTableColumnSetting>(cur.value);

        const enumKeys = Object.keys(BondDetailTableType).map(k => BondDetailTableType[k]) as string[];

        const setting = enumKeys.reduce((p, c) => {
          const t = c as BondDetailTableType;
          const settingItem = {
            [c]:
              remoteSetting?.[t] && remoteSetting[t].length
                ? remoteSetting?.[t]
                : getDefaultTableSettingItem(curProductType, t)
          };
          return { ...p, ...settingItem };
        }, {} as BondQuoteTableColumnSetting);

        const mapItem = { [curProductType]: setting };
        return { ...prev, ...mapItem };
      }, {} as singleBondDetailMap);

      const settings =
        (map?.[productType]?.[type] as BondQuoteTableColumnSettingItem[]) ??
        getDefaultTableSettingItem(productType, type);

      return settings;
    }
  });
  return { columnSettings, ...rest };
};

const getSettingList = (
  cache: { setting_list?: UserSetting[] },
  productType: ProductType,
  type: BondDetailTableType,
  settingItem: BondQuoteTableColumnSettingItem[]
) => {
  const func = formatProductType(productType);
  // 如果初始没有这条表格列设置，则需要新增进去
  const userSetting = cache.setting_list?.find(item => item.function === func) ?? { function: func, value: '{}' };

  const tableColumnSetting = parseJSON<BondQuoteTableColumnSetting>(userSetting.value) ?? {};
  tableColumnSetting[type] = settingItem;
  const settingList = cache.setting_list
    ?.filter(item => item.function !== func)
    .concat({
      function: func,
      value: JSON.stringify(tableColumnSetting)
    });
  return settingList;
};

export const useTableColumnSettingMutation = ({ productType, type }: SingleBondDetailTableColumnSettingParams) => {
  const queryClient = useQueryClient();
  const queryKey = getSettingsQueryKey(functionList);
  const mutationFn = (settingItem: BondQuoteTableColumnSettingItem[]) => {
    // 当前 query 缓存
    const cache = queryClient.getQueryData(queryKey, { exact: true }) as { setting_list?: UserSetting[] };

    const setting_list = getSettingList(cache, productType, type, settingItem);
    return mulUpsertUserSetting({ setting_list });
  };

  const { mutate: updateColumnSetting, ...rest } = useMutation({
    mutationFn,
    onMutate(settingItem) {
      // 当前 query 缓存
      const cache = queryClient.getQueryData(queryKey, { exact: true }) as { setting_list?: UserSetting[] };

      const setting_list = getSettingList(cache, productType, type, settingItem);
      // 乐观更新
      queryClient.setQueryData(queryKey, { setting_list });

      // 乐观更新失败的回滚函数
      return () => {
        queryClient.setQueryData(queryKey, cache);
      };
    },
    onError(_, __, restoreCache) {
      // 失败时回滚缓存内的内容
      restoreCache?.();
    }
  });

  return { updateColumnSetting, ...rest };
};
