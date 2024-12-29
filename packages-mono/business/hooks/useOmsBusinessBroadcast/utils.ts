import { OmsBusinessBroadcastChannel, OmsBusinessBroadcastChannelType } from './types';

export const postBroadcastMessage = (type: OmsBusinessBroadcastChannelType, token?: string) => {
  const bc = new BroadcastChannel(OmsBusinessBroadcastChannel);
  bc.postMessage({ type, token, logoutTimeOrigin: performance.timeOrigin });
  bc.close();
};
