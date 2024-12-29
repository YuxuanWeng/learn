import { message } from '@fepkg/components/Message';
import { DealQuote } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { isFRALiquidation } from '@packages/utils/liq-speed';
import { isSpotAppointMode, isUseLocalServer } from '@/common/ab-rules';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useQuoteByKeyMarketQuery } from '@/common/services/hooks/local-server/quote/useQuoteByKeyMarketQuery';
import { useBondQuoteLiveQuery } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { getNearestLiquidationSpeed } from '@/common/utils/liq-speed';
import { trackPoint } from '@/common/utils/logger/point';
import { HeadProvider, HeadProviderProps, useHead } from '@/components/IDCBoard/Head/HeadProvider';
import { SearchableBondProvider } from '@/components/IDCBoard/Head/SearchableBondProvider';
import IDCPanelSimplifyHead from '@/components/IDCBoard/Head/SimplifyHead';
import IDCPriceWithVolume from '@/components/IDCBoard/IDCPriceWithVolume';
import { useProductParams } from '@/layouts/Home/hooks/useProductParams';
import { miscStorage } from '@/localdb/miscStorage';
import useSpot from '@/pages/Spot/Panel/BondPanel/useSpot';
import { SpotDate } from '../../IDCSpot/types';
import Col from '../Col';
import Head from '../Head';
import { PanelPrice } from '../Price';
import Wrapper from '../Wrapper';
import { IDCPanelProps, IGrid } from '../types';
import { getBondDetailDialogConfig } from '../utils';
import { getList, getOptimal, getSummaryQuote } from './panelUtils';
import useListData from './useListData';

const ROW_COUNT = 2;

const Inner = (props: IDCPanelProps) => {
  const { onListChange, onBondDetailDialogOpen, showSubOptimal = true, spotDate, onSpot, rowCount } = props;

  const { bond, isDetailPage, isSimplify, quickSpotDate } = useHead();

  // 如果是精简模式下的主界面，使用组件内部的spotDate，否则使用传递进来的
  const nowSpotDate = isSimplify ? quickSpotDate : spotDate;

  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  const { openSpotAppointPricing } = useSpot();
  const isAppointMode = isSpotAppointMode();

  const isLocalServer = isUseLocalServer();
  const { data: localizationReferData } = useBondQuoteLiveQuery({
    params: {
      keyMarket: bond?.key_market,
      brokerId: miscStorage?.userInfo?.user_id
    },
    enabled: !isLocalServer
  });
  const { data: localServerReferData } = useQuoteByKeyMarketQuery({
    params: { key_market: bond?.key_market ?? '', broker_id: miscStorage?.userInfo?.user_id ?? '' },
    enabled: isLocalServer
  });

  const referData = isLocalServer ? localServerReferData : localizationReferData;

  const { data, dataList } = useListData({ bond, showSubOptimal, spotDate: nowSpotDate, onListChange, isSimplify });

  /**
   * @param dealType GVN/TKN
   * @param grid 当前小格子的数据
   * @param isAllFra getList里需要指定是否按远期模式去过滤数据，双击小格子时会判断下，如果最近的结算方式是远期则按照该模式过滤
   * */
  const spotPricing = useMemoizedFn((dealType: DealType, grid?: IGrid, isAllFra?: boolean) => {
    const targetSpotDate = isAllFra ? SpotDate.FRA : nowSpotDate;
    if (!bond) return;
    const optimal = getOptimal(dealType, grid?.quote?.deal_liquidation_speed_list, data, targetSpotDate);
    if (!optimal || grid?.isEmpty) {
      message.error(`${bond.display_code ?? bond.bond_code} ${bond.short_name}，当前无匹配报价`);
      return;
    }
    // 如果是精简模式的主页，将全量数据传递进去，因为内部还要进行切换(远期点价弹窗特殊，内部不能切换)
    let quoteList: DealQuote[] | undefined;
    const liqSpeed = grid?.quote?.deal_liquidation_speed_list;
    if (isSimplify) {
      if (targetSpotDate === SpotDate.FRA) {
        quoteList = getList(dealType, liqSpeed, data, SpotDate.FRA);
        onSpot({ dealType, optimal, bond, quoteList, spotDate: SpotDate.FRA });
      } else {
        quoteList = getList(dealType, liqSpeed, data, undefined);
        onSpot({ dealType, optimal, bond, quoteList, spotDate: targetSpotDate });
      }
    } else {
      quoteList = getList(dealType, liqSpeed, data, targetSpotDate);
      onSpot({ dealType, optimal, bond, quoteList, spotDate: targetSpotDate });
    }
  });

  const spotGridPricing = useMemoizedFn(async (dealType: DealType, grid?: IGrid) => {
    const nearestLiqSpeed = await getNearestLiquidationSpeed(grid?.quote?.deal_liquidation_speed_list);
    if (!isFRALiquidation(nearestLiqSpeed?.liquidationSpeed)) {
      if (!bond) return;
      openSpotAppointPricing({ dealType, quote: grid?.quote, bond });
    } else {
      spotPricing(dealType, grid, true);
    }
  });

  const config = getBondDetailDialogConfig(productType, { bond, data });

  const handleOpenDetail = useMemoizedFn(() => {
    openDialog(config);
    onBondDetailDialogOpen?.(bond?.key_market);
    trackPoint('open-bond-detail');
  });

  const headRender = (
    <div>
      {!isSimplify ? (
        <Head
          spotDate={spotDate}
          referQuoteList={referData}
          onSpotButtonClick={spotPricing}
          onBondDetail={handleOpenDetail}
        />
      ) : (
        <IDCPanelSimplifyHead
          referQuoteList={referData}
          onSpotButtonClick={spotPricing}
          onBondDetail={handleOpenDetail}
        />
      )}

      <div className="flex h-7 gap-1">
        {dataList.map((col, idx) => {
          const quote = getSummaryQuote(col);
          return (
            <div
              className="flex justify-between"
              key={JSON.stringify(idx)}
            >
              {isSimplify ? (
                <IDCPriceWithVolume
                  className="flex text-lg"
                  hideVolume={nowSpotDate === SpotDate.FRA}
                  quote={quote}
                  col={col}
                />
              ) : (
                <PanelPrice quote={quote} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Wrapper
      headRender={headRender}
      isDetailPage={isDetailPage}
      isSimplifyMode={isSimplify}
      showSubOptimal={showSubOptimal}
    >
      {dataList.map((col, idx) => (
        <Col
          key={JSON.stringify(idx)}
          rowCount={rowCount || ROW_COUNT}
          grid_list={col}
          onGridDoubleClick={(dealType, gridData) => {
            if (isAppointMode) {
              spotGridPricing(dealType, gridData);
            } else {
              spotPricing(dealType, gridData);
            }
          }}
        />
      ))}
    </Wrapper>
  );
};

export const IDCPanel = (props: IDCPanelProps & HeadProviderProps) => {
  return (
    <HeadProvider initialState={props}>
      <SearchableBondProvider>
        <Inner {...props} />
      </SearchableBondProvider>
    </HeadProvider>
  );
};
