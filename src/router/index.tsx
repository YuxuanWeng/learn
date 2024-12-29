import { Suspense, lazy, useLayoutEffect } from 'react';
import { Navigate, createHashRouter, useRouteError } from 'react-router-dom';
import { CommonRoute } from 'app/types/window-v2';
import Loading from '@/components/Loading/RouterLoading';
import { DialogLayout } from '@/layouts/Dialog';
import { Root } from '@/layouts/Root';
import { DebugDetailPage } from '@/pages/Base/DebugDetailPage';
import { receiptDealPanelLoader } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/preload';
import ProductPanel from '@/pages/ProductPanel';
import { productPanelLoader } from '@/pages/ProductPanel/providers/MainGroupProvider/preload';
import { spotPanelLoader } from '@/pages/Spot/Panel/Providers/preload';
import SpotAppointModal from '@/pages/Spot/SpotAppointModal';
import SpotModal from '@/pages/Spot/SpotModal';

const Login = lazy(() => import('@/pages/Base/Login'));
const PreparedWindow = lazy(() => import('@/pages/Base/PreparedWindow'));

const HomeLayout = lazy(() => import('@/layouts/Home'));

// TODO 目前懒加载时分包有点问题，后期需要优化处理下
// const ProductPanel = lazy(() => import('@/pages/ProductPanel'));
const SingleQuote = lazy(() => import('@/pages/Quote/SingleQuote'));
const QuoteLog = lazy(() => import('@/pages/Quote/QuoteLog'));
const BondDetail = lazy(() => import('@/pages/Quote/BondDetail'));
const IQuote = lazy(() => import('@/pages/Algo/IQuote'));
const IQuoteCard = lazy(() => import('@/pages/Algo/IQuote/components/IQuoteFloatCard'));
const Collaborative = lazy(() => import('@/pages/Quote/Collaborative'));
const UpdateDownload = lazy(() => import('@/pages/Base/UpdateDownload'));
const SpotPricingHint = lazy(() => import('@/pages/Spot/SpotPricingHint'));
const SpotPanel = lazy(() => import('@/pages/Spot/Panel'));
const SpotBondDetail = lazy(() => import('@/pages/Spot/BondDetail'));
const SpotOperRecords = lazy(() => import('@/pages/Spot/Panel/OperationRecords'));
const Calculator = lazy(() => import('@/pages/Base/Calculator'));
// 市场成交
const MarketDealForm = lazy(() => import('@/pages/Deal/Market/MarketDealForm'));
const MarketDealLog = lazy(() => import('@/pages/Deal/Market/MarketDealLog'));
const MarketDealRecommend = lazy(() => import('@/pages/Deal/Market/MarketDealRecommend'));
const MarketDealRecommendSetting = lazy(() => import('@/pages/Deal/Market/MarketDealRecommend/Setting'));

// 临时入口
// 行情追踪(原对价提醒)
const MarketTracking = lazy(() => import('@/pages/Algo/MarketTrack'));
// 过桥
const Bridge = lazy(() => import('@/pages/Deal/Bridge'));
// 成交明细
const DealDetail = lazy(() => import('@/pages/Deal/Detail'));

const ReceiptDealPanel = lazy(() => import('@/pages/Deal/Receipt/ReceiptDealPanel'));
const ReceiptDealForm = lazy(() => import('@/pages/Deal/Receipt/ReceiptDealForm'));
const ReceiptDealBatchForm = lazy(() => import('@/pages/Deal/Receipt/ReceiptDealBatchForm'));
const ReceiptDealLog = lazy(() => import('@/pages/Deal/Receipt/ReceiptDealLog'));
const DealDetailLog = lazy(() => import('@/pages/Deal/DealDetailLog'));
const SpotHistoryRecord = lazy(() => import('@/pages/Spot/Panel/HistoryRecords'));

const NCDPBatchForm = lazy(() => import('@/pages/NCDP/NCDPBatchForm'));
const NCDPLog = lazy(() => import('@/pages/NCDP/NCDPOperationLog'));

