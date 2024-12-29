import { app } from 'electron';
import { omsApp } from '../models/oms-application';

const getIsPackaged = () => {
  // ..多判断一层，防止 preload 脚本读取 electron 内容时因获取不到 isPackaged 报错；
  if (app?.isPackaged != null) {
    return app.isPackaged;
  }
  return false;
};

const getEnv = (env: string) => {
  const { appConfig } = omsApp;
  return appConfig != null ? appConfig.env === env : false;
};

export const isDev = () => getEnv('dev') ?? !getIsPackaged();

export const isProd = () => getEnv('prod') ?? getIsPackaged();

export const isTest = () => getEnv('test') ?? false;

export const isDevOrTest = () => isDev() || isTest();

export default isDev;
