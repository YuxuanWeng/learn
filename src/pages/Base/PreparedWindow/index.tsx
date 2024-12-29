import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IPCEventEnum from 'app/types/IPCEvents';
import { useSetAtom } from 'jotai';
import { contextAtom } from '@/pages/Base/PreparedWindow/atoms';

type PreparedProps = {
  routeUrl: string;
  context?: unknown;
};
/**
 * 一个空白路由页
 * 虚拟窗口池占位使用，方便快速切换路由
 * @returns JSX.Element
 */
export default function PreparedWindow() {
  const navigate = useNavigate();
  const setContextAtom = useSetAtom(contextAtom);

  useEffect(() => {
    const { on, remove } = window.Main;
    on<PreparedProps>(IPCEventEnum.NavigationWindow, props => {
      if (props) {
        setContextAtom(props?.context);
        navigate(props?.routeUrl);
      }
    });
    return () => remove(IPCEventEnum.NavigationWindow);
  }, [navigate, setContextAtom]);
  useEffect(() => {
    const { sendMessage } = window.Main;
    sendMessage(IPCEventEnum.NormalRouteWindowReady);
  }, []);
  return <div>&nbsp;</div>;
}
