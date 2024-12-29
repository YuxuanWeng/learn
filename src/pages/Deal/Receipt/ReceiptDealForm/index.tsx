import { BondSearchProvider, useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { hasOption } from '@fepkg/business/utils/bond';
import { BondQuoteType, ReceiptDealStatus, Side } from '@fepkg/services/types/enum';
import { ExerciseProvider } from '@/components/business/ExerciseGroup/provider';
import { PriceGroupProvider, PriceState, usePriceGroup } from '@/components/business/PriceGroup';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { DealFormLayout } from './components/DealForm';
import { useReceiptDealFormParams } from './hooks/useParams';
import { ReceiptDealBridgeProvider } from './providers/BridgeProvider';
import { ReceiptDealDateProvider } from './providers/DateProvider';
import { FocusProvider } from './providers/FocusProvider';
import { ReceiptDealFormProvider, useReceiptDealForm } from './providers/FormProvider';
import { ReceiptDealTradesProvider } from './providers/TradesProvider';
import { ReceiptDealFormMode } from './types';

const Wrapper = () => {
  const { productType } = useProductParams();
  const { bondSearchState } = useBondSearch();
  const { priceInfo } = usePriceGroup();

  const { formDisabled } = useReceiptDealForm();

  const isHasOption = hasOption(bondSearchState.selected?.original);
  const quoteType = priceInfo[Side.SideNone]?.quote_type ?? BondQuoteType.Yield;

  const params = useReceiptDealFormParams();

  const { defaultReceiptDeal } = params;
  return (
    <ExerciseProvider
      {...{
        hasBond: !!bondSearchState.selected?.original,
        productType,
        disabled: formDisabled,
        quoteType,
        isHasOption,
        defaultValue: defaultReceiptDeal?.is_exercise
      }}
    >
      <DealFormLayout />
    </ExerciseProvider>
  );
};

/** 成交单录入 */
const ReceiptDealForm = () => {
  const dialogLayout = useDialogLayout();
  const { productType } = useProductParams();
  const params = useReceiptDealFormParams();

  if (!productType) return null;
  if (!dialogLayout) return null;
  if (!params) return null;

  const { mode, defaultReceiptDeal, editable } = params;
  const { receipt_deal_id, bond_basic_info, update_time, receipt_deal_status, destroy_reason } =
    defaultReceiptDeal ?? {};

  const defaultPrice: PriceState = {
    quote_price: defaultReceiptDeal?.price !== undefined ? String(defaultReceiptDeal?.price) : undefined,
    quote_type: defaultReceiptDeal?.price_type ?? BondQuoteType.Yield,
    return_point: defaultReceiptDeal?.return_point !== undefined ? String(defaultReceiptDeal?.return_point) : undefined,
    flag_rebate: defaultReceiptDeal?.flag_rebate,
    flag_intention: false
  };

  const isDestroying = Boolean(receipt_deal_status === ReceiptDealStatus.ReceiptDealSubmitApproval && destroy_reason);

  const formDisabled = mode !== ReceiptDealFormMode.Join ? !editable || isDestroying : false;

  const key = `${receipt_deal_id}_${update_time}_${mode}`;

  return (
    <ReceiptDealFormProvider
      key={key}
      initialState={{ disabled: formDisabled }}
    >
      <BondSearchProvider initialState={{ productType, defaultValue: bond_basic_info }}>
        <ReceiptDealDateProvider>
          <ReceiptDealBridgeProvider>
            <ReceiptDealTradesProvider>
              {/* 价格信息全部取 Side.SideNone 的值 */}
              <PriceGroupProvider initialState={{ side: Side.SideNone, defaultValue: defaultPrice }}>
                <FocusProvider>
                  <Wrapper />
                </FocusProvider>
              </PriceGroupProvider>
            </ReceiptDealTradesProvider>
          </ReceiptDealBridgeProvider>
        </ReceiptDealDateProvider>
      </BondSearchProvider>
    </ReceiptDealFormProvider>
  );
};

export default ReceiptDealForm;
