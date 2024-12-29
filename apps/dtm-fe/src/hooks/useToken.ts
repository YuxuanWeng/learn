import { CacheItem } from '@fepkg/common/utils/cache';
import { AUTH_CACHE_STORAGE_KEY, AuthCache } from '@/utils/auth';
import { useReadLocalStorage } from 'usehooks-ts';

export const useToken = () => {
  const authState = useReadLocalStorage<CacheItem<AuthCache>>(AUTH_CACHE_STORAGE_KEY);

  return { token: authState?.data?.token };
};
