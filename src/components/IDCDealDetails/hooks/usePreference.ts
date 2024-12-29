import { useMemo } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import moment from 'moment';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';

// 目前只记录200条本地记录，超过则先入先出
const STORAGE_LENGTH = 200;

export type DealDetailStoStruct = {
  updateTime: number;
  content: DetailShowConfig;
};

export type DetailShowConfig = {
  showSide: boolean;
  showTimeRange: boolean;
  showShortName: boolean;
  showSum: boolean;
};

export const defaultDetailShowConfig: DetailShowConfig = {
  showSide: true,
  showTimeRange: true,
  showShortName: true,
  showSum: false
};

// 个人偏好设置hook 方向和汇总
export const useIDCDetailPreference = () => {
  // 初始按钮状态
  const cacheKey = getLSKeyWithoutProductType(LSKeys.DealDetailPreference);
  const [btnPreferenceList, setBtnPreferenceList] = useLocalStorage<[string, DealDetailStoStruct][]>(cacheKey, []);

  const btnPreferenceMap = useMemo(() => {
    return new Map(btnPreferenceList);
  }, [btnPreferenceList]);

  const getPreferenceValue = (groupId: string): DetailShowConfig => {
    const key = `${groupId}_v2`;
    return btnPreferenceMap.get(key)?.content ?? defaultDetailShowConfig;
  };

  /**
   *
   * @param groupId 分组id/交易员id
   * @param btnPreference 按钮状态
   */
  const onChangePreference = (groupId: string, btnPreference: DetailShowConfig) => {
    const stoStruct: DealDetailStoStruct = {
      updateTime: moment().valueOf(),
      content: btnPreference
    };
    const key = `${groupId}_v2`;
    const returnMap = new Map([...btnPreferenceMap, [key, stoStruct]]);
    if (!btnPreferenceMap.has(key) && btnPreferenceMap.size >= STORAGE_LENGTH) {
      const newList = btnPreferenceList.sort((a, b) => {
        return (a?.[1]?.updateTime || 0) - (b?.[1]?.updateTime || 0);
      });
      const deleteId = newList[0][0];
      returnMap.delete(deleteId);
    }
    setBtnPreferenceList([...returnMap]);
  };

  return { btnPreferenceMap, onChangePreference, getPreferenceValue };
};
