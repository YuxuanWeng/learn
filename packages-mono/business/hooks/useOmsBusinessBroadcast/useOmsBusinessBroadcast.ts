import { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { OmsBusinessBroadcastChannel, OmsBusinessBroadcastChannelType, OmsBusinessBroadcastStruct } from './types';

export const useOmsBusinessBroadcast = (props: { initToken?: string; onLogout: () => void }) => {
  const token = useRef(props.initToken);
  const onMessage = useMemoizedFn((event: MessageEvent<OmsBusinessBroadcastStruct>) => {
    const { data } = event;
    if (
      data.type === OmsBusinessBroadcastChannelType.Logout &&
      data.token === token.current &&
      data.processId !== performance.timeOrigin
    ) {
      props.onLogout();
    }
  });

  useEffect(() => {
    const bc = new BroadcastChannel(OmsBusinessBroadcastChannel);
    bc.addEventListener('message', onMessage);
    return () => {
      bc.removeEventListener('message', onMessage);
      bc.close();
    };
  }, [onMessage]);
};
