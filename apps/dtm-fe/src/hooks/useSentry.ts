import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { User } from '@fepkg/services/types/common';
import { useAuth } from '@/providers/AuthProvider';
import { BrowserTracing, init, reactRouterV6Instrumentation, setTag, setUser } from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;
const initSentry = (user: User) => {
  if (!dsn) return;

  init({
    dsn,
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        )
      })
    ],
    tracePropagationTargets: [
      'localhost',
      /^\/\//,
      'dtm.dev.zoople.cn',
      'dtm-dev.zoople.cn',
      'dtm.test.zoople.cn',
      'dtm-test.zoople.cn',
      'dtm-oms.tjxintang.com',
      'dtm-oms-uat.tjxintang.com',
      'o4503973927190528.ingest.sentry.io'
    ],
    tracesSampleRate: 1,

    environment: __API_ENV__
  });

  setUser({ userId: user.user_id });
  setTag('userId', user.user_id);
  setTag('apiEnv', __API_ENV__);
};

export const useSentry = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) initSentry(user);
  }, [user]);
};
