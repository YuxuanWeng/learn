import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '../../apis';
import type { FrontendSyncMsgScan } from '../../types/frontend-sync-msg/scan';

/**
 * @description 拉取channel中缺失的消息
 * @url /api/v1/bdm/bds/bds_api/frontend_sync_msg/scan
 */
export const frontendSyncMsgScan = (params: FrontendSyncMsgScan.Request, config?: RequestConfig) => {
  return getRequest().post<FrontendSyncMsgScan.Response>(APIs.frontendSyncMsg.scan, params, config);
};
