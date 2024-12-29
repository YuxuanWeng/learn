import { LoaderFunctionArgs, Params, redirect, useLoaderData } from 'react-router-dom';
import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { AccessCode } from '@fepkg/services/access-code';
import { User } from '@fepkg/services/types/bdm-common';
import { Post } from '@fepkg/services/types/bdm-enum';
import { accessQueryFn, getAccessQueryKey } from '@/hooks/useAccessQuery';
import { getUserQueryKey, userQueryFn } from '@/hooks/useUserQuery';
import { AUTH_CACHE_KEY, authCache, clearAuthInfo } from '@/utils/auth';
import { getIsUpdatePassword, setIsUpdatePassword } from '@/utils/local-storage';
import { setIsDisplayLogoutModal } from '@/utils/modal';
import { AccessProductTypeList, getUserProductList, isPostBackstage } from '@/utils/product';
import { queryClient } from '@/utils/query-client';
import { AuthRouteMap, RouteUrl } from '@/router/constants';
import { setLoggerMeta } from '../logger';

const toLogin = () => {
  clearAuthInfo();
  return redirect(RouteUrl.Login);
};

/** 获得第一个有权限的路由 */
export const getIndexAuthRouteUrl = (access?: Set<AccessCode>, user?: User) => {
  for (const [url, accessCode] of AuthRouteMap.entries()) {
    if (access?.has(accessCode)) {
      if (url === RouteUrl.BackendSetting) {
        const productTypeList = getUserProductList(user);
        return `${url}/${productTypeList?.at(-1)}`;
      }
      return url;
    }
  }

  return RouteUrl.NotFound;
};

/** 根据前缀匹配权限 */
const getPermissionForURL = (url: string) => {
  for (const key of AuthRouteMap.keys()) {
    if (url.startsWith(key)) {
      return AuthRouteMap.get(key);
    }
  }
  return undefined;
};

export const checkRouteUrlAuth = (url: string, access?: Set<AccessCode>) => {
  const targetAccessCode = getPermissionForURL(url);
  if (!targetAccessCode) return false;

  return !!access?.has(targetAccessCode);
};

const checkProductType = (params: Params<string>, user?: User) => {
  // 后台人员拥有所有productType权限
  if (isPostBackstage(user)) return true;

  // 参数没有productType的无需检测
  const { product_list: productTypeList } = user ?? {};
  if (params.productType === undefined) return true;

  // 没有productTypeList的则校验不通过
  if (!productTypeList) return false;

  const productType = Number(params.productType);

  return AccessProductTypeList.includes(productType) && productTypeList.map(i => i.product_type).includes(productType);
};

export const AuthLoader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    let initialToken: string | undefined;

    const url = new URL(request.url);
    const urlToken = url.searchParams.get('loginToken') ?? undefined;
    const cacheToken = authCache.get(AUTH_CACHE_KEY)?.token;

    if (urlToken) {
      initialToken = urlToken;
      // 如果登录 token 不等于已缓存的 token
      if (urlToken !== cacheToken) {
        // 并且有已缓存的 token，需要把原有账号退出登录
        // 先A账号sso登录，后B账号oms登录，此时两个页签页都会展示为B账号登录，B账号退登，之后再点击登录按钮，
        // 会从sso获取已登录的A账号token缓存，自动登录为A账号，下方注释的代码的可避免这样的多缓存问题
        // if (cacheToken) await logout();
      }

      authCache.set(AUTH_CACHE_KEY, { token: urlToken });
    } else {
      initialToken = cacheToken;
    }

    const userResp = await queryClient.fetchQuery({
      queryKey: getUserQueryKey(initialToken),
      queryFn: userQueryFn
    });
    const access = await queryClient.fetchQuery({
      queryKey: getAccessQueryKey(initialToken),
      queryFn: accessQueryFn
    });

    if (userResp?.user) {
      setIsDisplayLogoutModal(false);
      if (getIsUpdatePassword()) setIsUpdatePassword(false);

      const indexAuthRouteUrl = getIndexAuthRouteUrl(access, userResp?.user);

      setLoggerMeta({
        userId: userResp?.user.user_id,
        userPost: userResp?.user.post,
        account: userResp?.user.account
      });

      // 没有任何业务产品权限，不跳转，从当前页面的layout中弹出锁定弹窗
      if (!userResp?.user?.product_list?.length && userResp?.user?.post !== Post.Post_Backstage) {
        return null;
      }

      if (
        url.pathname === RouteUrl.Login ||
        url.pathname === RouteUrl.Root ||
        !checkRouteUrlAuth(url.pathname, access) ||
        !checkProductType(params, userResp.user)
      ) {
        // 初始化交易日信息
        await dealDateManager.init();

        return redirect(indexAuthRouteUrl);
      }
    } else if (url.pathname !== RouteUrl.Login) {
      return toLogin();
    }
  } catch {
    return toLogin();
  }

  return null;
};

export const useAuthLoader = () => useLoaderData() as Awaited<ReturnType<typeof AuthLoader>>;
