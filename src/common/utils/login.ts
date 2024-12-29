import { ModalUtils } from '@fepkg/components/Modal';
import { StatusCode } from '@fepkg/request/types';
import IPCEventEnum, { LoginEventEnum, NetworkEventEnum } from 'app/types/IPCEvents';
import { WindowName } from 'app/types/window-v2';
import { trackSpecial } from '@/common/utils/logger/special';
import { miscStorage } from '@/localdb/miscStorage';

// 使用 localStorage 跨进程存储 isDisplayingLogoutDialog
export const isDisplayingLogoutDialog = () => {
  const stored = localStorage.getItem('isDisplayingLogoutDialog');
  if (stored == null) return false;

  try {
    return JSON.parse(stored);
  } catch (err) {
    trackSpecial('is-displaying-logout-dialog-error', { error: err });
  }

  return false;
};

export const isResettingPassword = () => {
  const stored = localStorage.getItem('isResettingPassword');
  if (stored == null) return false;

  try {
    return JSON.parse(stored);
  } catch (err) {
    trackSpecial('is-resetting-password-error', { error: err });
  }

  return false;
};

export const setIsDisplayingLogoutDialog = (value: boolean) => {
  localStorage.setItem('isDisplayingLogoutDialog', JSON.stringify(value));
};

export const setIsResettingPassword = (value: boolean) => {
  localStorage.setItem('isResettingPassword', JSON.stringify(value));
};

const miscStorageClean = () => {
  miscStorage.token = undefined;
  miscStorage.userInfo = undefined;
  miscStorage.offset = undefined;
  miscStorage.localServerPort = undefined;
  miscStorage.localServerAvailable = false;
};

export const exitToLogin = (restartLogin = true, isAutoLogout = false) => {
  miscStorageClean();
  window.Main.invoke(LoginEventEnum.AfterLogout, restartLogin, isAutoLogout);
};

export const afterLogout = async (skipModal = false, statusCode?: StatusCode, restartLogin = true) => {
  const { sendMessage } = window.Main;
  const windowName: string = await window.Main.invoke(IPCEventEnum.GetWindowName, []);
  if (windowName === WindowName.Login) {
    miscStorageClean();
    return;
  }
  sendMessage(NetworkEventEnum.StopCheckUrlIsReachable);
  if (skipModal) {
    exitToLogin(restartLogin);
    return;
  }

  if (!(isDisplayingLogoutDialog() || isResettingPassword()) && restartLogin) {
    const text =
      {
        [StatusCode.NoSystemAccess]: '您没有当前系统权限',
        [StatusCode.UserTokenIsReplaced]: '当前账号已在其他设备登录，当前设备已退出',
        [StatusCode.AdminUserNotFound]: '账号不存在'
      }[statusCode ?? 0] ?? '当前登录状态已失效，请重新登录！';

    window.Main.invoke(LoginEventEnum.BeforeLogout, text);

    trackSpecial('relogin', { statusCode, text }, void 0, true);
  }
};

export const showLogoutModal = (text?: string, title?: string, okText?: string) => {
  if (isDisplayingLogoutDialog() || isResettingPassword()) return;

  // 防止 text 被多次插入弹窗
  if (text && document.body.innerHTML.includes(text)) return;

  const logoutMessage = text;

  setIsDisplayingLogoutDialog(true);

  ModalUtils.warning({
    title: title || '账号登出',
    content: logoutMessage,
    keyboard: false,
    afterClose: () => {
      setIsDisplayingLogoutDialog(false);
      exitToLogin();
    },
    showCancel: false,
    okText,
    blockAll: true
  });
};

setIsDisplayingLogoutDialog(false);

export const isXintangUat = () => {
  return window.appConfig.channel === 'xintang-uat';
};
