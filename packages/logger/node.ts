import { Logger } from '@fepkg/logger';

/** 该 logger 仅用于单测 */
export const testLogger = new Logger({
  source: 'node',
  meta: {
    userId: '',
    account: '',
    version: '',
    softLifecycleId: '',
    deviceId: '',
    deviceType: '',
    apiEnv: 'dev',
    uploadUrl: ''
  }
});
