import { Outlet } from 'react-router-dom';
import { CentrifugeProvider } from '@fepkg/business/providers/Centrifuge';
import { useLogoLog } from '@fepkg/components/Logo';
import { useLog } from '@/hooks/useLog';
import { useSentry } from '@/hooks/useSentry';
import { useToken } from '@/hooks/useToken';
import { AuthProvider } from '@/providers/AuthProvider';

const HooksRender = () => {
  useSentry();
  useLog();
  useLogoLog(__APP_VERSION__, __APP_SHORT_HASH__, 'dtm');

  return null;
};

export const RootLayout = () => {
  const { token } = useToken();

  return (
    <CentrifugeProvider
      key={token}
      initialState={{
        env: __API_ENV__,
        token: token ?? '',
        websocket: WebSocket,
        websocketHost: __APP_WEBSOCKET_HOST__
      }}
    >
      <AuthProvider>
        <Outlet />
        <HooksRender />
      </AuthProvider>
    </CentrifugeProvider>
  );
};
