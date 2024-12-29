import { useMemo } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { AccessCode } from '@fepkg/services/access-code';
import { createContainer } from 'unstated-next';

export const AccessContainer = createContainer(() => {
  const [accessCodeList, setAccessCodeList] = useLocalStorage<AccessCode[]>('accessCodeList', []);
  // 权限列表因为都是 import { AccessCode } from @fepkg/services/access-code
  // 这里直接使用 Set<AccessCode> 减少查询时间复杂度
  const access = useMemo(() => new Set(accessCodeList), [accessCodeList]);
  return { access, accessCodeList, setAccessCodeList };
});

export const AccessProvider = AccessContainer.Provider;
export const useAccess = AccessContainer.useContainer;
