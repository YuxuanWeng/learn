import { KeyboardEvent, Suspense, createContext, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '@/components/Loading/RouterLoading';
import { useDialogHandler } from '@/layouts/Dialog/hooks';
import { useDialogContext } from './hooks/useDialogContext';
import { DialogLayoutContext } from './types';

export const DialogContext = createContext<any>({});

export const Layout = () => {
  const { handleDialogConfirm, handleDialogCancel } = useDialogHandler();
  const [context, setContext] = useDialogContext();

  const actionOnKeyDown = useRef<(evt: KeyboardEvent<HTMLDivElement>) => void>();

  const outletContext: DialogLayoutContext = {
    setContext,
    setActionOnKeyDown: action => {
      actionOnKeyDown.current = action;
    },
    confirm: handleDialogConfirm,
    cancel: handleDialogCancel
  };

  return (
    <div
      // Dialog 整体不需要聚焦，所以设置为 -1
      tabIndex={-1}
      onKeyDown={evt => {
        /** 此处使用匿名函数的作用: 保证dom动态绑定函数地址，避免函数体发生变化时，此处的事件响应在旧的函数地址上 */
        actionOnKeyDown.current?.(evt);
      }}
      className="fixed-full flex flex-col border-[2px] border-solid border-gray-600 rounded-lg overflow-hidden focus:outline-none"
    >
      {/* --- 子路由内容在这里呈现 --- */}
      <DialogContext.Provider value={context}>
        <Suspense fallback={<Loading />}>
          <Outlet context={outletContext} />
        </Suspense>
      </DialogContext.Provider>
    </div>
  );
};
