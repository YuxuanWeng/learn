import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { AccessCode } from '@fepkg/services/access-code';
import { accessQueryFn, getAccessQueryKey } from '@/hooks/useAccessQuery';
import { getUserQueryKey, userQueryFn } from '@/hooks/useUserQuery';
import { AUTH_CACHE_KEY, authCache, clearAuthInfo } from '@/utils/auth';
import { setIsDisplayLogoutModal } from '@/utils/local-storage';
import { queryClient } from '@/utils/query-client';

const toLogin = () => {
  clearAuthInfo();
  return redirect('/login');
};

const AuthRouteMap = {
  '/home': AccessCode.CodeOdmMsgLog,
  '/home/conf': AccessCode.CodeOdmConfig,
  '/login': AccessCode.CodeOdmManage
};

export const getIndexAuthRouteUrl = (access?: Set<AccessCode>) => {
  for (const [url, accessCode] of Object.entries(AuthRouteMap)) {
    if (access?.has(accessCode)) return url;
  }
  return '/';
};

export const checkRouteUrlAuth = (url: string, access?: Set<AccessCode>) => {
  const targetAccessCode = AuthRouteMap[url];
  if (!targetAccessCode) return false;
  return !!access?.has(targetAccessCode);
};

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  try {
    let initialToken: string | undefined;
    const url = new URL(request.url);
    const urlToken = url.searchParams.get('loginToken') ?? undefined;
    const cacheToken = authCache.get(AUTH_CACHE_KEY)?.token;

    if (urlToken) {
      initialToken = urlToken;
      authCache.set(AUTH_CACHE_KEY, { token: urlToken });
    } else {
      initialToken = cacheToken;
    }

    // 请求当情登录用户的信息以及权限
    const userResp = await queryClient.fetchQuery({
      queryKey: getUserQueryKey(initialToken),
      queryFn: userQueryFn
    });
    const access = await queryClient.fetchQuery({
      queryKey: getAccessQueryKey(initialToken),
      queryFn: accessQueryFn
    });

    // 有user就表示一定有token
    if (userResp?.user) {
      setIsDisplayLogoutModal(false);
      const indexAuthRouteUrl = getIndexAuthRouteUrl(access);

      // 登录之后，如果匹配到在登录页或者没有指定路由，就跳转到home
      if (url.pathname === '/login' || url.pathname === '/' || !checkRouteUrlAuth(url.pathname, access)) {
        return redirect(indexAuthRouteUrl);
      }
      // 没有user就去登录
    } else if (url.pathname !== '/login') {
      return toLogin();
    }
  } catch (err) {
    console.log('error catch', err);

    return toLogin();
  }
  return null;
};
