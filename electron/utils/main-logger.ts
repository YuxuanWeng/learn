import { Logger, LoggerConfig, LoggerMeta } from '@fepkg/logger';
import { Post } from '@fepkg/services/types/enum';
import { IpcMainEvent } from 'electron';
import { batchSaveBusinessLogs } from '../windows/listeners/business-log-listener';

const DEFAULT_META: LoggerMeta = {
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

const onSend: LoggerConfig['onSend'] = businessLogs => {
  batchSaveBusinessLogs({ sender: { id: -1 } } as IpcMainEvent, businessLogs);
};

export const logger = new Logger({ source: 'node', meta: DEFAULT_META, onSend });

export const trackPoint = (keyword?: string, params?: object, immediate = true) => {
  logger.i({ keyword, ...params }, { immediate });
};
