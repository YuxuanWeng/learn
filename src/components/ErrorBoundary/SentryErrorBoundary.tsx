import { PropsWithChildren, useEffect } from 'react';
import { logout } from '@fepkg/services/api/auth/logout';
import { ErrorBoundary, ErrorBoundaryProps } from '@sentry/react';
import { WindowCrashedEnum } from 'app/types/window-v2';
import { trackSpecial } from '@/common/utils/logger/special';
import { afterLogout } from '@/common/utils/login';

export type SentryErrorBoundaryProps = PropsWithChildren<ErrorBoundaryProps>;

export const SentryErrorBoundary = ({ children, ...restProps }: SentryErrorBoundaryProps) => {
  const { sendMessage, on, remove } = window.Main;
  useEffect(() => {
    on(WindowCrashedEnum.PageErrorCallback, async () => {
      await logout();
      // await localforage.removeItem(UNDO);
      afterLogout(true, undefined, false);
    });
    return () => remove(WindowCrashedEnum.PageErrorCallback);
  }, []);
  /**
   * 接收 ErrorBoundary 的错误
   * @param error 错误类型，如 ReferenceError:
   * @param componentStack 错误堆栈信息
   * @param eventId 事件Id
   */
  const pageError = (error: Error, componentStack: string, eventId: string) => {
    trackSpecial('window-crash', { error, componentStack, eventId });

    sendMessage(WindowCrashedEnum.PageError);
  };
  return (
    <ErrorBoundary
      onError={pageError}
      {...restProps}
    >
      {children}
    </ErrorBoundary>
  );
};
