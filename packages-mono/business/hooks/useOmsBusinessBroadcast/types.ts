export const OmsBusinessBroadcastChannel = 'oms-business-broadcast-channel';

export enum OmsBusinessBroadcastChannelType {
  Logout = 'logout'
}

export type OmsBusinessBroadcastStruct = {
  type: string;
  processId: number;
  token?: string;
};
