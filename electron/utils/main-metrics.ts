import { Metrics, MetricsMeta } from '@fepkg/metrics';
import { Post } from '@fepkg/services/types/enum';
import { logger } from './main-logger';

const DEFAULT_META: MetricsMeta = {
  userId: '',
  userPost: Post.PostNone, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
  account: '',
  version: '',
  softLifecycleId: '', // 一次应用生命周期
  deviceId: '', // 设备id
  apiEnv: 'dev',
  deviceType: '', // 设备型号
  uploadUrl: ''
};

export const metrics = new Metrics({
  meta: DEFAULT_META,
  source: 'node',
  logger
});
