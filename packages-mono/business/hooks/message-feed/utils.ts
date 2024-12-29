import { FrontendSyncMsgScene } from '@fepkg/services/types/bds-enum';

export const MESSAGE_FEED_BROADCAST_CHANNEL = 'sync_msg_broadcast';

/**
 *
 * @param scene 业务场景
 * @param label 用户id或群组id
 * @returns 返回channel名
 */
export const getMessageFeedChannel = (scene: FrontendSyncMsgScene, label?: string) => {
  let channel = `sync_msg_${scene}`;

  if (label) {
    channel += `_${label}`;
  }

  return channel;
};
