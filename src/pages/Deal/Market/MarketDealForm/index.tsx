import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { NEW_SERVER_NIL } from '@fepkg/business/constants';
import { BondQuoteType, ExerciseType, Side } from '@fepkg/services/types/enum';
import { ExerciseProvider } from '@/components/business/ExerciseGroup/provider';
import { transFormExerciseToEnum } from '@/components/business/ExerciseGroup/utils';
import { PriceGroupProvider, PriceState, usePriceGroup } from '@/components/business/PriceGroup';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { getInitMarketDealTradeState } from '@/pages/Deal/Market/MarketDealForm/utils';
import { DealForm } from './components/DealForm';
import { useMarketDealFormParams } from './hooks/useParams';
import { FocusProvider } from './providers/FocusProvider';
import { MarketDealFormProvider, useMarketDealForm } from './providers/FormProvider';
import { MarketDealTradesProvider } from './providers/MarketTradesProvider';

const Inner = () => {
  const { productType } = useProductParams();
  const params = useMarketDealFormParams();
  const { priceInfo } = usePriceGroup();
  const { hasOptionBond, bond } = useMarketDealForm();

  const sidePriceInfo = priceInfo[Side.SideNone];

  const { exercise_manual, is_exercise = null } = params?.defaultValue ?? {};
  const defaultExerciseType = exercise_manual ? transFormExerciseToEnum(is_exercise) : ExerciseType.ExerciseTypeNone;

  return (
    <ExerciseProvider
      {...{
        hasBond: !!bond,
        productType,
        quoteType: sidePriceInfo?.quote_type,
        isHasOption: hasOptionBond,
        defaultValue: defaultExerciseType
      }}
    >
      <DealForm />
    </ExerciseProvider>
  );
};

const MarketDealForm = () => {
  const dialogLayout = useDialogLayout();
  const params = useMarketDealFormParams();
  const { productType } = useProductParams();

  if (!dialogLayout) return null;
  if (!params) return null;
  if (!productType) return null;

  const { defaultValue, defaultQuote, copyCount } = params;

  /** 默认价格信息 */
  const defaultPrice: PriceState = {
    quote_price: defaultValue?.price !== undefined ? defaultValue.price.toString() : void 0,
    quote_type: defaultValue?.price_type ?? BondQuoteType.Yield,
    return_point:
      defaultValue?.return_point !== undefined && defaultValue?.return_point !== NEW_SERVER_NIL
        ? defaultValue.return_point.toString()
        : void 0,
    flag_rebate: defaultValue?.flag_rebate,
    flag_intention: false
  };

  const bidTrade = getInitMarketDealTradeState(defaultValue, Side.SideBid, Boolean(copyCount));
  const ofrTrade = getInitMarketDealTradeState(defaultValue, Side.SideOfr, Boolean(copyCount));

  const key = `${defaultValue?.deal_id}_${defaultQuote?.quote_id}_${defaultValue?.update_time}`;

  return (
    <BondSearchProvider
      key={key}
      initialState={{ productType, defaultValue: params?.defaultValue?.bond_basic_info }}
    >
      {/* 成交面板的价格信息全部取 Side.SideNone 的值 */}
      <PriceGroupProvider initialState={{ side: Side.SideNone, defaultValue: defaultPrice }}>
        <FocusProvider>
          <MarketDealFormProvider initialState={{ defaultPrice }}>
            <MarketDealTradesProvider initialState={{ bidTrade, ofrTrade }}>
              <Inner />
            </MarketDealTradesProvider>
          </MarketDealFormProvider>
        </FocusProvider>
      </PriceGroupProvider>
    </BondSearchProvider>
  );
};

export default MarketDealForm;
