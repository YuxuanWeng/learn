import { useEffect } from 'react';
import { useAccess } from '@/common/providers/AccessProvider';
import {
  initUserHotkeys,
  removeUserHotkeysChangeListener,
  userHotkeysChangeListener
} from '@/common/utils/hotkey/initUserHotkeys';
import { useProductParams } from '@/layouts/Home/hooks';

export const useHotkeysInit = () => {
  const { productType } = useProductParams();
  const { access } = useAccess();

  useEffect(() => {
    initUserHotkeys(access, productType);

    // 监听快捷键变化
    userHotkeysChangeListener();
    return () => {
      // 取消监听快捷键变化
      removeUserHotkeysChangeListener();
    };
  }, [access, productType]);
};
