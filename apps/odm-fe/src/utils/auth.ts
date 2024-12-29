import { Cache, LocalStorageCacheStorage } from '@fepkg/common/utils/cache';
import { queryClient } from './query-client';

/** ls 中真实存储的 key */
export const TOKEN_CACHE_STORAGE_KEY = 'cache-auth';
export const AUTH_CACHE_KEY = 'auth';

export type AuthCache = {
  token?: string;
};

export const authCache = new Cache<AuthCache>({
  storage: new LocalStorageCacheStorage()
});

export const clearAuthInfo = () => {
  authCache.clear();
  queryClient.cancelQueries();
  queryClient.clear();
};
