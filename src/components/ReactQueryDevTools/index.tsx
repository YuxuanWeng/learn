import { Suspense, lazy } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CommonRoute } from 'app/types/window-v2';

const isDev = import.meta.env.DEV;

const ReactQueryDevtoolsForTest = lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(d => ({
    default: d.ReactQueryDevtools
  }))
);

export const ReactQueryDevtoolsForDevAndTest = () => {
  const getIsTestPackage = () => !isDev && window.appConfig.env === 'test';
  const needShowReactQueryDevtoolsInPage = () => {
    const { hash } = window.location;

    return getIsTestPackage()
      ? !hash.includes('spot-pricing-hint')
      : !hash.includes(CommonRoute.SingleQuote) &&
          !hash.includes('dialog/idc-spot') &&
          !hash.includes('spot-pricing-hint') &&
          !hash.includes(CommonRoute.BondDetail);
  };

  return (
    <>
      {isDev && needShowReactQueryDevtoolsInPage() && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position={CommonRoute.CollaborativeQuote ? 'top-left' : 'bottom-left'}
          closeButtonProps={{ className: 'select-none' }}
        />
      )}
      {/* {getIsTestPackage() && needShowReactQueryDevtoolsInPage() && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsForTest />
        </Suspense>
      )} */}
    </>
  );
};
