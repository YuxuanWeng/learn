import { message } from '@fepkg/components/Message';
import { useMemoizedFn } from 'ahooks';
import { useIsOnline } from '@/common/atoms';

export default () => {
  const isOnline = useIsOnline();
  const beforeOpenDialogWindow = useMemoizedFn(() => {
    if (!isOnline) {
      message.error('无网络');
      return false;
    }
    return true;
  });
  return { beforeOpenDialogWindow };
};
