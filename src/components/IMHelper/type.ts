import { IMHelperMsgSendSingleResult, IMHelperQQMsgForSend } from 'app/packages/im-helper-core/types';
import { Side } from '@fepkg/services/types/bds-enum';

export type IMHelperMsgSendSingleResultForDisplay = IMHelperMsgSendSingleResult & {
  trader_id: string;
  trader_name: string;
  inst_name: string;
};

export type SendMsgDetail = IMHelperQQMsgForSend & {
  receiver_id?: string;
  receiver_name?: string;
  inst_name?: string;
  side?: Side;
};
