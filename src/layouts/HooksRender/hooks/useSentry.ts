import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { BrowserTracing, init, reactRouterV6Instrumentation, setTag, setUser } from '@sentry/react';
import { getTracesSampleRate } from '@/common/ab-rules';
import { miscStorage } from '@/localdb/miscStorage';

// const dsn = 'http://446024a036c14f7487859f97427dc555@sentry.dev.zoople.cn/2';
const dsn = 'https://cdc9a88a9403b23e88b35919df954caa@o4503973927190528.ingest.sentry.io/4505922987622400';
const initSentry = () => {
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
    // 这里表示采样率，为了性能考虑上线后也可以改成一定比例进行上报
    tracesSampleRate: getTracesSampleRate(),

    environment: window.appConfig.env

    // beforeSend: evt => {
    //   // update the stacktrace before sending it to Sentry, this will strip out the asar path - i.e. those between two brackets:
    //   // /Applications/OMS.app/Contents/Resources/app.asar/src/out/assets/index.ab9e2552.js)
    //   if (evt.exception?.values) {
    //     evt.exception.values = evt.exception.values.map(exc => {
    //       if (exc.stacktrace?.frames) {
    //         exc.stacktrace.frames = exc.stacktrace.frames.map(f => {
    //           if (f.filename) {
    //             f.filename = f.filename.replace(/.*app\.asar/, 'app://');
    //           }
    //           return f;
    //         });
    //       }
    //       return exc;
    //     });
    //   }
    //   return evt;
    // }
  });

  setUser({ userId: miscStorage.userInfo?.user_id });
  setTag('userId', miscStorage.userInfo?.user_id);
  setTag('traceId', miscStorage.softLifecycleId);
  setTag('deviceId', miscStorage.deviceId);
  setTag('apiEnv', miscStorage.apiEnv);
  setTag('branch', window.appConfig.branch);
};

export const useSentry = () => {
  useEffect(() => {
    // 初始化Sentry
    initSentry();
  }, []);
};