export const TitleWrapper = ({ title, children }: { title: string; children: JSX.Element }) => {
  useLayoutEffect(() => {
    document.title = title;
  }, []);

  return children;
};

// 不需要 Router 的 ErrorBoundary，统一由 SentryErrorBoundary 接管
const NotErrorBoundary = () => {
  const error = useRouteError();
  throw error;
};

const withProductType = (path: string) => {
  return `${path}/:productType`;
};

export const router = createHashRouter([
  {
    path: CommonRoute.Root,
    element: <Root />,
    ErrorBoundary: NotErrorBoundary,
    children: [
      {
        path: CommonRoute.Login,
        element: (
          <Suspense fallback={<Loading />}>
            <TitleWrapper title="登录">
              <Login />
            </TitleWrapper>
          </Suspense>
        )
      },
      {
        path: CommonRoute.UpdateDownload,
        element: (
          <Suspense fallback={<Loading />}>
            <TitleWrapper title="版本更新">
              <UpdateDownload />
            </TitleWrapper>
          </Suspense>
        )
      },
      {
        path: CommonRoute.Home,
        element: (
          <Suspense fallback={<Loading showClose />}>
            <TitleWrapper title="首页">
              <HomeLayout />
            </TitleWrapper>
          </Suspense>
        ),
        children: [
          {
            loader: productPanelLoader,
            path: ':productType',
            element: (
              <Suspense fallback={<Loading showClose />}>
                <ProductPanel />
              </Suspense>
            )
          },
          {
            loader: receiptDealPanelLoader,
            path: `${withProductType(CommonRoute.HomeReceiptDealPanel)}/:internalCode?/:timestamp?`,
            element: (
              <Suspense fallback={<Loading showClose />}>
                <ReceiptDealPanel home />
              </Suspense>
            )
          }
        ]
      },
      {
        loader: spotPanelLoader,
        path: `${withProductType(CommonRoute.SpotPanel)}/:internalCode?`,
        element: (
          <Suspense fallback={<Loading showClose />}>
            <TitleWrapper title="点价">
              <SpotPanel />
            </TitleWrapper>
          </Suspense>
        )
      },
      {
        path: CommonRoute.SpotPricingHint,
        element: (
          <Suspense fallback={<div />}>
            <TitleWrapper title="点价提示">
              <SpotPricingHint />
            </TitleWrapper>
          </Suspense>
        )
      },
      {
        path: CommonRoute.ProductPanel,
        element: (
          <Suspense fallback={<Loading showClose />}>
            <TitleWrapper title="行情看板">
              <HomeLayout home={false} />
            </TitleWrapper>
          </Suspense>
        ),
        children: [
          {
            loader: productPanelLoader,
            path: ':productType/:panelId',
            element: (
              <Suspense fallback={<Loading showClose />}>
                <ProductPanel showMenu={false} />
              </Suspense>
            )
          }
        ]
      },
      {
        path: '/dialog',
        // DialogLayout 的 children 不需要再额外添加 Suspense，其统一在 DialogLayout 内部处理
        element: <DialogLayout.Layout />,
        children: [
          {
            path: withProductType(CommonRoute.SingleQuote),
            element: (
              <TitleWrapper title="报价">
                <SingleQuote />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.QuoteOperationLog),
            element: (
              <TitleWrapper title="报价日志">
                <QuoteLog />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.BondDetail),
            element: (
              <TitleWrapper title="债券详情">
                <BondDetail />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.IQuote),
            element: (
              <TitleWrapper title="iQuote">
                <IQuote />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.IQuoteCard),
            element: (
              <TitleWrapper title="iQuote卡片">
                <IQuoteCard />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.Calculator),
            element: (
              <TitleWrapper title="债券计算器">
                <Calculator />
              </TitleWrapper>
            )
          },
          {
            path: `${withProductType(CommonRoute.CollaborativeQuote)}/:panelId`,
            element: (
              <TitleWrapper title="协同报价">
                <Collaborative />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.MarketTrack),
            element: (
              <TitleWrapper title="行情追踪">
                <MarketTracking />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.DealDetail),
            element: (
              <TitleWrapper title="明细">
                <DealDetail />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.Bridge),
            element: (
              <TitleWrapper title="过桥">
                <Bridge />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.MarketDeal),
            element: (
              <TitleWrapper title="市场成交录入">
                <MarketDealForm />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.MarketRecommend),
            element: (
              <TitleWrapper title="成交推荐">
                <MarketDealRecommend />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.MarketRecommendSetting),
            element: (
              <TitleWrapper title="成交推荐设置">
                <MarketDealRecommendSetting />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.MarketOperationLog),
            element: (
              <TitleWrapper title="成交日志">
                <MarketDealLog />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.SpotModal),
            element: (
              <TitleWrapper title="点价弹窗">
                <SpotModal />
              </TitleWrapper>
            )
          },
          {
            path: CommonRoute.SpotAppointModal,
            element: (
              <TitleWrapper title="点价弹窗">
                <SpotAppointModal />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.SpotBondDetail),
            element: (
              <TitleWrapper title="单券点价板">
                <SpotBondDetail />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.SpotOperRecord),
            element: (
              <TitleWrapper title="成交记录操作日志">
                <SpotOperRecords />
              </TitleWrapper>
            )
          },
          {
            loader: receiptDealPanelLoader,
            path: `${withProductType(CommonRoute.ReceiptDealPanel)}/:internalCode?/:timestamp?`,
            element: (
              <Suspense fallback={<Loading showClose />}>
                <TitleWrapper title="成交单">
                  <ReceiptDealPanel />
                </TitleWrapper>
              </Suspense>
            )
          },
          {
            path: withProductType(CommonRoute.ReceiptDealForm),
            element: (
              <TitleWrapper title="成交单录入">
                <ReceiptDealForm />
              </TitleWrapper>
            )
          },
          {
            path: withProductType(CommonRoute.ReceiptDealBatchForm),
            element: (
              <TitleWrapper title="批量录入">
                <ReceiptDealBatchForm />
              </TitleWrapper>
            )
          },
          {
            path: `${withProductType(CommonRoute.ReceiptDealLog)}/:dealId`,
            element: (
              <Suspense fallback={<Loading showClose />}>
                <TitleWrapper title="成交单日志">
                  <ReceiptDealLog />
                </TitleWrapper>
              </Suspense>
            )
          },
          {
            path: CommonRoute.DebugDetailPage,
            element: (
              <Suspense fallback={<Loading />}>
                <TitleWrapper title="详细信息">
                  <DebugDetailPage />
                </TitleWrapper>
              </Suspense>
            )
          },
          {
            path: `${withProductType(CommonRoute.DealDetailLog)}/:dealId`,
            element: (
              <Suspense fallback={<Loading />}>
                <TitleWrapper title="明细/过桥操作日志">
                  <DealDetailLog />
                </TitleWrapper>
              </Suspense>
            )
          },
          {
            path: CommonRoute.SpotHistoryRecords,
            element: (
              <TitleWrapper title="点价历史记录">
                <SpotHistoryRecord />
              </TitleWrapper>
            )
          },
          {
            path: CommonRoute.NCDPBatchForm,
            element: (
              <TitleWrapper title="录入">
                <NCDPBatchForm />
              </TitleWrapper>
            )
          },
          {
            path: `${withProductType(CommonRoute.NCDPOperationLog)}/:ncdpId/:referred`,
            element: (
              <Suspense fallback={<Loading />}>
                <TitleWrapper title="报价日志">
                  <NCDPLog />
                </TitleWrapper>
              </Suspense>
            )
          }
        ]
      },
      { path: CommonRoute.PreparedWindow, element: <PreparedWindow /> },
      // TODO Navigate 需要根据用户权限定位到相应的 productType 的 Home 页面
      { path: '*', element: <Navigate to={CommonRoute.Home} /> }
    ]
  }
]);
