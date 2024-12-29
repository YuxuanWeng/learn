import { useState } from 'react';
import { AppEnv } from '@fepkg/common/types';
import { LoginEventEnum } from 'app/types/IPCEvents';
import { UserInitConfigStorageMeta } from 'app/windows/store/user-init-config-storage';
import { createContainer } from 'unstated-next';
import { getUploadUrl } from '@packages/utils';
import { isProd } from '@/common/utils';
import { logger } from '@/common/utils/logger';
import { metrics } from '@/common/utils/metrics';
import { miscStorage } from '@/localdb/miscStorage';
import { envs } from '../constants';

const getInitialEnv = () => {
  const storageEnv = envs.find(e => e.value === miscStorage.apiEnv)?.value as AppEnv;

  let initialEnv = storageEnv;
  // 如果是线上，环境统一用 prod
  if (isProd()) initialEnv = 'prod';

  // 更新 storage 内 apiEnv 缓存
  miscStorage.apiEnv = initialEnv;

  return initialEnv;
};

const LoginEnvContainer = createContainer(() => {
  const [step, setStep] = useState<'login' | 'env'>('login');
  const [env, setEnv] = useState(getInitialEnv);

  const toggleEnv = (apiEnv: AppEnv) => {
    setEnv(apiEnv);
    miscStorage.apiEnv = apiEnv;
    const { logUrl, metricsUrl } = getUploadUrl(window.appConfig, miscStorage.apiEnv);

    const meta: UserInitConfigStorageMeta = {
      ...logger.getMeta(),
      apiEnv,
      logUrl,
      metricsUrl
      // logUrl: window.appConfig?.logURL ?? '',
      // metricsUrl: window.appConfig?.metricsURL ?? ''
    };
    logger.setMeta({ ...meta, uploadUrl: meta.logUrl });
    metrics.setMeta({ ...meta, uploadUrl: meta.metricsUrl });

    window.Main.sendMessage(LoginEventEnum.ChangeMeta, meta);
  };

  return { env, toggleEnv, step, setStep };
});

export const LoginEnvProvider = LoginEnvContainer.Provider;
export const useLoginEnv = LoginEnvContainer.useContainer;
