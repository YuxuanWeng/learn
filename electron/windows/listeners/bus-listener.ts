import { omsApp } from '../../models/oms-application';
import { BusEventEnum } from '../../types/bus-events';
import { recoveryDialogWindow } from '../dialog/dialog';

const start = () => {
  omsApp.event.on(BusEventEnum.RecoveryDialog, recoveryDialogWindow);
};

const end = () => {
  omsApp.event.off(BusEventEnum.RecoveryDialog, recoveryDialogWindow);
};

/** electron 层相关事件总线 */
export default () => [start, end];
