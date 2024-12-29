import { useEffect, useState } from 'react';
import { DialogEvent } from 'app/types/IPCEvents';
import { useAddWindowLaunchNumber } from '@/common/atoms';
import { useAtomValue } from 'jotai';
import { contextAtom } from '@/pages/Base/PreparedWindow/atoms';

export const useDialogContext = () => {
  const [context, setContext] = useState<any>(useAtomValue(contextAtom));
  const addWindowLaunchNumber = useAddWindowLaunchNumber();

  useEffect(() => {
    const { invoke, on, remove } = window.Main;

    invoke(DialogEvent.ResendChildContext);

    on(DialogEvent.UpdateDialogContext, _context => {
      setContext({ ..._context, timestamp: Date.now() });
      addWindowLaunchNumber();
    });
    return () => {
      remove(DialogEvent.ResendChildContext);
      remove(DialogEvent.UpdateDialogContext);
    };
  }, []);

  return [context, setContext] as const;
};
