import { parseJSON } from '@fepkg/common/utils';
import { APIs } from '@fepkg/services/apis';
import { OppositePriceNotificationSetting, OppositePriceNotifyLogic, RangeInteger } from '@fepkg/services/types/common';
import { OppositePriceNotifyLogicType } from '@fepkg/services/types/enum';
import type { OppositePriceNotificationSettingUpsert } from '@fepkg/services/types/opposite-price-notification/setting-upsert';
import { useMutation } from '@tanstack/react-query';
import { updateOppositePriceNotificationSetting } from '@/common/services/api/opposite-price-notification/setting-upsert';
import { transformRemainDaysConfig } from '@/common/utils/date';
import { queryClient } from '@/common/utils/query-client';
import { GeneralFilterValue } from '@/components/BondFilter/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { transformCheckboxValue } from '@/pages/ProductPanel/utils';
import { useReminderConfig } from '../provider';
import { OppositePriceNotifyLogicTable } from '../types';

// 这块需要把整体逻辑都找个地方说明一下
const numRegExp = /\((\d{1,})\)/;

/** 获取节假日的入参 */
const getRemainDaysList = (generalFilter?: RangeInteger[]) => {
  if (!generalFilter) return [];
  return generalFilter
    ?.map(v => transformRemainDaysConfig(v as string))
    ?.map(v => (typeof v === 'string' ? parseJSON<RangeInteger>(v) : v))
    ?.filter(item => item != undefined) as RangeInteger[] | undefined;
};

/** 获取复制逻辑的名字-添加序号的规则为逐一增加，优先补齐被删除的序号 */
const getAddName = (list: OppositePriceNotifyLogic[], target: OppositePriceNotifyLogicTable) => {
  // 整理出已经被复制过的话术序号集合
  const res = list.reduce<Record<number, boolean>>((prev, curr) => {
    if (curr.notify_logic_type !== target.notify_logic_type) return prev;
    const matched = curr.notify_logic_name.match(numRegExp);
    const num = +(matched?.at(1) ?? '');
    prev[num] = true;
    return prev;
  }, {});

  // 提醒逻辑的序号
  let idx = 0;
  for (const key in res) {
    if (!Object.prototype.hasOwnProperty.call(res, key)) continue;
    const index = +key + 1;
    // 如果序号不存在整理的集合中就返回这个序号
    if (!res[index]) {
      idx = index;
      break;
    }
  }

  const result = `${target.notify_logic_name}(${idx})`;
  return result;
};

export const useMutationSetting = () => {
  const { settingRefetch, setting, notifyLogics } = useReminderConfig();
  const { productType } = useProductParams();

  const queryKey = [APIs.oppositePriceNotification.setting.get];
  const cache = queryClient.getQueryData<OppositePriceNotificationSetting>(queryKey, { exact: true });
  const mutateQueryData = async (data?: OppositePriceNotificationSetting) => {
    await queryClient.cancelQueries(queryKey, { exact: true });
    // 乐观更新
    queryClient.setQueryData(queryKey, data);
  };

  const { mutate } = useMutation({
    mutationFn: updateOppositePriceNotificationSetting,
    onMutate(variables) {
      const a = { ...cache, ...variables } as OppositePriceNotificationSetting;
      mutateQueryData(a);
      return () => {
        mutateQueryData(cache);
      };
    },
    onError(_, __, restoreCache) {
      // 修改失败，回滚到上一次的缓存
      restoreCache?.();
    },
    onSuccess: () => settingRefetch()
  });

  /** 更新提醒配置 */
  function updateLogics(params: OppositePriceNotifyLogicTable) {
    // 有历史成交合有即时成交
    const linkageList = new Set([
      OppositePriceNotifyLogicType.NotifyLogicTypeHasCurrentDeal,
      OppositePriceNotifyLogicType.NotifyLogicTypeHasHistDeal
    ]);
    const result: OppositePriceNotifyLogic[] = notifyLogics.map(i => {
      // 是当前修改的逻辑，就所有要素全部同步
      if (i.id === params.id) {
        return { ...params, id: void 0 };
      }
      // 如果修改的是有历史/即时成交
      if (linkageList.has(params.notify_logic_type) && linkageList.has(i.notify_logic_type)) {
        // 始终保持着两个逻辑的n_value一致
        return { ...i, n_value: params.n_value, id: void 0 };
      }
      // 保持原来的要素，并去掉id
      return { ...i, id: void 0 };
    });
    mutate({ ...setting, notify_logic: result, product_type: productType });
  }

  /** 更新债券组维护 */
  function updateBondGroup(params: GeneralFilterValue) {
    const maturity_is_holiday = transformCheckboxValue(params.maturity_is_holiday);
    mutate({
      ...setting,
      bond_filter_logic: {
        ...params,
        maturity_is_holiday,
        remain_days_list: getRemainDaysList(params.remain_days_list)
      },
      product_type: productType
    });
  }

  /** 点击提醒逻辑列中的图标(复制/删除) */
  function handleClick(params: OppositePriceNotifyLogicTable) {
    const result: OppositePriceNotifyLogic[] = [];
    // 由复制产生，执行删除操作
    if (params.copied) {
      const listAfterDel: OppositePriceNotifyLogic[] = notifyLogics.reduce((prev, curr) => {
        if (curr.id !== params.id) {
          const res: Partial<OppositePriceNotifyLogicTable> = { ...curr };
          delete res.id;
          prev.push(res as OppositePriceNotifyLogic);
        }
        return prev;
      }, [] as OppositePriceNotifyLogic[]);
      result.push(...listAfterDel);
    } else {
      const notifyLogicList = setting?.notify_logic ?? [];
      // 复制的逻辑N值为空，开关默认关
      const newAdd = {
        ...params,
        id: void 0,
        notify_logic_id: '0',
        notify_logic_name: getAddName(notifyLogicList, params),
        copied: true,
        n_value: void 0,
        turn_on: false
      };
      // 不带序号的逻辑名称一定是原逻辑
      const idx = notifyLogicList.findIndex(
        i => i.notify_logic_type === newAdd.notify_logic_type && !numRegExp.test(i.notify_logic_name)
      );
      result.push(...notifyLogicList);
      // 通过复制新增的逻辑需要紧跟在原话术的后面
      result.splice(idx + 1, 0, newAdd);
    }
    mutate({ ...setting, notify_logic: result, product_type: productType });
  }

  function updateSetting(params: Omit<OppositePriceNotificationSettingUpsert.Request, 'product_type'>) {
    mutate({ ...setting, ...params, product_type: productType });
  }

  return { update: updateSetting, updateLogics, updateBondGroup, handleClick };
};
