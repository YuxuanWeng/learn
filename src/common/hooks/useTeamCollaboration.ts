import { useMemo } from 'react';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { miscStorage } from '@/localdb/miscStorage';
import { TeamCollaboration } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { useUserSetting } from '../services/hooks/useSettings/useUserSetting';

export const useTeamCollaboration = () => {
  const userId = miscStorage.userInfo?.user_id;

  /** 我和我的团队 */
  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingTeamCollaboration]);
  const teamCollaboration = getSetting<TeamCollaboration>(UserSettingFunction.UserSettingTeamCollaboration);

  /** 当前台子的我和我的 Broker 团队 Id 列表 */
  const currProductTypeTeamBrokerIdList = useMemo(() => {
    /** 处理脏数据问题，原结构为[[ProductType.BCO, [userId]]], 新数据类型统一为{ [ProductType.BCO]: ProductType.BCO }
     * 防止新台子数据出现对象
     */
    const arr = Array.isArray(teamCollaboration) ? teamCollaboration : [];
    let list = arr.map(team => team.brokerId);

    if (userId) list = [...list, userId];
    return list.filter(Boolean);
  }, [teamCollaboration, userId]);

  return { teamCollaboration, currProductTypeTeamBrokerIdList };
};
