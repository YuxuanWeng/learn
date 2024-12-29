import { AppEnv } from '@fepkg/common/types';
import OSS from 'ali-oss';

export type AppConfig = {
  // 在脚本内按照 tag > hash > package.json内的version字段的顺序手动注入
  version: string;
  // package.json 内的版本
  staticVersion: string;
  // 当前所在的 git commit 的短 hash
  shortHash: string;
  // 默认为 dev
  env: AppEnv;
  branch: string;
  channel: string;
  algoHost: string;
  apiHost: string;
  ossHost: string;
  // 可以通过切换环境改变的参数均为可选
  websocketHost?: string;
  serviceProviderURL?: string;
  serverFluentdURL?: string;
  serviceMetricsInfluxdbURL?: string;
  serviceEnvMode?: string;
  localServerWSHost?: string;
  miniohost?: string;
  miniokey?: string;
  miniosecret?: string;
  crmURL?: string;
  dtmURL?: string;
  mainSentryDsn?: string;
  rendererSentryDsn?: string;
  sentryURL?: string;
  sentryAuthToken?: string;
  signComp?: string;
  ossSts: OSS.Options;
  localServer: { version?: string; shortHash?: string };

  /** 是否需要自动清理前端缓存
   * 1. 系统登录前清理
   * 2. 当前版本 > 历史版本清理
   * 3. 该字段为true时清理
   *  */
  cacheCleanupRequired?: boolean;
};
