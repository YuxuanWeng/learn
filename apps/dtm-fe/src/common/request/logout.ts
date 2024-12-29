import { OmsBusinessBroadcastChannelType, postBroadcastMessage } from '@fepkg/business/hooks/useOmsBusinessBroadcast';
import { ModalUtils } from '@fepkg/components/Modal';
import { StatusCode } from '@fepkg/request/types';
import { AUTH_CACHE_KEY, authCache, clearAuthInfo } from '@/utils/auth';
import { getIsUpdatePassword } from '@/utils/local-storage';
import { getIsDisplayLogoutModal, setIsDisplayLogoutModal } from '@/utils/modal';
import { RouteUrl } from '@/router/constants';

const navToLogin = () => {
  if (window.location.pathname !== RouteUrl.Login) {
    window.location.href = encodeURI(`${window.location.origin}/login`);
  }
};

const LOGOUT_STATUS_CODE = new Set([
  StatusCode.NotLogin,
  StatusCode.NoSystemAccess,
  StatusCode.UserTokenIsReplaced,
  StatusCode.AdminUserNotFound
]);

export const toastLogout = (content = '当前登录状态已失效，请重新登录！', broadcast = true) => {
  // 防止 text 被多次插入弹窗
  if (content && document.body.innerHTML.includes(content)) return;
  // 避免重复打开
  if (getIsDisplayLogoutModal()) {
    return;
  }

  setIsDisplayLogoutModal(true);

  if (broadcast) {
    const token = authCache.get(AUTH_CACHE_KEY)?.token;
    // 广播登出信息
    postBroadcastMessage(OmsBusinessBroadcastChannelType.Logout, token);
  }

  clearAuthInfo();

  ModalUtils.warning({
    title: '账号登出',
    className: 'logout-toast',
    content,
    keyboard: false,
    onOk: () => {
      setIsDisplayLogoutModal(false);
      navToLogin();
    },
    showCancel: false,
    blockAll: true
  });
};

export const handleLogout = (statusCode?: StatusCode) => {
  if (!statusCode || !LOGOUT_STATUS_CODE.has(statusCode)) return;

  if (getIsUpdatePassword()) return;

  if (statusCode === StatusCode.NotLogin) {
    // FIXME: 待处理
    // navToLogin();
    // return;
  }

  const text =
    {
      [StatusCode.NoSystemAccess]: '您没有当前系统权限',
      [StatusCode.UserTokenIsReplaced]: '账号已在其他设备登录，当前设备已登出！',
      [StatusCode.AdminUserNotFound]: '账号不存在'
    }[statusCode] ?? '当前登录状态已失效，请重新登录！';

  toastLogout(text);
};
