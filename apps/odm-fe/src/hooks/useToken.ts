import { CacheItem } from '@fepkg/common/utils/cache';
import { AuthCache, TOKEN_CACHE_STORAGE_KEY } from '@/utils/auth';
import { useLocalStorage } from 'usehooks-ts';

export const useToken = () => {
  const [authState] = useLocalStorage<CacheItem<AuthCache> | undefined>(TOKEN_CACHE_STORAGE_KEY, undefined);

  return { token: authState?.data?.token };
};
