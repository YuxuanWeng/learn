import { message } from '@fepkg/components/Message';
import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ConfigGet } from '@fepkg/services/types/config/get';

export const fetchSSOUrl = (config?: RequestConfig) => {
  return getRequest().post<ConfigGet.Response>(APIs.config.get, { namespace: 'auth', key: 'sso_url' }, config);
};

export const toSSOLogin = async () => {
  const { value: SSOHost } = await fetchSSOUrl();
  if (!SSOHost) message.error('获取登录地址失败！');
  else window.location.href = SSOHost + encodeURI(`/login?redirect=${window.location.origin}/login`);
};

export const toSSOChangePassword = async (token?: string, account?: string) => {
  const { value: SSOHost } = await fetchSSOUrl();
  if (!SSOHost) message.error('获取修改密码地址失败！');
  else
    window.location.href =
      SSOHost + encodeURI(`/change_password?redirect=${window.location.href}&token=${token}&account=${account}`);
};
