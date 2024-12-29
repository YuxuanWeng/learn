import { AppConfig } from '../types/app-config';

export const getAppConfig = () => {
  return process.env.APP_CONFIG as unknown as AppConfig;
};
