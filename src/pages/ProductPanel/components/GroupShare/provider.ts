import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { createContainer } from 'unstated-next';
import { panelShareMdlCancelTimestampAtom } from './atoms';

export const GroupShareContainer = createContainer(() => {
  const [visible, setVisible] = useState(false);

  const setPanelShareMdlCancelTimestamp = useSetAtom(panelShareMdlCancelTimestampAtom);

  const open = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setPanelShareMdlCancelTimestamp(Date.now());
  };

  const handleOk = () => {
    handleClose();
  };

  return {
    visible,
    open,
    handleOk,
    handleClose
  };
});

export const GroupShareProvider = GroupShareContainer.Provider;
export const useGroupShare = GroupShareContainer.useContainer;
