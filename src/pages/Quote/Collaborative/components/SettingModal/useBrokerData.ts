import { useEffect } from 'react';
import { parseJSON } from '@fepkg/common/utils/utils';
import { ProductType, UserSettingFunction } from '@fepkg/services/types/enum';
import { useLocalStorage } from 'usehooks-ts';
import { LSKeys } from '@/common/constants/ls-keys';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import {
  getOneUserSettingsRawValue,
  saveUserSettingsByProductType
} from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { DEFAULT_SELECTED_GROUP } from '../../constants';
import { QuoteDraftSettingsGroupsType } from './types';

type Props = { productType: ProductType };

/** 获取和更新协同分组默认broker */
export const useBrokerData = ({ productType }: Props) => {
  const { getSetting } = useUserSetting<QuoteDraftSettingsGroupsType>([
    UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup
  ]);

  // const initData = () => {
  //   const localStorageV = getOneUserSettingsRawValue(UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup);
  //   if (localStorageV) {
  //     return parseJSON<Record<number, string>>(localStorageV);
  //   }
  //   return undefined;
  // };

  const groupId =
    getSetting<string>(UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup) ?? DEFAULT_SELECTED_GROUP;

  // TODO 兼容旧数据的写法，间隔1～2版本之后可以将读取原有服务端数据的逻辑去掉
  // 疑似重复的缓存，
  // const [brokerMap, setBrokerMap] = useLocalStorage<Record<number, string>>(
  //   LSKeys.QuoteDraftCurrentBrokerID,
  //   // 这里只是赋予默认值，如果该id对应的缓存已经存在，该逻辑不会更新本地缓存
  //   initData() ?? { [productType]: groupId }
  // );

  // useEffect(() => {
  //   const data = initData();
  //   // 如果brokerMap对应的groupId对不上最新的缓存，就更新该缓存
  //   if (data && brokerMap[productType] !== groupId) setBrokerMap(data);
  // }, [brokerMap, groupId, productType, setBrokerMap]);

  // TODO 兼容旧数据的写法，间隔1～2版本之后可以将读取原有服务端数据的逻辑去掉
  /** 切换分组更新用户设置和localStorage */
  const updateSettingSelectedGroup = (group: string) => {
    // setBrokerMap({
    //   ...brokerMap,
    //   [productType]: group ?? ''
    // });
    const newValue = {
      [UserSettingFunction.UserSettingQuoteDraftCurrentBrokerGroup]: group
    };
    // 这个逻辑是不可删除的，切换分组需要请求服务端，否则服务端无法感知
    return saveUserSettingsByProductType(newValue, [productType]);
  };

  return { brokerGroupId: groupId, updateSettingSelectedGroup };
};
