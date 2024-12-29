import { Cache, LocalStorageCacheStorage } from '@fepkg/common/utils/cache';
import { setLoggerMeta } from '@/common/logger';
import { queryClient } from './query-client';

/** ls 中真是存储的 key */
export const AUTH_CACHE_STORAGE_KEY = 'cache-auth';
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
  setLoggerMeta();
};
