import { useEffect, useRef, useState } from 'react';
import { ConnectionInfo, IMConnection } from 'app/packages/im-helper-core/types';
import { IMHelperEventEnum } from 'app/types/IPCEvents';
import { createContainer } from 'unstated-next';

const IMConnectionContainer = createContainer(() => {
  const [imConnection, setIMConnection] = useState<IMConnection>();
  const [allowedUserIDs, setAllowedUserIDs] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    window.Main.invoke(IMHelperEventEnum.GetIMConnection).then((res: ConnectionInfo) => {
      setIMConnection(res.imConnection);
      setAllowedUserIDs(res.allowedUserIDs);
    });

    window.Main.on(IMHelperEventEnum.IMConnectionUpdate, (connection?: ConnectionInfo) => {
      if (connection == null) return;

      setIMConnection(connection.imConnection);
      setAllowedUserIDs(connection.allowedUserIDs);
    });

    timerRef.current = setInterval(() => {
      window.Main.invoke(IMHelperEventEnum.GetIMConnection).then((res: ConnectionInfo) => {
        setIMConnection(res.imConnection);
        setAllowedUserIDs(res.allowedUserIDs);
      });
    }, 1000 * 10);

    return () => {
      window.Main.remove(IMHelperEventEnum.IMConnectionUpdate);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { imConnection, allowedUserIDs };
});

export const IMConnectionProvider = IMConnectionContainer.Provider;
export const useIMConnection = IMConnectionContainer.useContainer;
