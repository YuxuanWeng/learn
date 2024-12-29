import { Suspense, lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthLoader } from '@/common/loaders/auth';
import { PreviewLoader } from '@/common/loaders/preview';
import { LoginLoading, PreviewLoading } from '@/components/Loading';
import { HomeLayout } from '@/layouts/Home';
import { RootLayout } from '@/layouts/Root';
import ApprovalDealList from '@/pages/ApprovalDealList';
import NotFound from '@/pages/NotFound';
import { RouteUrl } from './constants';

const Login = lazy(() => import('@/pages/Login'));
const ApprovalList = lazy(() => import('@/pages/ApprovalList'));
const ApprovalHistoryList = lazy(() => import('@/pages/ApprovalHistoryList'));
const BackendSetting = lazy(() => import('@/pages/BackendSetting'));
const Preview = lazy(() => import('@/pages/Preview'));
const PrintNode = lazy(() => import('@/components/PrintNode'));

const withProductTypeParam = (path: string) => {
  return `${path}/:productType`;
};
export const router = createBrowserRouter([
  {
    path: RouteUrl.Root,
    element: <RootLayout />,
    loader: AuthLoader,
    children: [
      {
        path: RouteUrl.Login,
        element: (
          <Suspense fallback={<LoginLoading />}>
            <Login />
          </Suspense>
        )
      },
      {
        element: <HomeLayout />,
        children: [
          { path: RouteUrl.ApprovalList, element: <ApprovalList /> },
          { path: RouteUrl.ApprovalHistoryList, element: <ApprovalHistoryList /> },
          { path: RouteUrl.ApprovalDealList, element: <ApprovalDealList /> },
          {
            path: withProductTypeParam(RouteUrl.BackendSetting),
            element: <BackendSetting />,
            children: [
              { path: `${withProductTypeParam(RouteUrl.BackendSetting)}/:tabType`, element: <BackendSetting /> }
            ]
          }
        ]
      },
      {
        path: RouteUrl.Preview,
        element: (
          <Suspense fallback={<PreviewLoading />}>
            <Preview />
          </Suspense>
        ),
        loader: PreviewLoader,
        children: [
          {
            path: RouteUrl.PreviewPrint,
            loader: PreviewLoader,
            element: (
              <Suspense fallback={<PreviewLoading />}>
                <PrintNode />
              </Suspense>
            )
          }
        ]
      },
      { path: RouteUrl.NotFound, element: <NotFound /> },
      { path: '*', element: <Navigate to={RouteUrl.NotFound} /> }
    ]
  }
]);
