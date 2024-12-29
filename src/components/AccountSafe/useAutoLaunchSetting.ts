import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { miscStorage } from '@/localdb/miscStorage';

const AutoLaunchKey = 'systemSettings_auto_launch';

export const useAutoLaunchSetting = () => {
  const userId = miscStorage.userInfo?.user_id ?? '';
  const [autoLaunchSetting, setAutoLaunchSetting] = useLocalStorage<{ userId: string; autoLaunch: boolean }[]>(
    AutoLaunchKey,
    []
  );

  const changeAutoLaunch = (autoLaunch: boolean) => {
    // 最多存二十个修改过开机自动启动的用户配置，避免配置无限增加，修改后会移到数组最后
    setAutoLaunchSetting(prev => {
      return prev
        .slice(prev.length > 20 ? 1 : 0)
        .filter(i => i.userId !== userId)
        .concat({
          userId,
          autoLaunch
        });
    });
  };

  const getAutoLaunchByUser = (user_id?: string) => {
    return autoLaunchSetting.find(i => i.userId === user_id)?.autoLaunch ?? true;
  };

  return {
    autoLaunch: autoLaunchSetting.find(i => i.userId === userId)?.autoLaunch ?? true,
    changeAutoLaunch,
    getAutoLaunchByUser
  };
};
